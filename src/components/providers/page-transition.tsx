"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ReactNode, useEffect, useRef, createContext, useContext } from "react";
import { useLenis } from "lenis/react";
import { useCurtainTransition } from "@/components/providers/curtain-transition";

/**
 * PAGE TRANSITION — two modes on top of ONE stable AnimatePresence (always
 * mode="wait": switching AnimatePresence modes mid-flight is unreliable).
 *
 * "fade" (default): gentle fade + 8px drift, exit-before-enter, scroll never
 * locked, Lenis never stopped.
 *
 * "slide" (opt-in via CurtainTransitionProvider — the Services nav links):
 * the provider froze a visual snapshot of the old page at z-[110] at click
 * time. The old page then exits with the NORMAL fade, invisibly, under that
 * opaque snapshot. The ENTERING page mounts fixed at z-[120] and rises from
 * the bottom (100vh → 0, rounded top corners + shadow) over the snapshot —
 * DHNN-style. On landing, scroll resets under the covering sheet, then the
 * provider releases (snapshot removed, page unfixed) — no visible jump.
 *
 * The fixed-during-enter styling is driven by provider STATE ARMED AT CLICK
 * TIME (isSlideArmed), never by render-phase state updates — App Router
 * navigations render inside a React transition where those are unreliable.
 */

export const PageTransitionContext = createContext<{ isPageTransitionComplete: boolean }>({
  isPageTransitionComplete: true,
});

export const usePageTransition = () => useContext(PageTransitionContext);

// Only animate on client after first render
let isInitialLoad = true;

type Mode = "fade" | "slide";

const pageVariants: Variants = {
  hidden: (mode: Mode) =>
    mode === "slide"
      ? { y: "100vh", borderTopLeftRadius: 28, borderTopRightRadius: 28 }
      : { opacity: 0, y: 8 },
  visible: (mode: Mode) =>
    mode === "slide"
      ? {
          y: "0vh",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          transition: {
            y: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] },
            borderTopLeftRadius: { delay: 0.6, duration: 0.2 },
            borderTopRightRadius: { delay: 0.6, duration: 0.2 },
          },
        }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          },
        },
  // Exit is always the plain fade: in slide mode it plays invisibly under
  // the opaque snapshot, so one exit behavior serves both modes.
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const lenis = useLenis();
  const { takePendingSlide, isSlideArmed, releaseSlide } = useCurtainTransition();

  // Decide the mode ONCE per pathname change, synchronously during render.
  // Refs only — they mutate reliably even inside a transition render.
  const lastPathRef = useRef(pathname);
  const modeRef = useRef<Mode>("fade");
  if (pathname !== lastPathRef.current) {
    lastPathRef.current = pathname;
    modeRef.current = !shouldReduceMotion && takePendingSlide() ? "slide" : "fade";
  }
  const mode = modeRef.current;
  const sliding = mode === "slide" && isSlideArmed;

  const landSheet = () => {
    // Reset scroll while the viewport is still covered by the sheet, THEN
    // release (remove snapshot + unfix) — the swap is invisible.
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else if (typeof window !== "undefined") window.scrollTo({ top: 0 });
    releaseSlide();
  };

  useEffect(() => {
    isInitialLoad = false;
  }, []);

  if (isInitialLoad) {
    return (
      <PageTransitionContext.Provider value={{ isPageTransitionComplete: true }}>
        <div className="w-full">{children}</div>
      </PageTransitionContext.Provider>
    );
  }

  const variants = shouldReduceMotion ? reducedVariants : pageVariants;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        custom={mode}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className={
          sliding
            ? "fixed inset-0 z-[120] h-screen w-full overflow-hidden bg-white shadow-[0_-24px_80px_rgba(0,0,0,0.35)] will-change-transform"
            : "w-full"
        }
        onAnimationStart={() => {
          // Fade swaps pages in place: reset scroll up front (historic
          // behavior). Slide keeps the snapshot still and resets scroll at
          // landing instead.
          if (mode === "fade") {
            if (lenis) lenis.scrollTo(0, { immediate: true });
            else if (typeof window !== "undefined") window.scrollTo({ top: 0 });
          }
        }}
        onAnimationComplete={(definition) => {
          if (definition === "visible" && sliding) {
            landSheet();
          }
        }}
      >
        <PageTransitionContext.Provider value={{ isPageTransitionComplete: true }}>
          {children}
        </PageTransitionContext.Provider>
      </motion.div>
    </AnimatePresence>
  );
}
