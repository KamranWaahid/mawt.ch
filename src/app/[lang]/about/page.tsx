import { SubpageHero } from "@/components/sections/subpage-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import Image from "next/image";
import { standaloneAlternates, localizedHref } from "@/lib/routing/url-helpers";
import { JsonLd, breadcrumbLd, ORG_ID, SITE_URL } from "@/components/seo/structured-data";
import type { Locale } from "@/i18n-config";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: lang === "fr" ? "À propos | MAWT" : "About Us | MAWT",
    description:
      lang === "fr"
        ? "Nous concevons des expériences digitales qui font avancer les entreprises."
        : "We Build Digital Experiences That Move Businesses Forward",
    alternates: standaloneAlternates("a-propos", lang),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const aboutUrl = `${SITE_URL}${localizedHref("a-propos", lang)}`;
  const aboutLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: aboutUrl,
    inLanguage: lang === "fr" ? "fr-CH" : "en",
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
  };
  const crumbLd = breadcrumbLd([
    { name: "MAWT", url: `${SITE_URL}/${lang}` },
    { name: lang === "fr" ? "À propos" : "About", url: aboutUrl },
  ]);

  return (
    <div className="bg-white min-h-screen font-sans text-black selection:bg-black selection:text-white">
      <JsonLd data={[crumbLd, aboutLd]} />
      <SubpageHero
        badge="About MAWT"
        title="We Build Digital Experiences That Move Businesses Forward"
      />
      
      {/* Intro Text */}
      <section className="px-6 py-12 sm:px-8 md:px-10 lg:px-12 max-w-[1440px] mx-auto">
        <SectionReveal>
          <p className="text-xl md:text-2xl lg:text-3xl font-light text-neutral-600 max-w-5xl leading-relaxed">
            At MAWT, we believe great digital work is not only about aesthetics. It is about creating meaningful experiences, solving real business challenges, and helping brands grow with clarity and purpose.
          </p>
          <p className="mt-6 text-lg md:text-xl text-neutral-500 max-w-4xl leading-relaxed">
            We are a modern web and marketing technology agency focused on building impactful digital solutions for businesses that want to stand out in a fast-moving world. From branding and web design to automation, strategy, and digital experiences, we combine creativity with precision to help companies evolve confidently. Every project we take on is approached with care, strategy, and a deep understanding of the people behind the business.
          </p>
        </SectionReveal>
      </section>

      {/* Main Hero Image */}
      <section className="px-6 pb-20 sm:px-8 md:px-10 lg:px-12 max-w-[1440px] mx-auto mt-10">
        <SectionReveal delay={0.2} className="relative w-full aspect-[21/9] md:aspect-[2.5/1] rounded-2xl overflow-hidden bg-neutral-100">
          <Image 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2850" 
            alt="MAWT Team Collaboration"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </SectionReveal>
      </section>

      {/* Split Section: Story, Mission, Vision */}
      <section className="px-6 py-20 md:py-32 sm:px-8 md:px-10 lg:px-12 border-t border-black/5 bg-neutral-50">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-12 gap-12 md:gap-8">
          
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-32">
              <h2 className="text-sm font-medium tracking-[0.2em] uppercase text-black/50 mb-4">Our Foundation</h2>
              <div className="w-12 h-px bg-black/20" />
            </div>
          </div>

          <div className="md:col-span-8 lg:col-span-7 space-y-24">
            
            {/* Story */}
            <SectionReveal>
              <h3 className="text-3xl md:text-4xl font-normal tracking-tight mb-8">Our Story</h3>
              <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                <p>MAWT was created with a simple vision: to bridge the gap between design, technology, and human connection.</p>
                <p>In a digital landscape filled with noise, we wanted to build an agency that values thoughtful execution, clean design, strong communication, and long-term partnerships. We work closely with brands, entrepreneurs, and companies to create solutions that not only look modern, but also perform with purpose.</p>
                <p>We see ourselves as more than a service provider. We become a strategic partner invested in the growth and evolution of every client we work with.</p>
              </div>
            </SectionReveal>

            {/* Mission */}
            <SectionReveal>
              <h3 className="text-3xl md:text-4xl font-normal tracking-tight mb-8">Our Mission</h3>
              <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                <p>To help businesses grow through intelligent design, modern technology, and meaningful digital experiences that create lasting impact.</p>
                <p>We aim to simplify the complex, elevate brands with clarity, and deliver solutions that feel both functional and refined.</p>
              </div>
            </SectionReveal>

            {/* Vision */}
            <SectionReveal>
              <h3 className="text-3xl md:text-4xl font-normal tracking-tight mb-8">Our Vision</h3>
              <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                <p>To become a trusted creative and technology partner for ambitious brands around the world by delivering work that is innovative, human-centered, and built for the future.</p>
                <p>We envision a digital world where businesses connect with people more authentically through better design, smarter systems, and stronger experiences.</p>
              </div>
            </SectionReveal>

          </div>
        </div>
      </section>

      {/* Services Grid matching the inspiration grid */}
      <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 max-w-[1440px] mx-auto border-t border-black/5">
        <SectionReveal>
          <div className="max-w-2xl mb-16">
             <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-6">What We Do</h2>
             <p className="text-lg text-neutral-500 font-light">MAWT offers a combination of creative, strategic, and technical expertise to support businesses across their digital journey.</p>
          </div>
        </SectionReveal>

        <div className="grid md:grid-cols-3 gap-x-8 gap-y-16">
          {[
            "Web Design & Development",
            "Branding & Visual Identity",
            "UI/UX Design",
            "E-Commerce Solutions",
            "Digital Strategy",
            "Marketing Technology",
            "Automation & Integrations",
            "Content & Creative Direction",
            "Social Media & Campaign Support"
          ].map((service, idx) => (
            <SectionReveal key={idx} delay={idx * 0.05} className="group cursor-default">
              <div className="w-full h-px bg-black/10 mb-6 group-hover:bg-black transition-colors duration-500" />
              <h4 className="text-xl font-normal text-black mb-3">{service}</h4>
              <p className="text-sm text-neutral-400">Tailored to your brand&apos;s goals.</p>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* What Makes Us Different - Layout inspired by the screenshot (image + text) */}
      <section className="px-6 py-24 md:py-32 sm:px-8 md:px-10 lg:px-12 bg-neutral-50 border-t border-black/5">
         <div className="max-w-[1440px] mx-auto">
            <SectionReveal>
              <h2 className="text-3xl md:text-5xl font-normal tracking-tight mb-20 max-w-3xl">
                What Makes MAWT Different
              </h2>
            </SectionReveal>

            <div className="grid md:grid-cols-2 gap-x-16 lg:gap-x-24 gap-y-24">
              
              <SectionReveal delay={0.1} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2 aspect-square relative rounded-xl overflow-hidden bg-neutral-100">
                  <Image src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1000" alt="Human-Centered" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500"/>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <h3 className="text-2xl font-normal">Human-Centered</h3>
                  <p className="text-neutral-500 font-light text-base leading-relaxed">We focus on understanding the people behind the business. Every decision is guided by user experience, clarity, and meaningful interaction.</p>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.2} className="flex flex-col md:flex-row gap-8 items-start md:mt-32">
                <div className="w-full md:w-1/2 aspect-square relative rounded-xl overflow-hidden bg-neutral-100">
                  <Image src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&q=80&w=1000" alt="Design With Purpose" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500"/>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <h3 className="text-2xl font-normal">Design With Purpose</h3>
                  <p className="text-neutral-500 font-light text-base leading-relaxed">We create clean, modern, and intentional digital experiences that balance aesthetics with performance.</p>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.3} className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/2 aspect-square relative rounded-xl overflow-hidden bg-neutral-100">
                  <Image src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000" alt="Technology That Simplifies" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500"/>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <h3 className="text-2xl font-normal">Simplifies Tech</h3>
                  <p className="text-neutral-500 font-light text-base leading-relaxed">We believe technology should make businesses more efficient, connected, and scalable, not more complicated.</p>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.4} className="flex flex-col md:flex-row gap-8 items-start md:mt-32">
                <div className="w-full md:w-1/2 aspect-square relative rounded-xl overflow-hidden bg-neutral-100">
                  <Image src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000" alt="Long-Term Thinking" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500"/>
                </div>
                <div className="w-full md:w-1/2 flex flex-col gap-4">
                  <h3 className="text-2xl font-normal">Long-Term Thinking</h3>
                  <p className="text-neutral-500 font-light text-base leading-relaxed">We build with the future in mind. Our goal is to create lasting value, working closely with clients to build trust.</p>
                </div>
              </SectionReveal>

            </div>
         </div>
      </section>

      {/* Our Values (Marquee or minimalist list) */}
      <section className="px-6 py-24 sm:px-8 md:px-10 lg:px-12 max-w-[1440px] mx-auto">
        <SectionReveal>
          <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-16">Our Values</h2>
        </SectionReveal>
        <div className="grid md:grid-cols-5 gap-6">
          {[
            { title: "Excellence", text: "Attention to detail & high-quality work." },
            { title: "Innovation", text: "Embracing modern tools & creative thinking." },
            { title: "Authenticity", text: "Honest communication & genuine collaboration." },
            { title: "Simplicity", text: "Clear and thoughtful solutions." },
            { title: "Growth", text: "Continuous learning & improvement." }
          ].map((val, idx) => (
             <SectionReveal key={idx} delay={idx * 0.1}>
               <div className="p-8 border border-black/5 h-full rounded-2xl hover:border-black/20 transition-all duration-300 bg-white group">
                  <div className="w-8 h-8 rounded-full bg-black/5 group-hover:bg-black group-hover:text-white flex items-center justify-center transition-colors mb-6">
                    <span className="text-xs font-medium">{idx + 1}</span>
                  </div>
                  <h4 className="text-xl font-normal mb-3">{val.title}</h4>
                  <p className="text-sm text-neutral-500 font-light leading-relaxed">{val.text}</p>
               </div>
             </SectionReveal>
          ))}
        </div>
      </section>

      {/* Dark CTA Section matching the inspiration "Schedule Call" area */}
      <section className="bg-black text-white px-6 py-24 md:py-32 sm:px-8 md:px-10 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
           <SectionReveal>
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight mb-8 leading-[1.1]">
               Built Around<br/>Your Brand
             </h2>
             <div className="space-y-6 text-lg text-white/70 font-light leading-relaxed">
               <p>No two businesses are the same, and neither are our solutions.</p>
               <p>Whether we are designing a website, building a platform, refining a brand identity, or automating workflows, our focus remains the same: creating work that reflects your vision and helps your business grow with confidence.</p>
               <p className="pt-4 text-white font-medium">At MAWT, we combine creativity, strategy, and technology to create experiences that feel modern, refined, and built to last.</p>
             </div>
           </SectionReveal>

           <SectionReveal delay={0.2} className="bg-white/5 border border-white/10 p-10 md:p-14 lg:p-16 rounded-[2rem] flex flex-col items-start backdrop-blur-sm">
              <h3 className="text-2xl md:text-3xl font-normal tracking-tight mb-6">Let’s Create Something Meaningful</h3>
              <p className="text-white/60 mb-10 font-light leading-relaxed">We work with businesses, startups, and brands that are ready to think differently, grow strategically, and build stronger digital experiences. MAWT is here to help turn ideas into impactful realities.</p>
              
              <a href="/en/contact" className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-neutral-200 transition-colors">
                Start a Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </a>
           </SectionReveal>
        </div>
      </section>

    </div>
  );
}
