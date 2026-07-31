import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createAdminSession, SESSION_COOKIE, SESSION_DURATION_SECONDS } from "@/lib/session";
import { rateLimit } from "@/lib/rate-limit";
import { secureEqual } from "@/lib/secure-compare";

/**
 * Admin login endpoint.
 *
 * BUG-001 fix: ADMIN_SECRET must come from env only — no hardcoded fallback.
 * BUG-002 fix: cookie stores a signed JWT, not the raw secret.
 */
export async function POST(request: Request) {
  // Brute-force protection: 5 attempts per 15 minutes per IP, fail-closed —
  // an unprotected admin login must refuse rather than run unlimited.
  const limiter = await rateLimit("admin-login", 5, 15 * 60, { failClosed: true });
  if (!limiter.success) {
    // Missing/broken Upstash looks like a rate-limit to callers unless we
    // surface a distinct status — common after domain/hosting moves.
    if (limiter.unavailable) {
      console.error(
        "[Admin Login] Rate limiter unavailable (UPSTASH_REDIS_REST_URL / TOKEN missing or down)."
      );
      return NextResponse.json(
        { error: "Server misconfiguration. Please contact the administrator." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 }
    );
  }

  // BUG-001: No hardcoded fallback. Server misconfiguration → 500.
  const adminSecret = process.env.ADMIN_SECRET?.trim();
  if (!adminSecret) {
    console.error("[Admin Login] ADMIN_SECRET environment variable is not set.");
    return NextResponse.json(
      { error: "Server misconfiguration. Please contact the administrator." },
      { status: 500 }
    );
  }

  // BUG-001: Also require SESSION_SECRET for JWT signing.
  if (!process.env.SESSION_SECRET?.trim()) {
    console.error("[Admin Login] SESSION_SECRET environment variable is not set.");
    return NextResponse.json(
      { error: "Server misconfiguration. Please contact the administrator." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { key } = body;
    const normalizedKey = typeof key === "string" ? key.trim() : "";

    if (!normalizedKey) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    // Constant-time comparison over fixed-length digests: the old
    // length-check + Buffer.compare leaked both length and prefix timing.
    if (!secureEqual(normalizedKey, adminSecret)) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // BUG-002: Issue a signed JWT — never store the raw secret in the cookie.
    const sessionToken = await createAdminSession();

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION_SECONDS,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Admin Login] Error:", error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
