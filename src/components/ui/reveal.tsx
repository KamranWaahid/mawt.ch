"use client";

import { motion, useInView, useAnimation, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  /**
   * Eager reveal: paint at opacity:1 with no blur from the very first frame,
   * animating ONLY the transform (Y). Use for above-the-fold / LCP content so
   * the text is the LCP at first paint instead of being gated behind a JS
   * opacity+blur animation (which made the mobile hero LCP ~10s).
   */
  eager?: boolean;
}

export const Reveal = ({
  children,
  width = "fit-content",
  delay = 0,
  direction = "up",
  duration = 0.5,
  eager = false,
}: RevealProps) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const offsetY = direction === "up" ? 24 : direction === "down" ? -24 : 0;
  const offsetX = direction === "left" ? 24 : direction === "right" ? -24 : 0;

  const variants = {
    hidden: {
      // Eager: stay fully visible and unblurred — only the transform animates,
      // so the element is LCP-eligible at first paint. opacity/blur are the GPU
      // costly parts and the ones that delay LCP, so they are skipped here.
      opacity: eager ? 1 : 0,
      y: shouldReduceMotion ? 0 : offsetY,
      x: shouldReduceMotion ? 0 : offsetX,
      filter: (eager || shouldReduceMotion) ? "none" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "none",
    },
  };

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={variants}
        initial="hidden"
        animate={mainControls}
        transition={{ 
          duration: shouldReduceMotion ? 0.1 : duration, 
          delay: shouldReduceMotion ? 0 : (0.2 + delay),
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
