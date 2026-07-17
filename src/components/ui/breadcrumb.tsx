"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to: string | null;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  lang: "fr" | "en";
  tone?: "dark" | "light";
}

export function Breadcrumb({ items, lang, tone = "light" }: BreadcrumbProps) {
  const isDark = tone === "dark";

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        isDark
          ? "site-container-xwide pt-28 pb-2 md:pt-32"
          : "site-container-xwide pt-32 pb-4"
      }
    >
      <ol
        className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-normal ${
          isDark ? "text-white/40" : "text-neutral-400"
        }`}
      >
        <li>
          <Link
            href={`/${lang}`}
            className={`transition-colors focus-visible:outline-none focus-visible:ring-2 ${
              isDark
                ? "hover:text-white focus-visible:ring-white/35"
                : "hover:text-black focus-visible:ring-black/25"
            }`}
          >
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <ChevronRight size={12} className="opacity-40" aria-hidden="true" />
            {item.to ? (
              <Link
                href={`/${lang}/${item.to}`}
                className={`transition-colors focus-visible:outline-none focus-visible:ring-2 ${
                  isDark
                    ? "hover:text-white focus-visible:ring-white/35"
                    : "hover:text-black focus-visible:ring-black/25"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span className={isDark ? "text-white/75" : "text-black/80"}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
