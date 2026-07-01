import type { Locale } from "@/i18n-config";
import { WorkProjectsSection } from "@/components/ui/work-projects-section";
import { getAllProjects } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";
import { SubpageHero } from "@/components/sections/subpage-hero";

interface ProjectsPageProps {
  params: Promise<{ lang: Locale }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Case Studies" : "Études de cas",
    description: lang === "en"
      ? "Proven systems built for high-performance teams."
      : "Systèmes éprouvés conçus pour des équipes performantes.",
    alternates: standaloneAlternates("projets", lang),
  };
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { lang } = await params;
  const fetchedProjects = await getAllProjects(lang);

  const defaultProjects = [
    { _id: "1", title: "Redstart Ventures", workType: "Website design and development", industry: "Deep tech VC fund", year: 2025, slug: "redstart-ventures" },
    { _id: "2", title: "Breathr", workType: "Ongoing partnership", industry: "Consumer Tech", year: 2026, slug: "breathr" },
    { _id: "3", title: "Ampcore Inc.", workType: "Ongoing partnership", industry: "Battery Materials", year: 2024, slug: "ampcore-inc" },
    { _id: "4", title: "Join Valley", workType: "Website design and development", industry: "AI SAAS", year: 2025, slug: "join-valley" },
    { _id: "5", title: "JK Urbanscapes", workType: "Brand system", industry: "Real Estate", year: 2026, slug: "jk-urbanscapes" },
    { _id: "6", title: "Hippocampus Logistic", workType: "Brand system and Landing Page", industry: "Logistic", year: 2025, slug: "hippocampus-logistic" },
    { _id: "7", title: "Wallo", workType: "Website design and brand system", industry: "Ed-Tech", year: 2025, slug: "wallo" },
    { _id: "8", title: "Dime", workType: "Website design", industry: "Fin-Tech", year: 2026, slug: "dime" },
    { _id: "9", title: "SquadStack", workType: "Pitch deck design series C", industry: "Voice AI", year: 2025, slug: "squadstack" },
    { _id: "10", title: "Studio34", workType: "Brand System", industry: "Pilate Studio", year: 2025, slug: "studio34" },
    { _id: "11", title: "Blaiz", workType: "Website design and development", industry: "AI SAAS", year: 2026, slug: "blaiz" }
  ];

  const activeProjects = fetchedProjects.length > 0 ? fetchedProjects : defaultProjects;
  
  return (
    <div className="min-h-screen">
      <SubpageHero
        eyebrow={lang === "fr" ? "Nos projets" : "Our work"}
        title={lang === "fr" ? "Notre travail" : "Our work"}
        subtitle={lang === "fr" ? "De l'idée à la sortie" : "From idea to exit"}
      />

      <WorkProjectsSection projects={activeProjects} lang={lang} />
    </div>
  );
}
