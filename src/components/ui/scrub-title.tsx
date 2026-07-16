"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";

/**
 * Scroll-scrubbed word reveal — the site-wide "grey turns black as you
 * scroll" effect (same feel as ProblemSection's ScrubWord), but UNPINNED:
 * no sticky track, no scroll hijacking, native scrolling only. Each word
 * fades from 15% to full opacity as the title crosses the viewport, driven
 * by scroll position both ways.
 */

function ScrubWord({
  children,
  progress,
  range,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block will-change-[opacity]">
      {children}
    </motion.span>
  );
}

export function ScrubTitle({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: "h2" | "h3" | "p";
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();
  // Scrub runs while the title travels from 85% viewport height up to 40% —
  // fully revealed well before it reaches the middle of the screen.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.4"],
  });

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {shouldReduceMotion
        ? text
        : words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <span key={`${word}-${i}`} className="inline">
                <ScrubWord progress={scrollYProgress} range={[start, end]}>
                  {word}
                </ScrubWord>
                {i < words.length - 1 ? " " : null}
              </span>
            );
          })}
    </Tag>
  );
}
