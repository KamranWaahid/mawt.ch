import type { ReactNode } from "react";
import { getSanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionReveal } from "@/components/ui/section-reveal";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { CurtainLink } from "@/components/ui/curtain-link";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { ArrowRight, Layers, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { getFamilyTitle, familySlugForLang, canonicalizeFamilySlug, localizedHref } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import { areaServed } from "@/components/seo/structured-data";
import { groq } from "next-sanity";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; family: string; service: string }>;
}

// ISR: 70 service detail pages are statically pre-rendered (generateStaticParams
// below) and refreshed from Sanity at most hourly.
export const revalidate = 3600;

const FAMILY_TAG_MAPPING: Record<string, string[]> = {
  "sites-et-branding": ["sites", "branding", "ecommerce"],
  "solutions-ia": ["ia", "automatisation", "crm", "agent-ia", "rag", "mobile"],
  "conseil-ia": ["conseil", "strategie", "audit", "transformation", "change"],
  "renfort-equipe": ["renfort", "developpeur", "fractional", "qa"],
  "formation-ia": ["formation", "chatgpt", "coaching"],
  "developpement-logiciel": ["sites", "mobile", "developpeur", "ia"],
  securite: ["ia"],
};

// defined(_id) drops nulls from broken/deleted references. Without it, a
// hidden!=true filter keeps nulls (null.hidden is undefined) and later
// project/service .title access throws during static generation.
const serviceDetailPageQuery = groq`
{
  "service": *[_type == "service" && family == $family && slug.current == $serviceSlug && language == $lang][0]{
    _id,
    title,
    "slug": slug.current,
    family,
    description,
    longDescription,
    features,
    icon,
    h2SeoCapture,
    heroH1,
    heroH2,
    answerBox,
    whoFor,
    deliverables,
    keyTakeaways,
    sections[]{ h2, paragraphs, bullets },
    comparisonTable{ title, columns, rows[]{ cells } },
    faq[]{ question, answer },
    cta,
    "featuredProjects": featuredProjects[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage,
      year,
      tags,
      hidden
    }[defined(_id) && !(hidden == true)],
    "relatedServices": relatedServices[]->{
      _id,
      title,
      "slug": slug.current,
      family,
      description,
      icon
    }[defined(_id) && defined(title) && defined(slug)],
    seo
  },
  "siblingServices": *[_type == "service" && family == $family && slug.current != $serviceSlug && language == $lang && displayAsCard == true] | order(tier asc)[0..2]{
    _id,
    title,
    "slug": slug.current,
    family,
    description,
    icon
  },
  "faqs": *[_type == "faq" && language == $lang && (count(tags[@ in $tags]) > 0 || $serviceSlug in tags)][0..4]{
    question,
    answer
  }
}
`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, family, service } = await params;
  const canonicalFamily = canonicalizeFamilySlug(family, lang as Locale);
  if (!canonicalFamily) return {};

  const client = getSanityClient();
  if (!client) return {};

  const data = await client.fetch<any>(
    groq`*[_type == "service" && family == $family && slug.current == $serviceSlug && language == $lang][0]{
      title,
      description,
      answerBox,
      heroH1,
      tier,
      seo
    }`,
    { family: canonicalFamily, serviceSlug: service, lang }
  );

  if (!data) return {};

  const currentPath = `/${lang}/services/${family}/${service}`;
  const canonical = `https://mawt.ch${currentPath}`;
  // Many Sanity metaTitles already carry a "| MAWT…" suffix ("| MAWT",
  // "| MAWT Genève"). The layout title template appends "| MAWT" on top,
  // which rendered "… | MAWT Genève | MAWT". Strip a bare trailing "| MAWT";
  // keep richer suffixes ("| MAWT Genève") as authored via an absolute title.
  const rawTitle = data.seo?.metaTitle || data.title;
  if (!rawTitle) return {};
  const hasBrandedSuffix = /\|\s*MAWT\b[^|]*$/i.test(rawTitle);
  const titleText = rawTitle.replace(/\s*\|\s*MAWT\s*$/i, "").trim();
  const title = hasBrandedSuffix ? { absolute: rawTitle } : rawTitle;
  const description = data.seo?.metaDescription || data.answerBox || data.description;

  // hreflang needs the SIBLING document's localized slug (translatePath cannot
  // translate Sanity per-doc slugs). FR/EN counterparts share (family, tier).
  const otherLang: Locale = lang === "fr" ? "en" : "fr";
  const sibling = await client.fetch<{ slug?: string } | null>(
    groq`*[_type == "service" && family == $family && tier == $tier && language == $other][0]{ "slug": slug.current }`,
    { family: canonicalFamily, tier: data.tier ?? -1, other: otherLang }
  );
  const SITE = "https://mawt.ch";
  let alternates;
  if (sibling?.slug) {
    const otherPath = `/${otherLang}/services/${familySlugForLang(canonicalFamily, otherLang)}/${sibling.slug}`;
    const frPath = lang === "fr" ? currentPath : otherPath;
    const enPath = lang === "en" ? currentPath : otherPath;
    alternates = {
      canonical,
      languages: { fr: `${SITE}${frPath}`, en: `${SITE}${enPath}`, "x-default": `${SITE}${enPath}` },
    };
  } else {
    // No sibling in the other language: emit the canonical ONLY. The old
    // fallback (hreflangAlternates) piped the untranslated Sanity slug through
    // translatePath and produced an hreflang pointing at a 404 — an invalid
    // alternate voids the whole set for BOTH pages. No signal beats a false
    // signal (same pattern as news/[slug]).
    alternates = { canonical };
  }

  return {
    title,
    description,
    alternates,
    openGraph: {
      title: titleText,
      description,
      url: canonical,
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
    twitter: { title: titleText, description },
  };
}

