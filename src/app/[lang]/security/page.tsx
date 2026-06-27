import { SubpageHero } from "@/components/sections/subpage-hero";
import { RichText } from "@/components/ui/rich-text";
import { getSecurityPage } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const doc = await getSecurityPage(lang);
  return {
    title: doc?.seo?.metaTitle || (lang === "fr" ? "Sécurité | MAWT" : "Security | MAWT"),
    description:
      doc?.seo?.metaDescription ||
      (lang === "fr"
        ? "Sécurité, confidentialité et IA responsable chez MAWT."
        : "Security, confidentiality and responsible AI at MAWT."),
    alternates: standaloneAlternates("securite", lang),
  };
}

export default async function SecurityPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const doc = await getSecurityPage(lang);
  const badge = lang === "fr" ? "Sécurité" : "Security";

  // No CMS doc for this language → clean localized placeholder, never English.
  if (!doc?.heroH1) {
    return (
      <div className="min-h-screen">
        <SubpageHero badge={badge} title={lang === "fr" ? "Bientôt disponible." : "Coming soon."} />
        <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">
            {lang === "fr" ? "Cette page sera bientôt disponible." : "This page will be available soon."}
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SubpageHero badge={badge} title={doc.heroH1} />

      <section className="pt-8 pb-4 md:pt-10 md:pb-6 lg:pt-12 lg:pb-8">
        <div className="max-w-3xl mx-auto">
          {doc.heroH2 && <p className="text-lg sm:text-xl text-neutral-500 font-normal leading-relaxed">{doc.heroH2}</p>}
          <div className="mt-8"><RichText value={doc.intro} /></div>
        </div>
      </section>

      {doc.sections?.length > 0 && (
        <section className="pb-16 md:pb-24 lg:pb-32">
          <div className="max-w-3xl mx-auto divide-y divide-black/5">
            {doc.sections.map((sec: { title: string; body: unknown }, i: number) => (
              <article key={i} className="py-10 first:pt-0">
                <h2 className="text-2xl font-normal tracking-tight text-black mb-4">{sec.title}</h2>
                <RichText value={sec.body} />
              </article>
            ))}
          </div>
        </section>
      )}

      {doc.bottomCtaH2 && (
        <section className="bg-black text-white py-20 md:py-28 lg:py-36 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatedTitle
              as="h2"
              text={doc.bottomCtaH2}
              className="text-3xl sm:text-4xl font-normal tracking-tight leading-[1.15]"
              splitBy="word"
            />
            {doc.bottomCtaBody && <p className="text-lg text-white/70 font-normal leading-relaxed">{doc.bottomCtaBody}</p>}
            {doc.bottomCtaLabel && (
              <Link href={`/${lang}/contact`} className="inline-block mt-2 px-8 py-4 bg-[#75DAB4] text-black text-sm font-normal uppercase tracking-widest rounded-sm hover:bg-white transition-colors">
                {doc.bottomCtaLabel}
              </Link>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
