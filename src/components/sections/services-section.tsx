import { SectionReveal } from "@/components/ui/section-reveal";
import type { Service } from "@/lib/types";

type ServicesSectionProps = {
  services: Service[];
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section id="services" className="px-6 py-20 md:px-12">
      <SectionReveal>
        <h2 className="text-3xl font-normal tracking-tight text-white md:text-5xl">
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
    </section>
  );
}
