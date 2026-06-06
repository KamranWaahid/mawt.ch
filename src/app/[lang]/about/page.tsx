import { SubpageHero } from "@/components/sections/subpage-hero";
import { getAboutContent } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, ORG_ID, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const doc = await getAboutContent(lang);
  return {
    title: doc?.seo?.metaTitle || (lang === "fr" ? "À propos | MAWT" : "About | MAWT"),
    description:
      doc?.seo?.metaDescription ||
      (lang === "fr"
        ? "MAWT, studio d'exécution technique à taille humaine basé à Genève."
        : "MAWT, a senior technical execution studio based in Geneva."),
    alternates: standaloneAlternates("a-propos", lang),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const doc = await getAboutContent(lang);
  const badge = lang === "fr" ? "À propos" : "About MAWT";

  const aboutUrl = `${SITE_URL}${localizedHref("a-propos", lang)}`;
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: lang === "fr" ? "À propos" : "About", url: aboutUrl },
  ]);
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: aboutUrl,
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
  };

  if (!doc?.heroH1) {
    return (
      <div className="bg-white min-h-screen">
        <JsonLd data={[crumbLd, aboutLd]} />
        <SubpageHero badge={badge} title={lang === "fr" ? "Bientôt disponible." : "Coming soon."} />
        <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">
            {lang === "fr" ? "Cette page sera bientôt disponible." : "This page will be available soon."}
          </p>
        </section>
      </div>
    );
  }

  const storyParas = [doc.storyP1, doc.storyP2, doc.storyP3].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      <JsonLd data={[crumbLd, aboutLd]} />
      <SubpageHero badge={badge} title={doc.heroH1} />

      {doc.heroH2 && (
        <section className="bg-white px-6 pt-12 pb-8 sm:px-8 md:px-10 lg:px-12">
          <p className="max-w-3xl mx-auto text-xl md:text-2xl text-neutral-600 font-normal leading-relaxed">{doc.heroH2}</p>
        </section>
      )}

      {/* Story */}
      {(doc.storyH2 || storyParas.length > 0) && (
        <section className="bg-white px-6 py-16 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-[1440px] mx-auto grid md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
              {doc.storyH2 && <h2 className="text-3xl font-normal tracking-tight text-black md:sticky md:top-32">{doc.storyH2}</h2>}
            </div>
            <div className="md:col-span-8 space-y-6">
              {storyParas.map((p: string, i: number) => (
                <p key={i} className="text-lg text-neutral-600 font-normal leading-relaxed">{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {(doc.teamH2 || doc.teamBody) && (
        <section className="bg-neutral-50 px-6 py-16 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {doc.teamH2 && <h2 className="text-3xl font-normal tracking-tight text-black">{doc.teamH2}</h2>}
            {doc.teamBody && <p className="text-lg text-neutral-600 font-normal leading-relaxed">{doc.teamBody}</p>}
          </div>
        </section>
      )}

      {/* Principles */}
      {doc.principles?.length > 0 && (
        <section className="bg-white px-6 py-16 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-[1440px] mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {doc.principles.map((p: { emoji?: string; title?: string; description?: string }, i: number) => (
              <article key={i} className="flex flex-col gap-3 p-8 border border-black/5 hover:border-black/20 transition-colors">
                {p.emoji && <span className="text-2xl" aria-hidden="true">{p.emoji}</span>}
                {p.title && <h3 className="text-xl font-normal text-black">{p.title}</h3>}
                {p.description && <p className="text-[15px] text-neutral-500 font-normal leading-relaxed">{p.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Track record */}
      {(doc.trackRecordH2 || doc.trackRecordBody) && (
        <section className="bg-white px-6 py-16 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {doc.trackRecordH2 && <h2 className="text-3xl font-normal tracking-tight text-black">{doc.trackRecordH2}</h2>}
            {doc.trackRecordBody && <p className="text-lg text-neutral-600 font-normal leading-relaxed">{doc.trackRecordBody}</p>}
          </div>
        </section>
      )}

      {/* Locations */}
      {doc.locations?.length > 0 && (
        <section className="bg-white px-6 py-16 sm:px-8 md:px-10 lg:px-12 border-t border-black/5">
          <div className="max-w-[1440px] mx-auto grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doc.locations.map((loc: { city?: string; description?: string }, i: number) => (
              <div key={i} className="space-y-2">
                {loc.city && <h3 className="text-lg font-normal text-black">{loc.city}</h3>}
                {loc.description && <p className="text-[15px] text-neutral-500 font-normal leading-relaxed">{loc.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {doc.bottomCtaH2 && (
        <section className="bg-black text-white px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight leading-[1.15]">{doc.bottomCtaH2}</h2>
            {doc.bottomCtaBody && <p className="text-lg text-white/70 font-normal leading-relaxed">{doc.bottomCtaBody}</p>}
            <a href={`/${lang}/contact`} className="inline-block mt-2 px-8 py-4 bg-[#75DAB4] text-black text-sm font-normal uppercase tracking-widest rounded-sm hover:bg-white transition-colors">
              {lang === "fr" ? "Discutons" : "Let's talk"}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
