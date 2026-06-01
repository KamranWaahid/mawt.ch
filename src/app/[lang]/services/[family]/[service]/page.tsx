import { getSanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity.image";
import { ArrowRight, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { getFamilyTitle, familySlugForLang, canonicalizeFamilySlug } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";
import { groq } from "next-sanity";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; family: string; service: string }>;
}

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
    featuredProjects[]->{
      _id,
      title,
      "slug": slug.current,
      excerpt,
      coverImage,
      year,
      tags
    },
    seo
  },
  "relatedServices": *[_type == "service" && family == $family && slug.current != $serviceSlug && language == $lang && displayAsCard == true] | order(tier asc)[0..2]{
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
      seo
    }`,
    { family: canonicalFamily, serviceSlug: service, lang }
  );

  if (!data) return {};

  return {
    title: data.seo?.metaTitle || `${data.title} | MAWT`,
    description: data.seo?.metaDescription || data.description,
  };
}

const components = {
  block: {
    h1: ({ children }: any) => <h1 className="text-4xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-3xl font-normal tracking-tight text-black mt-16 mb-8">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-normal text-black mt-12 mb-6">{children}</h3>,
    h4: ({ children }: any) => <h4 className="text-xl font-normal text-black mt-10 mb-4">{children}</h4>,
    normal: ({ children }: any) => <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#75DAB4] pl-8 py-2 italic text-neutral-500 my-12">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
    number: ({ children }: any) => <li className="text-neutral-600">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-semibold text-black">{children}</strong>,
    link: ({ children, value }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-[#75DAB4] underline hover:text-black transition-colors">
        {children}
      </a>
    ),
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

  const related = data?.relatedServices || [];
  const faqs = data?.faqs || [];

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

  return (
    <div className="bg-white min-h-screen">
      <Breadcrumb
        items={[
          { label: labels.breadServices, to: "services" },
          { label: getFamilyTitle(canonicalFamily, lang as Locale), to: `services/${family}` },
          { label: svc.title, to: null },
        ]}
        lang={lang as Locale}
      />

      {/* Hero Section */}
      <section className="bg-white px-6 pt-12 pb-16 md:pb-24 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto">
          <SectionReveal className="space-y-8 max-w-4xl">
            <div className="flex items-center gap-4 text-[#75DAB4]">
              <IconComponent size={40} strokeWidth={1.5} />
              <div className="h-px flex-1 bg-black/10" />
            </div>
            
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tighter text-black leading-[1.05] text-balance">
                {svc.heroH1 || svc.title}
              </h1>
              {svc.h2SeoCapture && (
                <h2 className="text-lg md:text-xl font-normal text-neutral-400 mt-4 max-w-2xl leading-relaxed">
                  {svc.h2SeoCapture}
                </h2>
              )}
            </div>

            <p className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-3xl">
              {svc.heroH2 || svc.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href={`/${lang}/contact`}
                className="px-8 py-4 bg-[#75DAB4] hover:bg-black text-black hover:text-white transition-all duration-300 text-sm font-normal uppercase tracking-widest text-center rounded-sm"
              >
                {labels.ctaPrimary}
              </Link>
              {svc.featuredProjects && svc.featuredProjects.length > 0 && (
                <a
                  href="#projects"
                  className="px-8 py-4 border border-black/10 hover:border-black text-black transition-all duration-300 text-sm font-normal uppercase tracking-widest text-center rounded-sm"
                >
                  {labels.ctaSecondary}
                </a>
              )}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Main Narrative & Capabilities Grid */}
      <section className="bg-white px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Left Column: Narrative (Portable Text) */}
          <div className="lg:col-span-7">
            <SectionReveal className="space-y-8">
              <div className="prose prose-lg max-w-none text-neutral-800">
                {svc.longDescription ? (
                  <PortableText value={svc.longDescription} components={components} />
                ) : (
                  <p className="text-xl text-neutral-600 italic">
                    {svc.description || "Detailed narrative coming soon."}
                  </p>
                )}
              </div>
            </SectionReveal>
          </div>

          {/* Right Column: Capabilities / What it includes */}
          <div className="lg:col-span-5">
            {svc.features && svc.features.length > 0 && (
              <SectionReveal delay={0.2} className="bg-neutral-50/50 p-8 sm:p-12 border border-black/5 rounded-sm sticky top-32">
                <h2 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-8">
                  {labels.featuresH2}
                </h2>
                <ul className="space-y-5">
                  {svc.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 group">
                      <div className="mt-1 flex items-center justify-center h-5 w-5 rounded-full bg-[#75DAB4]/10 text-black shrink-0">
                        <Check size={12} className="text-black" />
                      </div>
                      <span className="text-[15px] sm:text-[16px] font-normal leading-relaxed text-neutral-600 group-hover:text-black transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </SectionReveal>
            )}
          </div>
        </div>
      </section>

      {/* Case Studies / Featured Projects */}
      {svc.featuredProjects && svc.featuredProjects.length > 0 && (
        <section id="projects" className="bg-neutral-50/30 px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="mb-16">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-4 block">
                Proof of Excellence
              </span>
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black">
                {labels.projectsH2}
              </h2>
            </SectionReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {svc.featuredProjects.map((project: any, i: number) => (
                <SectionReveal key={project._id} delay={i * 0.1} className="group bg-white overflow-hidden border border-black/5 rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] bg-neutral-100 overflow-hidden">
                      {project.coverImage ? (
                        <Image
                          src={urlForImage(project.coverImage)?.width(1000).url() || ""}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                    <div className="p-8 space-y-4">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-bold">
                        {project.tags?.[0] || "Case Study"}
                      </span>
                      <h3 className="text-2xl font-normal tracking-tight text-black">
                        {project.title}
                      </h3>
                      <p className="text-neutral-500 font-normal leading-relaxed text-sm">
                        {project.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-8 pb-8 pt-4">
                    <Link
                      href={`/${lang}/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-normal text-black border-b border-black pb-1 hover:opacity-60 transition-opacity"
                    >
                      {labels.viewCaseStudy} <ArrowRight size={14} />
                    </Link>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {related.length > 0 && (
        <section className="bg-white px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-black">
                {labels.relatedH2}
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item: any, i: number) => {
                const ItemIcon = (Icons as any)[item.icon || "Layers"] || Icons.Layers;
                const localizedFamily = familySlugForLang(item.family, lang as Locale);
                return (
                  <SectionReveal key={item._id} delay={i * 0.08} className="border border-black/5 hover:border-black/20 p-8 rounded-sm hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="text-[#75DAB4]">
                        <ItemIcon size={28} strokeWidth={1.5} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-xl font-normal tracking-tight text-black">{item.title}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed font-normal">{item.description}</p>
                      </div>
                    </div>
                    <div className="pt-8">
                      <Link
                        href={`/${lang}/services/${localizedFamily}/${item.slug}`}
                        className="text-xs font-normal uppercase tracking-widest text-[#75DAB4] hover:text-black transition-colors flex items-center gap-1.5"
                      >
                        {lang === "fr" ? "Explorer →" : "Explore →"}
                      </Link>
                    </div>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-neutral-50/20 py-20 border-b border-black/5">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="px-6 sm:px-8 md:px-10 lg:px-12 text-center mb-4">
              <h2 className="text-3xl font-normal tracking-tighter text-black">
                {labels.faqH2}
              </h2>
            </SectionReveal>
            <FAQAccordion items={faqs} />
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-black text-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
        <SectionReveal className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight leading-[1.15] text-balance">
            {labels.bottomCtaH2}
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link
              href={`/${lang}/contact`}
              className="px-8 py-4 bg-[#75DAB4] text-black hover:bg-white transition-colors duration-300 text-sm font-normal uppercase tracking-widest rounded-sm w-full sm:w-auto text-center"
            >
              {lang === "fr" ? "Démarrer un projet" : "Start a Conversation"}
            </Link>
          </div>
        </SectionReveal>
      </section>
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
