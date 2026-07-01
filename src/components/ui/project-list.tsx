"use client";

import { motion } from "motion/react";
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

interface ProjectListProps {
  projects: Project[];
  lang: Locale;
}

export function ProjectList({ projects, lang }: ProjectListProps) {
  return (
    <div className="w-full">


      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 pb-6 border-b border-black/10 text-xs-fluid font-medium text-neutral-400">
        <div className="col-span-3">Client</div>
        <div className="col-span-4">Work Type</div>
        <div className="col-span-3">Industry</div>
        <div className="col-span-2">Date</div>
      </div>

      {/* Table Body */}
      <div className="flex flex-col">
        {projects.map((project, index) => (
          <motion.div
            key={project._id || project.slug || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.03 }}
          >
            <Link
              href={`/${lang}/${lang === "fr" ? "projets" : "work"}/${project.slug || ""}`}
              className="group flex flex-col gap-2 border-b border-black/[0.06] py-4 transition-colors hover:bg-white/45 md:grid md:grid-cols-12 md:items-center md:gap-4 md:px-3 md:py-5"
            >
              <div className="col-span-3 text-sm-fluid font-medium text-black group-hover:pl-2 transition-all duration-300">
                {project.title || "—"}
              </div>
              
              {/* Mobile Meta (hidden on desktop) */}
              <div className="md:hidden flex flex-wrap items-center gap-x-2 gap-y-1 text-xs-fluid text-neutral-500">
                <span>{project.workType || "—"}</span>
                <span className="text-neutral-300">•</span>
                <span>{project.industry || "—"}</span>
                <span className="text-neutral-300">•</span>
                <span>{project.year || "—"}</span>
              </div>

              {/* Desktop Columns (hidden on mobile) */}
              <div className="hidden md:block col-span-4 text-sm-fluid text-neutral-500">
                {project.workType || "—"}
              </div>
              <div className="hidden md:block col-span-3 text-sm-fluid text-neutral-500">
                {project.industry || "—"}
              </div>
              <div className="hidden md:block col-span-2 text-sm-fluid text-neutral-500">
                {project.year || "—"}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
