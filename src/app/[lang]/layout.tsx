import { SiteHeader } from "@/components/sections/site-header";
import { SiteFooter } from "@/components/sections/site-footer";
import { getDictionary } from "@/get-dictionary";
import { getHomePageData } from "@/lib/sanity.queries";
import type { Locale } from "@/i18n-config";
import { PageTransition } from "@/components/providers/page-transition";
import { CursorProvider } from "@/components/providers/cursor-provider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "MAWT — Technical Execution Partner",
    template: "%s | MAWT"
  },
  description: "Swiss-based technical execution partner for high-performance systems and digital experiences.",
  openGraph: {
    title: "MAWT",
    description: "Technical execution for ambitious companies.",
    url: "https://mawt.ch",
    siteName: "MAWT",
    locale: "en_US",
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

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);
  const data = await getHomePageData();

  return (
    <div className="relative">
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
