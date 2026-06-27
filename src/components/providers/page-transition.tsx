"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ReactNode, useEffect, createContext, useContext } from "react";

/**
 * PAGE TRANSITION — scroll-safe redesign
 *
 * Problem with the old approach:
 *   - The ENTERING page was given `position:fixed; overflow:hidden; height:100vh`
 *     until `onAnimationComplete` fired.
 *   - If the animation completed event raced with React hydration or reduced-motion
 *     rules, the page could stay permanently fixed/locked with no scroll.
 *   - Lenis was manually stopped/started which caused Lenis internal state to
 *     desync from the real scroll position, creating "jump" artifacts.
 *
 * New approach:
 *   - Pages use a simple fade + tiny y-shift in normal document flow.
 *   - AnimatePresence mode="wait" ensures the exit completes before the enter begins.
 *   - Scroll is NEVER locked. Lenis is NEVER stopped/started.
 *   - On initial load there is no animation at all.
 */

export const PageTransitionContext = createContext<{ isPageTransitionComplete: boolean }>({
  isPageTransitionComplete: true,
});

export const usePageTransition = () => useContext(PageTransitionContext);

// Only animate on client after first render
let isInitialLoad = true;

// Standard transition variants — gentle fade + 8px upward drift on enter
const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// Instant swap for users who prefer reduced motion
const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

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
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={variants}
        className="w-full"
        onAnimationStart={() => {
          // Scroll to top on page change — no lock needed
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0 });
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
