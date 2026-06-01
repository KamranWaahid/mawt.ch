import { getServiceBySlug } from "@/lib/sanity.queries";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { urlForImage } from "@/lib/sanity.image";
import * as Icons from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const SITE_URL = "https://mawt.ch";

const COPY = {
  fr: {
    badge: "Expertise",
    answerLabel: "En bref",
    whoForLabel: "Pour qui",
    deliverablesLabel: "Ce que vous obtenez",
    capabilitiesLabel: "Capacités",
    takeawaysLabel: "À retenir",
    faqLabel: "Questions fréquentes",
    relatedLabel: "Services liés",
    servicesLabel: "Services",
    ctaHeadline: "Prêt à intégrer cette expertise à votre activité ?",
    ctaPrimary: "Démarrer votre projet",
    ctaSecondary: "Voir nos réalisations",
    contactHref: "contact",
    projectsHref: "projets",
  },
  en: {
    badge: "Expertise",
    answerLabel: "In short",
    whoForLabel: "Who it is for",
    deliverablesLabel: "What you get",
    capabilitiesLabel: "Capabilities",
    takeawaysLabel: "Key takeaways",
    faqLabel: "Frequently asked questions",
    relatedLabel: "Related services",
    servicesLabel: "Services",
    ctaHeadline: "Ready to integrate this expertise into your business?",
    ctaPrimary: "Start your project",
    ctaSecondary: "Explore our case studies",
    contactHref: "contact",
    projectsHref: "projects",
  },
} as const;

