"use client";

import { motion } from "motion/react";
import { ArrowUpRight, BriefcaseBusiness, Calendar, Factory } from "lucide-react";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import type { Project as ProjectType } from "@/lib/types";

type Project = Partial<ProjectType> & {
  _id?: string;
  slug?: string;
  title?: string;
  workType?: string;
  industry?: string;
  year?: number;
};

type ListLabels = {
  client: string;
  workType: string;
  industry: string;
  date: string;
};

interface ProjectListProps {
  projects: Project[];
  lang: Locale;
  labels: ListLabels;
  variant?: "light" | "dark";
}

function workPath(lang: Locale) {
  return lang === "fr" ? "projets" : "work";
}

export function ProjectList({ projects, lang, labels, variant = "light" }: ProjectListProps) {
  const isDark = variant === "dark";

  return (
    <div className="w-full">
      <div
        className={`hidden md:grid grid-cols-12 gap-4 pb-6 border-b text-xs-fluid font-medium ${
          isDark ? "border-white/10 text-white/40" : "border-black/10 text-neutral-400"
        }`}
      >
        <div className="col-span-3">{labels.client}</div>
        <div className="col-span-4">{labels.workType}</div>
        <div className="col-span-3">{labels.industry}</div>
        <div className="col-span-2">{labels.date}</div>
      </div>

      <div className="flex flex-col">
        {projects.map((project, index) => (
          <motion.div
            key={project._id || project.slug || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.03 }}
          >
            <Link
              href={`/${lang}/${workPath(lang)}/${project.slug || ""}`}
              className={`group flex flex-col gap-2 border-b py-4 transition-colors md:grid md:grid-cols-12 md:items-center md:gap-4 md:px-3 md:py-5 ${
                isDark
                  ? "border-white/10 hover:bg-white/[0.03]"
                  : "border-black/[0.06] hover:bg-white/45"
              }`}
            >
              <div
                className={`col-span-3 flex items-center justify-between gap-4 text-sm-fluid font-medium transition-all duration-300 md:group-hover:pl-2 ${
                  isDark ? "text-white/85 group-hover:text-white" : "text-black"
                }`}
              >
                <span>{project.title || "—"}</span>
                {isDark ? (
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-white/60 md:hidden"
                  />
                ) : null}
              </div>

              <div
                className={`md:hidden flex flex-wrap items-center gap-x-2 gap-y-1 text-xs-fluid ${
                  isDark ? "text-white/45" : "text-neutral-500"
                }`}
              >
                <span>{project.workType || "—"}</span>
                <span className={isDark ? "text-white/20" : "text-neutral-300"}>•</span>
                <span>{project.industry || "—"}</span>
                <span className={isDark ? "text-white/20" : "text-neutral-300"}>•</span>
                <span>{project.year || "—"}</span>
              </div>

              <div
                className={`hidden md:flex col-span-4 items-center gap-3 text-sm-fluid ${
                  isDark ? "text-white/50" : "text-neutral-500"
                }`}
              >
                {isDark ? <BriefcaseBusiness size={14} strokeWidth={1.5} className="shrink-0 text-white/30" aria-hidden="true" /> : null}
                {project.workType || "—"}
              </div>
              <div
                className={`hidden md:flex col-span-3 items-center gap-3 text-sm-fluid ${
                  isDark ? "text-white/50" : "text-neutral-500"
                }`}
              >
                {isDark ? <Factory size={14} strokeWidth={1.5} className="shrink-0 text-white/30" aria-hidden="true" /> : null}
                {project.industry || "—"}
              </div>
              <div
                className={`hidden md:flex col-span-2 items-center justify-between text-sm-fluid ${
                  isDark ? "text-white/50" : "text-neutral-500"
                }`}
              >
                <span className="inline-flex items-center gap-3">
                  {isDark ? <Calendar size={14} strokeWidth={1.5} className="shrink-0 text-white/30" aria-hidden="true" /> : null}
                  {project.year || "—"}
                </span>
                {isDark ? (
                  <ArrowUpRight
                    size={14}
                    className="shrink-0 text-white/0 transition-all duration-300 group-hover:text-white/60"
                  />
                ) : null}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
