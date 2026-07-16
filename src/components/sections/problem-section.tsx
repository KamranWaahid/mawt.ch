"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useTransform, MotionValue, useMotionValue } from "motion/react";
import { useLenis } from "lenis/react";

type ProblemCopy = {
  story?: string[];
};

const ScrubWord = ({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) => {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block will-change-[opacity]">
      {children}
    </motion.span>
  );
};

export function ProblemSection({ dict }: { dict: ProblemCopy }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Two progress values from the same scroll position:
  // - rawProgress follows the scroll BOTH ways — it drives the end-of-section
  //   block fade, which must play in reverse so the text comes back when the
  //   user scrolls up into the section.
  // - wordProgress is a RATCHET: it only ever increases. Once a word has
  //   turned black it stays black — scrolling back up never greys the text
  //   out again. It resets only on a page load.
  const rawProgress = useMotionValue(0);
  const wordProgress = useMotionValue(0);

  const updateScrollProgress = useCallback(() => {
    if (!containerRef.current || typeof window === "undefined") return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;
    if (scrollDistance <= 0) {
      rawProgress.set(1);
      wordProgress.set(1);
      return;
    }

    const clamped = Math.max(0, Math.min(1, (0 - rect.top) / scrollDistance));
    rawProgress.set(clamped);
    if (clamped > wordProgress.get()) {
      wordProgress.set(clamped);
    }
  }, [rawProgress, wordProgress]);

  useLenis(() => {
    updateScrollProgress();
  });

  useEffect(() => {
    updateScrollProgress();
    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", updateScrollProgress, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", updateScrollProgress);
    };
  }, [updateScrollProgress]);

  // The entire text block fades out and moves up at the very end of the scroll
  // (last 15%) — driven by rawProgress so it reverses naturally on scroll-up.
  const blockOpacity = useTransform(rawProgress, [0.85, 1], [1, 0]);
  const blockY = useTransform(rawProgress, [0.85, 1], [0, -40]);

  if (!dict.story || !Array.isArray(dict.story)) {
    return null;
  }

  const text = dict.story.join(" ");
  const words = text.split(" ");

  return (
    <div ref={containerRef} className="relative h-[400vh] w-full">
      <section className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div
          className="site-container relative z-10 w-full"
          style={{ opacity: blockOpacity, y: blockY }}
        >
          <h2 className="max-w-[1280px] select-text font-serif text-[clamp(1.85rem,3.15vw,3rem)] font-normal leading-[1.04] tracking-normal text-neutral-900">
            {words.map((word, i) => {
              // The text scrub runs from 0.05 to 0.8
              const start = 0.05 + (i / words.length) * 0.75;
              const end = start + (0.75 / words.length);

              return (
                <span key={i} className="inline">
                  <ScrubWord progress={wordProgress} range={[start, end]}>
                    {word}
                  </ScrubWord>
                  {i < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </h2>
        </motion.div>
      </section>
    </div>
  );
}
