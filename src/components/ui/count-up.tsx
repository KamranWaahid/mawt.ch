"use client";

import { useEffect, useState, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface CountUpProps {
  value: string;
}

export function CountUp({ value }: CountUpProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  // Extract number and suffix (e.g., "3x" -> 3, "x"; "40%" -> 40, "%")
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");
  
  const count = useMotionValue(0);
  const rounded = useSpring(count, { stiffness: 50, damping: 30 });

  useEffect(() => {
    if (isInView) {
      count.set(numericValue);
    }
  }, [isInView, numericValue, count]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      // Handle decimals (e.g. 99.99%)
      if (numericValue % 1 !== 0) {
        setDisplayValue(latest.toFixed(2) + suffix);
      } else {
        setDisplayValue(Math.floor(latest) + suffix);
      }
    });
  }, [rounded, numericValue, suffix]);

  return <span ref={ref}>{displayValue}</span>;
}
