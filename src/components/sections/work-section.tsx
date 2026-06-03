"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import type { Project } from "@/lib/types";
import { urlForImage } from "@/lib/sanity.image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  },
};

export function WorkSection({ dict, projects }: { dict: any; projects: Project[] }) {
  const params = useParams();
  const currentLang = (params?.lang as string) || "en";

  return (
    <section id="work" className="bg-bg-light py-[120px]">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        <SectionReveal>
          {/* Header Badge */}
          <div className="mb-12 flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
            <div className="rounded-full border border-black/10 bg-black/[0.03] px-3.5 py-1.5 backdrop-blur-sm">
              <span className="text-[10px] font-normal tracking-[0.2em] text-black/80">{dict.badge}</span>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-20">
            <h2 className="text-3xl font-normal tracking-tight text-black sm:text-4xl md:text-[44px] lg:leading-[1.1]">
              {dict.headline}
            </h2>
          </div>

          {/* Projects Grid */}
          <motion.div 
            className="grid gap-4 md:gap-6 bg-transparent lg:grid-cols-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {projects.map((project, idx) => {
              const isWide = idx % 3 === 2;
              return (
                <motion.div key={project._id} variants={itemVariants} className={`group relative bg-white overflow-hidden ${isWide ? "lg:col-span-2" : ""}`}>
                  <Link href={`/${currentLang}/${currentLang === "fr" ? "projets" : "projects"}/${project.slug}`} className={`flex h-full ${isWide ? "flex-col lg:flex-row min-h-[480px] md:min-h-[520px]" : "flex-col"}`}>
                    
                    {/* Text Container */}
                    <div className={`p-8 md:p-10 ${isWide ? "flex flex-col justify-between w-full lg:w-1/2 pb-8 md:pb-10" : "flex items-start justify-between w-full pb-12"}`}>
                      <div className={`${isWide ? "space-y-4 max-w-[90%]" : "max-w-[85%] space-y-3"}`}>
                        <span className="block text-sm font-normal text-neutral-600">
                          {project.tags?.[0] || "Case Study"}
                        </span>
                        <h3 className={`${isWide ? "text-3xl md:text-[32px] leading-[1.1]" : "text-2xl md:text-[28px] leading-[1.15]"} font-normal text-black tracking-tight`}>
                          {project.title}
                        </h3>
                      </div>
                      
                      <div className={`flex shrink-0 items-center justify-center rounded-full bg-black text-white transition-transform duration-300 group-hover:scale-110 ${isWide ? "mt-16 h-12 w-12" : "h-10 w-10"}`}>
                        <ArrowRight size={isWide ? 20 : 18} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Image Container */}
                    <div className={`relative w-full overflow-hidden bg-neutral-100 ${isWide ? "aspect-video lg:aspect-auto lg:w-1/2" : "aspect-[4/3]"}`}>
                      {project.coverImage ? (
                        <Image
                          src={urlForImage(project.coverImage)?.width(isWide ? 1600 : 1200).url() || ""}
                          alt={project.title}
                          fill
                          sizes={isWide ? "100vw" : "(max-width: 1024px) 100vw, 50vw"}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : null}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </SectionReveal>
      </div>
    </section>
  );
}
