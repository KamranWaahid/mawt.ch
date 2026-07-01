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
  
  return (
    <div className="min-h-screen">
      <SubpageHero
        eyebrow={lang === "fr" ? "Nos projets" : "Our work"}
        title={lang === "fr" ? "Notre travail" : "Our work"}
        subtitle={lang === "fr" ? "De l'idée à la sortie" : "From idea to exit"}
      />

      <WorkProjectsSection projects={fetchedProjects} lang={lang} />
    </div>
  );
}
