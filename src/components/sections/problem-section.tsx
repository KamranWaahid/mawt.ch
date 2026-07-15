"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useTransform, MotionValue, useMotionValue, useMotionValueEvent } from "motion/react";
import { useLenis } from "lenis/react";

type ProblemCopy = {
  story?: string[];
};

const ScrubWord = ({ 
  children, 
  progress, 
  range,
  hasRevealed
}: { 
  children: React.ReactNode; 
  progress: MotionValue<number>; 
  range: [number, number];
  hasRevealed: boolean;
}) => {
  const opacityTransform = useTransform(progress, range, [0.15, 1]);
  const opacity = hasRevealed ? 1 : opacityTransform;
  return (
    <motion.span style={{ opacity }} className="inline-block will-change-[opacity]">
      {children}
    </motion.span>
  );
};

export function ProblemSection({ dict }: { dict: ProblemCopy }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We use a manual scroll calculation using getBoundingClientRect.
  // Manual DOM measurement guarantees pixel-perfect scroll scrubbing.
  const progressValue = useMotionValue(0);
  const [hasRevealed, setHasRevealed] = useState(false);
  const hasRevealedRef = useRef(false);
  const lenisRef = useRef<any>(null);

  const setRevealedState = useCallback((revealed: boolean) => {
    if (revealed === hasRevealedRef.current) return;
    
    hasRevealedRef.current = revealed;
    setHasRevealed(revealed);

    const lenis = lenisRef.current;
    if (typeof window === "undefined" || !lenis) return;

    const viewportHeight = window.innerHeight;
    const scrollAdjustment = 3 * viewportHeight;

    if (revealed) {
      // Transitioning 400vh -> 100vh: decrease scroll position by 300vh immediately to prevent jumps
      const targetScroll = lenis.scroll - scrollAdjustment;
      lenis.scrollTo(targetScroll, { immediate: true });
    }
  }, []);

  const updateScrollProgress = useCallback(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // If text was fully revealed, reset back to false if the user scrolls completely above it
    if (hasRevealedRef.current && rect.top >= 0) {
      setRevealedState(false);
    }
    
    const scrollDistance = rect.height - window.innerHeight;
    
    if (scrollDistance <= 0) {
      progressValue.set(1);
      return;
    }

    const rawProgress = (0 - rect.top) / scrollDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    
    progressValue.set(clampedProgress);

    // Trigger reveal lock once scroll progress is at or past 80%
    if (clampedProgress >= 0.80 && !hasRevealedRef.current) {
      setRevealedState(true);
    }
  }, [progressValue, setRevealedState]);

  useLenis((lenisInstance) => {
    lenisRef.current = lenisInstance;
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

  // The entire text block fades out and moves up at the very end of the scroll (last 15%)
  const blockOpacityTransform = useTransform(progressValue, [0.85, 1], [1, 0]);
  const blockYTransform = useTransform(progressValue, [0.85, 1], [0, -40]);

  const blockOpacity = hasRevealed ? 1 : blockOpacityTransform;
  const blockY = hasRevealed ? 0 : blockYTransform;

  if (!dict.story || !Array.isArray(dict.story)) {
    return null;
  }

  const text = dict.story.join(" ");
  const words = text.split(" ");

  return (
    <div 
      ref={containerRef} 
      style={{ height: hasRevealed ? "100vh" : "400vh" }} 
      className="relative w-full"
    >
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
                  <ScrubWord progress={progressValue} range={[start, end]} hasRevealed={hasRevealed}>
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
