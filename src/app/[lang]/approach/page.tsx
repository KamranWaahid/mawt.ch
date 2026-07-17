import { ApproachStickySteps } from "@/components/sections/approach-sticky-steps";
import { RichText } from "@/components/ui/rich-text";
import { getMethodPage } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import { localizedHref, standaloneAlternates } from "@/lib/routing/url-helpers";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { SectionReveal } from "@/components/ui/section-reveal";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { CurtainLink } from "@/components/ui/curtain-link";
import { JsonLd, breadcrumbLd, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { ArrowRight, Workflow } from "lucide-react";

interface ProcessPageProps {
  params: Promise<{ lang: Locale }>;
}

type PortableTextBlock = {
  _type?: string;
  children?: Array<{ text?: string }>;
};

function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) return "";

  return value
    .map((block: PortableTextBlock) => {
      if (block?._type !== "block" || !Array.isArray(block.children)) return "";
      return block.children.map((child) => child.text || "").join("");
    })
    .filter(Boolean)
    .join(" ");
}

export async function generateMetadata({ params }: ProcessPageProps): Promise<Metadata> {
  const { lang } = await params;
  const doc = await getMethodPage(lang);
  return {
    title: doc?.seo?.metaTitle || (lang === "fr" ? "Notre méthode | MAWT" : "Our Process | MAWT"),
    description:
      doc?.seo?.metaDescription ||
      (lang === "fr"
        ? "Comment MAWT mène un projet IA, du cadrage au déploiement, étape par étape."
        : "How MAWT runs an AI project, from scoping to deployment, step by step."),
    alternates: standaloneAlternates("notre-methode", lang),
  };
}

export default async function OurProcessPage({ params }: ProcessPageProps) {
  const { lang } = await params;
  const [doc, dictionary] = await Promise.all([
    getMethodPage(lang),
    getDictionary(lang),
  ]);

  const pageCopy = dictionary.approach.page;
  const servicesHref = localizedHref("services", lang);
  const contactHref = localizedHref("contact", lang);
  const processUrl = `${SITE_URL}${localizedHref("notre-methode", lang)}`;

  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    {
      name: lang === "fr" ? "Notre méthode" : "Our process",
      url: processUrl,
    },
  ]);

  if (!doc?.heroH1) {
    return (
      <div className="min-h-screen bg-[#161616] text-white">
        <HeaderTheme theme="light" />
        <JsonLd data={[crumbLd]} />
        <section className="catalogue-hero-pad">
          <div className="site-container-xwide">
            <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
              <span className="block">
                {pageCopy.wordmark}{" "}
                <CurtainLink
                  href={servicesHref}
                  className="text-white/15 transition-colors hover:text-white/40"
                >
                  {pageCopy.crossLabel}
                </CurtainLink>
              </span>
              <span className="block text-white/55">{pageCopy.comingSoonTitle}</span>
            </h1>
            <p className="mt-8 max-w-[40ch] text-[16px] font-normal leading-relaxed text-white/45">
              {pageCopy.comingSoonBody}
            </p>
          </div>
        </section>
      </div>
    );
  }

  const ctaHeadline = doc.bottomCtaH2 || pageCopy.ctaFallback.headline;
  const ctaBody = doc.bottomCtaBody || pageCopy.ctaFallback.body;
  const ctaLabel = doc.bottomCtaLabel || pageCopy.ctaFallback.label;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={[crumbLd]} />

      {/* Hero — Services-scale wordmark + CMS headline. */}
      <section className="catalogue-hero-pad">
        <div className="site-container-xwide">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <div className="lg:col-span-8">
              <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
                <span className="block">
                  {pageCopy.wordmark}{" "}
                  <CurtainLink
                    href={servicesHref}
                    className="text-white/15 transition-colors hover:text-white/40"
                  >
                    {pageCopy.crossLabel}
                  </CurtainLink>
                </span>
                <span className="mt-4 block max-w-[16ch] text-[clamp(1.8rem,3.4vw,3rem)] font-medium leading-[1.08] text-white/88">
                  {doc.heroH1}
                </span>
              </h1>
            </div>
            {(doc.heroH2 || doc.intro) && (
              <div className="lg:col-span-4">
                {doc.heroH2 && (
                  <p className="max-w-[36ch] text-[16px] font-normal leading-relaxed text-white/55 md:text-[17px]">
                    {doc.heroH2}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <SlidePageBody>
        {doc.intro && (
          <section className="pb-[10vh]">
            <div className="site-container-xwide">
              <div className="grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-16">
                <SectionReveal className="lg:col-span-3">
                  <p className="text-[13px] font-normal text-white/40">
                    {dictionary.approach.badge}
                  </p>
                </SectionReveal>
                <SectionReveal className="lg:col-span-7 lg:col-start-5" delay={0.04}>
                  <DarkPageIcon icon={Workflow} className="mb-8" />
                  <div className="max-w-[54ch]">
                    <RichText value={doc.intro} tone="dark" />
                  </div>
                </SectionReveal>
              </div>
            </div>
          </section>
        )}

        {doc.steps?.length > 0 && (
          <ApproachStickySteps
            stepsLabel={pageCopy.stepsLabel}
            steps={doc.steps.map((step: { title: string; body: unknown }, i: number) => ({
              id: String(i + 1).padStart(2, "0"),
              title: step.title,
              body: portableTextToPlainText(step.body),
            }))}
          />
        )}

        {Array.isArray(doc.differentiators) && doc.differentiators.length > 0 && (
          <div className="border-y border-white/10 bg-[#1d1d1d] text-white">
            <section className="py-20 md:py-28 lg:py-36">
              <div className="site-container-xwide">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
                  <SectionReveal className="lg:col-span-3">
                    <p className="text-[13px] font-normal text-white/40">
                      {pageCopy.differentiatorsLabel}
                    </p>
                  </SectionReveal>
                  <SectionReveal className="lg:col-span-8 lg:col-start-5" delay={0.04}>
                    <div className="max-w-[54ch]">
                      <RichText value={doc.differentiators} tone="dark" />
                    </div>
                  </SectionReveal>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Closing CTA — Sanity fields with approved dictionary fallbacks. */}
        <section className="py-20 md:py-28 lg:py-36">
          <div className="site-container-xwide">
            <SectionReveal>
              <h2 className="max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1.02] tracking-tight text-white">
                {ctaHeadline}
              </h2>
              {ctaBody && (
                <p className="mt-6 max-w-[52ch] text-[15px] font-normal leading-relaxed text-white/55">
                  {ctaBody}
                </p>
              )}
              <CurtainLink
                href={contactHref}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
              >
                {ctaLabel}
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
