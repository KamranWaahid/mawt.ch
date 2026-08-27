import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { getDictionary } from "@/get-dictionary";
import {
  getAboutContent,
  getHomePageData,
  getMethodPage,
} from "@/lib/sanity.queries";
import { i18n, type Locale } from "@/i18n-config";
import { localizedHref } from "@/lib/routing/url-helpers";
import { PageTransition } from "@/components/providers/page-transition";
import {
  CurtainTransitionProvider,
  type SlidePreview,
} from "@/components/providers/curtain-transition";
import { CursorProvider } from "@/components/providers/cursor-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { StructuredData } from "@/components/seo/structured-data";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Inter, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

// ISR: pages render statically at build (SSG via generateStaticParams) and
// refresh from Sanity at most once an hour.
export const revalidate = 3600;

// Pre-render both locale roots at build time (SSG).
export function generateStaticParams() {
  return i18n.locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isFr = lang === "fr";
  return {
    metadataBase: new URL("https://mawt.ch"),
    title: {
      default: isFr
        ? "MAWT | Agence IA à Genève"
        : "MAWT | AI agency in Geneva",
      template: "%s | MAWT",
    },
    description: isFr
      ? "Agence IA à Genève. Intelligence artificielle, automatisation des processus et outils sur mesure pour les PME et entreprises en croissance de Suisse romande."
      : "AI agency in Geneva. Artificial intelligence, process automation and custom tools for SMEs and growing companies across French speaking Switzerland.",
    openGraph: {
      title: "MAWT",
      description: isFr
        ? "Agence IA à Genève. Des solutions qui tournent, pas des slides."
        : "AI agency in Geneva. Solutions that run, not slides.",
      url: "https://mawt.ch",
      siteName: "MAWT",
      locale: isFr ? "fr_CH" : "en_US",
      type: "website",
      // Site-wide fallback: pages with their own Sanity cover override this
      // via their local metadata; everything else still gets a social card.
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isFr ? "MAWT — Agence IA à Genève" : "MAWT — AI agency in Geneva",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "MAWT | Agence IA à Genève" : "MAWT | AI agency in Geneva",
      description: isFr
        ? "Agence IA à Genève. Intelligence artificielle, automatisation des processus et outils sur mesure pour PME."
        : "AI agency in Geneva. Artificial intelligence, process automation and custom tools for SMEs and growing companies.",
      images: ["/og-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
  };
}

/**
 * ROOT layout for the whole localized site (i18n App Router pattern): owning
 * <html> here is the only SSG-friendly way to serve `<html lang="fr">` on the
 * French tree — the old shared root layout hardcoded lang="en" for 100% of
 * pages (reading headers() to fix it would have opted the site out of static
 * rendering). /studio has its own root layout.
 */
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  // Any /xx/... with an unknown locale used to render an EN homepage clone
  // with a 200 + self-referencing canonical — an unbounded soft-404 surface
  // for crawlers. Unknown locales are a real 404.
  if (!i18n.locales.includes(lang as Locale)) {
    notFound();
  }
  const htmlLang = lang === "fr" ? "fr" : "en";
  const locale = lang as Locale;
  const [dictionary, data, about, method] = await Promise.all([
    getDictionary(locale),
    getHomePageData(lang),
    getAboutContent(lang),
    getMethodPage(lang),
  ]);

  const isFr = locale === "fr";
  // Facade copy for every public route — any unmatched path still gets the
  // light SubpageHero curtain via resolvePreview fallback.
  const curtainPreviews: Record<string, SlidePreview> = {
    [`/${locale}`]: { theme: "home" },
    // Light SubpageHero — matches the restored services page (not the dark
    // DHNN facade, which flashed as a "new design" during the curtain rise).
    [localizedHref("services", locale)]: {
      theme: "light",
      title: dictionary.services.headline,
      subtitle: isFr ? "Cinq piliers d'expertise." : "Five pillars of expertise.",
    },
    [localizedHref("projets", locale)]: {
      theme: "light",
      title: isFr ? "Études de cas" : "Case studies",
      subtitle: isFr ? "De l'idée au lancement" : "From brief to launch",
    },
    [localizedHref("notre-methode", locale)]: {
      theme: "light",
      title: method?.heroH1 || (isFr ? "Notre approche" : "Our approach"),
      subtitle:
        method?.heroH2 ||
        (isFr ? "Structuré, transparent, livrable." : "Structured, transparent, deliverable."),
    },
    [localizedHref("blog", locale)]: {
      theme: "light",
      title: dictionary.insights.headline,
      subtitle: isFr ? "Notes de terrain sur l'IA." : "Field notes on AI in business.",
    },
    [localizedHref("a-propos", locale)]: {
      theme: "light",
      title: about?.heroH1 || (isFr ? "À propos" : "About"),
      subtitle: about?.heroH2 || (isFr ? "Notre histoire" : "Our story"),
    },
    [localizedHref("contact", locale)]: {
      theme: "light",
      title: dictionary.contact.headline,
      subtitle: dictionary.contact.subtitle,
    },
    [localizedHref("faqs", locale)]: {
      theme: "light",
      title: dictionary.faq.headline,
    },
    [localizedHref("clients", locale)]: {
      theme: "light",
      title: isFr ? "Partenaires MAWT." : "Partner with MAWT.",
    },
    [localizedHref("geneve", locale)]: {
      theme: "light",
      title: isFr
        ? "IA et transformation digitale à Genève."
        : "AI and digital transformation in Geneva.",
    },
    [localizedHref("securite", locale)]: {
      theme: "light",
      title: isFr ? "Sécurité" : "Security",
    },
    [localizedHref("confidentialite", locale)]: {
      theme: "light",
      title: isFr
        ? "Transparence et confiance au cœur de nos opérations."
        : "Transparency and trust at the core of our operations.",
    },
    [localizedHref("mentions-legales", locale)]: {
      theme: "light",
      title: isFr ? "Mentions légales" : "Legal Notice",
    },
    [localizedHref("conditions-generales", locale)]: {
      theme: "light",
      title: isFr
        ? "Cadre clair pour une collaboration professionnelle."
        : "Clear operational guidelines for professional collaboration.",
    },
    [localizedHref("cookies", locale)]: {
      theme: "light",
      title: isFr
        ? "Transparence sur le suivi et le consentement."
        : "Clear transparency regarding tracking and consent.",
    },
  };

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-black text-white" suppressHydrationWarning>
        <LenisProvider>
          <div className="flex min-h-full flex-col">
            <CurtainTransitionProvider previews={curtainPreviews}>
              <div className="relative bg-white min-h-screen" lang={htmlLang}>
                {/* Global JSON-LD (Organization + LocalBusiness + WebSite) — SSR */}
                <StructuredData
                  lang={lang as Locale}
                  sameAs={(data.settings.socialLinks || [])
                    .map((s: { url?: string }) => s?.url)
                    .filter((u: unknown): u is string => typeof u === "string")}
                />
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-white focus:text-black focus:px-6 focus:py-3 focus:border focus:border-black/10"
                >
                  Skip to content
                </a>
                <CursorProvider />
                <MetaPixel />
                <WhatsAppButton dict={dictionary.whatsapp} />
                <GoogleAnalytics />
                <SiteHeader
                  title={data.settings.title}
                  socialLinks={data.settings.socialLinks}
                  services={data.services}
                  mainNav={data.settings.mainNav}
                />
                <main id="main-content" className="internal-page-shell mx-auto w-full flex-grow flex flex-col">
                  <div className="flex-grow">
                    <PageTransition>
                      {children}
                    </PageTransition>
                  </div>
                  <SiteFooter
                    dict={dictionary.footer}
                    socialLinks={data.settings.socialLinks}
                  />
                </main>
              </div>
            </CurtainTransitionProvider>
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
