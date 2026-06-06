import { getSanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { SectionReveal } from "@/components/ui/section-reveal";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity.image";
import { ArrowRight, Check } from "lucide-react";
import * as Icons from "lucide-react";
import { getFamilyTitle, familySlugForLang, canonicalizeFamilySlug, hreflangAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { PILLAR_COPY, type FamilyKey } from "@/content/services-pillar-copy";
import { JsonLd, breadcrumbLd, itemListLd, faqPageLd, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/lib/routing/url-map";
import { groq } from "next-sanity";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ lang: string; family: string }>;
}

const FAMILY_TAG_MAPPING: Record<string, string[]> = {
  "sites-et-branding": ["sites", "branding", "ecommerce"],
  "solutions-ia": ["ia", "automatisation", "crm", "agent-ia", "rag", "mobile"],
  "conseil-ia": ["conseil", "strategie", "audit", "transformation", "change"],
  "renfort-equipe": ["renfort", "developpeur", "fractional", "qa"],
  "formation-ia": ["formation", "chatgpt", "coaching"],
};

const familyPillarPageQuery = groq`
{
  "services": *[_type == "service" && family == $family && language == $lang] | order(tier asc){
    _id,
    title,
    "slug": slug.current,
    family,
    description,
    icon
  },
  "projects": *[_type == "project" && language == $lang && !(hidden == true) && (family == $family || secondaryFamily == $family)] | order(year desc)[0..2]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    coverImage,
    year,
    tags
  },
  "testimonial": *[_type == "testimonial"][0]{
    quote,
    name,
    role
  },
  "faqs": *[_type == "faq" && language == $lang && count(tags[@ in $tags]) > 0][0..4]{
    key,
    question,
    answer
  }
}
`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, family } = await params;
  const canonicalFamily = canonicalizeFamilySlug(family, lang as Locale) as FamilyKey;
  if (!canonicalFamily) return {};

  const copy = PILLAR_COPY[canonicalFamily]?.[lang as "fr" | "en"];
  if (!copy) return {};

  const client = getSanityClient();
  let servicesListString = "";
  if (client) {
    const services = await client.fetch<{ title: string }[]>(
      groq`*[_type == "service" && family == $family && language == $lang] | order(tier asc){title}`,
      { family: canonicalFamily, lang }
    );
    if (services?.length) {
      servicesListString = services.map((s) => s.title).join(", ");
    }
  }

  const descParts = copy.metaDescription.split(". ");
  const descSuffix = descParts.length > 1 ? descParts.slice(1).join(". ") : copy.metaDescription;
  const dynamicMetaDescription = servicesListString
    ? `${servicesListString}. ${descSuffix}`
    : copy.metaDescription;

  return {
    title: copy.metaTitle,
    description: dynamicMetaDescription,
    alternates: hreflangAlternates(`/${lang}/services/${family}`, lang as Locale),
  };
}

