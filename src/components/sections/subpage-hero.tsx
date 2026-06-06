"use client";

import { motion } from "motion/react";

interface SubpageHeroProps {
  badge: string;
  title: string;
  bgImage?: string;
  bgTransparent?: boolean;
}

export function SubpageHero({ badge, title, bgImage, bgTransparent }: SubpageHeroProps) {
  return (
    <section 
      className={`relative px-6 pb-20 sm:px-8 md:px-10 lg:px-12 overflow-hidden ${
        bgTransparent ? "bg-transparent" : "bg-white border-b border-black/5"
      } ${bgTransparent ? "pt-12 md:pt-16" : "pt-40"}`}
      style={bgImage ? {
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      } : undefined}
    >
      {bgImage && (
        <div className="absolute inset-0 bg-white/30 pointer-events-none" />
      )}
      <div className="relative max-w-[1440px] mx-auto z-10">
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
      </div>
    </section>
  );
}
