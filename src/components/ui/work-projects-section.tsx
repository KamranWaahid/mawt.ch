"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Menu } from "lucide-react";
import type { Locale } from "@/i18n-config";
import type { Project } from "@/lib/types";
import { ProjectList } from "@/components/ui/project-list";

type WorkProjectsSectionProps = {
  projects: Partial<Project>[];
  lang: Locale;
};

const normalizeWorkType = (value?: string) => value?.trim() || "Other";
const hasCoverImage = (project: Partial<Project>) => Boolean(project.coverImage?.asset?._ref);

export function WorkProjectsSection({ projects, lang }: WorkProjectsSectionProps) {
  const [activeType, setActiveType] = useState("All");
  const imageBackedProjects = useMemo(() => projects.filter(hasCoverImage), [projects]);

  const workTypes = useMemo(() => {
    const unique = new Set<string>();
    imageBackedProjects.forEach((project) => {
      unique.add(normalizeWorkType(project.workType));
    });
    return ["All", ...Array.from(unique)];
  }, [imageBackedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeType === "All") return imageBackedProjects;
    return imageBackedProjects.filter((project) => normalizeWorkType(project.workType) === activeType);
  }, [activeType, imageBackedProjects]);

  if (imageBackedProjects.length === 0) {
    return null;
  }

  return (
    <>
      <div className="border-t border-black/5 py-6">
        <div className="site-container-wide flex w-full flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-x-5 gap-y-3 overflow-x-auto pb-1 text-[clamp(1rem,2vw,1.45rem)] font-normal leading-none md:flex-wrap md:overflow-visible md:pb-0">
            {workTypes.map((type, index) => (
              <span key={type} className="flex shrink-0 items-center gap-5">
                {index > 0 && <span className="text-neutral-300">—</span>}
                <button
                  type="button"
                  onClick={() => setActiveType(type)}
                  aria-pressed={activeType === type}
                  className={`transition-colors ${
                    activeType === type ? "text-black" : "text-neutral-400 hover:text-black"
                  }`}
                >
                  {type}
                </button>
              </span>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Grid view"
              className="flex items-center justify-center p-1 text-black transition-opacity hover:opacity-70"
            >
              <LayoutGrid size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="List view"
              className="flex items-center justify-center p-1 text-neutral-300 transition-colors hover:text-black"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <section className="site-container-wide pb-16 pt-8 md:pb-24 lg:pb-32">
        <ProjectList projects={filteredProjects} lang={lang} />
      </section>
    </>
  );
}
