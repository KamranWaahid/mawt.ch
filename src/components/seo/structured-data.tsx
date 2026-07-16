import type { Locale } from "@/i18n-config";

export const SITE_URL = "https://mawt.ch";
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;

/**
 * Generic server-rendered JSON-LD emitter. AI crawlers (SGE, Perplexity) do
 * not execute JS, so every schema is injected in the SSR HTML. Accepts a
 * single node or an array (rendered one <script> each).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const nodes = Array.isArray(data) ? data : [data];
  return (
    <>
      {nodes.map((node, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}

/**
 * Geographic anchoring for GEO/RAG engines.
 *
 * MAWT targets the Swiss market and, primarily, French-speaking Switzerland
 * (Suisse romande). We expose this explicitly via `areaServed` so AI engines
 * (Google SGE, Perplexity) associate the entity with the right region and
 * cantons. Reused by both the global graph and the per-service JSON-LD.
 */
export function areaServed(lang: Locale) {
  return [
    {
      "@type": "AdministrativeArea",
      name: lang === "fr" ? "Suisse romande" : "French-speaking Switzerland",
    },
    { "@type": "City", name: lang === "fr" ? "Genève" : "Geneva" },
    { "@type": "AdministrativeArea", name: "Vaud" },
    { "@type": "Country", name: lang === "fr" ? "Suisse" : "Switzerland" },
  ];
}

export function inLanguage(lang: Locale) {
  return lang === "fr" ? "fr-CH" : "en";
}

/** BreadcrumbList from an ordered list of { name, url }. */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** FAQPage from { question, answer } pairs. Returns null when empty. */
export function faqPageLd(items: { question: string; answer: string }[]) {
  if (!items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** ItemList of links (service catalog, family listing). */
export function itemListLd(
  name: string,
  items: { name: string; url: string }[],
  lang: Locale,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    inLanguage: inLanguage(lang),
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    })),
  };
}

/** BlogPosting / Article, cross-referenced to the global Organization. */
export function articleLd(opts: {
  url: string;
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  lang: Locale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    url: opts.url,
    headline: opts.headline,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    dateModified: opts.dateModified || opts.datePublished,
    inLanguage: inLanguage(opts.lang),
    author: { "@type": opts.authorName ? "Person" : "Organization", name: opts.authorName || "MAWT", ...(opts.authorName ? {} : { "@id": ORG_ID }) },
    publisher: { "@id": ORG_ID },
  };
}

/**
 * Global structured data: Organization + LocalBusiness + WebSite.
 *
 * Server-rendered (AI crawlers do not execute JS) and injected once per page
 * from the localized layout. Emitted as a single schema.org @graph so the
 * three entities are explicitly cross-referenced via @id.
 */
export function StructuredData({
  lang,
  sameAs,
}: {
  lang: Locale;
  sameAs?: string[];
}) {
  const orgId = ORG_ID;
  const siteId = WEBSITE_ID;
  const localBusinessId = LOCAL_BUSINESS_ID;
  const description =
    lang === "fr"
      ? "Agence IA à Genève. Solutions d'intelligence artificielle, automatisation des processus et outils sur mesure pour les PME et entreprises en croissance de Suisse romande. De la stratégie au déploiement."
      : "AI agency in Geneva. Artificial intelligence solutions, process automation and custom tools for SMEs and growing companies across French speaking Switzerland. From strategy to deployment.";
  const slogan =
    lang === "fr"
      ? "Des solutions qui tournent, pas des slides."
      : "Solutions that run, not slides.";
  const cleanSameAs = (sameAs || []).filter(
    (u): u is string => typeof u === "string" && /^https?:\/\//.test(u),
  );
  const contactPoint = {
    "@type": "ContactPoint",
    contactType: "sales",
    areaServed: "CH",
    availableLanguage: ["French", "English"],
    telephone: "+41766363333",
    email: "info@mawt.ch",
  };
  const foundingLocation = {
    "@type": "Place",
    name: lang === "fr" ? "Genève, Suisse" : "Geneva, Switzerland",
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: "MAWT",
        url: SITE_URL,
        description,
        slogan,
        logo: `${SITE_URL}/logo-black.svg`,
        inLanguage: inLanguage(lang),
        areaServed: areaServed(lang),
        foundingLocation,
        contactPoint,
        knowsLanguage: ["fr-CH", "en"],
        ...(cleanSameAs.length ? { sameAs: cleanSameAs } : {}),
      },
      {
        "@type": "LocalBusiness",
        "@id": localBusinessId,
        name: "MAWT",
        url: SITE_URL,
        description,
        slogan,
        image: `${SITE_URL}/logo-black.svg`,
        priceRange: "$$$",
        inLanguage: inLanguage(lang),
        areaServed: areaServed(lang),
        contactPoint,
        telephone: "+41766363333",
        email: "info@mawt.ch",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Rue de la Fontenette 23",
          postalCode: "1227",
          addressLocality: "Carouge",
          addressRegion: lang === "fr" ? "Genève" : "Geneva",
          addressCountry: "CH",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 46.1839,
          longitude: 6.1394,
        },
        parentOrganization: { "@id": orgId },
        ...(cleanSameAs.length ? { sameAs: cleanSameAs } : {}),
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: "MAWT",
        url: SITE_URL,
        inLanguage: inLanguage(lang),
        publisher: { "@id": orgId },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${lang}/services?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
