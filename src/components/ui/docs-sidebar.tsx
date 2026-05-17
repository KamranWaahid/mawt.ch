"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface DocLink {
  title: string;
  slug: string;
}

export interface DocGroup {
  title: string;
  links: DocLink[];
}

export function DocsSidebar({ 
  lang, 
  groups 
}: { 
  lang: string; 
  groups: DocGroup[];
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 shrink-0">
      <nav className="sticky top-32 flex flex-col gap-10">
        {groups.map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <h4 className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">
              {section.title}
            </h4>
            <ul className="flex flex-col gap-3">
              {section.links.map((link) => {
                const fullHref = `/${lang}/docs/${link.slug}`;
                const isActive = pathname === fullHref;

                return (
                  <li key={link.slug}>
                    <Link
                      href={fullHref}
                      className={cn(
                        "text-[15px] font-normal transition-colors hover:text-black",
                        isActive ? "text-black" : "text-neutral-500"
                      )}
                    >
                      <motion.div
                        initial={false}
                        animate={isActive ? { x: 4 } : { x: 0 }}
                      >
                        {link.title}
                      </motion.div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
