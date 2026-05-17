"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export function Skeleton({ className, width, height, borderRadius }: SkeletonProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-neutral-100",
        className
      )}
      style={{
        width: width || "100%",
        height: height || "1rem",
        borderRadius: borderRadius || "0",
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </div>
  );
}
