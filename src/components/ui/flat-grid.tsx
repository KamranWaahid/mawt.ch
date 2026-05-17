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

export function FlatGrid({ items, columns = 3 }: FlatGridProps) {
  return (
    <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <div className={`grid gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-${columns}`}>
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
              className="flex flex-col gap-6 p-8 border border-transparent hover:border-black/5 hover:bg-neutral-50 transition-colors duration-500 group cursor-none"
              data-cursor="pointer"
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-normal tracking-tight text-black group-hover:text-black transition-colors">
                  {item.title}
                </h3>
                <p className="text-[16px] leading-relaxed text-neutral-500 font-normal group-hover:text-neutral-600 transition-colors">
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
