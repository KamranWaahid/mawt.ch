import { DarkCatalogueHero } from "@/components/ui/dark-catalogue-hero";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { SectionReveal } from "@/components/ui/section-reveal";
import { CurtainLink } from "@/components/ui/curtain-link";
import { getFAQs } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, faqPageLd, breadcrumbLd, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

interface FAQsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: FAQsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === "en" ? "FAQ — AI, automation and pricing" : "FAQ — IA, automatisation et tarifs";
  const description = lang === "en"
    ? "Answers to the questions companies ask before working with an AI agency: costs, timelines, data security, which AI tools, local AI and more."
    : "Réponses aux questions que les entreprises se posent avant de travailler avec une agence IA : coûts, délais, sécurité des données, choix des outils, IA locale.";
  return {
    title,
    description,
    alternates: standaloneAlternates("faqs", lang),
    openGraph: {
      title,
      description,
      url: `https://mawt.ch/${lang}/faqs`,
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
    twitter: { title, description },
  };
}

export default async function FAQsPage({ params }: FAQsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const faqs = await getFAQs(lang);

  const faqLd = faqPageLd(
    (faqs || []).map((f: { question: string; answer: string }) => ({
      question: f.question,
      answer: f.answer,
    })),
  );
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: "FAQ", url: `${SITE_URL}${localizedHref("faqs", lang)}` },
  ]);

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={faqLd ? [crumbLd, faqLd] : [crumbLd]} />

      <DarkCatalogueHero
        wordmark={dict.faq.wordmark}
        crossHref={localizedHref("contact", lang)}
        crossLabel={dict.faq.crossLabel}
        title={dict.faq.headline}
      />

      <SlidePageBody>
        {faqs.length > 0 ? (
          <FAQAccordion items={faqs} tone="dark" />
        ) : (
          <section className="pb-20">
            <div className="site-container-xwide">
              <p className="text-white/45 font-normal italic">{dict.faq.noFaqs}</p>
            </div>
          </section>
        )}

        <section className="border-t border-white/10 py-20 md:py-28 lg:py-36">
          <div className="site-container-xwide">
            <SectionReveal>
              <h2 className="max-w-[16ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.05] tracking-tight text-white">
                {dict.faq.stillQuestions}
              </h2>
              <p className="mt-6 max-w-[48ch] text-[15px] font-normal leading-relaxed text-white/55">
                {dict.faq.contactDesc}
              </p>
              <CurtainLink
                href={localizedHref("contact", lang)}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
              >
                {dict.faq.contactBtn}
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
