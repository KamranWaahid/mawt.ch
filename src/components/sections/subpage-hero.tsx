"use client";

import { motion } from "motion/react";

interface SubpageHeroProps {
  badge: string;
  title: string;
  subtitle?: string;
}

export function SubpageHero({ badge, title, subtitle }: SubpageHeroProps) {
  return (
    <section className="bg-white px-6 pt-40 pb-20 sm:px-8 md:px-10 lg:px-12 border-b border-black/5">
      <div className="max-w-[1440px] mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-[15px] font-normal tracking-tight text-neutral-500 mb-6"
        >
          {badge}
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight text-black max-w-4xl leading-[1.1] overflow-hidden"
        >
          {title.split(" ").map((word, i) => (
            <motion.span
              key={i}
              className="inline-block mr-[0.2em]"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.1 + i * 0.05,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl font-normal text-neutral-600 max-w-3xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
