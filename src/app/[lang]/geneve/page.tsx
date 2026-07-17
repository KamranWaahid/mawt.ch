import Link from "next/link";
import { SubpageHero } from "@/components/sections/subpage-hero";
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

// AI-first, matching FAMILY_ORDER in url-helpers (agence IA positioning).
const FAMILY_KEYS = [
  "solutions-ia",
  "conseil-ia",
  "developpement-logiciel",
  "securite",
  "sites-et-branding",
  "renfort-equipe",
  "formation-ia",
] as const;

const COPY = {
  fr: {
    badge: "Genève, Suisse romande",
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
    // Self-contained 134-167 word passage (GEO extraction window): complete
    // answer, no external context needed.
    expectBody:
      "Un projet type démarre par une séance de cadrage, en personne à Genève ou en visioconférence, pour identifier les processus qui coûtent le plus d’heures à vos équipes. Nous livrons ensuite une proposition courte : périmètre, budget et délai. La plupart des automatisations et assistants IA passent en production en quelques semaines, pas en plusieurs mois. Le développement avance par itérations testables : vous voyez le système fonctionner sur vos données réelles avant le déploiement complet. Les données restent hébergées en Suisse, la conformité nLPD est intégrée dès la conception, et une IA locale, sur vos serveurs ou dans un cloud privé suisse, est proposée quand la confidentialité l’exige. Après la mise en production, l’équipe qui a construit votre système en assure le suivi : pas de hotline anonyme, un interlocuteur unique qui connaît votre dossier.",
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
      "A typical project starts with a scoping session, in person in Geneva or over video, to identify the processes that cost your teams the most hours. We then deliver a short proposal: scope, budget and timeline. Most automations and AI assistants reach production in weeks, not months. Development moves in testable iterations: you see the system running on your real data before full rollout. Data stays hosted in Switzerland, nFADP compliance is designed in from the start, and local AI, on your own servers or in a Swiss private cloud, is proposed whenever confidentiality demands it. After go-live, the team that built your system keeps supporting it: no anonymous hotline, one point of contact who knows your file.",
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
  // No "| MAWT" suffix here: the layout title template appends the brand —
  // duplicating it produced "… | MAWT | MAWT" in the SERP.
  const title =
    lang === "fr"
      ? "IA et transformation digitale à Genève"
      : "AI and digital transformation in Geneva";
  // Dedicated 120-160c description (c.intro is 220c+ and gets truncated).
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

  const families = FAMILY_KEYS.map((key) => ({
    title: getFamilyTitle(key, lang),
    blurb: c.familyBlurb[key],
    href: `/${lang}/services/${familySlugForLang(key, lang)}`,
  }));

  // JSON-LD: breadcrumb + a CollectionPage listing the service families.
  // No page-level LocalBusiness node: the global @graph already carries THE
  // LocalBusiness (Carouge HQ, full NAP + geo). A second node with a
  // divergent address/geo on the same page fragmented the entity — the
  // CollectionPage references the global node by @id instead.
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
    hasPart: families.map((f) => ({ "@type": "WebPage", name: f.title, url: `${SITE_URL}${f.href}` })),
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={[crumbLd, collectionLd]} />

      <SubpageHero badge={c.badge} title={c.title} />

      {/* Bite-sized intent statement for RAG / AI Overview */}
      <section className="px-6 pt-12 pb-8 sm:px-8 md:px-10 lg:px-12">
        <p className="max-w-3xl mx-auto text-xl md:text-2xl text-neutral-600 font-normal leading-relaxed">
          {c.intro}
        </p>
      </section>

      {/* 1. Local anchoring */}
      <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
        <div className="site-container-wide">
          <h2 className="text-3xl font-normal tracking-tight text-black mb-10">{c.localH2}</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {c.local.map((item) => (
              <article key={item.t} className="flex flex-col gap-3 p-8 border border-black/5 hover:border-black/20 transition-colors">
                <h3 className="text-xl font-normal text-black">{item.t}</h3>
                <p className="text-[15px] text-neutral-500 font-normal leading-relaxed">{item.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. What to expect — one self-contained 134-167 word passage (the
          GEO extraction window) answering the local commercial query end to
          end: process, timeline, nFADP, Swiss hosting, follow-up. */}
      <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
        <div className="site-container-wide">
          <h2 className="text-3xl font-normal tracking-tight text-black mb-8">{c.expectH2}</h2>
          <p className="max-w-3xl text-lg text-neutral-600 font-normal leading-relaxed">
            {c.expectBody}
          </p>
        </div>
      </section>

      {/* 3. Carouge HQ — visible NAP on the local page itself (engines
          corroborate the LocalBusiness schema from visible HTML). */}
      <section className="py-16 md:py-24 lg:py-32 border-t border-black/5">
        <div className="site-container-wide">
          <h2 className="text-3xl font-normal tracking-tight text-black mb-8">{c.hqH2}</h2>
          <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
            <p className="max-w-3xl text-lg text-neutral-600 font-normal leading-relaxed">
              {c.hqBody}
            </p>
            <address className="not-italic space-y-4 text-[15px] font-normal leading-relaxed">
              <div>
                <div className="text-neutral-400">{c.hqAddressLabel}</div>
                <p className="text-black">MAWT<br />Rue de la Fontenette 23<br />1227 Carouge, {lang === "fr" ? "Genève" : "Geneva"}</p>
              </div>
              <div>
                <div className="text-neutral-400">{c.hqContactLabel}</div>
                <p>
                  <a href="tel:+41766363333" className="text-black hover:text-neutral-500 transition-colors">+41 76 636 33 33</a>
                  <br />
                  <a href="mailto:info@mawt.ch" className="text-black hover:text-neutral-500 transition-colors">info@mawt.ch</a>
                </p>
              </div>
            </address>
          </div>
        </div>
      </section>

      {/* 4. Wiki summary: the service families */}
      <section className="bg-neutral-50 py-16 md:py-24 lg:py-32 border-t border-black/5">
        <div className="site-container-wide">
          <h2 className="text-3xl font-normal tracking-tight text-black">{c.wikiH2}</h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-500 font-normal leading-relaxed">{c.wikiSub}</p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {families.map((f) => (
              <li key={f.href}>
                <Link
                  href={f.href}
                  className="flex h-full flex-col gap-3 p-8 bg-white border border-black/5 hover:border-black/20 transition-colors"
                >
                  <h3 className="text-xl font-normal text-black">{f.title}</h3>
                  <p className="text-[15px] text-neutral-500 font-normal leading-relaxed">{f.blurb}</p>
                  <span className="mt-auto pt-4 text-xs font-normal uppercase tracking-widest text-[#75DAB4]">
                    {c.explore} →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Conversion */}
      <AiMaturityCta lang={lang} />
    </div>
  );
}
