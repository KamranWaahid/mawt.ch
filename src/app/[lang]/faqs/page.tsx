import { SubpageHero } from "@/components/sections/subpage-hero";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { getFAQs } from "@/lib/sanity.queries";
import { getDictionary } from "@/get-dictionary";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface FAQsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: FAQsPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "FAQs" : "FAQs",
    description: lang === "en"
      ? "Everything you need to know about working with MAWT."
      : "Tout ce que vous devez savoir sur le travail avec MAWT.",
    alternates: standaloneAlternates("faqs", lang),
  };
}

export default async function FAQsPage({ params }: FAQsPageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const faqs = await getFAQs();

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero 
        badge={dict.faq.badge}
        title={dict.faq.headline}
      />
      {faqs.length > 0 ? (
        <FAQAccordion items={faqs} />
      ) : (
        <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">{dict.faq.noFaqs}</p>
        </section>
      )}
      
      <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
        <div className="max-w-[1440px] mx-auto text-center">
          <h2 className="text-3xl font-normal tracking-tighter text-black mb-6">{dict.faq.stillQuestions}</h2>
          <p className="text-lg text-neutral-500 font-normal mb-10 max-w-2xl mx-auto">
            {dict.faq.contactDesc}
          </p>
          <button className="px-10 py-4 bg-black text-white text-sm font-normal uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300">
            {dict.faq.contactBtn}
          </button>
        </div>
      </section>
    </div>
  );
}
