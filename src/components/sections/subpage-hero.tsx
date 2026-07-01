"use client";

import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";

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

function HeroWord({
  word,
  index,
  total,
  progress,
  muted = false,
}: {
  word: string;
  index: number;
  total: number;
  progress: number;
  muted?: boolean;
}) {
  const start = 0.08 + (index / Math.max(1, total)) * 0.72;
  const end = Math.min(0.92, start + 0.18);
  const localProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  const grey = [167, 173, 183];
  const black = [6, 40, 51];
  const color = muted
    ? `rgb(${grey.map((channel, i) => Math.round(channel + (black[i] - channel) * localProgress)).join(", ")})`
    : "#062833";

  return (
    <span className="inline">
      <span style={{ color }} className="inline-block will-change-[color]">
        {word}
      </span>{" "}
    </span>
  );
}

function ScrollHeroTitle({
  title,
  subtitle,
  progress,
}: {
  title: string;
  subtitle?: string;
  progress: number;
}) {
  const titleWords = title.split(" ");
  const subtitleWords = subtitle?.split(" ") ?? [];
  const total = titleWords.length + subtitleWords.length;

  return (
    <h1 className="max-w-[1180px] font-serif text-[clamp(2.55rem,6vw,4.45rem)] font-normal leading-[0.94] tracking-normal text-[#062833] md:max-w-[1240px]">
      <span className="block">
        {titleWords.map((word, index) => (
          <HeroWord key={`title-${word}-${index}`} word={word} index={index} total={total} progress={progress} />
        ))}
      </span>
      {subtitle ? (
        <span className="mt-1 block">
          {subtitleWords.map((word, index) => (
            <HeroWord
              key={`subtitle-${word}-${index}`}
              word={word}
              index={titleWords.length + index}
              total={total}
              progress={progress}
              muted
            />
          ))}
        </span>
      ) : null}
    </h1>
  );
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
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const eyebrowLabel = eyebrow ?? badge;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  useMotionValueEvent(scrollYProgress, "change", setScrollProgress);

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden pt-[132px] pb-14 sm:pt-[150px] md:min-h-[72vh] md:pt-[170px] lg:min-h-[76vh]">
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
        <div className="max-w-[1240px]">
          {eyebrowLabel && <span className="sr-only">{eyebrowLabel}</span>}

          <ScrollHeroTitle title={title} subtitle={subtitle} progress={scrollProgress} />

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
