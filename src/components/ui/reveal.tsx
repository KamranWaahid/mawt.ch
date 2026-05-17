"use client";

import { motion, useInView, useAnimation, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

export const Reveal = ({ 
  children, 
  width = "fit-content", 
  delay = 0, 
  direction = "up",
  duration = 0.5 
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

  const variants = {
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : (direction === "up" ? 24 : direction === "down" ? -24 : 0),
      x: shouldReduceMotion ? 0 : (direction === "left" ? 24 : direction === "right" ? -24 : 0),
      filter: shouldReduceMotion ? "none" : "blur(10px)"
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0,
      filter: "none"
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
