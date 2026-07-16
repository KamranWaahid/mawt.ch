"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n-config";
import type { Project } from "@/lib/types";
import { ProjectList } from "@/components/ui/project-list";
import { urlForImage } from "@/lib/sanity.image";

type WorkProjectsSectionProps = {
  projects: Partial<Project>[];
  lang: Locale;
};

const normalizeWorkType = (value?: string) => value?.trim() || "Other";
const hasCoverImage = (project: Partial<Project>) => Boolean(project.coverImage?.asset?._ref);
type WorkView = "grid" | "list";

export function WorkProjectsSection({ projects, lang }: WorkProjectsSectionProps) {
  const [activeType, setActiveType] = useState("All");
  const [activeView, setActiveView] = useState<WorkView>("grid");
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
                  {/* "All"/"Other" are internal filter keys — display them
                      localized (they rendered in English on /fr/projets). */}
                  {type === "All"
                    ? lang === "fr" ? "Tous" : "All"
                    : type === "Other"
                      ? lang === "fr" ? "Autre" : "Other"
                      : type}
                </button>
              </span>
            ))}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={activeView === "grid"}
              onClick={() => setActiveView("grid")}
              className={`flex items-center justify-center p-1 transition-colors hover:text-black ${
                activeView === "grid" ? "text-black" : "text-neutral-300"
              }`}
            >
              <LayoutGrid size={20} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={activeView === "list"}
              onClick={() => setActiveView("list")}
              className={`flex items-center justify-center p-1 transition-colors hover:text-black ${
                activeView === "list" ? "text-black" : "text-neutral-300"
              }`}
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <section className="site-container-wide pb-16 pt-8 md:pb-24 lg:pb-32">
        {activeView === "grid" ? (
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const imageSrc = urlForImage(project.coverImage)?.width(1100).height(1380).fit("crop").url();

              if (!imageSrc) return null;

              return (
                <Link
                  key={project._id || project.slug || index}
                  href={`/${lang}/${lang === "fr" ? "projets" : "work"}/${project.slug || ""}`}
                  className="group block"
                  data-cursor="view"
                >
                  <div className="relative aspect-[0.82] w-full overflow-hidden rounded-[8px] bg-neutral-100">
                    <Image
                      src={imageSrc}
                      alt={project.coverImage?.alt || project.title || ""}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      priority={index < 3}
                    />
                  </div>
                  <h2 className="mt-5 text-[clamp(1.15rem,1.8vw,1.65rem)] font-normal leading-tight tracking-normal text-black">
                    {project.title || "—"}
                  </h2>
                </Link>
              );
            })}
          </div>
        ) : (
          <ProjectList projects={filteredProjects} lang={lang} />
        )}
      </section>
    </>
  );
}
