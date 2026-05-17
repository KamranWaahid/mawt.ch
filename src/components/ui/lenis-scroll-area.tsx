"use client";

import React from "react";

type LenisScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

export function LenisScrollArea({ children, className }: LenisScrollAreaProps) {
  return (
    <div
      data-lenis-prevent
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className={className}
    >
      {children}
    </div>
  );
}
