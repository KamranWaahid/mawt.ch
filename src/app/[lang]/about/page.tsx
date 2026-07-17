import { getAboutContent } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, ORG_ID, SITE_URL } from "@/components/seo/structured-data";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { ABOUT_COPY } from "@/content/about-copy";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CircleDot,
  Puzzle,
  Sparkles,
  Target,
  UsersRound,
  Workflow,
} from "lucide-react";
import { CurtainLink } from "@/components/ui/curtain-link";

const WHY_HIGHLIGHTS = {
  en: [
    "Beyond the brief",
    "An extension of your team",
    "Continuous partnership",
    "Not one-shot delivery",
    "There are no problems, only solutions",
  ],
  fr: [
    "Au-delà du brief",
    "Une extension de votre équipe",
    "Accompagnement continu",
    "Pas une prestation one-shot",
    "Il n'y a pas de problème, il n'y a que des solutions",
  ],
} as const;

const TEAM_LINES = {
  en: ["Consulting and execution", "Marketing and technology", "Strategy and AI"],
  fr: ["Conseil et exécution", "Marketing et technologie", "Stratégie et IA"],
} as const;

const TEAM_ICONS = [Workflow, Sparkles, BrainCircuit] as const;
const PRINCIPLE_ICONS = [UsersRound, Target, Puzzle, BrainCircuit] as const;

