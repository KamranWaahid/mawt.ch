"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import {
  CONTENT_FADE_MS,
  useCurtainTransition,
} from "@/components/providers/curtain-transition";

/**
 * Fades the below-the-hero body on /work and /services during the curtain
 * transition. The hero stays fully opaque so it matches the facade; this
 * wrapper only softens the rest of the page so content never blinks in.
 */
export function SlidePageBody({ children }: { children: ReactNode }) {
  const { contentVisible } = useCurtainTransition();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: contentVisible ? 1 : 0 }}
      transition={{
        duration: CONTENT_FADE_MS / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="will-change-[opacity]"
    >
      {children}
    </motion.div>
  );
}
