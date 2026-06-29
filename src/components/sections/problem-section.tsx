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
  range 
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
  
  // We use a manual scroll calculation using getBoundingClientRect.
  // Framer Motion's useScroll can sometimes fail to reach 1.0 or lose sync 
  // on complex pages with Lenis, pinned sections, or dynamic heights.
  // Manual DOM measurement guarantees pixel-perfect scroll scrubbing.
  const progressValue = useMotionValue(0);

  const updateScrollProgress = useCallback(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // We want to scrub from when the top of the container hits the top of viewport (0)
    // to when the bottom of the container hits the bottom of the viewport (1).
    const scrollDistance = rect.height - window.innerHeight;
    
    if (scrollDistance <= 0) {
      progressValue.set(1);
      return;
    }

    const rawProgress = (0 - rect.top) / scrollDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    
    progressValue.set(clampedProgress);
  }, [progressValue]);

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

  if (!dict.story || !Array.isArray(dict.story)) {
    return null;
  }

  const text = dict.story.join(" ");
  const words = text.split(" ");

  // The entire text block fades out and moves up at the very end of the scroll (last 15%)
  const blockOpacity = useTransform(progressValue, [0.85, 1], [1, 0]);
  const blockY = useTransform(progressValue, [0.85, 1], [0, -40]);

  return (
    <div ref={containerRef} style={{ height: "400vh" }} className="relative w-full">
      <section className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="site-container relative z-10 w-full"
          style={{ opacity: blockOpacity, y: blockY }}
        >
          {/* Using the exact typography classes from the Hero gradient statement for consistency */}
          <h2 className="max-w-[1040px] select-text font-serif text-[clamp(2.15rem,4vw,3.65rem)] font-normal leading-[1.02] tracking-normal text-neutral-900">
            {words.map((word, i) => {
              // The text scrub runs from 0.05 to 0.8
              const start = 0.05 + (i / words.length) * 0.75;
              const end = start + (0.75 / words.length);
              
              return (
                <span key={i} className="inline">
                  <ScrubWord progress={progressValue} range={[start, end]}>
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
