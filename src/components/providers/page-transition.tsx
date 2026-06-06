"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  // IMPORTANT: opacity-only fade — no `y`/translate. A `transform` on this
  // wrapper (which contains the whole page) establishes a containing block and
  // BREAKS `position: sticky` for every descendant (e.g. the Vision section's
  // pinned left column). Opacity does not create a containing block, so the
  // fade is safe to keep.
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0.2 : 0.4,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
