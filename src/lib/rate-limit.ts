/**
 * Production-safe rate limiter.
 *
 * BUG-004 fix: The original in-memory Map resets on every serverless cold start,
 * making it ineffective in production (Vercel, etc.).
 *
 * Strategy:
 * - If UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set → use Upstash Redis
 *   for persistent, cross-instance rate limiting.
 * - Otherwise → log a warning and allow the request (graceful degradation in dev).
 *   In production you MUST set the Upstash credentials.
 *
 * Usage: await rateLimit("contact", 5, 60 * 60)  // 5 reqs per hour
 */

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

import { headers } from "next/headers";

type RateLimitResult = { success: boolean; remaining: number };

type RateLimitOptions = {
  /**
   * Fail CLOSED when the limiter can't do its job (Redis down, or no store
   * configured in production). Use for auth-critical endpoints (admin login,
   * revalidate webhook) where "no limiter" must mean "no access", not
   * "unlimited access". Default false: public forms degrade gracefully.
   */
  failClosed?: boolean;
};

async function upstashPost(pipeline: string[][]): Promise<unknown[]> {
  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pipeline),
    cache: "no-store",
  });
  const data = await res.json();
  return data.map((d: { result: unknown }) => d.result);
}

async function upstashRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  // Sliding window using INCR + EXPIRE pipeline
  const [count] = (await upstashPost([
    ["INCR", key],
    ["EXPIRE", key, String(windowSeconds), "NX"],
  ])) as number[];

  const remaining = Math.max(0, limit - count);
  return { success: count <= limit, remaining };
}

/** Get caller IP from request headers */
async function getCallerIp(): Promise<string> {
  try {
    const headerList = await headers();
    return headerList.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  } catch {
    return "unknown";
  }
}

/**
 * Rate limit a named action.
 * @param key      Action name, e.g. "contact", "newsletter", "admin-login"
 * @param limit    Max requests per window
 * @param windowSeconds Duration of the rate limit window in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
  options: RateLimitOptions = {}
): Promise<RateLimitResult> {
  const ip = await getCallerIp();
  const identifier = `rl:${key}:${ip}`;

  if (UPSTASH_URL && UPSTASH_TOKEN) {
    try {
      return await upstashRateLimit(identifier, limit, windowSeconds);
    } catch (err) {
      if (options.failClosed) {
        console.error("[RateLimit] Upstash Redis error — DENYING request (failClosed):", err);
        return { success: false, remaining: 0 };
      }
      // Public forms: if Redis is temporarily unavailable, allow but log.
      console.error("[RateLimit] Upstash Redis error — allowing request:", err);
      return { success: true, remaining: 0 };
    }
  }

  // No persistent store configured.
  if (process.env.NODE_ENV === "production") {
    console.warn(
      "[RateLimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set. " +
      "Rate limiting is DISABLED in production. Set these env vars to enable it."
    );
    if (options.failClosed) {
      // Auth-critical callers must not run unprotected in production.
      return { success: false, remaining: 0 };
    }
  }
  return { success: true, remaining: limit - 1 };
}
