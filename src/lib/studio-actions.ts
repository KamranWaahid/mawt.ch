"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { verifyAdminSession, SESSION_COOKIE } from "@/lib/session";
import { logger } from "@/lib/logger";

/**
 * Manual cache purge for the Studio dashboard.
 *
 * Replaces the old client-side fetch to /api/revalidate that interpolated
 * NEXT_PUBLIC_SANITY_REVALIDATE_SECRET — a NEXT_PUBLIC_ var ships in the
 * client bundle, so the webhook secret was effectively public. A Server
 * Action needs no shared secret at all: it runs server-side and authorizes
 * against the admin JWT cookie (the caller is already inside /studio, which
 * requires that session).
 */
export async function triggerHomeRevalidate(): Promise<{ ok: boolean; error?: string }> {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    revalidateTag("home", "default");
    logger.info("Manual home revalidation triggered from Studio dashboard");
    return { ok: true };
  } catch (err) {
    logger.error("Manual revalidation failed", err);
    return { ok: false, error: "Revalidation failed" };
  }
}
