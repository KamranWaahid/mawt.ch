import { headers } from "next/headers";

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

export async function rateLimit(key: string, limit: number, durationMs: number) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const identifier = `${key}:${ip}`;
  
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    // New entry or expired
    store.set(identifier, {
      count: 1,
      resetTime: now + durationMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count += 1;
  return { success: true, remaining: limit - entry.count };
}

// Helper for cleaning up the store periodically (optional in serverless but good for long-running dev)
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}
