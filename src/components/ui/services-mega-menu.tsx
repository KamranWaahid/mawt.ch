"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  familySlugForLang,
  familyOrderIndex,
  getFamilyTitle,
} from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";

export type HeaderService = {
  _id: string;
  title?: string;
  slug?: string;
  family?: string;
  tier?: number;
};

export type ServiceMenuGroup = {
  family: string;
  title: string;
  href: string;
  items: { title: string; href: string }[];
};

/** Group Sanity services by family (FAMILY_ORDER, then tier) for the menu. */
export function groupServicesByFamily(
  services: HeaderService[] | undefined,
  lang: Locale,
): ServiceMenuGroup[] {
  const byFamily = new Map<string, ServiceMenuGroup>();
  const sorted = (services ?? [])
    .filter((s) => s.family && s.title && s.slug)
    .slice()
    .sort(
      (a, b) =>
        familyOrderIndex(a.family!) - familyOrderIndex(b.family!) ||
        (a.tier ?? 50) - (b.tier ?? 50),
    );
  for (const s of sorted) {
    const familySlug = familySlugForLang(s.family!, lang);
    if (!byFamily.has(s.family!)) {
      byFamily.set(s.family!, {
        family: s.family!,
        title: getFamilyTitle(s.family!, lang),
        href: `/${lang}/services/${familySlug}`,
        items: [],
      });
    }
    byFamily.get(s.family!)!.items.push({
      title: s.title!,
      href: `/${lang}/services/${familySlug}/${s.slug}`,
    });
  }
  return Array.from(byFamily.values());
}

/**
 * Desktop services mega menu: dark scrim over the page + white panel pinned
 * under the 71px nav bar. Must be rendered INSIDE the hover container (header
 * or nav) so onMouseLeave on that container closes it. The scrim is
 * pointer-events-none: moving the mouse past the panel leaves the container
 * and closes the menu naturally.
 */
export function ServicesMegaMenu({
  open,
  groups,
  onNavigate,
}: {
  open: boolean;
  groups: ServiceMenuGroup[];
  onNavigate: () => void;
}) {
  return (
    <AnimatePresence>
      {open && groups.length > 0 && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-none fixed inset-x-0 top-[71px] bottom-0 hidden bg-black/30 backdrop-blur-[2px] md:block"
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            // Inline background: a global page-texture rule turns `.bg-white`
            // translucent inside .internal-page-shell (globals.css), which
            // made the panel see-through over the homepage hero.
            style={{ backgroundColor: "#ffffff" }}
            className="absolute left-0 right-0 top-full hidden max-h-[calc(100vh-71px)] overflow-y-auto border-b border-black/5 text-black shadow-[0_24px_48px_-24px_rgba(0,0,0,0.12)] md:block"
          >
            <div className="site-container-wide grid grid-cols-3 gap-x-10 gap-y-12 py-12 lg:grid-cols-5">
              {groups.map((group) => (
                <div key={group.family} className="flex flex-col gap-4">
                  <Link
                    href={group.href}
                    onClick={onNavigate}
                    className="text-[15px] font-medium tracking-tight text-black transition-colors hover:text-[#3fae87]"
                  >
                    {group.title}
                  </Link>
                  <ul className="flex flex-col gap-2.5">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className="block text-[13px] leading-snug text-neutral-500 transition-colors hover:text-black"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
