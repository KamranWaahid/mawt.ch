"use client";

import { AnimatedTitle } from "@/components/ui/animated-title";
import Link from "next/link";
import { motion } from "motion/react";

interface SubpageHeroProps {
  /** Small eyebrow label above the title */
  eyebrow?: string;
  /** Main large title — displayed in Instrument Serif */
  title: string;
  /** Optional secondary title line displayed in muted color */
  subtitle?: string;
  /** Optional body description below the titles */
  description?: string;
  /** Optional primary CTA button */
  cta?: {
    label: string;
    href: string;
  };
  /** Suppress the default gradient (e.g. when the parent provides its own background) */
  noGradient?: boolean;
  /** Legacy prop — maps to eyebrow for backward compat */
  badge?: string;
}

/**
 * InternalPageHero — the master hero layout for all non-home pages.
 */
export function SubpageHero({
  eyebrow,
  title,
  subtitle,
  description,
  cta,
  noGradient = false,
  badge,
}: SubpageHeroProps) {
  const eyebrowLabel = eyebrow ?? badge;

  return (
    <section className="relative isolate overflow-hidden pt-[140px] pb-14 sm:pt-[160px] md:min-h-[72vh] md:pt-[180px] lg:min-h-[76vh]">
      {!noGradient && (
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #BFFFE6 0%, #DFFFF4 30%, #F6F5F4 74%, transparent 100%)",
          }}
        />
      )}
      {!noGradient && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.36]"
          style={{
            background:
              "linear-gradient(180deg, rgba(117,218,180,0.18) 0%, transparent 42%, rgba(255,255,255,0.72) 100%)",
          }}
        />
      )}

      <div className="site-container-wide relative z-10 flex min-h-[calc(72vh-220px)] flex-col justify-center md:justify-end md:pb-[12vh]">
        <div className="max-w-[720px]">
          {eyebrowLabel && <span className="sr-only">{eyebrowLabel}</span>}

          <AnimatedTitle
            as="h1"
            text={title}
            className="max-w-[720px] font-serif text-[clamp(2.75rem,7.1vw,4.95rem)] font-normal leading-[0.9] tracking-normal text-[#062833]"
            splitBy="word"
            eager={true}
          />

          {subtitle && (
            <AnimatedTitle
              as="p"
              text={subtitle}
              className="mt-1 max-w-[720px] font-serif text-[clamp(2.25rem,6.1vw,4.3rem)] font-normal leading-[0.92] tracking-normal text-[#A7ADB7]"
              splitBy="word"
              delay={0.12}
              eager={true}
            />
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-[54ch] text-base-fluid font-normal leading-relaxed text-black/48"
            >
              {description}
            </motion.p>
          )}

          {cta && (
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8"
            >
              <Link
                href={cta.href}
                className="inline-flex h-11 items-center rounded-full border border-black/10 bg-white/55 px-5 text-sm font-normal text-black backdrop-blur-md transition-colors duration-300 hover:border-black/20 hover:bg-white"
              >
                {cta.label}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
