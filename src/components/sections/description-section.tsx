import { SectionReveal } from "@/components/ui/section-reveal";

export function DescriptionSection({ dict }: { dict: any }) {
  if (!dict?.paragraphs?.length) return null;

  return (
    <section
      aria-label="Company description"
      className="bg-[#161616] pt-0 pb-14 md:pb-20 lg:pb-24"
      style={{ backgroundColor: "#161616" }}
    >
      <SectionReveal>
        <div className="site-container">
          <div className="space-y-8 border-t border-white/10 pt-10 md:pl-[10%] lg:pl-[20%]">
            {dict.paragraphs.map((paragraph: string) => (
              <p
                key={paragraph}
                className="max-w-3xl text-base-fluid font-normal leading-relaxed text-white/55"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </SectionReveal>
    </section>
  );
}
