"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { useCurtainTransition, slideDestinationForHref } from "@/components/providers/curtain-transition";

type CurtainLinkProps = ComponentProps<typeof Link>;

/**
 * Link that uses the slide-up curtain when the href is a curtain destination
 * (/services, /work|/projets, /news|/blog, /about|/a-propos, or /contact).
 * Falls back to normal navigation for everything else.
 */
export function CurtainLink({ href, onClick, ...props }: CurtainLinkProps) {
  const { navigateWithCurtain } = useCurtainTransition();
  const hrefString = typeof href === "string" ? href : href.pathname || "";

  return (
    <Link
      href={href}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (!hrefString || !slideDestinationForHref(hrefString)) return;
        e.preventDefault();
        navigateWithCurtain(hrefString);
      }}
      {...props}
    />
  );
}
