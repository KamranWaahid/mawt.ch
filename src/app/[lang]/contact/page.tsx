import { SubpageHero } from "@/components/sections/subpage-hero";
import { ContactForm } from "@/components/ui/contact-form";
import { getDictionary } from "@/get-dictionary";
import { getContactSettings, getHomePageData } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MapPin, Mail, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";
import { standaloneAlternates } from "@/lib/routing/url-helpers";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Contact | MAWT, AI agency in Geneva" : "Contact | MAWT, agence IA à Genève",
    description: lang === "en"
      ? "Talk to MAWT, an AI agency in Geneva. AI integration, process automation and custom tools for SMEs and growing companies across French speaking Switzerland."
      : "Contactez MAWT, agence IA à Genève. Intégration d'IA, automatisation des processus et outils sur mesure pour les PME et entreprises en croissance de Suisse romande.",
    alternates: standaloneAlternates("contact", lang),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [dict, contact, siteData] = await Promise.all([
    getDictionary(lang),
    getContactSettings(),
    getHomePageData(lang)
  ]);

  return (
    <div className="min-h-screen">
      <SubpageHero 
        eyebrow={dict.contact.badge}
        title={contact?.headline || dict.contact.headline}
        subtitle={lang === "fr" ? "Discutons de votre projet." : "Let's talk about your project."}
      />
      
      <section className="py-16 md:py-24 lg:py-32">
        <div className="site-container-wide grid lg:grid-cols-[1fr_2.2fr] gap-24">
          <div className="flex flex-col gap-16">
            {/* Main Inquiries */}
            <SectionReveal className="flex flex-col gap-6">
              <h3 className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">{dict.contact.inquiries}</h3>
              <div className="flex flex-col gap-4">
                 {contact?.email && (
                   <a href={`mailto:${contact.email}`} className="text-2xl font-normal text-black hover:text-brand-teal transition-colors flex items-center gap-3">
                      <Mail size={20} strokeWidth={1.5} />
                      {contact.email}
                   </a>
                 )}
                 {contact?.phone && (
                   <a href={`tel:${contact.phone}`} className="text-2xl font-normal text-black hover:text-brand-teal transition-colors flex items-center gap-3">
                      <Phone size={20} strokeWidth={1.5} />
                      {contact.phone}
                   </a>
                 )}
              </div>
            </SectionReveal>

            {/* Offices */}
            <SectionReveal delay={0.1} className="flex flex-col gap-8">
              <h3 className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">
                {/* BUG-021: Localized using lang variable, not hardcoded English */}
                {lang === "fr" ? "Notre présence" : "Our Presence"}
              </h3>
              <div className="flex flex-col gap-10">
                 {contact?.offices?.map((office, i) => (
                   <div key={i} className="flex flex-col gap-3 group">
                      <div className="flex items-center justify-between">
                         <span className="text-lg font-medium text-black">{office.city}</span>
                         {office.isMain && <span className="text-[10px] font-normal uppercase tracking-widest text-brand-teal bg-brand-teal/5 px-2 py-0.5 rounded-full">HQ</span>}
                      </div>
                      <p className="text-neutral-500 font-normal leading-relaxed whitespace-pre-line">
                        {office.address}
                      </p>
                      {office.mapUrl && (
                        <a 
                          href={office.mapUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-normal text-neutral-400 hover:text-black transition-colors flex items-center gap-2 mt-2 group-hover:translate-x-1 duration-300"
                        >
                          View on Map <ExternalLink size={12} />
                        </a>
                      )}
                   </div>
                 ))}
              </div>
            </SectionReveal>

            {/* Social */}
            <SectionReveal delay={0.2} className="flex flex-col gap-6 pt-8 border-t border-black/5">
              <h3 className="text-[11px] font-normal text-neutral-400 uppercase tracking-[0.2em]">{contact?.socialHeadline || dict.contact.social}</h3>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {siteData?.settings?.socialLinks
                  ?.filter((link) => {
                    const p = (link.platform || "").toLowerCase();
                    return p !== "twitter" && p !== "x" && p !== "github";
                  })
                  .map((link, i) => (
                  <Link 
                    key={i} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-lg font-normal text-black hover:text-brand-teal transition-colors underline underline-offset-8 decoration-black/10 hover:decoration-brand-teal"
                  >
                    {link.platform}
                  </Link>
                ))}
              </div>
            </SectionReveal>
          </div>
          
          <SectionReveal delay={0.1}>
             <div className="px-5 py-8 sm:p-8 md:p-16 bg-neutral-50/50 border border-black/5 rounded-sm">
                <ContactForm dict={dict.contact.form} />
             </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}

