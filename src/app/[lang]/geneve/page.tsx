import Link from "next/link";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { AiMaturityCta } from "@/components/ui/ai-maturity-cta";
import { JsonLd, breadcrumbLd, areaServed, SITE_URL, ORG_ID } from "@/components/seo/structured-data";
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
  "digital",
  "donnees-analytics",
  "developpement-logiciel",
  "securite",
  "operations-scm",
  "sites-et-branding",
  "renfort-equipe",
  "formation-ia",
] as const;

const COPY = {
  fr: {
    badge: "Genève, Suisse romande",
    title: "IA et transformation digitale à Genève.",
    intro:
      "MAWT est l'agence IA des entreprises genevoises. Stratégie IA, automatisation, développement sur mesure et renfort d'équipe, livrés par une équipe senior basée à Genève. De la première séance au déploiement, vous parlez à ceux qui construisent.",
    localH2: "Pourquoi MAWT pour une entreprise genevoise",
    local: [
      { t: "Proximité genevoise", d: "Une équipe sur place, disponible pour des séances en personne à Genève et en Suisse romande. Pas de décalage horaire, pas d'intermédiaire." },
      { t: "Conformité nLPD", d: "Données hébergées en Suisse, conformité nLPD et RGPD pensée dès la conception. Vos informations clients restent sous votre contrôle." },
      { t: "Secteurs clés du bassin", d: "Nous comprenons les enjeux de la finance et de la banque privée, du négoce, de l'horlogerie et du luxe, de la medtech et des entreprises commerciales en croissance." },
      { t: "Exécution senior", d: "Un interlocuteur unique, du cadrage à la production. Pas de juniors envoyés en rotation, pas de PowerPoint d'agence. Du concret, livré vite." },
    ],
    wikiH2: "Le sommaire de nos services",
    wikiSub: "Un point d'entrée par domaine. Chaque famille regroupe nos services détaillés pour les entreprises de Genève et de Suisse romande.",
    explore: "Explorer",
    familyBlurb: {
      "sites-et-branding": "Branding, identité visuelle, audits UX/SEO et refontes orientées croissance.",
      "solutions-ia": "CRM intelligent, agents IA, RAG, automatisation et IA locale.",
      "conseil-ia": "Stratégie IA, audit opérationnel et transformation, par des gens qui construisent aussi.",
      "renfort-equipe": "Développeurs, CTO, tech leads et experts IA intégrés à votre équipe.",
      "formation-ia": "Formation ChatGPT, ateliers IA par métier et coaching des décideurs.",
      digital: "Conseil et stratégie digitale, e-commerce et applications métier.",
      "donnees-analytics": "Modernisation des données, analytique avancée, IA générative.",
      "developpement-logiciel": "Du MVP au système critique : web, mobile, desktop, API, bases de données.",
      securite: "Cybersécurité, conformité nLPD, tests d'intrusion et SIEM pour PME.",
      "operations-scm": "ERP, logistique, entrepôt, fournisseurs et gestion documentaire.",
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
    wikiH2: "Our services, organized",
    wikiSub: "One entry point per domain. Each family groups our detailed services for businesses in Geneva and French speaking Switzerland.",
    explore: "Explore",
    familyBlurb: {
      "sites-et-branding": "Branding, visual identity, UX/SEO audits and redesigns built for growth.",
      "solutions-ia": "Smart CRM, AI agents, RAG, automation and local AI.",
      "conseil-ia": "AI strategy, operational audit and transformation, by people who also build.",
      "renfort-equipe": "Developers, CTOs, tech leads and AI experts embedded in your team.",
      "formation-ia": "ChatGPT training, AI workshops per function and leadership coaching.",
      digital: "Digital consulting & strategy, digital commerce and business applications.",
      "donnees-analytics": "Data modernization, advanced analytics and generative AI.",
      "developpement-logiciel": "From MVP to mission-critical: web, mobile, desktop, API, databases.",
      securite: "Cybersecurity, compliance, penetration testing and SIEM for SMEs.",
      "operations-scm": "ERP, supply chain, warehouse, vendor and document management.",
    } as Record<string, string>,
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const c = COPY[lang] ?? COPY.en;
  return {
    title: lang === "fr" ? "IA et transformation digitale à Genève | MAWT" : "AI and digital transformation in Geneva | MAWT",
    description: c.intro,
    alternates: standaloneAlternates("geneve", lang),
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

  // JSON-LD: LocalBusiness anchored to the Geneva HQ + breadcrumb + a
  // CollectionPage listing the five service families (the wiki summary).
  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness-geneva`,
    name: "MAWT",
    url: pageUrl,
    description: c.intro,
    image: `${SITE_URL}/logo-black.svg`,
    priceRange: "$$$",
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    parentOrganization: { "@id": ORG_ID },
    areaServed: areaServed(lang),
    address: {
      "@type": "PostalAddress",
      addressLocality: lang === "fr" ? "Genève" : "Geneva",
      addressRegion: lang === "fr" ? "Genève" : "Geneva",
      addressCountry: "CH",
    },
    geo: { "@type": "GeoCoordinates", latitude: 46.2044, longitude: 6.1432 },
  };
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
    about: { "@id": ORG_ID },
    hasPart: families.map((f) => ({ "@type": "WebPage", name: f.title, url: `${SITE_URL}${f.href}` })),
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={[localBusinessLd, crumbLd, collectionLd]} />

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

      {/* 2. Wiki summary: the 5 service families */}
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

      {/* 3. Conversion */}
      <AiMaturityCta lang={lang} />
    </div>
  );
}
