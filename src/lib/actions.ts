"use server";

import { z } from "zod";
import { getSanityWriteClient } from "./sanity.write-client";
import { subscribeToNewsletter } from "./marketing";
import { rateLimit } from "./rate-limit";
import { trackConversion } from "./analytics";
import { logger } from "./logger";

const ContactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().toLowerCase(),
  service: z.string().trim().min(1).max(50),
  timeline: z.string().trim().min(1).max(50),
  message: z.string().trim().min(10).max(2000),
});

const NewsletterSchema = z.object({
  email: z.string().trim().email().toLowerCase(),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  // Rate Limit: 5 submissions per hour per IP
  const limiter = await rateLimit("contact", 5, 60 * 60 * 1000);
  if (!limiter.success) {
    return { error: "Too many requests. Please try again in an hour." };
  }
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    service: formData.get("service"),
    timeline: formData.get("timeline"),
    message: formData.get("message"),
  };

  const validated = ContactSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: "Invalid form data.", details: validated.error.flatten().fieldErrors };
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

    // Analytics & Notifications
    await trackConversion({ type: "lead", email: validated.data.email, metadata: { service: validated.data.service } });
    logger.info("New lead captured", { email: validated.data.email });
    
    return { success: true };
  } catch (err) {
    logger.error("Contact submission error", err, { email: rawData.email });
    return { error: "Failed to submit. Please try again later." };
  }
}

export async function subscribeNewsletter(prevState: any, formData: FormData) {
  // Rate Limit: 3 subscriptions per minute per IP
  const limiter = await rateLimit("newsletter", 3, 60 * 1000);
  if (!limiter.success) {
    return { error: "Too many attempts. Please wait a minute." };
  }
  const email = formData.get("email") as string;
  const validated = NewsletterSchema.safeParse({ email });

  if (!validated.success) {
    return { error: "Invalid email address." };
  }

  try {
    // 1. External Marketing Provider Integration
    const marketingResult = await subscribeToNewsletter(validated.data.email);
    
    if (!marketingResult.success) {
      if (marketingResult.error === "ALREADY_SUBSCRIBED") {
        return { error: "You're already on the list! Welcome back." };
      }
      return { error: "Newsletter service is temporarily unavailable." };
    }

    // 2. Sanity Lead Creation (for internal audit)
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

    // Analytics
    await trackConversion({ type: "newsletter", email: validated.data.email });
    logger.info("New newsletter subscriber", { email: validated.data.email });

    return { success: true };
  } catch (err) {
    logger.error("Newsletter subscription error", err, { email });
    return { error: "Failed to subscribe. Please try again later." };
  }
}
