"use client";

import { motion } from "motion/react";
import { sectionTitleClass } from "@/components/ui/section-title-style";

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
    <section className="bg-white py-24">
      <div className="site-container-xwide">
        <h2 className={`${sectionTitleClass} mb-12`}>Compliance & Certifications</h2>
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
