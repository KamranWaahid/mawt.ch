import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mawt.ch"),
  title: {
    default: "MAWT | AI agency in Geneva",
    template: "%s | MAWT",
  },
  description:
    "AI agency in Geneva. We integrate artificial intelligence, automate processes and ship custom tools for SMEs and growing companies across French speaking Switzerland.",
  openGraph: {
    title: "MAWT | AI agency in Geneva",
    description:
      "AI agency in Geneva. Artificial intelligence, process automation and custom tools for SMEs and growing companies. Solutions that run, not slides.",
    type: "website",
    url: "https://mawt.ch",
    siteName: "MAWT",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAWT | AI agency in Geneva",
    description:
      "AI agency in Geneva. Artificial intelligence, process automation and custom tools for SMEs and growing companies.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `lang` stays a static default here: reading headers() to make it dynamic
  // opts the ENTIRE site out of static rendering (SSG), which tanked TTFB.
  // The localized subtree declares its real language via `<div lang>` in
  // [lang]/layout.tsx, which is valid HTML and SSG-friendly.
  return (
      <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-black text-white" suppressHydrationWarning>
        <LenisProvider>
          {/* The single <main id="main-content"> lives in [lang]/layout.tsx,
              which also owns the skip link, to avoid a duplicate landmark/id. */}
          <div className="flex min-h-full flex-col">{children}</div>
        </LenisProvider>
      </body>
    </html>
  );
}
