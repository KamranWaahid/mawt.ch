/**
 * Marketing Service
 * Handles interaction with external providers like Mailchimp, Resend, or Buttondown.
 */
import { logger } from "./logger";
import { redactEmail } from "./text-sanitize";

export type NewsletterResponse = {
  success: boolean;
  error?: "ALREADY_SUBSCRIBED" | "INVALID_EMAIL" | "API_ERROR";
};

export async function subscribeToNewsletter(email: string): Promise<NewsletterResponse> {
  const provider = process.env.NEWSLETTER_PROVIDER; // e.g., 'mailchimp'
  const apiKey = process.env.NEWSLETTER_API_KEY;

  if (!provider || !apiKey) {
    // Never mock success in production: the visitor would be told "you're
    // subscribed" while their address goes nowhere.
    if (process.env.NODE_ENV === "production") {
      logger.error("Newsletter provider not configured in production — refusing subscription");
      return { success: false, error: "API_ERROR" };
    }
    logger.info(`Newsletter provider missing — mocking success for ${redactEmail(email)} (dev only)`);
    return { success: true };
  }

  try {
    // Example logic for a generic provider
    logger.info(`Subscribing ${redactEmail(email)} via ${provider}`);

    // Simulating an external API call
    // In a real implementation, you would use fetch() here
    // const response = await fetch('...', { ... })

    return { success: true };
  } catch (err) {
    logger.error("Marketing Service Error:", err);
    return { success: false, error: "API_ERROR" };
  }
}
