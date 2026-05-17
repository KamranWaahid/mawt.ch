"use client";

import { motion, type Variants } from "motion/react";

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

function Motif({ index }: { index: number }) {
  // Variations for each motif based on the index to match the reference's diversity
  const configurations = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8], // All solid
    [0, 1, 3, 4, 6, 7], // Some missing
    [0, 2, 4, 6, 8], // Checkerboard
    [1, 3, 4, 5, 7], // Cross pattern
  ];

  const config = configurations[index % configurations.length];

  return (
    <div aria-hidden className="grid h-10 w-10 shrink-0 grid-cols-3 gap-[3px] pt-1.5">
      {Array.from({ length: 9 }).map((_, i) => {
        const isActive = config.includes(i);
        const isOutlined = !isActive && i % 2 === 0;
        const isBlurred = i === 4 || i === 8;

        return (
          <div
            key={i}
            className={`
              h-2 w-2 rotate-45 border transition-all duration-700
              ${isActive ? "bg-white border-white" : "bg-transparent border-white/20"}
              ${isOutlined ? "opacity-40" : ""}
              ${isBlurred && !isActive ? "blur-[1px] opacity-20" : ""}
            `}
          />
        );
      })}
    </div>
  );
}

export function SolutionSection({ dict }: { dict: any }) {
  return (
    <section
      aria-labelledby="solution-section-heading"
      className="relative isolate overflow-hidden bg-bg-dark py-[120px]"
    >
      {/* Premium Glow Background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute right-0 bottom-0 h-[600px] w-[600px] translate-y-1/4 translate-x-1/4 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute top-0 left-0 h-[500px] w-[500px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-600/5 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20">
        {/* Header Section */}
        <motion.div
          className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2.5fr]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="text-[10px] font-normal tracking-[0.2em] text-white/90">{dict.badge}</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h2
              id="solution-section-heading"
              className="text-balance text-3xl font-normal tracking-tight text-white sm:text-4xl md:text-[44px] lg:leading-[1.1]"
            >
              <span className="opacity-40">{dict.headline_1}</span>
              <br />
              <span>{dict.headline_2}</span>
            </h2>
          </motion.div>
        </motion.div>

        {/* Subtle Divider */}
        <div className="mb-16 h-px w-full bg-white/10" />

        {/* Solution Grid */}
        <motion.div 
          className="grid gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {dict.items.map((item: any, index: number) => (
            <motion.article
              key={item.title}
              className="flex items-start gap-6 group"
              variants={itemVariants}
            >
              <div className="pt-1 transition-colors duration-300 group-hover:text-brand-teal text-white/20">
                <Motif index={index} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-normal tracking-tight text-white group-hover:text-brand-teal transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="max-w-[40ch] text-base font-normal leading-relaxed text-neutral-400">
                  {item.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
