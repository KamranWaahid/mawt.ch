import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminSession, SESSION_COOKIE } from "@/lib/session";
import "../globals.css";

export const metadata: Metadata = {
  title: "Sanity Studio | MAWT",
  robots: { index: false, follow: false },
};

/**
 * Root layout for /studio only. The site's root layout lives in [lang]/
 * (it owns `<html lang>` per locale — the i18n App Router pattern); the
 * Studio is language-neutral, self-styled, and must not load the site's
 * Lenis/transition providers.
 *
 * Defense in depth: the proxy already gates /studio, but a middleware
 * misconfiguration (or matcher gap) must not expose the Studio — re-verify
 * the admin JWT here before rendering anything.
 */
export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = await verifyAdminSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) {
    redirect("/en/login");
  }

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
