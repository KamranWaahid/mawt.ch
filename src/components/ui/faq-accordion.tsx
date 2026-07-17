"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { Plus } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  noWrapper?: boolean;
  /** Dark catalogue pages use "dark"; light service pillars keep "light". */
  tone?: "dark" | "light";
}

export function FAQAccordion({
  items,
  noWrapper = false,
  tone = "light",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();
  const isDark = tone === "dark";

  const content = (
    <div className="mx-auto max-w-[840px]">
      <div
        className={
          isDark
            ? "divide-y divide-white/10 border-y border-white/10"
            : "divide-y divide-black/10 border-y border-black/10"
        }
      >
        {items.map((item, index) => {
          const open = openIndex === index;
          const panelId = `${baseId}-panel-${index}`;
          const buttonId = `${baseId}-button-${index}`;

          return (
            <div key={`${item.question}-${index}`}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className={`group flex w-full items-start justify-between gap-6 py-6 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 sm:py-7 ${
                    isDark
                      ? "focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616]"
                      : "focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F5F4]"
                  }`}
                >
                  <span
                    className={`text-[17px] font-normal leading-snug transition-colors md:text-[18px] ${
                      isDark
                        ? "text-white/80 group-hover:text-white"
                        : "text-black/80 group-hover:text-black"
                    }`}
                  >
                    {item.question}
                  </span>
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center border transition-[transform,colors] duration-300 ${
                      isDark
                        ? `border-white/15 text-white/55 group-hover:border-white/35 group-hover:text-white ${
                            open ? "rotate-45 border-white/35 text-white" : ""
                          }`
                        : `border-black/15 text-black/55 group-hover:border-black/40 group-hover:text-black ${
                            open ? "rotate-45 border-black/40 text-black" : ""
                          }`
                    }`}
                    aria-hidden="true"
                  >
                    <Plus size={14} strokeWidth={1.5} />
                  </span>
                </button>
              </h3>

              {/* Always mounted so answers remain in SSR HTML for SEO/FAQ schema. */}
              <motion.div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                initial={false}
                animate={{
                  height: open ? "auto" : 0,
                  opacity: open ? 1 : 0,
                }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
                aria-hidden={!open}
              >
                <div className="pb-7 pr-12">
                  <p
                    className={`max-w-[58ch] text-[15px] font-normal leading-relaxed md:text-[16px] ${
                      isDark ? "text-white/55" : "text-neutral-600"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );

  if (noWrapper) return content;

  return (
    <section className="pb-16 md:pb-24 lg:pb-28">
      <div className="site-container-xwide">{content}</div>
    </section>
  );
}
