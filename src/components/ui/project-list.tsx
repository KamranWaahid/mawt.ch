"use client";

import { motion } from "motion/react";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { Menu, LayoutGrid } from "lucide-react";

interface ProjectListProps {
  projects: any[];
  lang: Locale;
}

export function ProjectList({ projects, lang }: ProjectListProps) {
  return (
    <div className="w-full">
      {/* Header Row */}
      <div className="flex justify-between items-end mb-16">
        <h1 className="text-[28px] font-normal tracking-tight text-black">
          {lang === "en" ? "Case Studies" : "Études de cas"}
        </h1>
        <div className="flex items-center gap-3">
          <button className="p-1.5 bg-black text-white hover:bg-black/90 transition-colors flex items-center justify-center rounded-[2px]">
            <Menu size={18} strokeWidth={2.5} />
          </button>
          <button className="p-1.5 text-neutral-400 hover:text-black transition-colors flex items-center justify-center rounded-[2px]">
            <LayoutGrid size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 pb-8 border-b border-black/5 text-[11px] uppercase tracking-widest text-neutral-400">
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
              href={`/${lang}/projects/${project.slug}`}
              className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-4 py-6 md:py-8 border-b border-black/5 group hover:bg-black/[0.02] transition-colors items-start md:items-center"
            >
              <div className="col-span-3 text-base md:text-[14px] font-normal text-black group-hover:pl-2 transition-all duration-300">
                {project.title}
              </div>
              
              {/* Mobile Meta (hidden on desktop) */}
              <div className="md:hidden flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                <span>{project.workType || "—"}</span>
                <span className="text-neutral-300">•</span>
                <span>{project.industry || "—"}</span>
                <span className="text-neutral-300">•</span>
                <span>{project.year || "—"}</span>
              </div>

              {/* Desktop Columns (hidden on mobile) */}
              <div className="hidden md:block col-span-4 text-[14px] font-normal text-neutral-600">
                {project.workType || "—"}
              </div>
              <div className="hidden md:block col-span-3 text-[14px] font-normal text-neutral-600">
                {project.industry || "—"}
              </div>
              <div className="hidden md:block col-span-2 text-[14px] font-normal text-neutral-600">
                {project.year || "—"}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
