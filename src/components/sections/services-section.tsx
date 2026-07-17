import { SectionReveal } from "@/components/ui/section-reveal";
import { sectionTitleDarkClass } from "@/components/ui/section-title-style";
import type { Service } from "@/lib/types";

type ServicesSectionProps = {
  services: Service[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="py-20">
      <div className="site-container-xwide">
        <SectionReveal>
          <h2 className={sectionTitleDarkClass}>
            Services & Skills
          </h2>
        </SectionReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <SectionReveal key={service._id}>
              <article className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="text-xl text-white">{service.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-300">{service.description}</p>
              </article>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
