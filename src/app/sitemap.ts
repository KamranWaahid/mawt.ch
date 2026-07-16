import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { getSanityClient } from "@/lib/sanity.client";
import {
  SITE_URL,
  localizedHref,
  familySlugForLang,
  FAMILY_ORDER,
} from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";

const LOCALES: Locale[] = ["fr", "en"];

/**
 * Build a sitemap entry (one per locale) with reciprocal hreflang alternates.
 *
 * lastModified is only emitted when a REAL date is known (Sanity _updatedAt):
 * a lastmod that equals "now" on every crawl is a lie Google learns to ignore
 * and it degrades trust in the whole sitemap. Static pages omit it.
 */
function entry(
  pathByLocale: Record<Locale, string>,
  priority: number,
  lastModified?: string,
): MetadataRoute.Sitemap {
  const languages = {
    fr: `${SITE_URL}${pathByLocale.fr}`,
    en: `${SITE_URL}${pathByLocale.en}`,
    "x-default": `${SITE_URL}${pathByLocale.en}`,
  };
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}${pathByLocale[lang]}`,
    ...(lastModified ? { lastModified } : {}),
    changeFrequency: "weekly" as const,
    priority,
    alternates: { languages },
  }));
}

// FR-canonical keys for every static (non-dynamic) route. Home handled separately.
const STATIC_ROUTE_KEYS = [
  "services",
  "geneve",
  "projets",
  "blog",
  "a-propos",
  "contact",
  "faqs",
  "clients",
  "notre-methode",
  "securite",
  "confidentialite",
  "mentions-legales",
  "conditions-generales",
  "cookies",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];

  // Home.
  out.push(...entry({ fr: "/fr", en: "/en" }, 1));

  // Static routes (localized public slugs).
  for (const key of STATIC_ROUTE_KEYS) {
    out.push(
      ...entry(
        { fr: localizedHref(key, "fr"), en: localizedHref(key, "en") },
        0.8,
      ),
    );
  }

  // Service family pillar pages (7 families × 2 locales).
  for (const family of FAMILY_ORDER) {
    out.push(
      ...entry(
        {
          fr: `/fr/services/${familySlugForLang(family, "fr")}`,
          en: `/en/services/${familySlugForLang(family, "en")}`,
        },
        0.8,
      ),
    );
  }

  const client = getSanityClient();
  if (!client) return out;

  // Service detail pages (70 docs, fr+en). Hreflang alternates are paired by
  // (family, tier) — the unique 1:1 FR↔EN key — because translatePath cannot
  // translate Sanity per-document slugs (it would emit non-existent URLs, the
  // same bug that caused the language-switch 404).
  const services = await client.fetch<
    { slug: string; family: string; tier: number; language: Locale; _updatedAt?: string }[]
  >(
    groq`*[_type == "service" && !(_id in path("drafts.**")) && defined(slug.current) && defined(family) && defined(language)]{ "slug": slug.current, family, tier, language, _updatedAt }`,
  );
  // Real per-document modification dates for lastmod (see entry() note).
  const updatedAtByPath = new Map<string, string>();
  const pathByKeyLang = new Map<string, Partial<Record<Locale, string>>>();
  const collided: string[] = [];
  for (const s of services) {
    const key = `${s.family}|${s.tier}`;
    const path = `/${s.language}/services/${familySlugForLang(s.family, s.language)}/${s.slug}`;
    if (s._updatedAt) updatedAtByPath.set(path, s._updatedAt);
    const e = pathByKeyLang.get(key) || {};
    if (e[s.language]) {
      // Two docs share the same (family, tier, language): a collision would
      // silently OVERWRITE the earlier doc and drop its page from the sitemap
      // (this happened — 6 live pages vanished). Emit the extra doc as a
      // standalone entry instead, and make the collision visible in logs.
      console.warn(
        `[sitemap] service pairing collision on ${key} (${s.language}): keeping ${e[s.language]}, emitting ${path} standalone — fix the tiers in Sanity`,
      );
      collided.push(path);
      continue;
    }
    e[s.language] = path;
    pathByKeyLang.set(key, e);
  }
  for (const path of collided) {
    const mod = updatedAtByPath.get(path);
    out.push({
      url: `${SITE_URL}${path}`,
      ...(mod ? { lastModified: mod } : {}),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const paths of pathByKeyLang.values()) {
    // Fall back to the existing-language path if a sibling is missing, so a URL
    // is never pointed at a non-existent translation.
    const fr = paths.fr ?? paths.en!;
    const en = paths.en ?? paths.fr!;
    const languages = {
      fr: `${SITE_URL}${fr}`,
      en: `${SITE_URL}${en}`,
      "x-default": `${SITE_URL}${en}`,
    };
    for (const path of [paths.fr, paths.en].filter(Boolean) as string[]) {
      const mod = updatedAtByPath.get(path);
      out.push({
        url: `${SITE_URL}${path}`,
        ...(mod ? { lastModified: mod } : {}),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  // Blog posts ARE language-split (the article route filters by post language):
  // listing every post under both locales produced sitemap 404s. Emit each post
  // only under its own locale, at the localized public path (/fr/blog, /en/news).
  const posts = await client.fetch<{ slug: string; language?: string; _updatedAt?: string }[]>(
    groq`*[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current, language, _updatedAt }`,
  );
  for (const p of posts) {
    const lang: Locale = p.language === "fr" ? "fr" : "en";
    out.push({
      url: `${SITE_URL}${localizedHref("blog", lang)}/${p.slug}`,
      ...(p._updatedAt ? { lastModified: p._updatedAt } : {}),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // Project case studies exist per language but share slugs across locales;
  // use the LOCALIZED listing prefix (the /fr/work/<slug> form 308-redirects).
  // !(hidden == true): hidden/unfinished projects must not leak into the
  // sitemap while every other surface (listing, detail 404) excludes them.
  const projects = await client.fetch<{ slug: string; _updatedAt?: string }[]>(
    groq`*[_type == "project" && !(_id in path("drafts.**")) && defined(slug.current) && !(hidden == true)]{ "slug": slug.current, _updatedAt }`,
  );
  // Slugs are shared across locales: keep the most recent _updatedAt per slug.
  const projectModBySlug = new Map<string, string>();
  for (const pr of projects) {
    if (!pr._updatedAt) continue;
    const prev = projectModBySlug.get(pr.slug);
    if (!prev || pr._updatedAt > prev) projectModBySlug.set(pr.slug, pr._updatedAt);
  }
  const uniqueProjectSlugs = [...new Set(projects.map((pr) => pr.slug))];
  for (const slug of uniqueProjectSlugs) {
    out.push(
      ...entry(
        {
          fr: `${localizedHref("projets", "fr")}/${slug}`,
          en: `${localizedHref("projets", "en")}/${slug}`,
        },
        0.6,
        projectModBySlug.get(slug),
      ),
    );
  }

  return out;
}
