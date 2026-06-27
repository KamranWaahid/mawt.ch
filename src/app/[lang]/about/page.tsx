import { SubpageHero } from "@/components/sections/subpage-hero";
import { getAboutContent } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, ORG_ID, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const doc = await getAboutContent(lang);
  return {
    title: doc?.seo?.metaTitle || (lang === "fr" ? "À propos | MAWT" : "About | MAWT"),
    description:
      doc?.seo?.metaDescription ||
      (lang === "fr"
        ? "MAWT, agence IA à taille humaine basée à Genève. Intelligence artificielle, automatisation et outils sur mesure."
        : "MAWT, a human scale AI agency based in Geneva. Artificial intelligence, automation and custom tools."),
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
      <div className="min-h-screen">
        <JsonLd data={[crumbLd, aboutLd]} />
        <SubpageHero
          eyebrow={badge}
          title={lang === "fr" ? "Bientôt disponible." : "Coming soon."}
        />
        <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 text-center">
          <p className="text-neutral-500 font-normal italic">
            {lang === "fr" ? "Cette page sera bientôt disponible." : "This page will be available soon."}
          </p>
        </section>
      </div>
    );
  }

  const storyParas = [doc.storyP1, doc.storyP2, doc.storyP3].filter(Boolean);

  return (
    <div className="min-h-screen">
      <JsonLd data={[crumbLd, aboutLd]} />
      <SubpageHero
        eyebrow={badge}
        title={doc.heroH1}
        subtitle={doc.heroH2 || (lang === "fr" ? "Notre histoire" : "Our story")}
      />

      {/* Story */}
      {(doc.storyH2 || storyParas.length > 0) && (
        <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="site-container-wide grid md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
              {doc.storyH2 && (
                <AnimatedTitle
                  as="h2"
                  text={doc.storyH2}
                  className="text-3xl-fluid font-medium tracking-tighter text-black md:sticky md:top-32"
                  splitBy="word"
                />
              )}
            </div>
            <div className="md:col-span-8 space-y-6">
              {storyParas.map((p: string, i: number) => (
                <p key={i} className="text-base-fluid text-neutral-500 font-normal leading-relaxed max-w-[55ch]">{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {(doc.teamH2 || doc.teamBody) && (
        <section className="bg-neutral-50 py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {doc.teamH2 && (
              <AnimatedTitle
                as="h2"
                text={doc.teamH2}
                className="text-3xl-fluid font-medium tracking-tighter text-black"
                splitBy="word"
              />
            )}
            {doc.teamBody && <p className="text-base-fluid text-neutral-500 font-normal leading-relaxed max-w-[55ch] mx-auto">{doc.teamBody}</p>}
          </div>
        </section>
      )}

      {/* Principles */}
      {doc.principles?.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="site-container-wide grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {doc.principles.map((p: { emoji?: string; title?: string; description?: string }, i: number) => (
              <article key={i} className="flex flex-col gap-3 p-8 border border-black/5 hover:border-black/20 transition-colors">
                {p.emoji && <span className="text-2xl" aria-hidden="true">{p.emoji}</span>}
                {p.title && <h3 className="text-lg-fluid font-medium text-black">{p.title}</h3>}
                {p.description && <p className="text-sm-fluid text-neutral-500 font-normal leading-relaxed max-w-[40ch]">{p.description}</p>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Track record */}
      {(doc.trackRecordH2 || doc.trackRecordBody) && (
        <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {doc.trackRecordH2 && (
              <AnimatedTitle
                as="h2"
                text={doc.trackRecordH2}
                className="text-3xl-fluid font-medium tracking-tighter text-black"
                splitBy="word"
              />
            )}
            {doc.trackRecordBody && <p className="text-base-fluid text-neutral-500 font-normal leading-relaxed max-w-[55ch] mx-auto">{doc.trackRecordBody}</p>}
          </div>
        </section>
      )}

      {/* Locations */}
      {doc.locations?.length > 0 && (
        <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
          <div className="site-container-wide grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {doc.locations.map((loc: { city?: string; description?: string }, i: number) => (
              <div key={i} className="space-y-2">
                {loc.city && <h3 className="text-lg-fluid font-medium text-black">{loc.city}</h3>}
                {loc.description && <p className="text-sm-fluid text-neutral-500 font-normal leading-relaxed max-w-[40ch]">{loc.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {doc.bottomCtaH2 && (
        <section className="bg-black text-white py-20 md:py-28 lg:py-36 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatedTitle
              as="h2"
              text={doc.bottomCtaH2}
              className="text-4xl-fluid font-medium tracking-tighter text-white max-w-3xl mx-auto"
              splitBy="word"
            />
            {doc.bottomCtaBody && <p className="text-base-fluid text-white/70 font-normal leading-relaxed max-w-[55ch] mx-auto">{doc.bottomCtaBody}</p>}
            <Link href={`/${lang}/contact`} className="inline-flex items-center gap-2 mt-2 px-8 py-4 bg-[#75DAB4] text-black text-sm font-normal tracking-widest rounded-sm hover:bg-white transition-colors">
              {lang === "fr" ? "Discutons" : "Let's talk"}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
