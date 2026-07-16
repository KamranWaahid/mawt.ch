import { SubpageHero } from "@/components/sections/subpage-hero";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { getFAQs } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, faqPageLd, breadcrumbLd, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";

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
    <div className="min-h-screen">
      <JsonLd data={faqLd ? [crumbLd, faqLd] : [crumbLd]} />
      <SubpageHero
        badge={dict.faq.badge}
        title={dict.faq.headline}
      />
      {faqs.length > 0 ? (
        <FAQAccordion items={faqs} />
      ) : (
        <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">{dict.faq.noFaqs}</p>
        </section>
      )}
      
      <section className="py-20 md:py-28 lg:py-36 border-t border-black/5">
        <div className="site-container-wide text-center">
          <h2 className="text-3xl font-normal tracking-tighter text-black mb-6">{dict.faq.stillQuestions}</h2>
          <p className="text-lg text-neutral-500 font-normal mb-10 max-w-2xl mx-auto">
            {dict.faq.contactDesc}
          </p>
          <Link href={`/${lang}/contact`} className="inline-flex px-10 py-4 bg-black text-white text-sm font-normal uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300">
            {dict.faq.contactBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