export default async function FamilyPillarPage({ params }: Props) {
  const { lang, family } = await params;

  const canonicalFamily = canonicalizeFamilySlug(family, lang as Locale) as FamilyKey;
  if (!canonicalFamily) {
    notFound();
  }

  const copy = PILLAR_COPY[canonicalFamily]?.[lang as "fr" | "en"];
  if (!copy) {
    notFound();
  }

  const client = getSanityClient();
  if (!client) {
    notFound();
  }

  const tags = FAMILY_TAG_MAPPING[canonicalFamily] || [];

  const data = await client.fetch<any>(
    familyPillarPageQuery,
    { family: canonicalFamily, lang, tags }
  );

  const services = data?.services || [];
  const projects = data?.projects || [];
  const testimonial = data?.testimonial;
  const faqs = data?.faqs || [];

  const servicesListString = services.length > 0
    ? services.map((s: any) => s.title).join(", ")
    : "";
  const subheadParts = copy.subhead.split(". ");
  const subheadSuffix = subheadParts.length > 1 ? subheadParts.slice(1).join(". ") : copy.subhead;
  const dynamicSubhead = servicesListString
    ? `${servicesListString}. ${subheadSuffix}`
    : copy.subhead;

  const labels = {
    fr: {
      breadServices: "Services",
      methodH2: "Notre Méthode",
      methodPitch: "Nous croyons en un process transparent et structuré : Audit, Construction, Déploiement et Optimisation continue.",
      methodCta: "Explorer notre méthodologie",
      viewCaseStudy: "Voir l'étude de cas",
    },
    en: {
      breadServices: "Services",
      methodH2: "Our Process",
      methodPitch: "We believe in a transparent and structured lifecycle : Audit, Build, Deploy, and Continuous Optimization.",
      methodCta: "Explore our methodology",
      viewCaseStudy: "View Case Study",
    },
  }[lang as "fr" | "en"] || {
    breadServices: "Services",
    methodH2: "Our Process",
    methodPitch: "We believe in a transparent and structured lifecycle : Audit, Build, Deploy, and Continuous Optimization.",
    methodCta: "Explore our methodology",
    viewCaseStudy: "View Case Study",
  };

  const familyTitle = getFamilyTitle(canonicalFamily, lang as Locale);
  const familyUrl = `${SITE_URL}/${lang}/services/${family}`;
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: labels.breadServices, url: `${SITE_URL}${localizedHref("services", lang as Locale)}` },
    { name: familyTitle, url: familyUrl },
  ]);
  const serviceItemsLd = itemListLd(
    familyTitle,
    services.map((s: any) => ({
      name: s.title,
      url: `${SITE_URL}/${lang}/services/${familySlugForLang(s.family, lang as Locale)}/${s.slug}`,
    })),
    lang as Locale,
  );
  const faqLd = faqPageLd(
    (faqs || []).map((f: any) => ({ question: f.question, answer: f.answer })),
  );

  return (
    <div className="bg-white min-h-screen">
      <JsonLd data={faqLd ? [crumbLd, serviceItemsLd, faqLd] : [crumbLd, serviceItemsLd]} />
      <Breadcrumb
        items={[
          { label: labels.breadServices, to: "services" },
          { label: getFamilyTitle(canonicalFamily, lang as Locale), to: null },
        ]}
        lang={lang as Locale}
      />

      {/* Hero Section */}
      <section className="bg-white px-6 pt-12 pb-16 md:pb-24 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto">
          <SectionReveal className="space-y-8 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal tracking-tighter text-black leading-[1.05] text-balance">
              {copy.h1}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed max-w-3xl">
              {dynamicSubhead}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href={`/${lang}/${copy.ctaPrimaryHref}`}
                className="px-8 py-4 bg-[#75DAB4] hover:bg-black text-black hover:text-white transition-all duration-300 text-sm font-normal uppercase tracking-widest text-center rounded-sm"
              >
                {copy.ctaPrimary}
              </Link>
              <Link
                href={`/${lang}/${copy.ctaSecondaryHref}`}
                className="px-8 py-4 border border-black/10 hover:border-black text-black transition-all duration-300 text-sm font-normal uppercase tracking-widest text-center rounded-sm"
              >
                {copy.ctaSecondary}
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* Intro Narrative */}
      <section className="bg-white px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-normal tracking-tight text-black leading-[1.25]">
                {lang === "fr" ? "Pourquoi collaborer avec nous ?" : "Why partner with us?"}
              </h2>
            </SectionReveal>
          </div>
          <div className="lg:col-span-7 space-y-6">
            <SectionReveal className="space-y-6 text-lg text-neutral-600 leading-relaxed font-normal">
              {copy.introParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Services Cards Grid */}
      <section className="bg-neutral-50/20 px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
        <div className="max-w-[1440px] mx-auto">
          <SectionReveal className="mb-16">
            <h2 className="text-3xl font-normal tracking-tighter text-black">
              {copy.servicesH2}
            </h2>
            {copy.socialProof && (
              <p className="text-neutral-500 font-normal text-sm mt-3 max-w-3xl leading-relaxed">
                {copy.socialProof}
              </p>
            )}
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((item: any, i: number) => {
              const ItemIcon = (Icons as any)[item.icon || "Layers"] || Icons.Layers;
              const localizedFamily = familySlugForLang(item.family, lang as Locale);
              return (
                <SectionReveal key={item._id} delay={i * 0.08} className="bg-white border border-black/5 hover:border-black/20 p-8 rounded-sm transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="text-[#75DAB4]">
                      <ItemIcon size={32} strokeWidth={1.5} />
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

      {/* Case Studies Section */}
      {projects.length > 0 && (
        <section className="bg-white px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="mb-16">
              <span className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em] mb-4 block">
                Proof of Excellence
              </span>
              <h2 className="text-3xl md:text-4xl font-normal tracking-tight text-black">
                {copy.projectsH2}
              </h2>
            </SectionReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project: any, i: number) => (
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
                      <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-normal">
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
                      href={`/${lang}/${lang === "fr" ? "projets" : "projects"}/${project.slug}`}
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

      {/* Testimonial Quote */}
      {testimonial && (
        <section className="bg-black text-white py-24 px-6 sm:px-8 md:px-10 lg:px-12 border-b border-white/5">
          <div className="max-w-[1000px] mx-auto text-center space-y-8">
            <SectionReveal>
              <p className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight leading-relaxed italic text-neutral-300">
                "{testimonial.quote}"
              </p>
              <div className="pt-6">
                <p className="text-sm font-normal tracking-wider text-[#75DAB4] uppercase">{testimonial.name}</p>
                {testimonial.role && <p className="text-xs text-neutral-400 font-normal mt-1">{testimonial.role}</p>}
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="bg-neutral-50/20 py-20 border-b border-black/5">
          <div className="max-w-[1440px] mx-auto">
            <SectionReveal className="px-6 sm:px-8 md:px-10 lg:px-12 text-center mb-4">
              <h2 className="text-3xl font-normal tracking-tighter text-black">
                {copy.faqH2}
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
            {copy.bottomCtaH2}
          </h2>
          <p className="text-lg text-neutral-400 leading-relaxed font-normal max-w-2xl mx-auto">
            {copy.bottomCtaPitch}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link
              href={`/${lang}/contact`}
              className="px-8 py-4 bg-[#75DAB4] text-black hover:bg-white transition-colors duration-300 text-sm font-normal uppercase tracking-widest rounded-sm w-full sm:w-auto text-center"
            >
              {copy.bottomCtaLabel}
            </Link>
          </div>
        </SectionReveal>
      </section>
    </div>
  );
}

export async function generateStaticParams() {
  const families = ["sites-et-branding", "solutions-ia", "conseil-ia", "renfort-equipe", "formation-ia"];
  const params = [];
  for (const lang of ["fr", "en"]) {
    for (const family of families) {
      params.push({
        lang,
        family: familySlugForLang(family, lang as Locale),
      });
    }
  }
  return params;
}
