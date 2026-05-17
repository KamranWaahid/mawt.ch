"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function ClientsSection({ dict }: { dict: any }) {
  return (
    <section className="bg-bg-light py-24">
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-20 flex flex-col items-center">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-black/40 text-[11px] font-normal mb-10 tracking-[0.2em]"
        >
          {dict.title}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full aspect-[5/1] md:aspect-[10/1] max-w-5xl"
        >
          <Image
            src="/Client Logos.png"
            alt="Trusted by leading companies"
            fill
            className="object-contain opacity-50 grayscale"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
