"use client";

import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/ui/custom-cursor").then(mod => mod.CustomCursor), {
  ssr: false
});

export function CursorProvider() {
  return <CustomCursor />;
}
