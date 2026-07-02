"use server";

import { z } from "zod";
import { getSanityWriteClient } from "./sanity.write-client";
import { subscribeToNewsletter } from "./marketing";
import { rateLimit } from "./rate-limit";
import { trackConversion } from "./analytics";
import { logger } from "./logger";

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
    name: "Name must be at least 2 characters.",
    email: "Please enter a valid email address.",
    messageMin: "Message must be at least 10 characters.",
    messageMax: "Message must be under 2000 characters.",
    rateLimit: "Too many requests. Please try again in an hour.",
    fixErrors: "Please fix the errors below.",
    submitFailed: "Failed to submit. Please try again later.",
  },
  fr: {
    name: "Le nom doit contenir au moins 2 caractères.",
    email: "Veuillez saisir une adresse e-mail valide.",
    messageMin: "Le message doit contenir au moins 10 caractères.",
    messageMax: "Le message doit contenir moins de 2000 caractères.",
    rateLimit: "Trop de demandes. Veuillez réessayer dans une heure.",
    fixErrors: "Veuillez corriger les erreurs ci-dessous.",
    submitFailed: "L'envoi a échoué. Veuillez réessayer plus tard.",
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

const NewsletterSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address." }).toLowerCase(),
});

export async function submitContactForm(
  prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Rate Limit: 5 submissions per hour per IP (BUG-004: windowSeconds, not ms)
  const lang = formData.get("lang") === "fr" ? "fr" : "en";
  const messages = contactMessages[lang];
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
    } else {
      console.log("Mocking contact lead creation:", validated.data);
    }

    await trackConversion({ type: "lead", email: validated.data.email, metadata: { service: validated.data.service } });
    logger.info("New lead captured", { email: validated.data.email });

    return { success: true };
  } catch (err) {
    logger.error("Contact submission error", err, { email: rawData.email });
    return { error: messages.submitFailed };
  }
}

export async function subscribeNewsletter(
  prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  // Rate Limit: 3 subscriptions per minute per IP (BUG-004: seconds not ms)
  const limiter = await rateLimit("newsletter", 3, 60);
  if (!limiter.success) {
    return { error: "Too many attempts. Please wait a minute." };
  }

  const email = formData.get("email") as string;
  const validated = NewsletterSchema.safeParse({ email });

  if (!validated.success) {
    return { error: "Invalid email address." };
  }

  try {
    const marketingResult = await subscribeToNewsletter(validated.data.email);

    if (!marketingResult.success) {
      if (marketingResult.error === "ALREADY_SUBSCRIBED") {
        return { error: "You're already on the list! Welcome back." };
      }
      return { error: "Newsletter service is temporarily unavailable." };
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
    logger.info("New newsletter subscriber", { email: validated.data.email });

    return { success: true };
  } catch (err) {
    logger.error("Newsletter subscription error", err, { email });
    return { error: "Failed to subscribe. Please try again later." };
  }
}