function getCopy(lang: string) {
  return lang === "fr" ? COPY.fr : COPY.en;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const service = await getServiceBySlug(slug, lang);
  if (!service?._id) return {};

  const title = service.seo?.metaTitle || service.heroH1 || service.title;
  const description =
    service.seo?.metaDescription || service.answerBox || service.description || service.title;
  const canonical = `${SITE_URL}/${lang}/services/${service.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
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
    h2: ({ children }: any) => <h3 className="text-2xl font-normal text-black mt-12 mb-6">{children}</h3>,
    h3: ({ children }: any) => <h4 className="text-xl font-normal text-black mt-10 mb-4">{children}</h4>,
    normal: ({ children }: any) => (
      <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">{children}</p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-brand-teal pl-8 py-2 italic text-neutral-500 my-12">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
    number: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-black">{children}</strong>,
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        rel="noopener noreferrer"
        className="text-brand-teal underline hover:text-black transition-colors"
      >
        {children}
      </a>
    ),
  },
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const service = await getServiceBySlug(slug, lang);

  if (!service?._id) {
    notFound();
  }

  const t = getCopy(lang);
  const IconComponent = (Icons as any)[service.icon || "Layers"] || Icons.Layers;

  const h1 = service.heroH1 || service.title;
  const heroSub = service.heroH2 || service.h2SeoCapture || undefined;

  const table = service.comparisonTable;
  const hasTable = !!(table && table.rows && table.rows.length > 0);

  // ── JSON-LD (SSR — AI crawlers do not run JS) ──────────────────────
  const canonical = `${SITE_URL}/${lang}/services/${service.slug}`;

  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.answerBox || service.description || h1,
    url: canonical,
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    provider: { "@type": "Organization", name: "MAWT", url: SITE_URL },
    areaServed: { "@type": "Country", name: "Switzerland" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "MAWT", item: `${SITE_URL}/${lang}` },
      { "@type": "ListItem", position: 2, name: t.servicesLabel, item: `${SITE_URL}/${lang}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: canonical },
    ],
  };

  const faqLd =
    service.faq && service.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: service.faq.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  return (
    <div className="bg-white min-h-screen">
      {/* JSON-LD — server rendered */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}

      {/* Hero — real H1 + H2 */}
      <SubpageHero badge={t.badge} title={h1} subtitle={heroSub} />

      {/* Answer box high on the page */}
      {service.answerBox && (
        <section className="bg-white px-6 pt-12 md:pt-16 sm:px-8 md:px-10 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="max-w-3xl rounded-sm border-l-4 border-brand-teal bg-neutral-50 p-6 md:p-8">
              <span className="text-xs uppercase tracking-[0.2em] text-brand-teal font-semibold block mb-3">
                {t.answerLabel}
              </span>
              <p className="text-lg md:text-xl text-black/80 leading-relaxed">{service.answerBox}</p>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* Main content */}
      <section className="bg-white px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Left: narrative + sections */}
          <div className="lg:col-span-7">
            <SectionReveal className="space-y-8 md:space-y-12">
              <div className="flex items-center gap-4 text-brand-teal">
                <IconComponent size={32} strokeWidth={1.5} />
                <div className="h-px flex-1 bg-black/5" />
              </div>

              {service.longDescription && (
                <div className="prose prose-lg max-w-none text-neutral-800">
                  <PortableText value={service.longDescription} components={components} />
                </div>
              )}

              {/* Structured sections — real H2s */}
              {service.sections?.map((sec, i) => (
                <div key={i}>
                  <h2 className="text-3xl font-normal tracking-tight text-black mt-4 mb-6">{sec.h2}</h2>
                  {sec.paragraphs?.map((p, j) => (
                    <p key={j} className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">
                      {p}
                    </p>
                  ))}
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="list-disc pl-6 mt-2 mb-2 text-neutral-600 space-y-2 text-lg">
                      {sec.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* Comparison table */}
              {hasTable && (
                <div>
                  {table!.title && (
                    <h2 className="text-3xl font-normal tracking-tight text-black mt-4 mb-6">{table!.title}</h2>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      {table!.columns && table!.columns.length > 0 && (
                        <thead>
                          <tr className="border-b border-black/10">
                            {table!.columns.map((c, i) => (
                              <th
                                key={i}
                                className="py-3 pr-6 text-sm uppercase tracking-wider text-black/50 font-semibold"
                              >
                                {c}
                              </th>
                            ))}
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {table!.rows!.map((row, i) => (
                          <tr key={i} className="border-b border-black/5">
                            {row.cells?.map((cell, j) => (
                              <td
                                key={j}
                                className={`py-3 pr-6 text-base ${j === 0 ? "text-black font-medium" : "text-neutral-600"}`}
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
              )}

              {/* Who it is for */}
              {service.whoFor && (
                <div>
                  <h2 className="text-3xl font-normal tracking-tight text-black mt-4 mb-6">{t.whoForLabel}</h2>
                  <p className="text-lg text-neutral-600 leading-relaxed">{service.whoFor}</p>
                </div>
              )}

              {!service.longDescription && !service.sections?.length && !service.whoFor && (
                <p className="text-xl text-neutral-600 italic">{service.description || ""}</p>
              )}
            </SectionReveal>
          </div>

          {/* Right rail: capabilities + deliverables */}
          <div className="lg:col-span-5 space-y-8">
            {service.features && service.features.length > 0 && (
              <SectionReveal delay={0.2} className="bg-neutral-50 p-6 sm:p-12 border border-black/5 rounded-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-black/40 mb-6 md:mb-8 font-semibold">
                  {t.capabilitiesLabel}
                </h2>
                <ul className="space-y-4 md:space-y-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                      <span className="text-base md:text-lg font-normal text-black/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </SectionReveal>
            )}

            {service.deliverables && service.deliverables.length > 0 && (
              <SectionReveal delay={0.3} className="bg-white p-6 sm:p-12 border border-black/5 rounded-sm">
                <h2 className="text-sm uppercase tracking-[0.2em] text-black/40 mb-6 md:mb-8 font-semibold">
                  {t.deliverablesLabel}
                </h2>
                <ul className="space-y-4">
                  {service.deliverables.map((d, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <Icons.Check size={18} className="text-brand-teal mt-1 shrink-0" />
                      <span className="text-base md:text-lg text-black/80">{d}</span>
                    </li>
                  ))}
                </ul>
              </SectionReveal>
            )}
          </div>
        </div>
      </section>

      {/* Key takeaways */}
      {service.keyTakeaways && service.keyTakeaways.length > 0 && (
        <section className="bg-white px-6 py-12 md:py-16 sm:px-8 md:px-10 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="rounded-sm bg-black text-white p-8 md:p-12">
              <h2 className="text-sm uppercase tracking-[0.2em] text-brand-teal mb-6 font-semibold">
                {t.takeawaysLabel}
              </h2>
              <ul className="grid md:grid-cols-2 gap-x-12 gap-y-4">
                {service.keyTakeaways.map((k, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-teal shrink-0" />
                    <span className="text-lg text-white/90 leading-relaxed">{k}</span>
                  </li>
                ))}
              </ul>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faq && service.faq.length > 0 && (
        <section className="bg-bg-light px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-[900px] mx-auto">
            <SectionReveal className="mb-10">
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black">{t.faqLabel}</h2>
            </SectionReveal>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {service.faq.map((f, i) => (
                <SectionReveal key={i} delay={i * 0.05}>
                  <details className="group py-6" {...(i === 0 ? { open: true } : {})}>
                    <summary className="flex cursor-pointer items-center justify-between gap-6 list-none">
                      <h3 className="text-lg md:text-xl font-normal text-black">{f.question}</h3>
                      <Icons.Plus
                        size={20}
                        className="text-brand-teal shrink-0 transition-transform group-open:rotate-45"
                      />
                    </summary>
                    <p className="mt-4 text-lg text-neutral-600 leading-relaxed">{f.answer}</p>
                  </details>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related services — internal links */}
      {service.relatedServices && service.relatedServices.length > 0 && (
        <section className="bg-white px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="mb-10">
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black">{t.relatedLabel}</h2>
            </SectionReveal>
            <div className="grid md:grid-cols-3 gap-6">
              {service.relatedServices.map((rel) => {
                const RelIcon = (Icons as any)[rel.icon || "ArrowRight"] || Icons.ArrowRight;
                return (
                  <SectionReveal key={rel._id}>
                    <Link
                      href={`/${lang}/services/${rel.slug}`}
                      className="group block h-full p-6 md:p-8 border border-black/10 rounded-sm hover:border-brand-teal transition-colors"
                    >
                      <RelIcon size={24} className="text-brand-teal mb-4" strokeWidth={1.5} />
                      <h3 className="text-xl font-normal text-black mb-2">{rel.title}</h3>
                      {(rel.heroH2 || rel.description) && (
                        <p className="text-base text-neutral-600 line-clamp-3">{rel.heroH2 || rel.description}</p>
                      )}
                    </Link>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured projects — defensive */}
      {service.featuredProjects && service.featuredProjects.length > 0 && (
        <section className="bg-bg-light px-6 py-16 md:py-24 sm:px-8 md:px-10 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid md:grid-cols-2 gap-1 px-1 bg-black/5 border border-black/5 overflow-hidden rounded-sm">
              {service.featuredProjects.map((project, i) => (
                <SectionReveal
                  key={project._id}
                  delay={i * 0.1}
                  className="group bg-white overflow-hidden relative aspect-[4/3] md:aspect-[16/10]"
                >
                  <Link href={`/${lang}/projects/${project.slug}`} className="block h-full relative">
                    {project.coverImage ? (
                      <Image
                        src={urlForImage(project.coverImage)?.width(1200).height(800).url() || ""}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100" />
                    )}
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Localized CTA from Sanity, with localized fallbacks */}
      <section className="bg-black text-white px-6 py-32 sm:px-8 md:px-10 lg:px-12 text-center">
        <SectionReveal className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight leading-[1.1]">
            {service.cta?.headline || t.ctaHeadline}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link
              href={`/${lang}/${service.cta?.primaryHref || t.contactHref}`}
              className="px-8 py-4 bg-brand-teal text-black text-sm font-semibold tracking-wide hover:bg-white transition-colors rounded-sm"
            >
              {service.cta?.primaryLabel || t.ctaPrimary}
            </Link>
            <Link
              href={`/${lang}/${service.cta?.secondaryHref || t.projectsHref}`}
              className="text-sm font-normal border-b border-white/20 hover:border-white transition-colors pb-1"
            >
              {service.cta?.secondaryLabel || t.ctaSecondary}
            </Link>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}
