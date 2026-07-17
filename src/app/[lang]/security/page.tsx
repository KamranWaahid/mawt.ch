import { DarkCatalogueHero } from "@/components/ui/dark-catalogue-hero";
import { RichText } from "@/components/ui/rich-text";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { SectionReveal } from "@/components/ui/section-reveal";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { CurtainLink } from "@/components/ui/curtain-link";
import { getSecurityPage } from "@/lib/sanity.queries";
import { localizedHref, standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import {
  ArrowRight,
  Fingerprint,
  LockKeyhole,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const SECTION_ICONS: LucideIcon[] = [ShieldCheck, LockKeyhole, Fingerprint];

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
  const wordmark = lang === "fr" ? "sécurité" : "security";
  const contactHref = localizedHref("contact", lang);

  if (!doc?.heroH1) {
    return (
      <div className="min-h-screen bg-[#161616] text-white">
        <HeaderTheme theme="light" />
        <DarkCatalogueHero
          wordmark={wordmark}
          crossHref={contactHref}
          crossLabel="/contact"
          title={lang === "fr" ? "Bientôt disponible." : "Coming soon."}
          description={
            lang === "fr"
              ? "Cette page sera bientôt disponible."
              : "This page will be available soon."
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />

      <DarkCatalogueHero
        wordmark={wordmark}
        crossHref={contactHref}
        crossLabel="/contact"
        title={doc.heroH1}
        description={doc.heroH2 || undefined}
      />

      <SlidePageBody>
        {doc.intro && (
          <section className="pb-16 md:pb-20">
            <div className="site-container-xwide">
              <div className="grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-16">
                <SectionReveal className="lg:col-span-3">
                  <p className="text-[13px] font-normal text-white/40">
                    {lang === "fr" ? "Pratiques" : "Practices"}
                  </p>
                </SectionReveal>
                <SectionReveal className="max-w-[54ch] lg:col-span-7 lg:col-start-5" delay={0.04}>
                  <DarkPageIcon icon={ShieldCheck} className="mb-8" />
                  <RichText value={doc.intro} tone="dark" />
                </SectionReveal>
              </div>
            </div>
          </section>
        )}

        {doc.sections?.length > 0 && (
          <section className="border-y border-white/10 bg-[#1d1d1d]">
            <div className="site-container-xwide divide-y divide-white/10 py-4 md:py-6">
              {doc.sections.map((sec: { title: string; body: unknown }, i: number) => {
                const Icon = SECTION_ICONS[i % SECTION_ICONS.length];
                return (
                  <article key={i} className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
                    <SectionReveal className="lg:col-span-3">
                      <DarkPageIcon icon={Icon} className="mb-5" />
                      <h2 className="max-w-[16ch] text-[clamp(1.4rem,2.4vw,1.9rem)] font-medium leading-tight tracking-tight text-white">
                        {sec.title}
                      </h2>
                    </SectionReveal>
                    <SectionReveal className="max-w-[54ch] lg:col-span-7 lg:col-start-5" delay={0.04}>
                      <RichText value={sec.body} tone="dark" />
                    </SectionReveal>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {doc.bottomCtaH2 && (
          <section className="py-20 md:py-28 lg:py-36">
            <div className="site-container-xwide">
              <SectionReveal>
                <h2 className="max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1.02] tracking-tight text-white">
                  {doc.bottomCtaH2}
                </h2>
                {doc.bottomCtaBody && (
                  <p className="mt-6 max-w-[52ch] text-[15px] font-normal leading-relaxed text-white/55">
                    {doc.bottomCtaBody}
                  </p>
                )}
                {doc.bottomCtaLabel && (
                  <CurtainLink
                    href={contactHref}
                    className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                  >
                    {doc.bottomCtaLabel}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <ArrowRight size={13} aria-hidden="true" />
                    </span>
                  </CurtainLink>
                )}
              </SectionReveal>
            </div>
          </section>
        )}
      </SlidePageBody>
    </div>
  );
}
