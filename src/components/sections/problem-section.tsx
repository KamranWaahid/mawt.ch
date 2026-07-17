"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useTransform, MotionValue, useMotionValue } from "motion/react";
import { useLenis } from "lenis/react";
import { prefersNativeScroll } from "@/lib/scroll-environment";

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

  // Once the scrub is complete, the pinned track collapses to a normal
  // 100vh section: no re-scrolling three screens of already-black text.
  const [collapsed, setCollapsed] = useState(false);
  const [nativeScroll, setNativeScroll] = useState(false);
  const collapsedRef = useRef(false);
  const nativeScrollRef = useRef(false);
  const lenisRef = useRef<{
    scrollTo: (t: number, o?: object) => void;
    scroll?: number;
    targetScroll?: number;
    resize?: () => void;
  } | null>(null);

  useEffect(() => {
    const sync = () => {
      const next = prefersNativeScroll();
      nativeScrollRef.current = next;
      setNativeScroll(next);
    };
    sync();
    const media = window.matchMedia(
      "(hover: none) and (pointer: coarse), (prefers-reduced-motion: reduce)",
    );
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const collapse = useCallback((adjustScroll: "shift" | "snap" | "none") => {
    const container = containerRef.current;
    if (collapsedRef.current || !container) return;
    collapsedRef.current = true;

    const rect = container.getBoundingClientRect();
    const removed = rect.height - window.innerHeight;
    container.style.height = "100vh";
    if (adjustScroll !== "none") {
      // "shift": section fully above the viewport — keep what's on screen
      // still by absorbing the removed height. "snap": pinned view — the
      // sticky screen renders identically at the section top.
      const target =
        adjustScroll === "shift" ? window.scrollY - removed : rect.top + window.scrollY;
      const lenis = lenisRef.current;
      if (lenis) {
        // Never move the native scroll directly: Lenis's onNativeScroll
        // resyncs to it and derives a huge parasite velocity from the jump.
        // Snap through Lenis, then re-issue the un-consumed part of the
        // current gesture (targetScroll - scroll) as an animated target —
        // dropping it froze the scroll dead mid-flick, which was the hitch.
        const pending = (lenis.targetScroll ?? 0) - (lenis.scroll ?? 0);
        lenis.resize?.();
        lenis.scrollTo(target, { immediate: true, force: true });
        if (Math.abs(pending) > 1) {
          lenis.scrollTo(target + pending, { force: true });
        }
      } else if (adjustScroll === "shift") {
        // Native scroll: only adjust when the section is already off-screen.
        // Mid-gesture scrollTo kills iOS/Android momentum and feels like a jump.
        window.scrollTo({ top: target, behavior: "instant" as ScrollBehavior });
      }
    }
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
        // Fully scrolled past (section above the viewport): collapse while
        // nothing of it is on screen.
        collapse("shift");
      } else if (rect.top >= window.innerHeight) {
        // Section entirely below the viewport (exited upwards): collapsing
        // only moves content that is below the fold — no adjustment needed.
        collapse("none");
      } else if (!nativeScrollRef.current) {
        // Desktop + Lenis only: snap-collapse when reversing mid-track.
        // Native momentum scroll must never be interrupted mid-gesture.
        if (clamped < previousRaw - 0.0005 && clamped < 0.84) {
          collapse("snap");
        }
      }
    }
  }, [rawProgress, wordProgress, collapse]);

  useLenis((lenis) => {
    lenisRef.current = lenis;
    updateScrollProgress();
  });

  useEffect(() => {
    const onScrollOrResize = () => updateScrollProgress();
    onScrollOrResize();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
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
      // Shorter pin on native/touch: less dead track after the scrub, fewer
      // chances for sticky + momentum to fight. Desktop keeps the full 400vh.
      style={{ height: collapsed ? "100vh" : nativeScroll ? "240vh" : "400vh" }}
      className="relative w-full"
    >
      <section className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden">
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
