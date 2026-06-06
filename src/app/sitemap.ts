import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { getSanityClient } from "@/lib/sanity.client";
import {
  SITE_URL,
  localizedHref,
  familySlugForLang,
} from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";

const LOCALES: Locale[] = ["fr", "en"];

/** Build a sitemap entry (one per locale) with reciprocal hreflang alternates. */
function entry(
  pathByLocale: Record<Locale, string>,
  priority: number,
): MetadataRoute.Sitemap {
  const languages = {
    fr: `${SITE_URL}${pathByLocale.fr}`,
    en: `${SITE_URL}${pathByLocale.en}`,
    "x-default": `${SITE_URL}${pathByLocale.en}`,
  };
  return LOCALES.map((lang) => ({
    url: `${SITE_URL}${pathByLocale[lang]}`,
    lastModified: new Date(),
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

  const client = getSanityClient();
  if (!client) return out;

  // Service detail pages (70 docs, fr+en). Hreflang alternates are paired by
  // (family, tier) — the unique 1:1 FR↔EN key — because translatePath cannot
  // translate Sanity per-document slugs (it would emit non-existent URLs, the
  // same bug that caused the language-switch 404).
  const services = await client.fetch<
    { slug: string; family: string; tier: number; language: Locale }[]
  >(
    groq`*[_type == "service" && !(_id in path("drafts.**")) && defined(slug.current) && defined(family) && defined(language)]{ "slug": slug.current, family, tier, language }`,
  );
  const pathByKeyLang = new Map<string, Partial<Record<Locale, string>>>();
  for (const s of services) {
    const key = `${s.family}|${s.tier}`;
    const path = `/${s.language}/services/${familySlugForLang(s.family, s.language)}/${s.slug}`;
    const e = pathByKeyLang.get(key) || {};
    e[s.language] = path;
    pathByKeyLang.set(key, e);
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
      out.push({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: { languages },
      });
    }
  }

  // Blog posts and project case studies are not language-split (single doc per slug,
  // rendered under either locale prefix). List both locales with reciprocal alternates.
  const posts = await client.fetch<{ slug: string }[]>(
    groq`*[_type == "post" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current }`,
  );
  for (const p of posts) {
    out.push(...entry({ fr: `/fr/blog/${p.slug}`, en: `/en/blog/${p.slug}` }, 0.6));
  }

  const projects = await client.fetch<{ slug: string }[]>(
    groq`*[_type == "project" && !(_id in path("drafts.**")) && defined(slug.current)]{ "slug": slug.current }`,
  );
  for (const pr of projects) {
    out.push(
      ...entry({ fr: `/fr/projets/${pr.slug}`, en: `/en/projects/${pr.slug}` }, 0.6),
    );
  }

  return out;
}
