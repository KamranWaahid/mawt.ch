/**
 * Server-side Analytics Utility
 * Used for tracking high-value conversions without client-side scripts.
 */

export type ConversionEvent = {
  type: "lead" | "newsletter";
  email: string;
  metadata?: Record<string, any>;
};

export async function trackConversion(event: ConversionEvent) {
  const isProd = process.env.NODE_ENV === "production";
  
  // Log for local visibility
  console.log(`[CONVERSION] ${event.type.toUpperCase()}: ${event.email}`, event.metadata || "");

  if (isProd) {
    // In production, you would send this to a service like Segment, PostHog, or a custom DB
    // await fetch('https://analytics-api.example.com', { ... })
  }
}
