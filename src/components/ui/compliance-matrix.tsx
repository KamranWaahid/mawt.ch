"use client";

import { motion } from "motion/react";

interface ComplianceItem {
  title: string;
  status: string;
  description: string;
}

interface ComplianceMatrixProps {
  items: ComplianceItem[];
}

export function ComplianceMatrix({ items }: ComplianceMatrixProps) {
  return (
    <section className="bg-white px-6 py-24 sm:px-8 md:px-10 lg:px-12">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-2xl font-normal tracking-tight text-black mb-12">Compliance & Certifications</h2>
        <div className="grid gap-px bg-black/5 border border-black/5 overflow-hidden">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-8 grid md:grid-cols-[1fr_120px_2fr] gap-8 items-center"
            >
              <h3 className="text-lg font-normal text-black">{item.title}</h3>
              <span className="text-[14px] font-normal text-neutral-400 uppercase tracking-widest">{item.status}</span>
              <p className="text-[15px] text-neutral-500 font-normal leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
