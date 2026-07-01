import { getSanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { getFamilyTitle, familySlugForLang, canonicalizeFamilySlug, hreflangAlternates } from "@/lib/routing/url-helpers";
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
};

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
    featuredProjects[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage,
      year,
      tags
    },
    relatedServices[]->{
      _id,
      title,
      "slug": slug.current,
      family,
      description,
      icon
    },
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
  const title = data.seo?.metaTitle || `${data.title} | MAWT`;
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
    alternates = hreflangAlternates(currentPath, lang as Locale);
  }

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: canonical,
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
  };
}

const components = {
  block: {
    // Authored "h1" blocks render as <h2>: the page owns a single H1 (hero),
    // so body content starts at H2 for a strict, parser-friendly hierarchy.
    h1: ({ children }: any) => <h2 className="text-xl font-normal text-black mt-8 mb-4">{children}</h2>,
    h2: ({ children }: any) => <h2 className="text-xl font-normal text-black mt-8 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-normal text-black mt-6 mb-3">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-base font-normal text-black mt-4 mb-2">{children}</h4>,
    normal: ({ children }: any) => <p className="text-base text-neutral-600 font-normal leading-relaxed mb-4">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-2 border-[#75DAB4] pl-5 py-1 italic text-neutral-500 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 mb-4 text-neutral-600 space-y-1.5 text-base">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 mb-4 text-neutral-600 space-y-1.5 text-base">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
    number: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
  },
  marks: {
    // Flat semantic emphasis (GEO): keeps the <strong> signal at weight 400.
    strong: ({ children }: any) => <strong className="font-normal text-black">{children}</strong>,
    em: ({ children }: any) => <em className="not-italic text-black">{children}</em>,
    highlight: ({ children }: any) => <mark>{children}</mark>,
    link: ({ children, value }: any) => {
      const href = value?.href || "#";
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="text-[#75DAB4] underline hover:text-black transition-colors">
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#75DAB4] underline hover:text-black transition-colors">
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
  if (!svc) {
    notFound();
  }

  // Use explicit references if present in Sanity; fallback to automatically filtered sibling services
  const related = (svc.relatedServices && svc.relatedServices.length > 0)
    ? svc.relatedServices
    : (data?.siblingServices || []);

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
    provider: { "@type": "Organization", name: "MAWT", url: SITE_URL },
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

  // Dynamically resolve icon
  const IconComponent = (Icons as any)[svc.icon || "Layers"] || Icons.Layers;

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
  };

  // Helper function to prevent double slash in link URLs
  const cleanPath = (path: string) => {
    if (!path) return "";
    return path.startsWith("/") ? path.slice(1) : path;
  };

  return (
    <div className="min-h-screen text-black font-sans selection:bg-[#d7b687]/30">
      {/* JSON-LD — server rendered */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      {/* Header & Hero Background Container spanning to the top of the viewport */}
      <div className="relative">
        <div className="relative z-10">
          <Breadcrumb
            items={[
              { label: labels.breadServices, to: "services" },
              { label: getFamilyTitle(canonicalFamily, lang as Locale), to: `services/${family}` },
              { label: svc.title, to: null },
            ]}
            lang={lang as Locale}
          />

          <SubpageHero
            eyebrow={getFamilyTitle(canonicalFamily, lang as Locale)}
            title={svc.heroH1 || svc.title}
            noGradient={true}
          />
        </div>
      </div>

      {/* Split Grid Content Block (Resume-style vertical stack in white) */}
      <main className="site-container-wide py-8 md:py-16 divide-y divide-black/5">
        
        {/* Row 1: Overview */}
        <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 first:pt-0">
          <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
            {lang === "fr" ? "Aperçu" : "Overview"}
          </div>
          <div className="md:col-span-9 lg:col-span-8 space-y-8">
            <div className="text-[#75DAB4] flex items-center gap-4">
              <IconComponent size={32} strokeWidth={1} />
              <div className="h-px flex-1 bg-black/5" />
            </div>

            {(svc.heroH2 || svc.description) && (
              <p className="text-xl sm:text-2xl text-neutral-800 font-normal leading-relaxed text-balance">
                {svc.heroH2 || svc.description}
              </p>
            )}

            {svc.answerBox && (
              <div className="border-l border-[#75DAB4] pl-4 py-1">
                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed italic">
                  {svc.answerBox}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href={`/${lang}/contact`}
                className="px-6 py-3.5 bg-[#75DAB4] hover:bg-black text-black hover:text-white transition-all duration-300 text-xs font-normal uppercase tracking-widest text-center rounded-sm"
              >
                {labels.ctaPrimary}
              </Link>
              {svc.featuredProjects && svc.featuredProjects.length > 0 && (
                <a
                  href="#projects"
                  className="px-6 py-3.5 border border-black/10 hover:border-black text-black transition-all duration-300 text-xs font-normal uppercase tracking-widest text-center rounded-sm"
                >
                  {labels.ctaSecondary}
                </a>
              )}
            </div>
          </div>
        </SectionReveal>

        {/* Row 2: Target Audience */}
        {svc.whoFor && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {lang === "fr" ? "Pour qui" : "Target"}
            </div>
            <div className="md:col-span-9 lg:col-span-8">
              <p className="text-base text-neutral-600 leading-relaxed font-normal">
                {svc.whoFor}
              </p>
            </div>
          </SectionReveal>
        )}

        {/* Row 3: Narrative Details */}
        {(svc.longDescription || (svc.sections && svc.sections.length > 0)) && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {lang === "fr" ? "Détails" : "Details"}
            </div>
            <div className="md:col-span-9 lg:col-span-8 space-y-12">
              {svc.longDescription && (
                <div className="prose prose-neutral max-w-none text-neutral-800">
                  <PortableText value={svc.longDescription} components={components} />
                </div>
              )}

              {svc.sections?.map((sec: any, i: number) => (
                <div key={i} className="space-y-4">
                  <h3 className="text-lg font-normal text-black">{sec.h2}</h3>
                  {sec.paragraphs?.map((p: string, j: number) => (
                    <p key={j} className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">{p}</p>
                  ))}
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-neutral-500">
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

        {/* Row 4: Capabilities */}
        {svc.features && svc.features.length > 0 && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {labels.featuresH2}
            </div>
            <div className="md:col-span-9 lg:col-span-8">
              <ul className="space-y-3">
                {svc.features.map((feature: string, i: number) => (
                  <li key={i} className="text-sm sm:text-base text-neutral-600 font-normal flex items-start gap-2">
                    <span className="text-[#75DAB4] select-none">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        )}

        {/* Row 5: Deliverables */}
        {svc.deliverables && svc.deliverables.length > 0 && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {lang === "fr" ? "Livrables" : "Deliverables"}
            </div>
            <div className="md:col-span-9 lg:col-span-8">
              <ul className="space-y-3">
                {svc.deliverables.map((d: string, i: number) => (
                  <li key={i} className="text-sm sm:text-base text-neutral-600 font-normal flex items-start gap-2">
                    <span className="text-[#75DAB4] select-none">•</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        )}

        {/* Row 6: Comparison Table */}
        {hasTable && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {lang === "fr" ? "Comparatif" : "Comparison"}
            </div>
            <div className="md:col-span-9 lg:col-span-8 space-y-4">
              {table.title && (
                <h3 className="text-base font-normal text-black">{table.title}</h3>
              )}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-black/10">
                      {table.columns?.map((c: string, i: number) => (
                        <th key={i} className="py-3 pr-4 text-xs font-normal text-neutral-400">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows?.map((row: any, i: number) => (
                      <tr key={i} className="border-b border-black/5">
                        {row.cells?.map((cell: string, j: number) => (
                          <td key={j} className={`py-3 pr-4 text-xs sm:text-sm ${j === 0 ? "text-black font-normal" : "text-neutral-500"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Row 7: Key Takeaways */}
        {svc.keyTakeaways && svc.keyTakeaways.length > 0 && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {lang === "fr" ? "À retenir" : "Takeaways"}
            </div>
            <div className="md:col-span-9 lg:col-span-8">
              <ul className="space-y-4">
                {svc.keyTakeaways.map((k: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#75DAB4] shrink-0" />
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">{k}</p>
                  </li>
                ))}
              </ul>
            </div>
          </SectionReveal>
        )}

        {/* Row 8: Featured Projects */}
        {svc.featuredProjects && svc.featuredProjects.length > 0 && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {labels.projectsH2}
            </div>
            <div className="md:col-span-9 lg:col-span-8 space-y-8" id="projects">
              {svc.featuredProjects.map((project: any) => (
                <div key={project._id} className="space-y-2 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <h4 className="text-base font-normal text-black group-hover:text-[#75DAB4] transition-colors">
                      {project.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-normal">
                      <span>{project.year}</span>
                      {project.tags?.[0] && (
                        <>
                          <span>•</span>
                          <span>{project.tags[0]}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed max-w-3xl">
                    {project.excerpt}
                  </p>
                  <div className="pt-1">
                    <Link
                      href={`/${lang}/work/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-normal text-[#75DAB4] hover:text-black transition-colors"
                    >
                      {labels.viewCaseStudy} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </SectionReveal>
        )}

        {/* Row 9: Related Services */}
        {related.length > 0 && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {labels.relatedH2}
            </div>
            <div className="md:col-span-9 lg:col-span-8 space-y-6">
              {related.map((item: any) => {
                const localizedFamily = familySlugForLang(item.family, lang as Locale);
                return (
                  <div key={item._id} className="space-y-1 group">
                    <h4 className="text-base font-normal text-black group-hover:text-[#75DAB4] transition-colors">
                      <Link href={`/${lang}/services/${localizedFamily}/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-3xl font-normal">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionReveal>
        )}

        {/* Row 10: FAQ */}
        {faqItems.length > 0 && (
          <SectionReveal className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
            <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
              {labels.faqH2}
            </div>
            <div className="md:col-span-9 lg:col-span-8">
              <div className="space-y-4 divide-y divide-black/5">
                {faqItems.map((item, index: number) => (
                  <details key={index} className="group pt-4 first:pt-0">
                    <summary className="flex justify-between items-center font-normal text-base text-black cursor-pointer list-none select-none hover:text-neutral-500 transition-colors">
                      <span>{item.question}</span>
                      <span className="transition-transform duration-200 group-open:rotate-45 text-neutral-400">
                        <Icons.Plus size={16} />
                      </span>
                    </summary>
                    <div className="mt-3 text-sm leading-relaxed text-neutral-500 font-normal">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Row 11: Bottom CTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-b-0">
          <div className="md:col-span-3 text-sm text-neutral-400 font-normal">
            {lang === "fr" ? "Contact" : "Next steps"}
          </div>
          <div className="md:col-span-9 lg:col-span-8 space-y-6">
            <AnimatedTitle
              as="h3"
              text={svc.cta?.headline || labels.bottomCtaH2}
              className="text-xl sm:text-2xl font-normal text-black leading-snug text-balance"
              splitBy="word"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={`/${lang}/${cleanPath(svc.cta?.primaryHref || "contact")}`}
                className="px-6 py-3.5 bg-black hover:bg-[#75DAB4] text-white hover:text-black transition-all duration-300 text-xs font-normal uppercase tracking-widest text-center rounded-sm"
              >
                {svc.cta?.primaryLabel || (lang === "fr" ? "Démarrer un projet" : "Start a Conversation")}
              </Link>
              {svc.cta?.secondaryLabel && (
                <Link
                  href={`/${lang}/${cleanPath(svc.cta?.secondaryHref || (lang === "fr" ? "projets" : "work"))}`}
                  className="px-6 py-3.5 border border-black/10 hover:border-black text-black transition-all duration-300 text-xs font-normal uppercase tracking-widest text-center rounded-sm"
                >
                  {svc.cta.secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export async function generateStaticParams() {
  const client = getSanityClient();
  if (!client) return [];

  const services = await client.fetch<{
    family: string;
    slug: { current: string };
    language: "fr" | "en";
  }[]>(
    groq`*[_type == "service" && defined(slug.current)]{family, slug, language}`
  );

  return services.map((svc) => ({
    lang: svc.language,
    family: familySlugForLang(svc.family, svc.language),
    service: svc.slug.current,
  }));
}
