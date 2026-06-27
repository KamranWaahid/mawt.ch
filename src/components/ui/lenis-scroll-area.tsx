"use client";

import React from "react";

type LenisScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * LenisScrollArea — wraps horizontally-scrollable sub-sections.
 *
 * IMPORTANT: We use `data-lenis-prevent` so Lenis hands over wheel control
 * to the native scroller inside this element when the pointer is over it.
 * We do NOT call e.stopPropagation() — that swallows vertical scroll events,
 * which caused the page to feel stuck whenever the cursor was over this area.
 */
export function LenisScrollArea({ children, className }: LenisScrollAreaProps) {
  return (
    <div
      data-lenis-prevent
      className={className}
    >
      {children}
    </div>
  );
}
