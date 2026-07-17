import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { getDictionary } from "@/get-dictionary";
import { getHomePageData } from "@/lib/sanity.queries";
import { i18n, type Locale } from "@/i18n-config";
import { PageTransition } from "@/components/providers/page-transition";
import { CurtainTransitionProvider } from "@/components/providers/curtain-transition";
import { ABOUT_COPY } from "@/content/about-copy";
import { CursorProvider } from "@/components/providers/cursor-provider";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { StructuredData } from "@/components/seo/structured-data";
import { Inter, Instrument_Serif } from "next/font/google";
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
    },
    twitter: {
      card: "summary_large_image",
      title: isFr ? "MAWT | Agence IA à Genève" : "MAWT | AI agency in Geneva",
      description: isFr
        ? "Agence IA à Genève. Intelligence artificielle, automatisation des processus et outils sur mesure pour PME."
        : "AI agency in Geneva. Artificial intelligence, process automation and custom tools for SMEs and growing companies.",
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
  const htmlLang = lang === "fr" ? "fr" : "en";
  const dictionary = await getDictionary(lang as Locale);
  const data = await getHomePageData(lang);

  return (
    <html
      lang={htmlLang}
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-black text-white" suppressHydrationWarning>
        <LenisProvider>
          <div className="flex min-h-full flex-col">
            <CurtainTransitionProvider
              servicesPreview={{
                title: dictionary.services.hero.title,
                crossLabel: dictionary.services.hero.crossLabel,
                tagline: dictionary.services.hero.tagline,
              }}
              workPreview={{
                title: dictionary.work.hero.title,
                crossLabel: dictionary.work.hero.crossLabel,
                tagline: dictionary.work.hero.tagline,
              }}
              newsPreview={{
                title: dictionary.insights.hero.title,
                crossLabel: dictionary.insights.hero.crossLabel,
                tagline: dictionary.insights.hero.tagline,
              }}
              aboutPreview={{
                title: ABOUT_COPY[lang as Locale].hero.h1,
                layout: "statement",
              }}
              contactPreview={{
                title: dictionary.contact.hero.title,
                crossLabel: dictionary.contact.hero.crossLabel,
                tagline: dictionary.contact.hero.tagline,
              }}
            >
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
