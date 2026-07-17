import type { Locale } from "@/i18n-config";
import { WorkProjectsSection } from "@/components/ui/work-projects-section";
import { getAllProjects } from "@/lib/sanity.queries";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";
import { JsonLd, breadcrumbLd, SITE_URL, ORG_ID } from "@/components/seo/structured-data";

interface ProjectsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  const title =
    lang === "en"
      ? "Case studies - AI & automation projects in Geneva"
      : "Études de cas - projets IA et automatisation à Genève";
  const description =
    lang === "en"
      ? "AI, automation and custom software case studies from Geneva: real projects, measured results. Hours saved, errors cut, teams unblocked."
      : "Études de cas IA, automatisation et logiciels sur mesure à Genève : des projets réels, des résultats mesurés. Heures récupérées, erreurs réduites.";
  return {
    title,
    description,
    alternates: standaloneAlternates("projets", lang),
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${localizedHref("projets", lang)}`,
      locale: lang === "fr" ? "fr_CH" : "en_US",
    },
    twitter: { title, description },
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const fetchedProjects = await getAllProjects(lang);
  const pageUrl = `${SITE_URL}${localizedHref("projets", lang)}`;
  const pageName = lang === "fr" ? "Études de cas" : "Case studies";

  // JSON-LD: case studies are the agency's #1 "Experience" (E-E-A-T) asset —
  // expose the listing as a CollectionPage + ItemList (SSR, AI crawlers
  // do not run JS).
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: pageName, url: pageUrl },
  ]);
  const projectItems = (fetchedProjects || [])
    .filter((p) => p?.title && p?.slug)
    .map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title as string,
      url: `${SITE_URL}/${lang}/${lang === "fr" ? "projets" : "work"}/${p.slug}`,
    }));
  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: pageUrl,
    name: pageName,
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    about: { "@id": ORG_ID },
    ...(projectItems.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: projectItems.length,
            itemListElement: projectItems,
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen">
      <JsonLd data={[crumbLd, collectionLd]} />
      <SubpageHero
        eyebrow={lang === "fr" ? "Nos projets" : "Our work"}
        title={lang === "fr" ? "Études de cas" : "Case studies"}
        subtitle={lang === "fr" ? "De l'idée au lancement" : "From brief to launch"}
      />

      <WorkProjectsSection projects={fetchedProjects} lang={lang} />
    </div>
  );
}
