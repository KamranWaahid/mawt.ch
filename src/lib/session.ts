/**
 * Secure session management for the MAWT admin area.
 *
 * Uses HMAC-signed JWTs (jose) so the cookie never contains the raw secret.
 * The signing key is derived from SESSION_SECRET (required env var).
 *
 * BUG-002 fix: cookie value is a signed JWT, NOT the raw ADMIN_SECRET.
 */
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "admin-session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** Returns the encoded secret key. Throws if SESSION_SECRET is not set. */
function getEncodedKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET environment variable is not set. Admin authentication is disabled."
    );
  }
  return new TextEncoder().encode(secret);
}

/** Issue a signed admin JWT containing a non-sensitive marker payload. */
export async function createAdminSession(): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);
  return new SignJWT({ role: "admin", expiresAt: expiresAt.toISOString() })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getEncodedKey());
}

/** Verify a session token. Returns the payload or null if invalid/expired. */
export async function verifyAdminSession(
  token: string | undefined
): Promise<{ role: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getEncodedKey(), {
      algorithms: ["HS256"],
    });
    if (payload.role !== "admin") return null;
    return payload as { role: string };
  } catch {
    return null;
  }
}

export { SESSION_COOKIE, SESSION_DURATION_SECONDS };
