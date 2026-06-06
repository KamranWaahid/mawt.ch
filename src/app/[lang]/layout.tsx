import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { getDictionary } from "@/get-dictionary";
import { getHomePageData } from "@/lib/sanity.queries";
import { i18n, type Locale } from "@/i18n-config";
import { PageTransition } from "@/components/providers/page-transition";
import { CursorProvider } from "@/components/providers/cursor-provider";
import { StructuredData } from "@/components/seo/structured-data";
import type { Metadata } from "next";

// ISR: pages render statically at build (SSG via generateStaticParams) and
// refresh from Sanity at most once an hour. Pairs with the static root layout.
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
    title: {
      default: isFr
        ? "MAWT — Partenaire d'exécution technique"
        : "MAWT — Technical Execution Partner",
      template: "%s | MAWT",
    },
    description: isFr
      ? "Partenaire suisse d'exécution technique pour la Suisse romande : systèmes haute performance et expériences digitales."
      : "Swiss-based technical execution partner for high-performance systems and digital experiences.",
    openGraph: {
      title: "MAWT",
      description: isFr
        ? "Exécution technique pour entreprises ambitieuses."
        : "Technical execution for ambitious companies.",
      url: "https://mawt.ch",
      siteName: "MAWT",
      locale: isFr ? "fr_CH" : "en_US",
      type: "website",
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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const data = await getHomePageData(lang);

  return (
    <div className="relative" lang={lang}>
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
      <main id="main-content" className="mx-auto w-full">
        <PageTransition>
          {children}
        </PageTransition>
        <SiteFooter 
          dict={dictionary.footer} 
          socialLinks={data.settings.socialLinks} 
        />
      </main>
    </div>
  );
}
