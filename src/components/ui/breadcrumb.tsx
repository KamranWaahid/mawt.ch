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
}

export function Breadcrumb({ items, lang }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="site-container-wide pt-32 pb-4">
      <ol className="flex items-center space-x-2 text-sm text-neutral-400 font-normal">
        <li>
          <Link href={`/${lang}`} className="hover:text-black transition-colors">
            {lang === "fr" ? "Accueil" : "Home"}
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <ChevronRight size={14} className="opacity-40" />
            {item.to ? (
              <Link href={`/${lang}/${item.to}`} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-black/80 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
