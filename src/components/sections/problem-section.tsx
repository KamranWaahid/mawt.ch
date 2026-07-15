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
  
  const progressValue = useMotionValue(0);
  const [hasRevealed, setHasRevealed] = useState(false);
  const hasRevealedRef = useRef(false);
  const lenisRef = useRef<any>(null);

  const updateScrollProgress = useCallback(() => {
    if (!containerRef.current || typeof window === "undefined") return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const lenis = lenisRef.current;
    
    // If text was fully revealed, reset back to false only when it has completely passed the screen going upwards (rect.top >= window.innerHeight)
    if (hasRevealedRef.current && rect.top >= window.innerHeight) {
      hasRevealedRef.current = false;
      containerRef.current.style.height = "400vh"; // Sync DOM update
      setHasRevealed(false);
    }
    
    // Recalculate rect after potential height change
    const currentRect = containerRef.current.getBoundingClientRect();
    const scrollDistance = currentRect.height - window.innerHeight;
    
    if (scrollDistance <= 0) {
      progressValue.set(1);
      return;
    }

    const rawProgress = (0 - currentRect.top) / scrollDistance;
    const clampedProgress = Math.max(0, Math.min(1, rawProgress));
    
    progressValue.set(clampedProgress);

    // Trigger reveal lock only when progress reaches 99% (completely past and faded out)
    if (clampedProgress >= 0.99 && !hasRevealedRef.current) {
      hasRevealedRef.current = true;
      if (lenis) {
        const scrollAdjustment = 3 * window.innerHeight;
        const targetScroll = lenis.scroll - scrollAdjustment;
        
        // 1. Instantly change DOM height before browser paints
        containerRef.current.style.height = "100vh";
        
        // 2. Instantly change native scroll to match
        window.scrollTo({ top: targetScroll, behavior: "instant" });
        
        // 3. Sync Lenis to the new scroll position
        lenis.scrollTo(targetScroll, { immediate: true });
        
        // 4. Update React state for subsequent renders
        setHasRevealed(true);
      }
    }
  }, [progressValue]);

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