const STUDIO_LINE = {
  en: "Not an agency. A studio.",
  fr: "Pas une agence. Un studio.",
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const doc = await getAboutContent(lang);
  const copy = ABOUT_COPY[lang];

  return {
    title: doc?.seo?.metaTitle || copy.seo.title,
    description: doc?.seo?.metaDescription || copy.seo.description,
    alternates: standaloneAlternates("a-propos", lang),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const copy = ABOUT_COPY[lang];
  const principles = copy.howWeWork.principles;
  const contactHref = localizedHref("contact", lang);

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

  const heroIntro = copy.hero.h2.replace(STUDIO_LINE[lang], "").trim();

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={[crumbLd, aboutLd]} />

      {/* Hero — same dark catalogue scale as /services, /work and /news. */}
      <section className="pb-[10vh] pt-[24vh]">
        <div className="site-container-xwide">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-9">
              <h1 className="max-w-[12ch] text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[0.98] tracking-tight text-white">
                {copy.hero.h1}
              </h1>
            </div>
            <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
              <p className="max-w-[52ch] text-[16px] font-normal leading-relaxed text-white/58 md:text-[18px]">
                {heroIntro}{" "}
                <span className="text-white">{STUDIO_LINE[lang]}</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <SlidePageBody>
        {/* Why MAWT */}
        <section className="pb-[14vh]">
          <div className="site-container-xwide">
            <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-16">
              <SectionReveal className="lg:col-span-3">
                <p className="text-[13px] font-normal text-white/40">{copy.story.h2}</p>
              </SectionReveal>

              <div className="space-y-12 lg:col-span-8 lg:col-start-5">
                <SectionReveal>
                  <DarkPageIcon icon={CircleDot} className="mb-8" />
                  <p className="max-w-[20ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white">
                    {lang === "fr"
                      ? "Au-delà du brief, nous cherchons ce qui vous fait vraiment avancer."
                      : "Beyond the brief, we look for what actually moves you forward."}
                  </p>
                </SectionReveal>

                <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
                  <SectionReveal className="space-y-4" delay={0.04}>
                    {WHY_HIGHLIGHTS[lang].map((item) => (
                      <div
                        key={item}
                        className="group flex items-center gap-3 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/62 transition-colors hover:text-white"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/25 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                        {item}
                      </div>
                    ))}
                  </SectionReveal>

                  <SectionReveal className="space-y-6" delay={0.08}>
                    {[copy.story.p1, copy.story.p2, copy.story.p3].map((paragraph) => (
                      <p
                        key={paragraph}
                        className="max-w-[58ch] text-[15px] font-normal leading-relaxed text-white/55"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </SectionReveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="pb-[14vh]">
          <div className="site-container-xwide">
            <div className="grid gap-12 border-t border-white/10 pt-10 lg:grid-cols-12 lg:gap-16">
              <SectionReveal className="lg:col-span-3">
                <p className="text-[13px] font-normal text-white/40">{copy.team.h2}</p>
              </SectionReveal>

              <div className="lg:col-span-8 lg:col-start-5">
                <SectionReveal>
                  <h2 className="max-w-[16ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white">
                    {lang === "fr" ? "Plusieurs profils, une seule vision." : "Several profiles, one shared vision."}
                  </h2>
                </SectionReveal>

                <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_1fr]">
                  <SectionReveal delay={0.04}>
                    <p className="max-w-[58ch] text-[15px] font-normal leading-relaxed text-white/55">
                      {copy.team.body}
                    </p>
                  </SectionReveal>

                  <SectionReveal delay={0.08}>
                    <ul className="space-y-0">
                      {TEAM_LINES[lang].map((line, index) => {
                        const Icon = TEAM_ICONS[index];
                        return (
                        <li
                          key={line}
                          className="group flex items-center justify-between gap-6 border-b border-white/10 py-[15px] text-[14px] font-normal text-white/70 transition-colors hover:text-white"
                        >
                          <span className="inline-flex items-center gap-3">
                            <Icon size={15} strokeWidth={1.5} className="shrink-0 text-white/35 transition-colors group-hover:text-white/60" aria-hidden="true" />
                            {line}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-white/60"
                          />
                        </li>
                      );
                      })}
                    </ul>
                  </SectionReveal>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="pb-[14vh]">
          <div className="site-container-xwide">
            <SectionReveal className="mb-12 border-t border-white/10 pt-10 md:mb-16">
              <p className="text-[13px] font-normal text-white/40">{copy.howWeWork.h2}</p>
            </SectionReveal>

            <div>
              {principles.map((principle, index) => (
                <SectionReveal key={principle.title} delay={index * 0.03}>
                  <article className="group grid gap-6 border-b border-white/10 py-8 transition-colors hover:border-white/20 md:grid-cols-12 md:items-start md:gap-10 md:py-10">
                    <div className="flex items-center gap-5 md:col-span-3">
                      <DarkPageIcon icon={PRINCIPLE_ICONS[index] || CircleDot} />
                      <span className="text-[clamp(2.8rem,6vw,5rem)] font-medium leading-none tracking-tight text-white/14 transition-colors group-hover:text-white/24">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <h3 className="max-w-[18ch] text-[clamp(1.45rem,2.6vw,2.4rem)] font-semibold leading-[1.05] tracking-tight text-white">
                        {principle.title}
                      </h3>
                    </div>
                    <div className="md:col-span-5">
                      <p className="max-w-[42ch] text-[15px] font-normal leading-relaxed text-white/55">
                        {principle.description}
                      </p>
                    </div>
                  </article>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Since 2021 */}
        <div className="border-y border-white/10 bg-[linear-gradient(135deg,#101010_0%,#1f1f1f_48%,#161616_100%)] text-white">
          <section className="py-20 md:py-28 lg:py-36">
            <div className="site-container-xwide">
              <SectionReveal className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
                <div className="lg:col-span-5">
                  <DarkPageIcon icon={Target} className="mb-8" />
                  <p className="text-[13px] font-normal text-white/42">{copy.trackRecord.h2}</p>
                  <div className="mt-6 flex items-end gap-4">
                    <span className="text-[clamp(6rem,16vw,13rem)] font-medium leading-[0.78] tracking-tight text-white">
                      50+
                    </span>
                    <span className="pb-2 text-[clamp(1.2rem,2vw,1.75rem)] font-medium leading-none text-white/52">
                      missions
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-6 lg:col-start-7">
                  <p className="max-w-[16ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white">
                    {copy.trackRecord.body}
                  </p>
                  <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                    {[0, 1, 2].map((item) => (
                      <span key={item} className="h-px bg-white/10" aria-hidden="true" />
                    ))}
                  </div>
                </div>
              </SectionReveal>
            </div>
          </section>
        </div>

        {/* Closing CTA */}
        <section className="py-20 md:py-28 lg:py-36">
          <div className="site-container-xwide">
            <SectionReveal>
              <h2 className="max-w-[16ch] text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[1.02] tracking-tight text-white">
                {copy.bottomCta.h2}
              </h2>
              {copy.bottomCta.body && (
                <p className="mt-6 max-w-[52ch] text-[15px] font-normal leading-relaxed text-white/55">
                  {copy.bottomCta.body}
                </p>
              )}
              <CurtainLink
                href={contactHref}
                className="mt-10 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white"
              >
                {copy.bottomCta.ctaPrimary.label}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                  <ArrowRight size={13} />
                </span>
              </CurtainLink>
            </SectionReveal>
          </div>
        </section>
      </SlidePageBody>
    </div>
  );
}
