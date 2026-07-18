import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time string comparison for secrets.
 *
 * Both inputs are hashed first so the comparison length is fixed —
 * `timingSafeEqual` throws on length mismatch, and a raw length check
 * short-circuits in a way that leaks the secret's length.
 */
export function secureEqual(a: string, b: string): boolean {
  const digestA = createHash("sha256").update(a, "utf8").digest();
  const digestB = createHash("sha256").update(b, "utf8").digest();
  return timingSafeEqual(digestA, digestB);
}
