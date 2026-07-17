"use client";

import { motion, useReducedMotion } from "motion/react";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import {
  Boxes,
  Network,
  Share2,
  type LucideIcon,
} from "lucide-react";

interface GridItem {
  title: string;
  description: string;
}

interface FlatGridProps {
  items: GridItem[];
  columns?: number;
}

const ICONS: LucideIcon[] = [Boxes, Network, Share2];

const columnMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function FlatGrid({ items, columns = 3 }: FlatGridProps) {
  const reduceMotion = useReducedMotion();
  const lgGridColsClass = columnMap[columns] || "lg:grid-cols-3";

  return (
    <section className="pb-16 md:pb-24 lg:pb-28">
      <div className="site-container-xwide">
        <div className={`grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 ${lgGridColsClass}`}>
          {items.map((item, index) => {
            const Icon = ICONS[index % ICONS.length];
            return (
              <motion.article
                key={item.title}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.45,
                  delay: Math.min(index * 0.06, 0.18),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group flex min-h-[240px] flex-col gap-6 bg-[#161616] p-7 transition-colors duration-300 hover:bg-[#1a1a1a] sm:p-8"
              >
                <DarkPageIcon icon={Icon} />
                <div className="flex flex-col gap-3">
                  <h3 className="text-[18px] font-medium tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="max-w-[36ch] text-[14px] font-normal leading-relaxed text-white/50">
                    {item.description}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
