import { SubpageHero } from "@/components/sections/subpage-hero";
import { RichText } from "@/components/ui/rich-text";
import { getMethodPage } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

interface ProcessPageProps {
  params: Promise<{ lang: Locale }>;
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
  const doc = await getMethodPage(lang);
  const badge = lang === "fr" ? "Notre méthode" : "Our process";

  if (!doc?.heroH1) {
    return (
      <div className="bg-white min-h-screen">
        <SubpageHero badge={badge} title={lang === "fr" ? "Bientôt disponible." : "Coming soon."} />
        <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">
            {lang === "fr" ? "Cette page sera bientôt disponible." : "This page will be available soon."}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <SubpageHero badge={badge} title={doc.heroH1} />

      <section className="bg-white px-6 pt-12 pb-8 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {doc.heroH2 && <p className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed">{doc.heroH2}</p>}
          <div className="mt-8"><RichText value={doc.intro} /></div>
        </div>
      </section>

      {doc.steps?.length > 0 && (
        <section className="bg-white px-6 pb-20 sm:px-8 md:px-10 lg:px-12">
          <div className="max-w-[1440px] mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doc.steps.map((step: { title: string; body: unknown }, i: number) => (
              <article key={i} className="flex flex-col gap-4 p-10 border border-black/5 bg-white hover:border-black/20 transition-colors">
                <span className="text-[13px] font-normal text-neutral-400 uppercase tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-xl font-normal text-black">{step.title}</h2>
                <div className="text-[15px]"><RichText value={step.body} /></div>
              </article>
            ))}
          </div>
        </section>
      )}

      {Array.isArray(doc.differentiators) && doc.differentiators.length > 0 && (
        <section className="bg-white px-6 py-20 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-3xl mx-auto"><RichText value={doc.differentiators} /></div>
        </section>
      )}

      {doc.bottomCtaH2 && (
        <section className="bg-black text-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight leading-[1.15]">{doc.bottomCtaH2}</h2>
            {doc.bottomCtaBody && <p className="text-lg text-white/70 font-normal leading-relaxed">{doc.bottomCtaBody}</p>}
            {doc.bottomCtaLabel && (
              <a href={`/${lang}/contact`} className="inline-block mt-2 px-8 py-4 bg-[#75DAB4] text-black text-sm font-normal uppercase tracking-widest rounded-sm hover:bg-white transition-colors">
                {doc.bottomCtaLabel}
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
