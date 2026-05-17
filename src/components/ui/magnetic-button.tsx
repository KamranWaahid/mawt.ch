"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useMotionTemplate, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function MagneticButton({ href, children, className }: MagneticButtonProps) {
  const [hovering, setHovering] = useState(false);
  const mouseX = useSpring(0, { stiffness: 220, damping: 18 });
  const mouseY = useSpring(0, { stiffness: 220, damping: 18 });

  const transform = useMotionTemplate`translate(${mouseX}px, ${mouseY}px)`;
  const baseClass = useMemo(
    () =>
      cn(
        "inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium tracking-[0.16em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        hovering ? "bg-white text-black" : "bg-white/5 text-white",
        className,
      ),
    [className, hovering],
  );

  return (
    <motion.div
      onMouseMove={(event) => {
        const target = event.currentTarget.getBoundingClientRect();
        mouseX.set((event.clientX - target.left - target.width / 2) * 0.12);
        mouseY.set((event.clientY - target.top - target.height / 2) * 0.12);
      }}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
        setHovering(false);
      }}
      onMouseEnter={() => setHovering(true)}
      style={{ transform }}
    >
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    </motion.div>
  );
}
