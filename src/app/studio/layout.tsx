import type { Metadata } from "next";
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
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
