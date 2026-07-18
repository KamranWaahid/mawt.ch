"use server";

import { z } from "zod";
import { getSanityWriteClient } from "./sanity.write-client";
import { sendLeadNotification, sendLeadThankYou } from "./mail";
import { subscribeToNewsletter } from "./marketing";
import { rateLimit } from "./rate-limit";
import { trackConversion } from "./analytics";
import { logger } from "./logger";
import { redactEmail } from "./text-sanitize";

// ── Typed Action State (BUG-023) ─────────────────────────────────────────────
export interface ContactFormStateObj {
  success?: boolean;
  error?: string;
  /** Field-level validation errors keyed by field name. BUG-007: now exposed. */
  details?: Partial<Record<"name" | "email" | "service" | "timeline" | "message", string[]>>;
}
export type ContactFormState = ContactFormStateObj | null;

export type NewsletterFormState = {
  success?: boolean;
  error?: string;
} | null;
// ─────────────────────────────────────────────────────────────────────────────

const contactMessages = {
  en: {
    name: "Please enter your name (at least 2 characters).",
    email: "Please enter a valid email address.",
    messageMin: "Please add a few more words to your message (at least 10 characters).",
    messageMax: "Your message is a little long. Please keep it under 2000 characters.",
    rateLimit: "You have sent a few requests already. Please try again in an hour.",
    fixErrors: "Please fix the errors below.",
    submitFailed: "We could not send your message. Please try again in a moment.",
  },
  fr: {
    name: "Veuillez indiquer votre nom (2 caractères minimum).",
    email: "Veuillez saisir une adresse e-mail valide.",
    messageMin: "Votre message est un peu court (10 caractères minimum).",
    messageMax: "Votre message est un peu long. Merci de rester sous 2000 caractères.",
    rateLimit: "Vous avez déjà envoyé plusieurs demandes. Veuillez réessayer dans une heure.",
    fixErrors: "Veuillez corriger les erreurs ci-dessous.",
    submitFailed: "Nous n'avons pas pu envoyer votre message. Veuillez réessayer dans un instant.",
  },
};

const getContactSchema = (lang: "en" | "fr") => {
  const messages = contactMessages[lang];

  return z.object({
    name: z.string().trim().min(2, { message: messages.name }).max(100),
    email: z.string().trim().email({ message: messages.email }).toLowerCase(),
    service: z.string().trim().min(1).max(50),
    timeline: z.string().trim().min(1).max(50),
    message: z.string().trim().min(10, { message: messages.messageMin }).max(2000, { message: messages.messageMax }),
  });
};

const newsletterMessages = {
  en: {
    invalidEmail: "Please enter a valid email address.",
    rateLimit: "You have sent a few requests already. Please wait a minute.",
    alreadySubscribed: "You're already on the list. Welcome back.",
    unavailable: "The newsletter service is temporarily unavailable. Please try again later.",
    submitFailed: "We could not subscribe you. Please try again later.",
  },
  fr: {
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    rateLimit: "Vous avez déjà envoyé plusieurs demandes. Veuillez patienter une minute.",
    alreadySubscribed: "Vous êtes déjà inscrit. Bon retour.",
    unavailable: "Le service de newsletter est momentanément indisponible. Veuillez réessayer plus tard.",
    submitFailed: "Nous n'avons pas pu vous inscrire. Veuillez réessayer plus tard.",
  },
};

const getNewsletterSchema = (lang: "en" | "fr") =>
  z.object({
    email: z.string().trim().email({ message: newsletterMessages[lang].invalidEmail }).toLowerCase(),
  });

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const lang = formData.get("lang") === "fr" ? "fr" : "en";
  const messages = contactMessages[lang];

  // Honeypot: the visible form carries an off-screen "company" field humans
  // never fill. A value means a bot — pretend success, store nothing.
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    logger.warn("Contact honeypot triggered — submission dropped");
    return { success: true };
  }

  // Rate Limit: 5 submissions per hour per IP (BUG-004: windowSeconds, not ms)
  const limiter = await rateLimit("contact", 5, 60 * 60);
  if (!limiter.success) {
    return { error: messages.rateLimit };
  }

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    service: formData.get("service"),
    timeline: formData.get("timeline"),
    message: formData.get("message"),
  };

  const validated = getContactSchema(lang).safeParse(rawData);

  if (!validated.success) {
    // BUG-007: Return field-level errors so the UI can display them specifically.
    return {
      error: messages.fixErrors,
      details: validated.error.flatten().fieldErrors as ContactFormStateObj["details"],
    };
  }

  try {
    const client = getSanityWriteClient();
    if (client) {
      await client.create({
        _type: "contactLead",
        ...validated.data,
        status: "new",
      });
    } else if (process.env.NODE_ENV === "production") {
      // Never pretend success in production: without the write token the
      // lead would be console.logged into a serverless void and lost.
      logger.error("Contact submission with no Sanity write client in production");
      return { error: messages.submitFailed };
    } else {
      console.log("Mocking contact lead creation:", validated.data);
    }

    await sendLeadNotification(validated.data);
    await sendLeadThankYou(validated.data, lang);
    await trackConversion({ type: "lead", email: validated.data.email, metadata: { service: validated.data.service } });
    logger.info("New lead captured", { email: redactEmail(validated.data.email) });

    return { success: true };
  } catch (err) {
    logger.error("Contact submission error", err, { email: redactEmail(rawData.email) });
    return { error: messages.submitFailed };
  }
}

export async function subscribeNewsletter(
  prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const lang = formData.get("lang") === "fr" ? "fr" : "en";
  const messages = newsletterMessages[lang];

  // Honeypot (same pattern as the contact form): off-screen "company" field
  // humans never fill. A value means a bot — pretend success, store nothing.
  const honeypot = formData.get("company");
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    logger.warn("Newsletter honeypot triggered — submission dropped");
    return { success: true };
  }

  // Rate Limit: 3 subscriptions per minute per IP (BUG-004: seconds not ms)
  const limiter = await rateLimit("newsletter", 3, 60);
  if (!limiter.success) {
    return { error: messages.rateLimit };
  }

  const email = formData.get("email") as string;
  const validated = getNewsletterSchema(lang).safeParse({ email });

  if (!validated.success) {
    return { error: messages.invalidEmail };
  }

  try {
    const marketingResult = await subscribeToNewsletter(validated.data.email);

    if (!marketingResult.success) {
      if (marketingResult.error === "ALREADY_SUBSCRIBED") {
        return { error: messages.alreadySubscribed };
      }
      return { error: messages.unavailable };
    }

    const client = getSanityWriteClient();
    if (client) {
      await client.create({
        _type: "newsletterSubscriber",
        email: validated.data.email,
        subscribedAt: new Date().toISOString(),
        status: "active",
      });
    } else {
      console.log("Mocking newsletter subscription:", validated.data.email);
    }

    await trackConversion({ type: "newsletter", email: validated.data.email });
    logger.info("New newsletter subscriber", { email: redactEmail(validated.data.email) });

    return { success: true };
  } catch (err) {
    logger.error("Newsletter subscription error", err, { email: redactEmail(email) });
    return { error: messages.submitFailed };
  }
}
