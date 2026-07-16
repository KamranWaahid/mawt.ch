"use client";

import { useRef, useEffect, useCallback, useState } from "react";
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

// The word scrub finishes at 0.8 of the pinned track (see ranges below).
const SCRUB_DONE = 0.795;

export function ProblemSection({ dict }: { dict: ProblemCopy }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Two progress values from the same scroll position:
  // - rawProgress follows the scroll BOTH ways (drives the end-of-track fade).
  // - wordProgress is a RATCHET: it only increases, so a word that turned
  //   black stays black. Resets only on a page load.
  const rawProgress = useMotionValue(0);
  const wordProgress = useMotionValue(0);

  // Once the scrub is complete, the 400vh pinned track collapses to a normal
  // 100vh section: no re-scrolling three screens of already-black text.
  const [collapsed, setCollapsed] = useState(false);
  const collapsedRef = useRef(false);
  const lenisRef = useRef<{ scrollTo: (t: number, o?: object) => void } | null>(null);

  const collapse = useCallback(() => {
    const container = containerRef.current;
    if (collapsedRef.current || !container) return;
    collapsedRef.current = true;

    const rect = container.getBoundingClientRect();
    const removed = rect.height - window.innerHeight;
    // Passed below the section → shift scroll up by the removed height so
    // nothing on screen moves. Still inside the pinned view → snap to the
    // section top: the sticky screen renders identically, so the swap from
    // "pinned at progress p" to "normal section" is invisible.
    const target =
      rect.bottom <= 0
        ? window.scrollY - removed
        : rect.top + window.scrollY;

    container.style.height = "100vh";
    window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
    lenisRef.current?.scrollTo(target, { immediate: true, force: true });
    wordProgress.set(1);
    setCollapsed(true);
  }, [wordProgress]);

  const updateScrollProgress = useCallback(() => {
    const container = containerRef.current;
    if (!container || collapsedRef.current || typeof window === "undefined") return;

    const rect = container.getBoundingClientRect();
    const scrollDistance = rect.height - window.innerHeight;
    if (scrollDistance <= 0) {
      rawProgress.set(1);
      wordProgress.set(1);
      return;
    }

    const clamped = Math.max(0, Math.min(1, (0 - rect.top) / scrollDistance));
    const previousRaw = rawProgress.get();
    rawProgress.set(clamped);
    if (clamped > wordProgress.get()) {
      wordProgress.set(clamped);
    }

    if (wordProgress.get() >= SCRUB_DONE) {
      if (rect.bottom <= 0) {
        // Fully scrolled past: collapse while nothing of it is on screen.
        collapse();
      } else if (clamped < previousRaw - 0.001) {
        // Scrolling back up after the reveal: switch to a normal section
        // right away instead of replaying the pinned track in reverse.
        collapse();
      }
    }
  }, [rawProgress, wordProgress, collapse]);

  useLenis((lenis) => {
    lenisRef.current = lenis;
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

  // End-of-track fade (last 15%), only meaningful while the track exists.
  const blockOpacityTransform = useTransform(rawProgress, [0.85, 1], [1, 0]);
  const blockYTransform = useTransform(rawProgress, [0.85, 1], [0, -40]);
  const blockOpacity = collapsed ? 1 : blockOpacityTransform;
  const blockY = collapsed ? 0 : blockYTransform;

  if (!dict.story || !Array.isArray(dict.story)) {
    return null;
  }

  const text = dict.story.join(" ");
  const words = text.split(" ");

  return (
    <div
      ref={containerRef}
      style={{ height: collapsed ? "100vh" : "400vh" }}
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
