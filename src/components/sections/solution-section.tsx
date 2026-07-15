"use client";

import { motion, type Variants } from "motion/react";
import { AnimatedTitle } from "@/components/ui/animated-title";
import { sectionTitleClass } from "@/components/ui/section-title-style";

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
      className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-32"
    >
      <div className="site-container-wide">
        <div className="sticky top-[71px] z-10 bg-gradient-to-b from-[#F6F5F4] from-75% to-transparent pt-4 pb-16 md:relative md:top-auto md:z-auto md:bg-none md:pt-0 md:pb-0 mb-10 sm:mb-14 w-full">
          <div className="mb-4 h-px w-full bg-black/10 md:mb-10" />

          <h2
            id="solution-section-heading"
            className={`${sectionTitleClass} text-balance`}
          >
            <AnimatedTitle
              as="span"
              text={dict.headline_1}
              className="block text-black/45"
              splitBy="word"
            />
            <AnimatedTitle
              as="span"
              text={dict.headline_2}
              className="block"
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
              className="group relative flex min-h-[240px] flex-col justify-between overflow-hidden rounded-2xl border border-black/[0.02] bg-[#EDEDED]/50 px-5 py-7 transition-all duration-500 ease-out hover:bg-[#E3EAE6]/70 xs:px-8 sm:min-h-[280px] md:min-h-[340px] md:px-10 md:py-10"
              variants={itemVariants}
            >
              <div className="space-y-4">
                <div className="text-sm font-normal leading-none text-black/35">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="max-w-[18ch] text-xl font-semibold leading-tight tracking-[-0.02em] text-neutral-900 transition-colors duration-300 group-hover:text-[#1D7A65] sm:text-2xl md:max-w-[14ch]">
                  {item.title}
                </h3>
              </div>
              <p className="mt-10 max-w-[42ch] text-sm font-normal leading-[1.6] tracking-[-0.015em] text-black/50">
                {item.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
