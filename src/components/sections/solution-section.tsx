"use client";

import { motion, type Variants } from "motion/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function SolutionSection({ dict }: { dict: any }) {
  return (
    <section
      aria-labelledby="solution-section-heading"
      className="relative overflow-hidden bg-[#161616] py-12 sm:py-16 md:py-24 lg:py-32"
    >
      <div className="site-container-xwide">
        <div className="sticky top-[71px] z-10 mb-10 w-full bg-gradient-to-b from-[#161616] from-75% to-transparent pb-16 pt-4 sm:mb-14 md:relative md:top-auto md:z-auto md:bg-none md:pb-0 md:pt-0">
          <div className="mb-4 h-px w-full bg-white/10 md:mb-10" />

          <h2
            id="solution-section-heading"
            className={`${sectionTitleDarkClass} text-balance`}
          >
            <AnimatedTitle
              as="span"
              text={dict.headline_1}
              className="block text-white/40"
              splitBy="word"
            />
            <AnimatedTitle
              as="span"
              text={dict.headline_2}
              className="block text-white"
              splitBy="word"
              delay={0.12}
            />
          </h2>
        </div>

        <motion.div
          className="grid gap-3 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {dict.items.map((item: any, index: number) => (
            <motion.article
              key={item.title}
              className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-7 transition-colors duration-500 ease-out hover:bg-white/[0.06] xs:px-8 sm:min-h-[280px] md:min-h-[340px] md:px-10 md:py-10"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <div className="text-sm font-normal leading-none text-white/35">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="max-w-[18ch] text-xl font-semibold leading-tight tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-[#75DAB4] sm:text-2xl md:max-w-[14ch]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-10 max-w-[42ch] text-sm font-normal leading-[1.6] tracking-[-0.015em] text-white/50">
                {item.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
