import type { Metadata } from "next";

/**
 * The [lang] layout applies the "%s | MAWT" title template. Titles that
 * already end in a branded suffix ("| MAWT", "| MAWT Genève", "| MAWT
 * Solutions") must opt out via `absolute`, or the SERP shows "… | MAWT |
 * MAWT". Unbranded titles pass through and let the template add the brand.
 */
export function brandSafeTitle(raw: string): Metadata["title"] {
  return /\|\s*MAWT\b[^|]*$/i.test(raw) ? { absolute: raw } : raw;
}

/**
 * Site-wide social card fallback. Next merges metadata SHALLOWLY: a page
 * that declares its own `openGraph` replaces the layout's whole object,
 * silently dropping the layout-level image. Every page-level `openGraph`
 * without a page-specific visual must therefore spread these in itself.
 */
export const DEFAULT_OG_IMAGE = {
  url: "/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "MAWT — AI agency in Geneva",
};

export const DEFAULT_TWITTER_CARD = {
  card: "summary_large_image" as const,
  images: ["/og-image.jpg"],
};