const components = {
  block: {
    // Authored "h1" blocks render as <h2>: the page owns a single H1 (hero).
    h1: ({ children }: any) => (
      <h2 className="mt-8 mb-4 text-xl font-medium tracking-tight text-white">{children}</h2>
    ),
    h2: ({ children }: any) => (
      <h2 className="mt-8 mb-4 text-xl font-medium tracking-tight text-white">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="mt-6 mb-3 text-lg font-medium tracking-tight text-white">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="mt-4 mb-2 text-base font-medium tracking-tight text-white/90">{children}</h4>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 text-base font-normal leading-relaxed text-white/55">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-6 border-l border-[#75DAB4]/70 pl-5 py-1 text-white/50">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="mb-4 list-disc space-y-1.5 pl-5 text-base text-white/55">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-base text-white/55">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-white/55">{children}</li>,
    number: ({ children }: any) => <li className="text-white/55">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-normal text-white">{children}</strong>,
    em: ({ children }: any) => <em className="not-italic text-white/80">{children}</em>,
    highlight: ({ children }: any) => <mark className="bg-[#75DAB4]/20 text-white">{children}</mark>,
    link: ({ children, value }: any) => {
      const href = value?.href || "#";
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="text-[#75DAB4] underline transition-colors hover:text-white">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#75DAB4] underline transition-colors hover:text-white"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function ServiceDetailPage({ params }: Props) {
  const { lang, family, service } = await params;
  
  const canonicalFamily = canonicalizeFamilySlug(family, lang as Locale);
  if (!canonicalFamily) {
    notFound();
  }

  const client = getSanityClient();
  if (!client) {
    notFound();
  }

  const tags = FAMILY_TAG_MAPPING[canonicalFamily] || [];

  const data = await client.fetch<any>(
    serviceDetailPageQuery,
    { family: canonicalFamily, serviceSlug: service, lang, tags }
  );

  const svc = data?.service;
  if (!svc?.title) {
    notFound();
  }

  // Use explicit references if present in Sanity; fallback to automatically filtered sibling services.
  // Filter again in JS: GROQ can still surface sparse arrays if a reference is mid-delete.
  const related = (
    svc.relatedServices?.length
      ? svc.relatedServices
      : data?.siblingServices || []
  ).filter((item: { _id?: string; title?: string; slug?: string } | null) =>
    Boolean(item?._id && item.title && item.slug),
  );

  const featuredProjects = (svc.featuredProjects || []).filter(
    (project: { _id?: string; title?: string } | null) =>
      Boolean(project?._id && project.title),
  );

  // Prefer the service's own rich FAQ; fall back to tag matched FAQ docs.
  const faqItems = (svc.faq && svc.faq.length > 0 ? svc.faq : data?.faqs || []) as { question: string; answer: string }[];
  const table = svc.comparisonTable;
  const hasTable = !!(table && table.rows && table.rows.length > 0);

  // JSON-LD (SSR — AI crawlers do not run JS)
  const SITE_URL = "https://mawt.ch";
  const canonical = `${SITE_URL}/${lang}/services/${family}/${service}`;
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    serviceType: svc.title,
    description: svc.answerBox || svc.description || svc.heroH1 || svc.title,
    url: canonical,
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    // @id reference, not an inline duplicate: the global @graph already
    // defines #organization — inline copies fragment the entity graph.
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: areaServed(lang as Locale),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "MAWT", item: `${SITE_URL}/${lang}` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/${lang}/services` },
      { "@type": "ListItem", position: 3, name: svc.title, item: canonical },
    ],
  };
  const faqLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  const IconComponent = ((Icons as unknown as Record<string, LucideIcon>)[svc.icon || "Layers"] || Layers);
  const familyTitle = getFamilyTitle(canonicalFamily, lang as Locale);
  const contactHref = localizedHref("contact", lang as Locale);

  const labels = {
    fr: {
      breadServices: "Services",
      ctaPrimary: "Discutons de votre besoin",
      ctaSecondary: "Projets liés",
      featuresH2: "Ce que ça inclut",
      projectsH2: "Projets concrets",
      relatedH2: "Vous pourriez aussi avoir besoin de",
      faqH2: "Questions fréquentes",
      bottomCtaH2: `Discutons de votre besoin sur ${svc.title}`,
      viewCaseStudy: "Voir l'étude de cas",
      overview: "Aperçu",
      target: "Pour qui",
      details: "Détails",
      deliverables: "Livrables",
      comparison: "Comparatif",
      takeaways: "À retenir",
      nextSteps: "Contact",
      startProject: "Démarrer un projet",
    },
    en: {
      breadServices: "Services",
      ctaPrimary: "Discuss this need",
      ctaSecondary: "Related projects",
      featuresH2: "What it includes",
      projectsH2: "Real projects",
      relatedH2: "You might also need",
      faqH2: "Frequent questions",
      bottomCtaH2: `Let's talk about your ${svc.title} need`,
      viewCaseStudy: "View Case Study",
      overview: "Overview",
      target: "Target",
      details: "Details",
      deliverables: "Deliverables",
      comparison: "Comparison",
      takeaways: "Takeaways",
      nextSteps: "Next steps",
      startProject: "Start a Conversation",
    },
  }[lang as "fr" | "en"] || {
    breadServices: "Services",
    ctaPrimary: "Discuss this need",
    ctaSecondary: "Related projects",
    featuresH2: "What it includes",
    projectsH2: "Real projects",
    relatedH2: "You might also need",
    faqH2: "Frequent questions",
    bottomCtaH2: `Let's talk about your ${svc.title} need`,
    viewCaseStudy: "View Case Study",
    overview: "Overview",
    target: "Target",
    details: "Details",
    deliverables: "Deliverables",
    comparison: "Comparison",
    takeaways: "Takeaways",
    nextSteps: "Next steps",
    startProject: "Start a Conversation",
  };

  const cleanPath = (path: string) => {
    if (!path) return "";
    return path.startsWith("/") ? path.slice(1) : path;
  };

  const RowLabel = ({ children }: { children: ReactNode }) => (
    <div className="text-[13px] font-normal text-white/35 md:col-span-3">{children}</div>
  );

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      <Breadcrumb
        items={[
          { label: labels.breadServices, to: "services" },
          { label: familyTitle, to: `services/${family}` },
          { label: svc.title, to: null },
        ]}
        lang={lang as Locale}
        tone="dark"
      />

      <section className="pb-10 pt-6 md:pb-14 md:pt-8">
        <div className="site-container-xwide">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <p className="mb-5 text-[13px] font-normal text-white/40">{familyTitle}</p>
              <h1 className="max-w-[14ch] text-[clamp(2.6rem,5vw,4.6rem)] font-medium leading-[0.98] tracking-tight text-white">
                {svc.heroH1 || svc.title}
              </h1>
            </div>
            <div className="lg:col-span-4">
              <DarkPageIcon icon={IconComponent} className="mb-6" />
              {(svc.heroH2 || svc.description) && (
                <p className="max-w-[36ch] text-[15px] font-normal leading-relaxed text-white/55 md:text-[16px]">
                  {svc.heroH2 || svc.description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <SlidePageBody>
        <main className="site-container-xwide divide-y divide-white/10 border-t border-white/10 pb-8 md:pb-16">
          <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12 first:pt-10">
            <RowLabel>{labels.overview}</RowLabel>
            <div className="space-y-7 md:col-span-9 lg:col-span-8">
              {svc.answerBox && (
                <div className="border-l border-[#75DAB4]/70 pl-4 py-1">
                  <p className="text-[16px] font-normal leading-relaxed text-white/60 md:text-[17px]">
                    {svc.answerBox}
                  </p>
                </div>
              )}
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <CurtainLink
                  href={contactHref}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {labels.ctaPrimary}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </CurtainLink>
                {featuredProjects.length > 0 && (
                  <a
                    href="#projects"
                    className="inline-flex items-center justify-center border border-white/20 px-6 py-3.5 text-[13px] font-normal text-white/70 transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                  >
                    {labels.ctaSecondary}
                  </a>
                )}
              </div>
            </div>
          </SectionReveal>

          {svc.whoFor && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.target}</RowLabel>
              <div className="md:col-span-9 lg:col-span-8">
                <p className="max-w-[54ch] text-[15px] font-normal leading-relaxed text-white/55 md:text-[16px]">
                  {svc.whoFor}
                </p>
              </div>
            </SectionReveal>
          )}

          {(svc.longDescription || (svc.sections && svc.sections.length > 0)) && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.details}</RowLabel>
              <div className="space-y-12 md:col-span-9 lg:col-span-8">
                {svc.longDescription && (
                  <PortableText value={svc.longDescription} components={components} />
                )}
                {svc.sections?.map((sec: any, i: number) => (
                  <div key={i} className="space-y-4">
                    <h2 className="text-[18px] font-medium tracking-tight text-white">{sec.h2}</h2>
                    {sec.paragraphs?.map((p: string, j: number) => (
                      <p key={j} className="text-[15px] font-normal leading-relaxed text-white/55">
                        {p}
                      </p>
                    ))}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="list-disc space-y-1.5 pl-5 text-[15px] text-white/50">
                        {sec.bullets.map((b: string, j: number) => (
                          <li key={j}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </SectionReveal>
          )}

          {svc.features && svc.features.length > 0 && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.featuresH2}</RowLabel>
              <div className="md:col-span-9 lg:col-span-8">
                <ul className="divide-y divide-white/10 border-y border-white/10">
                  {svc.features.map((feature: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 py-3.5 text-[15px] font-normal text-white/60"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#75DAB4]" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          )}

          {svc.deliverables && svc.deliverables.length > 0 && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.deliverables}</RowLabel>
              <div className="md:col-span-9 lg:col-span-8">
                <ul className="space-y-3">
                  {svc.deliverables.map((d: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-[15px] font-normal text-white/60">
                      <span className="text-[#75DAB4]" aria-hidden="true">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          )}

          {hasTable && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.comparison}</RowLabel>
              <div className="space-y-4 md:col-span-9 lg:col-span-8">
                {table.title && (
                  <h2 className="text-[16px] font-medium tracking-tight text-white">{table.title}</h2>
                )}
                <div className="overflow-x-auto border border-white/10">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.03]">
                        {table.columns?.map((c: string, i: number) => (
                          <th key={i} className="px-4 py-3 text-[12px] font-normal text-white/40">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows?.map((row: any, i: number) => (
                        <tr key={i} className="border-b border-white/5 last:border-b-0">
                          {row.cells?.map((cell: string, j: number) => (
                            <td
                              key={j}
                              className={`px-4 py-3 text-[13px] ${
                                j === 0 ? "text-white/85" : "text-white/45"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </SectionReveal>
          )}

          {svc.keyTakeaways && svc.keyTakeaways.length > 0 && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.takeaways}</RowLabel>
              <div className="md:col-span-9 lg:col-span-8">
                <ul className="space-y-4">
                  {svc.keyTakeaways.map((k: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#75DAB4]" aria-hidden="true" />
                      <p className="text-[15px] font-normal leading-relaxed text-white/55">{k}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          )}

          {featuredProjects.length > 0 && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.projectsH2}</RowLabel>
              <div className="space-y-8 md:col-span-9 lg:col-span-8" id="projects">
                {featuredProjects.map((project: any) => (
                  <div key={project._id} className="group space-y-2 border-b border-white/10 pb-8 last:border-b-0 last:pb-0">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-[16px] font-medium tracking-tight text-white transition-colors group-hover:text-white/80">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[12px] font-normal text-white/35">
                        <span>{project.year}</span>
                        {project.tags?.[0] && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span>{project.tags[0]}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="max-w-3xl text-[14px] font-normal leading-relaxed text-white/45">
                      {project.excerpt}
                    </p>
                    {project.coverImage?.asset && (
                      <Link
                        href={`/${lang}/${lang === "fr" ? "projets" : "work"}/${project.slug}`}
                        className="inline-flex items-center gap-1.5 pt-1 text-[12px] font-normal text-white/55 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                      >
                        {labels.viewCaseStudy} <ArrowRight size={12} aria-hidden="true" />
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </SectionReveal>
          )}

          {related.length > 0 && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.relatedH2}</RowLabel>
              <div className="divide-y divide-white/10 border-y border-white/10 md:col-span-9 lg:col-span-8">
                {related.map((item: any) => {
                  const localizedFamily = familySlugForLang(item.family, lang as Locale);
                  return (
                    <Link
                      key={item._id}
                      href={`/${lang}/services/${localizedFamily}/${item.slug}`}
                      className="group block space-y-1 py-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                    >
                      <h3 className="text-[16px] font-medium tracking-tight text-white/90 group-hover:text-white">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="max-w-3xl text-[13px] font-normal leading-relaxed text-white/45">
                          {item.description}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            </SectionReveal>
          )}

          {faqItems.length > 0 && (
            <SectionReveal className="grid grid-cols-1 gap-8 py-12 md:grid-cols-12">
              <RowLabel>{labels.faqH2}</RowLabel>
              <div className="divide-y divide-white/10 border-y border-white/10 md:col-span-9 lg:col-span-8">
                {faqItems.map((item, index: number) => (
                  <details key={index} className="group py-5 first:pt-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35">
                      <h3 className="text-[15px] font-normal text-white/85 transition-colors group-hover:text-white md:text-[16px]">
                        {item.question}
                      </h3>
                      <span className="mt-0.5 text-white/40 transition-transform duration-200 group-open:rotate-45">
                        <Icons.Plus size={16} aria-hidden="true" />
                      </span>
                    </summary>
                    <div className="mt-3 max-w-[54ch] text-[14px] font-normal leading-relaxed text-white/50">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </SectionReveal>
          )}

          <section className="grid grid-cols-1 gap-8 py-16 md:grid-cols-12 md:py-20">
            <RowLabel>{labels.nextSteps}</RowLabel>
            <div className="space-y-6 md:col-span-9 lg:col-span-8">
              <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-tight tracking-tight text-white">
                {svc.cta?.headline || labels.bottomCtaH2}
              </h2>
              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <CurtainLink
                  href={`/${lang}/${cleanPath(svc.cta?.primaryHref || "contact")}`}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                >
                  {svc.cta?.primaryLabel || labels.startProject}
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                    <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </CurtainLink>
                {svc.cta?.secondaryLabel && (
                  <Link
                    href={`/${lang}/${cleanPath(svc.cta?.secondaryHref || (lang === "fr" ? "projets" : "work"))}`}
                    className="inline-flex items-center justify-center border border-white/20 px-6 py-3.5 text-[13px] font-normal text-white/70 transition-colors hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                  >
                    {svc.cta.secondaryLabel}
                  </Link>
                )}
              </div>
            </div>
          </section>
        </main>
      </SlidePageBody>
    </div>
  );
}

export async function generateStaticParams() {
  const client = getSanityClient();
  if (!client) return [];

  const services = await client.fetch<{
    family: string;
    slug: string;
    language: "fr" | "en";
    title?: string;
  }[]>(
    groq`*[_type == "service" && defined(slug.current) && defined(family) && defined(language) && defined(title)]{
      family,
      "slug": slug.current,
      language,
      title
    }`
  );

  return (services || [])
    .filter((svc) => svc?.family && svc?.slug && svc?.language && svc?.title)
    .map((svc) => ({
      lang: svc.language,
      family: familySlugForLang(svc.family, svc.language),
      service: svc.slug,
    }));
}
