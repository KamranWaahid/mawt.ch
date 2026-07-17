import { ContactForm } from "@/components/ui/contact-form";
import { getDictionary } from "@/get-dictionary";
import { getContactSettings, getHomePageData } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import { SectionReveal } from "@/components/ui/section-reveal";
import { HeaderTheme } from "@/components/ui/header-theme";
import { SlidePageBody } from "@/components/ui/slide-page-body";
import { DarkPageIcon } from "@/components/ui/dark-page-icon";
import { CurtainLink } from "@/components/ui/curtain-link";
import { ArrowUpRight, AtSign, MapPin, MessageSquare, Phone, Share2 } from "lucide-react";
import Link from "next/link";
import { localizedHref, standaloneAlternates } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, SITE_URL } from "@/components/seo/structured-data";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "en" ? "Contact | MAWT, Geneva" : "Contact | MAWT, Genève",
    description: lang === "en"
      ? "Write to MAWT in Geneva about AI systems, automation, or custom software. A clear project or an early question is enough to start."
      : "Écrivez à MAWT à Genève au sujet de systèmes IA, d'automatisation ou de logiciels sur mesure. Un projet clair ou une question précoce suffit.",
    alternates: standaloneAlternates("contact", lang),
    openGraph: {
      title: lang === "en" ? "Contact MAWT" : "Contacter MAWT",
      description: lang === "en"
        ? "A conversation about the work that is slowing you down."
        : "Une conversation sur le travail qui vous ralentit.",
      url: `https://mawt.ch/${lang}/contact`,
    },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const [dict, contact, siteData] = await Promise.all([
    getDictionary(lang),
    getContactSettings(),
    getHomePageData(lang),
  ]);

  const hero = dict.contact.hero;
  const aboutHref = localizedHref("a-propos", lang);
  const contactUrl = `${SITE_URL}${localizedHref("contact", lang)}`;
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: "Contact", url: contactUrl },
  ]);

  const socialLinks =
    siteData?.settings?.socialLinks?.filter((link) => {
      const p = (link.platform || "").toLowerCase();
      return p !== "twitter" && p !== "x" && p !== "github";
    }) ?? [];

  const hasInquiries = Boolean(contact?.email || contact?.phone);
  const hasOffices = Boolean(contact?.offices?.length);
  const hasSocial = socialLinks.length > 0;

  return (
    <div className="min-h-screen bg-[#161616] text-white">
      <HeaderTheme theme="light" />
      <JsonLd data={[crumbLd]} />

      {/* Hero — same catalogue scale as /services, /work, /news, /about. */}
      <section className="catalogue-hero-pad">
        <div className="site-container-xwide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-end">
            <div className="lg:col-span-7">
              <h1 className="text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.98] tracking-tight text-white">
                <span className="block">
                  {hero.title}{" "}
                  <CurtainLink
                    href={aboutHref}
                    className="text-white/15 transition-colors hover:text-white/40"
                  >
                    {hero.crossLabel}
                  </CurtainLink>
                </span>
                <span className="block">{hero.tagline}</span>
              </h1>
            </div>
            <div className="lg:col-span-5">
              <p className="max-w-[40ch] text-[16px] font-normal leading-relaxed text-white/58 md:text-[18px]">
                {dict.contact.headline}
              </p>
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="group mt-8 inline-flex items-center gap-2 border-b border-white/20 pb-1 text-[18px] font-normal text-white transition-colors hover:border-white md:text-[20px]"
                >
                  {contact.email}
                  <ArrowUpRight
                    size={16}
                    className="text-white/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <SlidePageBody>
        {/* Contact details — editorial hairlines on the dark ground. */}
        {(hasInquiries || hasOffices || hasSocial) && (
          <section className="pb-[12vh]">
            <div className="site-container-xwide grid gap-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-16">
              {hasInquiries && (
                <SectionReveal className="flex flex-col gap-5">
                  <h2 className="text-[13px] font-normal text-white/40">
                    <AtSign size={14} strokeWidth={1.5} className="mr-2 inline-block align-[-2px] text-white/35" aria-hidden="true" />
                    {dict.contact.inquiries}
                  </h2>
                  <ul className="flex flex-col">
                    {contact?.email && (
                      <li>
                        <a
                          href={`mailto:${contact.email}`}
                          className="group flex items-center justify-between gap-4 border-b border-white/10 py-[15px] text-[15px] font-normal text-white/80 transition-colors hover:text-white"
                        >
                          <span className="inline-flex items-center gap-3">
                            <AtSign size={14} strokeWidth={1.5} className="shrink-0 text-white/35 transition-colors group-hover:text-white/60" aria-hidden="true" />
                            {contact.email}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-white/35 transition-opacity duration-300 [@media(hover:hover)]:text-white/0 [@media(hover:hover)]:group-hover:text-white/55"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    )}
                    {contact?.phone && (
                      <li>
                        <a
                          href={`tel:${contact.phone}`}
                          className="group flex items-center justify-between gap-4 border-b border-white/10 py-[15px] text-[15px] font-normal text-white/80 transition-colors hover:text-white"
                        >
                          <span className="inline-flex items-center gap-3">
                            <Phone size={14} strokeWidth={1.5} className="shrink-0 text-white/35 transition-colors group-hover:text-white/60" aria-hidden="true" />
                            {contact.phone}
                          </span>
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-white/35 transition-opacity duration-300 [@media(hover:hover)]:text-white/0 [@media(hover:hover)]:group-hover:text-white/55"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    )}
                  </ul>
                </SectionReveal>
              )}

              {hasOffices && (
                <SectionReveal delay={0.08} className="flex flex-col gap-5">
                  <h2 className="text-[13px] font-normal text-white/40">
                    <MapPin size={14} strokeWidth={1.5} className="mr-2 inline-block align-[-2px] text-white/35" aria-hidden="true" />
                    {dict.contact.presence}
                  </h2>
                  <ul className="flex flex-col gap-8">
                    {contact?.offices?.map((office, i) => (
                      <li key={`${office.city}-${i}`} className="flex flex-col gap-2">
                        <div className="flex items-baseline gap-3">
                          <span className="text-[17px] font-medium tracking-tight text-white">
                            {office.city}
                          </span>
                          {office.isMain && (
                            <span className="text-[12px] font-normal text-white/35">
                              {dict.contact.hqLabel}
                            </span>
                          )}
                        </div>
                        {office.address && (
                          <p className="max-w-[28ch] whitespace-pre-line text-[14px] font-normal leading-relaxed text-white/50">
                            {office.address}
                          </p>
                        )}
                        {office.mapUrl && (
                          <a
                            href={office.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1.5 text-[13px] font-normal text-white/40 transition-colors hover:text-white"
                          >
                            {dict.contact.mapLabel}
                            <ArrowUpRight size={12} />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </SectionReveal>
              )}

              {hasSocial && (
                <SectionReveal delay={0.12} className="flex flex-col gap-5">
                  <h2 className="text-[13px] font-normal text-white/40">
                    <Share2 size={14} strokeWidth={1.5} className="mr-2 inline-block align-[-2px] text-white/35" aria-hidden="true" />
                    {dict.contact.social}
                  </h2>
                  <ul className="flex flex-col">
                    {socialLinks.map((link, i) => (
                      <li key={`${link.platform}-${i}`}>
                        <Link
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 border-b border-white/10 py-[15px] text-[15px] font-normal text-white/80 transition-colors hover:text-white"
                        >
                          {link.platform}
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 text-white/0 transition-opacity duration-300 group-hover:text-white/55"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </SectionReveal>
              )}
            </div>
          </section>
        )}

        {/* Form — tonal dark band, matching the Services page language. */}
        <div className="border-y border-white/10 bg-[#1d1d1d] text-white" id="contact-form">
          <section className="py-20 md:py-28 lg:py-36">
            <div className="site-container-xwide">
              <SectionReveal>
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                  <div className="lg:col-span-4">
                    <DarkPageIcon icon={MessageSquare} className="mb-8" />
                    <p className="text-[13px] font-normal text-white/42">
                      {dict.contact.subtitle}
                    </p>
                    <h2 className="mt-5 max-w-[12ch] text-[clamp(2rem,4vw,3.6rem)] font-medium leading-[1.12] tracking-tight text-white">
                      {dict.contact.formTitle}
                    </h2>
                  </div>
                  <div className="lg:col-span-8">
                    <ContactForm dict={dict.contact.form} lang={lang} theme="dark" />
                  </div>
                </div>
              </SectionReveal>
            </div>
          </section>
        </div>
      </SlidePageBody>
    </div>
  );
}
