import Link from "next/link";
import { DarkCatalogueHero } from "@/components/ui/dark-catalogue-hero";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { SectionReveal } from "@/components/ui/section-reveal";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { CurtainLink } from "@/components/ui/curtain-link";
import { AiMaturityCta } from "@/components/ui/ai-maturity-cta";
import { JsonLd, breadcrumbLd, SITE_URL, LOCAL_BUSINESS_ID } from "@/components/seo/structured-data";
import {
  standaloneAlternates,
  localizedHref,
  familySlugForLang,
  getFamilyTitle,
} from "@/lib/routing/url-helpers";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  Scale,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

const FAMILY_KEYS = [
  "solutions-ia",
  "conseil-ia",
  "developpement-logiciel",
  "securite",
  "sites-et-branding",
  "renfort-equipe",
  "formation-ia",
] as const;

const LOCAL_ICONS: LucideIcon[] = [MapPin, Scale, Building2, UsersRound];

const COPY = {
  fr: {
    badge: "Genève, Suisse romande",
    wordmark: "genève",
    crossLabel: "/services",
    title: "IA et transformation digitale à Genève.",
    intro:
      "MAWT est l’agence IA des entreprises genevoises. Stratégie IA, automatisation, développement sur mesure et renfort d’équipe, livrés par une équipe senior basée à Genève. De la première séance au déploiement, vous parlez à ceux qui construisent.",
    localH2: "Pourquoi MAWT pour une entreprise genevoise",
    local: [
      { t: "Proximité genevoise", d: "Une équipe sur place, disponible pour des séances en personne à Genève et en Suisse romande. Pas de décalage horaire, pas d’intermédiaire." },
      { t: "Conformité nLPD", d: "Données hébergées en Suisse, conformité nLPD et RGPD pensée dès la conception. Vos informations clients restent sous votre contrôle." },
      { t: "Secteurs clés du bassin", d: "Nous comprenons les enjeux de la finance et de la banque privée, du négoce, de l’horlogerie et du luxe, de la medtech et des entreprises commerciales en croissance." },
      { t: "Exécution senior", d: "Un interlocuteur unique, du cadrage à la production. Pas de juniors envoyés en rotation, pas de PowerPoint d’agence. Du concret, livré vite." },
    ],
    expectH2: "Travailler avec une agence IA à Genève : à quoi s’attendre",
    expectBody:
      "Un projet type démarre par une séance de cadrage, en personne à Genève ou en visioconférence, pour identifier les processus qui coûtent le plus d’heures à vos équipes. Nous livrons ensuite une proposition courte : périmètre, budget et délai — la plupart des automatisations et assistants IA passent en production en quelques semaines, pas en plusieurs mois. Le développement avance par itérations testables : vous voyez le système fonctionner sur vos données réelles avant le déploiement complet. Les données restent hébergées en Suisse, la conformité nLPD est intégrée dès la conception, et une IA locale — sur vos serveurs ou dans un cloud privé suisse — est proposée quand la confidentialité l’exige. Après la mise en production, l’équipe qui a construit votre système en assure le suivi : pas de hotline anonyme, un interlocuteur unique qui connaît votre dossier.",
    hqH2: "Notre siège à Carouge",
    hqBody:
      "MAWT est installée Rue de la Fontenette 23 à Carouge (1227), à quelques minutes du centre de Genève. Nous nous déplaçons chez nos clients dans tout le canton et travaillons à distance avec des entreprises de toute la Suisse romande.",
    hqAddressLabel: "Adresse",
    hqContactLabel: "Contact",
    wikiH2: "Le sommaire de nos services",
    wikiSub: "Un point d’entrée par domaine. Chaque famille regroupe nos services détaillés pour les entreprises de Genève et de Suisse romande.",
    explore: "Explorer",
    familyBlurb: {
      "sites-et-branding": "E-commerce, branding, audits UX/SEO, référencement IA (GEO) et refontes.",
      "solutions-ia": "CRM intelligent, agents IA, RAG, IA générative, automatisation et IA locale.",
      "conseil-ia": "Stratégie IA, audit opérationnel et transformation, par des gens qui construisent aussi.",
      "renfort-equipe": "Développeurs, CTO, tech leads et experts IA intégrés à votre équipe.",
      "formation-ia": "Formation ChatGPT, ateliers IA par métier et coaching des décideurs.",
      "developpement-logiciel": "Du MVP au système critique : web, mobile, desktop, API, bases de données.",
      securite: "Cybersécurité, conformité nLPD et tests d’intrusion pour PME.",
    } as Record<string, string>,
  },
  en: {
    badge: "Geneva, Switzerland",
    wordmark: "geneva",
    crossLabel: "/services",
    title: "AI and digital transformation in Geneva.",
    intro:
      "MAWT is the AI agency for Geneva businesses. AI strategy, automation, custom development and team augmentation, delivered by a senior team based in Geneva. From the first session to production, you talk to the people who build.",
    localH2: "Why MAWT for a Geneva business",
    local: [
      { t: "Geneva proximity", d: "A team on the ground, available for in person sessions in Geneva and French speaking Switzerland. No time zone gap, no middleman." },
      { t: "nFADP compliance", d: "Data hosted in Switzerland, nFADP and GDPR compliance designed in from the start. Your client information stays under your control." },
      { t: "Key local sectors", d: "We understand finance and private banking, commodity trading, watchmaking and luxury, medtech, and growing commercial companies." },
      { t: "Senior execution", d: "One point of contact, from scoping to production. No rotating juniors, no agency slide decks. Concrete work, shipped fast." },
    ],
    expectH2: "Working with an AI agency in Geneva: what to expect",
    expectBody:
      "A typical project starts with a scoping session, in person in Geneva or over video, to identify the processes that cost your teams the most hours. We then deliver a short proposal: scope, budget and timeline — most automations and AI assistants reach production in weeks, not months. Development moves in testable iterations: you see the system running on your real data before full rollout. Data stays hosted in Switzerland, nFADP compliance is designed in from the start, and local AI — on your own servers or in a Swiss private cloud — is proposed whenever confidentiality demands it. After go-live, the team that built your system keeps supporting it: no anonymous hotline, one point of contact who knows your file.",
    hqH2: "Our Carouge headquarters",
    hqBody:
      "MAWT is based at Rue de la Fontenette 23 in Carouge (1227), minutes from central Geneva. We travel to clients across the canton and work remotely with companies throughout French speaking Switzerland.",
    hqAddressLabel: "Address",
    hqContactLabel: "Contact",
    wikiH2: "Our services, organized",
    wikiSub: "One entry point per domain. Each family groups our detailed services for businesses in Geneva and French speaking Switzerland.",
    explore: "Explore",
    familyBlurb: {
      "sites-et-branding": "E-commerce, branding, UX/SEO audits, AI search optimization (GEO) and redesigns.",
      "solutions-ia": "Smart CRM, AI agents, RAG, generative AI, automation and local AI.",
      "conseil-ia": "AI strategy, operational audit and transformation, by people who also build.",
      "renfort-equipe": "Developers, CTOs, tech leads and AI experts embedded in your team.",
      "formation-ia": "ChatGPT training, AI workshops per function and leadership coaching.",
      "developpement-logiciel": "From MVP to mission-critical: web, mobile, desktop, API, databases.",
      securite: "Cybersecurity, compliance and penetration testing for SMEs.",
    } as Record<string, string>,
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const c = COPY[lang] ?? COPY.en;
  const title =
    lang === "fr"
      ? "IA et transformation digitale à Genève"
      : "AI and digital transformation in Geneva";
  const description =
    lang === "fr"
      ? "MAWT accompagne les entreprises genevoises : solutions IA, automatisation et logiciels sur mesure, avec conformité nLPD et hébergement suisse."
      : "MAWT helps Geneva businesses adopt AI: custom solutions, process automation and tailored software, with Swiss hosting and nFADP compliance.";
  const url = `${SITE_URL}${localizedHref("geneve", lang)}`;
  return {
    title,
    description,
    alternates: standaloneAlternates("geneve", lang),
    openGraph: {
      title,
      description,
      url,
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
    twitter: { title, description },
  };
}

export default async function GenevaPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const c = COPY[lang] ?? COPY.en;
  const pageUrl = `${SITE_URL}${localizedHref("geneve", lang)}`;
  const servicesHref = localizedHref("services", lang);

  const families = FAMILY_KEYS.map((key) => ({
    title: getFamilyTitle(key, lang),
    blurb: c.familyBlurb[key],
    href: `/${lang}/services/${familySlugForLang(key, lang)}`,
  }));

  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: lang === "fr" ? "Genève" : "Geneva", url: pageUrl },
  ]);
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: pageUrl,
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    name: c.title,
    about: { "@id": LOCAL_BUSINESS_ID },
    hasPart: families.map((f) => ({
      "@type": "WebPage",
      name: f.title,
      url: `${SITE_URL}${f.href}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={[crumbLd, collectionLd]} />

      <DarkCatalogueHero
        wordmark={c.wordmark}
        crossHref={servicesHref}
        crossLabel={c.crossLabel}
        title={c.title}
        description={c.badge}
      />

      <SlidePageBody>
        <section className="pb-16 md:pb-20">
          <div className="site-container-xwide">
            <SectionReveal>
              <p className="max-w-[54ch] text-[18px] font-normal leading-relaxed text-white/58 md:text-[20px]">
                {c.intro}
              </p>
            </SectionReveal>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#1d1d1d] py-20 md:py-28">
          <div className="site-container-xwide">
            <SectionReveal>
              <p className="mb-10 text-[13px] font-normal text-white/40">{c.localH2}</p>
            </SectionReveal>
            <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {c.local.map((item, index) => {
                const Icon = LOCAL_ICONS[index % LOCAL_ICONS.length];
                return (
                  <SectionReveal
                    key={item.t}
                    delay={index * 0.05}
                    className="flex flex-col gap-5 bg-[#1d1d1d] p-7 transition-colors hover:bg-[#222]"
                  >
                    <DarkPageIcon icon={Icon} />
                    <h3 className="text-[17px] font-medium tracking-tight text-white">{item.t}</h3>
                    <p className="text-[14px] font-normal leading-relaxed text-white/50">{item.d}</p>
                  </SectionReveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 lg:py-32">
          <div className="site-container-xwide">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <SectionReveal className="lg:col-span-4">
                <h2 className="max-w-[16ch] text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-tight tracking-tight text-white">
                  {c.expectH2}
                </h2>
              </SectionReveal>
              <SectionReveal className="lg:col-span-7 lg:col-start-6" delay={0.04}>
                <p className="max-w-[54ch] text-[16px] font-normal leading-relaxed text-white/55 md:text-[17px]">
                  {c.expectBody}
                </p>
              </SectionReveal>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#1d1d1d] py-20 md:py-28">
          <div className="site-container-xwide">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <SectionReveal className="lg:col-span-5">
                <DarkPageIcon icon={MapPin} className="mb-6" />
                <h2 className="max-w-[14ch] text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-tight tracking-tight text-white">
                  {c.hqH2}
                </h2>
                <p className="mt-6 max-w-[40ch] text-[15px] font-normal leading-relaxed text-white/55">
                  {c.hqBody}
                </p>
              </SectionReveal>
              <SectionReveal className="lg:col-span-5 lg:col-start-8" delay={0.04}>
                <address className="not-italic space-y-8 text-[15px] font-normal leading-relaxed">
                  <div>
                    <div className="mb-2 text-[12px] tracking-wide text-white/35">
                      {c.hqAddressLabel}
                    </div>
                    <p className="text-white/80">
                      MAWT
                      <br />
                      Rue de la Fontenette 23
                      <br />
                      1227 Carouge, {lang === "fr" ? "Genève" : "Geneva"}
                    </p>
                  </div>
                  <div>
                    <div className="mb-2 text-[12px] tracking-wide text-white/35">
                      {c.hqContactLabel}
                    </div>
                    <p className="space-y-1">
                      <a
                        href="tel:+41766363333"
                        className="block text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                      >
                        +41 76 636 33 33
                      </a>
                      <a
                        href="mailto:info@mawt.ch"
                        className="block text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                      >
                        info@mawt.ch
                      </a>
                    </p>
                  </div>
                </address>
              </SectionReveal>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 lg:py-32">
          <div className="site-container-xwide">
            <SectionReveal className="mb-12 max-w-[48ch]">
              <h2 className="text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-tight tracking-tight text-white">
                {c.wikiH2}
              </h2>
              <p className="mt-4 text-[15px] font-normal leading-relaxed text-white/50">
                {c.wikiSub}
              </p>
            </SectionReveal>

            <ul className="divide-y divide-white/10 border-y border-white/10">
              {families.map((f) => (
                <li key={f.href}>
                  <Link
                    href={f.href}
                    className="group flex flex-col gap-2 py-6 transition-colors sm:flex-row sm:items-baseline sm:justify-between sm:gap-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
                  >
                    <div className="min-w-0">
                      <h3 className="text-[17px] font-medium text-white/85 transition-colors group-hover:text-white">
                        {f.title}
                      </h3>
                      <p className="mt-1 max-w-[48ch] text-[14px] font-normal leading-relaxed text-white/45">
                        {f.blurb}
                      </p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1.5 text-[12px] font-normal text-white/35 transition-colors group-hover:text-white/70">
                      {c.explore}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <CurtainLink
                href={servicesHref}
                className="text-[13px] font-normal text-white/45 transition-colors hover:text-white"
              >
                {lang === "fr" ? "Voir tous les services →" : "View all services →"}
              </CurtainLink>
            </div>
          </div>
        </section>

        <AiMaturityCta lang={lang} />
      </SlidePageBody>
    </div>
  );
}
