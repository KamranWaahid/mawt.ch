"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

interface LegalSection {
  title: string;
  content: string[];
}

interface LegalContentProps {
  sections: LegalSection[];
  contentsLabel?: string;
}

function slugify(value: string, index: number) {
  const base = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return base || `section-${index + 1}`;
}

export function LegalContent({
  sections,
  contentsLabel = "Contents",
}: LegalContentProps) {
  const reduceMotion = useReducedMotion();
  const prepared = useMemo(
    () =>
      sections.map((section, index) => ({
        ...section,
        id: slugify(section.title || `section-${index + 1}`, index),
      })),
    [sections],
  );

  const titledSections = useMemo(
    () => prepared.filter((section) => section.title),
    [prepared],
  );
  const [activeId, setActiveId] = useState(titledSections[0]?.id ?? "");

  useEffect(() => {
    if (titledSections.length === 0) return;

    const elements = titledSections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [titledSections]);

  return (
    <section className="border-t border-white/10 pb-20 pt-10 md:pb-28 md:pt-14 lg:pb-36">
      <div className="site-container-xwide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {titledSections.length > 1 && (
            <aside className="lg:col-span-3">
              <nav
                aria-label={contentsLabel}
                className="lg:sticky lg:top-28 lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:overscroll-contain"
                data-lenis-prevent
              >
                <p className="mb-5 text-[12px] font-normal tracking-wide text-white/35">
                  {contentsLabel}
                </p>
                <ol className="space-y-2.5">
                  {titledSections.map((section, index) => {
                    const active = activeId === section.id;
                    return (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className={`group flex items-start gap-3 text-[13px] font-normal leading-snug transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#161616] ${
                            active
                              ? "text-white"
                              : "text-white/40 hover:text-white/75"
                          }`}
                        >
                          <span
                            className={`mt-2 h-px w-4 shrink-0 transition-[background-color,transform] duration-300 ${
                              active ? "bg-white scale-x-100" : "bg-white/20"
                            }`}
                            aria-hidden="true"
                          />
                          <span>
                            <span className="mr-2 tabular-nums text-white/25">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            {section.title.replace(/^\d+\.\s*/, "")}
                          </span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </nav>
            </aside>
          )}

          <div
            className={
              titledSections.length > 1
                ? "lg:col-span-8 lg:col-start-5"
                : "lg:col-span-8 lg:col-start-3"
            }
          >
            <div className="flex flex-col gap-14 md:gap-16">
              {prepared.map((section, index) => (
                <motion.article
                  key={section.id}
                  id={section.title ? section.id : undefined}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.03, 0.18),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="scroll-mt-28 border-t border-white/10 pt-8 first:border-t-0 first:pt-0"
                >
                  {section.title && (
                    <h2 className="mb-6 max-w-[28ch] text-[clamp(1.35rem,2.2vw,1.85rem)] font-medium leading-tight tracking-tight text-white">
                      <span className="mr-3 text-white/30">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title.replace(/^\d+\.\s*/, "")}
                    </h2>
                  )}
                  <div className="flex flex-col gap-4">
                    {section.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="max-w-[62ch] text-[15px] font-normal leading-relaxed text-white/55 md:text-[16px]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
