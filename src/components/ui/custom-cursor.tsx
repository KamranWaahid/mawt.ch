"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CustomCursor() {
  const [hoverState, setHoverState] = useState<"default" | "pointer" | "view">("default");
  const [isTouch, setIsTouch] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isPointer = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a");
      
      const isView = target.getAttribute("data-cursor") === "view" || target.closest("[data-cursor='view']");

      if (isView) {
        setHoverState("view");
      } else if (isPointer) {
        setHoverState("pointer");
      } else {
        setHoverState("default");
      }
    };

    const handleHoverEnd = () => {
      setHoverState("default");
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleHoverStart);
    window.addEventListener("mouseout", handleHoverEnd);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleHoverStart);
      window.removeEventListener("mouseout", handleHoverEnd);
    };
  }, [mouseX, mouseY]);

  if (isTouch) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden md:flex items-center justify-center rounded-full bg-white"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        width: hoverState === "default" ? 12 : hoverState === "pointer" ? 64 : 80,
        height: hoverState === "default" ? 12 : hoverState === "pointer" ? 64 : 80,
      }}
    >
      {hoverState === "view" && (
        <motion.span 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[10px] font-normal uppercase tracking-widest text-black"
        >
          View
        </motion.span>
      )}
    </motion.div>
  );
}
