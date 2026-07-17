import { getSanityClient } from "@/lib/sanity.client";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { CurtainLink } from "@/components/ui/curtain-link";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/lib/sanity.image";
import { ArrowRight, ArrowUpRight, Layers } from "lucide-react";
import * as Icons from "lucide-react";
import {
  getFamilyTitle,
  familySlugForLang,
  canonicalizeFamilySlug,
  hreflangAlternates,
  localizedHref,
} from "@/lib/routing/url-helpers";
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
  "developpement-logiciel": ["sites", "mobile", "developpeur", "ia"],
  securite: ["ia"],
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
      { family: canonicalFamily, lang },
    );
    if (services?.length) {
      servicesListString = services
        .filter((s): s is { title: string } => Boolean(s?.title))
        .map((s) => s.title)
        .join(", ");
    }
  }

  const descParts = copy.metaDescription.split(". ");
  const descSuffix = descParts.length > 1 ? descParts.slice(1).join(". ") : copy.metaDescription;
  const listDescription = `${servicesListString}. ${descSuffix}`;
  const dynamicMetaDescription =
    servicesListString && listDescription.length <= 170
      ? listDescription
      : copy.metaDescription;

  const title = /\|\s*MAWT\s*$/i.test(copy.metaTitle)
    ? { absolute: copy.metaTitle }
    : copy.metaTitle;

  return {
    title,
    description: dynamicMetaDescription,
    alternates: hreflangAlternates(`/${lang}/services/${family}`, lang as Locale),
    openGraph: {
      title: copy.metaTitle.replace(/\s*\|\s*MAWT\s*$/i, ""),
      description: copy.metaDescription,
      url: `https://mawt.ch/${lang}/services/${family}`,
      siteName: "MAWT",
      type: "website",
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
    twitter: {
      title: copy.metaTitle.replace(/\s*\|\s*MAWT\s*$/i, ""),
      description: copy.metaDescription,
    },
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

  const data = await client.fetch<any>(familyPillarPageQuery, {
    family: canonicalFamily,
    lang,
    tags,
  });

  const services = (data?.services || []).filter(
    (s: { _id?: string; title?: string; slug?: string } | null) =>
      Boolean(s?._id && s.title && s.slug),
  );
  const projects = (data?.projects || []).filter(
    (p: { _id?: string; title?: string } | null) => Boolean(p?._id && p.title),
  );
  const testimonial = data?.testimonial;
  const faqs = data?.faqs || [];

  const servicesListString =
    services.length > 0 ? services.map((s: any) => s.title).join(", ") : "";
  const subheadParts = copy.subhead.split(". ");
  const subheadSuffix =
    subheadParts.length > 1 ? subheadParts.slice(1).join(". ") : copy.subhead;
  const dynamicSubhead = servicesListString
    ? `${servicesListString}. ${subheadSuffix}`
    : copy.subhead;

  const labels = {
    fr: {
      breadServices: "Services",
      whyH2: "Pourquoi collaborer avec nous ?",
      explore: "Explorer",
      viewCaseStudy: "Voir l'étude de cas",
      proofLabel: "Preuve",
    },
    en: {
      breadServices: "Services",
      whyH2: "Why partner with us?",
      explore: "Explore",
      viewCaseStudy: "View Case Study",
      proofLabel: "Proof",
    },
  }[lang as "fr" | "en"] || {
    breadServices: "Services",
    whyH2: "Why partner with us?",
    explore: "Explore",
    viewCaseStudy: "View Case Study",
    proofLabel: "Proof",
  };

  const familyTitle = getFamilyTitle(canonicalFamily, lang as Locale);
  const familyUrl = `${SITE_URL}/${lang}/services/${family}`;
  const contactHref = localizedHref("contact", lang as Locale);
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
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={faqLd ? [crumbLd, serviceItemsLd, faqLd] : [crumbLd, serviceItemsLd]} />

      <Breadcrumb
        items={[
          { label: labels.breadServices, to: "services" },
          { label: familyTitle, to: null },
        ]}
        lang={lang as Locale}
        tone="dark"
      />

      <section className="pb-[8vh] pt-8 md:pt-10">
        <div className="site-container-xwide">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <p className="mb-5 text-[13px] font-normal text-white/40">{familyTitle}</p>
              <h1 className="max-w-[14ch] text-[clamp(2.8rem,5.2vw,4.8rem)] font-medium leading-[0.98] tracking-tight text-white">
                {copy.h1}
              </h1>
            </div>
            <div className="lg:col-span-4">
              <p className="max-w-[36ch] text-[15px] font-normal leading-relaxed text-white/55 md:text-[16px]">
                {dynamicSubhead}
              </p>
              <CurtainLink
                href={contactHref}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                {copy.ctaPrimary}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
              </CurtainLink>
            </div>
          </div>
        </div>
      </section>

      <SlidePageBody>
        <section className="border-t border-white/10 py-16 md:py-24 lg:py-28">
          <div className="site-container-xwide grid gap-10 lg:grid-cols-12 lg:gap-16">
            <SectionReveal className="lg:col-span-4">
              <h2 className="max-w-[14ch] text-[clamp(1.6rem,2.8vw,2.2rem)] font-medium leading-tight tracking-tight text-white">
                {labels.whyH2}
              </h2>
            </SectionReveal>
            <SectionReveal className="space-y-5 lg:col-span-7 lg:col-start-6" delay={0.04}>
              {copy.introParagraphs.map((p: string, idx: number) => (
                <p
                  key={idx}
                  className="max-w-[52ch] text-[15px] font-normal leading-relaxed text-white/55 md:text-[16px]"
                >
                  {p}
                </p>
              ))}
            </SectionReveal>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#1d1d1d] py-16 md:py-24 lg:py-28">
          <div className="site-container-xwide">
            <SectionReveal className="mb-12 max-w-[48ch]">
              <h2 className="text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-tight tracking-tight text-white">
                {copy.servicesH2}
              </h2>
              {copy.socialProof && (
                <p className="mt-4 text-[14px] font-normal leading-relaxed text-white/45">
                  {copy.socialProof}
                </p>
              )}
            </SectionReveal>

            <ul className="divide-y divide-white/10 border-y border-white/10">
              {services.map((item: any) => {
                const ItemIcon = (Icons as any)[item.icon || "Layers"] || Layers;
                const localizedFamily = familySlugForLang(item.family, lang as Locale);
                return (
                  <li key={item._id}>
                    <Link
                      href={`/${lang}/services/${localizedFamily}/${item.slug}`}
                      className="group grid gap-4 py-7 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8"
                    >
                      <DarkPageIcon icon={ItemIcon} />
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-medium tracking-tight text-white/90 transition-colors group-hover:text-white">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-1.5 max-w-[52ch] text-[14px] font-normal leading-relaxed text-white/45">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-[12px] font-normal text-white/35 transition-colors group-hover:text-white/70">
                        {labels.explore}
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {projects.length > 0 && (
          <section className="py-16 md:py-24 lg:py-28">
            <div className="site-container-xwide">
              <SectionReveal className="mb-12">
                <p className="mb-4 text-[13px] font-normal text-white/40">
                  {labels.proofLabel}
                </p>
                <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-tight tracking-tight text-white">
                  {copy.projectsH2}
                </h2>
              </SectionReveal>

              <div className="grid gap-8 md:grid-cols-2">
                {projects.map((project: any, i: number) => {
                  const coverImage = project.coverImage
                    ? urlForImage(project.coverImage)?.width(1000).url()
                    : null;

                  return (
                    <SectionReveal
                      key={project._id}
                      delay={i * 0.06}
                      className="group border border-white/10 bg-white/[0.02] transition-colors hover:border-white/25"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-white/[0.03]">
                        {coverImage ? (
                          <Image
                            src={coverImage}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>
                      <div className="space-y-3 p-7">
                        <p className="text-[12px] font-normal tracking-wide text-white/35">
                          {project.tags?.[0] || (lang === "fr" ? "Étude de cas" : "Case study")}
                          {project.year ? ` · ${project.year}` : ""}
                        </p>
                        <h3 className="text-[18px] font-medium tracking-tight text-white">
                          {project.title}
                        </h3>
                        {project.excerpt && (
                          <p className="max-w-[40ch] text-[14px] font-normal leading-relaxed text-white/45">
                            {project.excerpt}
                          </p>
                        )}
                        <Link
                          href={`/${lang}/${lang === "fr" ? "projets" : "work"}/${project.slug}`}
                          className="inline-flex items-center gap-2 pt-2 text-[13px] font-normal text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                        >
                          {labels.viewCaseStudy}
                          <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                      </div>
                    </SectionReveal>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {testimonial && (
          <section className="border-y border-white/10 bg-[#1d1d1d] py-20 md:py-28">
            <div className="site-container-xwide">
              <SectionReveal className="mx-auto max-w-[820px]">
                <p className="text-[clamp(1.5rem,3vw,2.4rem)] font-medium leading-[1.25] tracking-tight text-white/85">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[13px] font-normal text-white/70">{testimonial.name}</p>
                  {testimonial.role && (
                    <p className="mt-1 text-[12px] font-normal text-white/35">
                      {testimonial.role}
                    </p>
                  )}
                </div>
              </SectionReveal>
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="py-16 md:py-24 lg:py-28">
            <div className="site-container-xwide">
              <SectionReveal className="mb-10 md:mb-14">
                <h2 className="max-w-[18ch] text-[clamp(1.8rem,3.2vw,2.8rem)] font-medium leading-tight tracking-tight text-white">
                  {copy.faqH2}
                </h2>
              </SectionReveal>
              <FAQAccordion items={faqs} noWrapper tone="dark" />
            </div>
          </section>
        )}

        <section className="border-t border-white/10 py-20 md:py-28 lg:py-36">
          <div className="site-container-xwide">
            <SectionReveal>
              <h2 className="max-w-[14ch] text-[clamp(2.2rem,4.6vw,4rem)] font-medium leading-[1.05] tracking-tight text-white">
                {copy.bottomCtaH2}
              </h2>
              <p className="mt-6 max-w-[48ch] text-[15px] font-normal leading-relaxed text-white/55">
                {copy.bottomCtaPitch}
              </p>
              <CurtainLink
                href={contactHref}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                {copy.bottomCtaLabel}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight size={13} aria-hidden="true" />
                </span>
              </CurtainLink>
            </SectionReveal>
          </div>
        </section>
      </SlidePageBody>
    </div>
  );
}

export async function generateStaticParams() {
  const families = [
    "sites-et-branding",
    "solutions-ia",
    "conseil-ia",
    "renfort-equipe",
    "formation-ia",
    "developpement-logiciel",
    "securite",
  ];
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
