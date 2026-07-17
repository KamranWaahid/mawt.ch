"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import {
  isCurtainNavigableHref,
  useCurtainTransition,
} from "@/components/providers/curtain-transition";

type CurtainLinkProps = ComponentProps<typeof Link>;

/**
 * Link that uses the slide-up curtain for every internal site navigation.
 * External / hash / studio / admin links keep normal Next.js navigation.
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
        if (!hrefString || !isCurtainNavigableHref(hrefString)) return;
        e.preventDefault();
        navigateWithCurtain(hrefString);
      }}
      {...props}
    />
  );
}
