import { SubpageHero } from "@/components/sections/subpage-hero";
import { getAboutContent } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, ORG_ID, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleClass } from "@/components/ui/section-title-style";

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
    <div className="min-h-screen bg-white">
      <JsonLd data={[crumbLd, aboutLd]} />
      <SubpageHero
        eyebrow={badge}
        title={doc.heroH1}
        subtitle={doc.heroH2 || (lang === "fr" ? "Notre histoire" : "Our story")}
      />

      {/* Story */}
      {(doc.storyH2 || storyParas.length > 0) && (
        <section className="relative py-12 md:py-18 lg:py-24">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column */}
              <div className="lg:col-span-5 self-start w-full">
                <div className="mb-4 h-px w-full bg-black/10" />
                {doc.storyH2 && (
                  <AnimatedTitle
                    as="h2"
                    text={doc.storyH2}
                    className={`${sectionTitleClass} text-balance`}
                    splitBy="word"
                  />
                )}
              </div>
              {/* Right Column */}
              <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                <div className="space-y-6">
                  {storyParas.map((p: string, i: number) => (
                    <p key={i} className="text-base font-normal leading-relaxed text-neutral-500 max-w-[55ch]">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {(doc.teamH2 || doc.teamBody) && (
        <section className="relative py-12 md:py-18 lg:py-24">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column */}
              <div className="lg:col-span-5 self-start w-full">
                <div className="mb-4 h-px w-full bg-black/10" />
                {doc.teamH2 && (
                  <AnimatedTitle
                    as="h2"
                    text={doc.teamH2}
                    className={`${sectionTitleClass} text-balance`}
                    splitBy="word"
                  />
                )}
              </div>
              {/* Right Column */}
              <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                {doc.teamBody && (
                  <p className="text-base font-normal leading-relaxed text-neutral-500 max-w-[55ch]">
                    {doc.teamBody}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Principles */}
      {doc.principles?.length > 0 && (
        <section className="relative py-12 md:py-18 lg:py-24">
          <div className="site-container">
            <div className="mb-10 sm:mb-14 w-full">
              <div className="mb-4 h-px w-full bg-black/10 md:mb-10" />
              <h2 className={`${sectionTitleClass} text-balance`}>
                {lang === "fr" ? "Nos principes" : "Our principles"}
              </h2>
            </div>
            
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {doc.principles.map((p: { emoji?: string; title?: string; description?: string }, index: number) => (
                <article
                  key={index}
                  className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.02] bg-[#EDEDED]/50 px-5 py-7 transition-all duration-500 ease-out hover:bg-[#E3EAE6]/70 xs:px-8 sm:min-h-[280px] md:min-h-[300px] md:px-8 md:py-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm font-normal leading-none text-black/35">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {p.emoji && <span className="text-xl" aria-hidden="true">{p.emoji}</span>}
                    </div>
                    {p.title && (
                      <h3 className="max-w-[18ch] text-xl font-semibold leading-tight tracking-[-0.02em] text-neutral-900 transition-colors duration-300 group-hover:text-[#1D7A65]">
                        {p.title}
                      </h3>
                    )}
                  </div>
                  {p.description && (
                    <p className="mt-8 max-w-[42ch] text-sm font-normal leading-[1.6] tracking-[-0.015em] text-black/50">
                      {p.description}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Track record */}
      {(doc.trackRecordH2 || doc.trackRecordBody) && (
        <section className="relative py-12 md:py-18 lg:py-24">
          <div className="site-container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column */}
              <div className="lg:col-span-5 self-start w-full">
                <div className="mb-4 h-px w-full bg-black/10" />
                {doc.trackRecordH2 && (
                  <AnimatedTitle
                    as="h2"
                    text={doc.trackRecordH2}
                    className={`${sectionTitleClass} text-balance`}
                    splitBy="word"
                  />
                )}
              </div>
              {/* Right Column */}
              <div className="lg:col-span-7 flex flex-col pt-2 lg:pt-0">
                {doc.trackRecordBody && (
                  <p className="text-base font-normal leading-relaxed text-neutral-500 max-w-[55ch]">
                    {doc.trackRecordBody}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Locations */}
      {doc.locations?.length > 0 && (
        <section className="relative py-12 md:py-18 lg:py-24">
          <div className="site-container">
            <div className="mb-10 sm:mb-14 w-full">
              <div className="mb-4 h-px w-full bg-black/10 md:mb-10" />
              <h2 className={`${sectionTitleClass} text-balance`}>
                {lang === "fr" ? "Nos bureaux" : "Our locations"}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {doc.locations.map((loc: { city?: string; description?: string }, i: number) => (
                <div key={i} className="flex flex-col border-t border-black/10 pt-6">
                  {loc.city && (
                    <h3 className="text-lg font-semibold leading-tight tracking-tight text-neutral-900 mb-2">
                      {loc.city}
                    </h3>
                  )}
                  {loc.description && (
                    <p className="text-sm font-normal leading-relaxed text-neutral-500 max-w-[32ch]">
                      {loc.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      {doc.bottomCtaH2 && (
        <section className="bg-black text-white py-20 md:py-28 lg:py-36 text-center">
          <div className="max-w-3xl mx-auto space-y-8 px-5 sm:px-8">
            <AnimatedTitle
              as="h2"
              text={doc.bottomCtaH2}
              className="text-4xl-fluid font-medium tracking-tighter text-white max-w-3xl mx-auto"
              splitBy="word"
            />
            {doc.bottomCtaBody && (
              <p className="text-base-fluid text-neutral-400 leading-relaxed font-normal max-w-[55ch] mx-auto">
                {doc.bottomCtaBody}
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link
                href={`/${lang}/contact`}
                className="px-8 py-4 bg-[#75DAB4] text-black hover:bg-white transition-colors duration-300 text-sm font-normal uppercase tracking-widest rounded-sm w-full sm:w-auto text-center"
              >
                {lang === "fr" ? "Discutons" : "Let's talk"}
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
