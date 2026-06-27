"use client";

import { motion } from "motion/react";

interface GridItem {
  title: string;
  description: string;
}

interface FlatGridProps {
  items: GridItem[];
  columns?: number;
}

const columnMap: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function FlatGrid({ items, columns = 3 }: FlatGridProps) {
  const lgGridColsClass = columnMap[columns] || "lg:grid-cols-3";

  return (
    <section className="py-14 md:py-20 lg:py-28">
      <div className="site-container-wide">
        <div className={`grid gap-3 sm:grid-cols-2 ${lgGridColsClass}`}>
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              viewport={{ once: true }}
              transition={{ 
                y: { type: "spring", stiffness: 400, damping: 30 },
                opacity: { duration: 0.5, delay: index * 0.1 }
              }}
              className="group flex min-h-[260px] cursor-none flex-col gap-6 rounded-2xl border border-black/[0.02] bg-white/42 p-6 transition-colors duration-500 hover:bg-white/70 xs:p-8"
              data-cursor="pointer"
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-black transition-colors">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-black/50 font-normal transition-colors">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
