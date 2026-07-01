/**
 * Centralized Logging Utility
 * Orchestrates error reporting and system logs across the back-end.
 */

export const logger = {
  info: (message: string, context?: any) => {
    console.log(`[INFO] ${message}`, context || "");
  },
  
  warn: (message: string, context?: any) => {
    console.warn(`[WARN] ${message}`, context || "");
  },

  error: (message: string, error?: any, context?: any) => {
    console.error(`[ERROR] ${message}`, error || "", context || "");
    
    // In production, send to Sentry/Axiom
    if (process.env.NODE_ENV === "production") {
      // Sentry.captureException(error, { extra: context });
    }
  },
};
