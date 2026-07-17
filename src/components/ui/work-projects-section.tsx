"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, Calendar, Factory, LayoutGrid, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/i18n-config";
import type { Project } from "@/lib/types";
import { ProjectList } from "@/components/ui/project-list";
import { urlForImage } from "@/lib/sanity.image";

type WorkDict = {
  filterAll: string;
  projectMore: string;
  listLabels: {
    client: string;
    workType: string;
    industry: string;
    date: string;
  };
};

type WorkProjectsSectionProps = {
  projects: Partial<Project>[];
  lang: Locale;
  dict: WorkDict;
};

const normalizeWorkType = (value?: string) => value?.trim() || "Other";
const hasCoverImage = (project: Partial<Project>) => Boolean(project.coverImage?.asset?._ref);
type WorkView = "grid" | "list";

function workPath(lang: Locale) {
  return lang === "fr" ? "projets" : "work";
}

export function WorkProjectsSection({ projects, lang, dict }: WorkProjectsSectionProps) {
  const [activeType, setActiveType] = useState(dict.filterAll);
  const [activeView, setActiveView] = useState<WorkView>("grid");
  const imageBackedProjects = useMemo(() => projects.filter(hasCoverImage), [projects]);

  const workTypes = useMemo(() => {
    const unique = new Set<string>();
    imageBackedProjects.forEach((project) => {
      unique.add(normalizeWorkType(project.workType));
    });
    return [dict.filterAll, ...Array.from(unique)];
  }, [dict.filterAll, imageBackedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeType === dict.filterAll) return imageBackedProjects;
    return imageBackedProjects.filter((project) => normalizeWorkType(project.workType) === activeType);
  }, [activeType, dict.filterAll, imageBackedProjects]);

  const groupedProjects = useMemo(() => {
    if (activeType !== dict.filterAll) return null;

    const groups = new Map<string, Partial<Project>[]>();
    for (const project of imageBackedProjects) {
      const type = normalizeWorkType(project.workType);
      if (!groups.has(type)) groups.set(type, []);
      groups.get(type)!.push(project);
    }
    return Array.from(groups.entries()).map(([type, items]) => ({ type, items }));
  }, [activeType, dict.filterAll, imageBackedProjects]);

  if (imageBackedProjects.length === 0) {
    return null;
  }

  return (
    <section className="pb-[14vh]">
      {/* Filters + view toggle — dark-ground controls */}
      <div className="site-container-xwide mb-16 flex w-full flex-col gap-6 md:mb-20 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-x-5 gap-y-3 overflow-x-auto pb-1 text-[clamp(0.95rem,1.6vw,1.15rem)] font-normal leading-none md:flex-wrap md:overflow-visible md:pb-0">
          {workTypes.map((type, index) => (
            <span key={type} className="flex shrink-0 items-center gap-5">
              {index > 0 && <span className="text-white/20">·</span>}
              <button
                type="button"
                onClick={() => setActiveType(type)}
                aria-pressed={activeType === type}
                className={`transition-colors ${
                  activeType === type ? "text-white" : "text-white/35 hover:text-white/70"
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
            aria-pressed={activeView === "grid"}
            onClick={() => setActiveView("grid")}
            className={`flex items-center justify-center p-1 transition-colors hover:text-white ${
              activeView === "grid" ? "text-white" : "text-white/25"
            }`}
          >
            <LayoutGrid size={20} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="List view"
            aria-pressed={activeView === "list"}
            onClick={() => setActiveView("list")}
            className={`flex items-center justify-center p-1 transition-colors hover:text-white ${
              activeView === "list" ? "text-white" : "text-white/25"
            }`}
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="site-container-xwide">
        {activeView === "list" ? (
          activeType === dict.filterAll && groupedProjects ? (
            <div className="columns-1 gap-x-20 md:columns-2">
              {groupedProjects.map((group) => (
                <div key={group.type} className="mb-24 break-inside-avoid md:mb-28">
                  <h2 className="max-w-[14ch] text-[clamp(1.9rem,3.2vw,3rem)] font-semibold leading-[1.05] tracking-tight text-white">
                    {group.type}
                  </h2>
                  <ul className="mt-10">
                    {group.items.map((project) => {
                      const href = `/${lang}/${workPath(lang)}/${project.slug || ""}`;
                      return (
                        <li key={project._id || project.slug}>
                          <Link
                            href={href}
                            className="group flex items-center justify-between gap-6 border-b border-white/10 py-[15px] text-[14px] font-normal text-white/75 transition-colors hover:text-white"
                          >
                            {project.title}
                            <ArrowUpRight
                              size={14}
                              className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-white/60"
                            />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ProjectList
              projects={filteredProjects}
              lang={lang}
              labels={dict.listLabels}
              variant="dark"
            />
          )
        ) : (
          /* Project cards — image-led showcase on dark ground */
          <div className="columns-1 gap-x-20 md:columns-2">
            {filteredProjects.map((project, index) => {
              const imageSrc = urlForImage(project.coverImage)?.width(1200).height(750).fit("crop").url();
              if (!imageSrc) return null;

              const href = `/${lang}/${workPath(lang)}/${project.slug || ""}`;

              return (
                <article key={project._id || project.slug || index} className="mb-24 break-inside-avoid md:mb-28">
                  <Link href={href} className="group block" data-cursor="view">
                    <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
                      <Image
                        src={imageSrc}
                        alt={project.coverImage?.alt || project.title || ""}
                        fill
                        sizes="(min-width: 768px) 46vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        priority={index < 2}
                      />
                    </div>
                  </Link>

                  <h2 className="mt-8 max-w-[18ch] text-[clamp(1.6rem,2.8vw,2.4rem)] font-semibold leading-[1.08] tracking-tight text-white">
                    <Link href={href} className="transition-colors hover:text-white/80">
                      {project.title || "-"}
                    </Link>
                  </h2>

                  {project.excerpt ? (
                    <p className="mt-5 max-w-[46ch] text-[15px] font-normal leading-relaxed text-white/55">
                      {project.excerpt}
                    </p>
                  ) : null}

                  <ul className="mt-8">
                    {project.workType ? (
                      <li className="flex items-center gap-3 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/50">
                        <BriefcaseBusiness size={14} strokeWidth={1.5} className="shrink-0 text-white/35" aria-hidden="true" />
                        {project.workType}
                      </li>
                    ) : null}
                    {project.industry ? (
                      <li className="flex items-center gap-3 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/50">
                        <Factory size={14} strokeWidth={1.5} className="shrink-0 text-white/35" aria-hidden="true" />
                        {project.industry}
                      </li>
                    ) : null}
                    {project.year ? (
                      <li className="flex items-center gap-3 border-b border-white/10 py-[13px] text-[14px] font-normal text-white/50">
                        <Calendar size={14} strokeWidth={1.5} className="shrink-0 text-white/35" aria-hidden="true" />
                        {project.year}
                      </li>
                    ) : null}
                  </ul>

                  <Link
                    href={href}
                    className="mt-9 inline-flex items-center gap-3 rounded-full bg-white/[0.08] py-[13px] pl-6 pr-4 text-[13px] font-normal text-white/85 transition-colors hover:bg-white/[0.16] hover:text-white"
                  >
                    {dict.projectMore}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
