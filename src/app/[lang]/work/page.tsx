import type { Locale } from "@/i18n-config";
import { ProjectList } from "@/components/ui/project-list";
import { getAllProjects } from "@/lib/sanity.queries";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import { Menu, LayoutGrid } from "lucide-react";
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

      {/* Filter Bar */}
      <div className="py-6 border-t border-black/5">
        <div className="site-container-wide w-full flex justify-between items-center">
          <div className="flex flex-wrap items-center gap-4 text-[15px]">
            <button className="font-medium text-black">All</button>
            <span className="text-neutral-300">—</span>
            <button className="text-neutral-400 hover:text-black transition-colors">Strategy</button>
            <button className="text-neutral-400 hover:text-black transition-colors">Design</button>
            <button className="text-neutral-400 hover:text-black transition-colors">Development</button>
            <button className="text-neutral-400 hover:text-black transition-colors">Experience</button>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 text-black hover:opacity-70 transition-opacity flex items-center justify-center">
              <LayoutGrid size={20} strokeWidth={1.5} />
            </button>
            <button className="p-1 text-neutral-300 hover:text-black transition-colors flex items-center justify-center">
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <section className="site-container-wide pt-8 pb-16 md:pb-24 lg:pb-32">
        <ProjectList projects={activeProjects} lang={lang} />
      </section>
    </div>
  );
}
