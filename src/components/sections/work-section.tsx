"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleClass } from "@/components/ui/section-title-style";
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
  const workPath = currentLang === "fr" ? "projets" : "work";
  const displayProjects = (projects?.length ? projects : [])
    .map((project) => {
      const coverUrl = project.coverImage
        ? urlForImage(project.coverImage)?.width(1600).height(900).url()
        : null;

      return coverUrl ? { ...project, coverUrl } : null;
    })
    .filter((project): project is Project & { coverUrl: string } => Boolean(project))
    .slice(0, 3);

  if (!displayProjects.length) return null;

  return (
    <section
      id="work"
      className="py-12 sm:py-14 md:py-18 lg:py-24"
    >
      <div className="site-container-wide">
        <div className="mb-8 flex flex-col items-start gap-5 sm:mb-10 sm:flex-row sm:justify-between sm:gap-6">
          <AnimatedTitle
            as="h2"
            text={dict.headline}
            className={sectionTitleClass}
            splitBy="word"
          />
          <Link
            href={`/${currentLang}/${workPath}`}
            className="inline-flex shrink-0 items-center gap-2 bg-white/80 px-3.5 py-2 text-base font-normal leading-none tracking-tight text-black/45 transition-colors duration-300 hover:text-black sm:px-4 sm:py-1.5 sm:text-[clamp(1.1rem,2vw,1.85rem)]"
          >
            {dict.seeAll}
            <ArrowRight className="h-[1em] w-[1em]" strokeWidth={1.8} />
          </Link>
        </div>

        <div className="mb-8 h-px w-full bg-black/10 sm:mb-12" />

        <motion.div
          className="space-y-10 md:space-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayProjects.map((project) => (
              <motion.article key={project._id} variants={itemVariants}>
                <Link
                  href={`/${currentLang}/${workPath}/${project.slug}`}
                  className="group grid gap-5 md:grid-cols-[0.85fr_1.9fr] md:gap-12 lg:gap-16"
                >
                  <div className="flex flex-col justify-between gap-6 md:min-h-[280px] md:py-2">
                    <div>
                      <h3 className="text-[clamp(1.35rem,6vw,2rem)] font-normal leading-[1.1] tracking-tight text-black">
                        {project.title}
                      </h3>
                      <p className="mt-4 max-w-[38ch] text-[15px] font-normal leading-[1.45] tracking-tight text-black/45 md:mt-5 md:text-[17px]">
                        {project.excerpt}
                      </p>
                    </div>

                    {project.tags?.length ? (
                      <ul className="flex flex-wrap gap-2.5 sm:gap-4">
                        {project.tags.slice(0, 2).map((tag) => (
                          <li
                            key={tag}
                            className="rounded-lg bg-white/85 px-3.5 py-2 text-[12px] font-normal leading-none text-black sm:px-4 sm:text-[13px]"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="relative aspect-[1.45/1] overflow-hidden rounded-[16px] bg-[#F2F2F2] sm:aspect-[1.86/1] md:rounded-[20px]">
                    <Image
                      src={project.coverUrl}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 64vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                    />
                  </div>
                </Link>
              </motion.article>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
