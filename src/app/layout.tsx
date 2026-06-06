import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LenisProvider } from "@/components/providers/lenis-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mawt.ch"),
  title: {
    default: "MAWT | Technical Execution for High-Performance Teams",
    template: "%s | MAWT",
  },
  description:
    "Swiss technical execution partner building high-performance systems, automation, and digital infrastructure for teams that move fast.",
  openGraph: {
    title: "MAWT | Technical Execution for High-Performance Teams",
    description:
      "Swiss technical execution partner building high-performance systems, automation, and digital infrastructure.",
    type: "website",
    url: "https://mawt.ch",
    siteName: "MAWT",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAWT | Technical Execution",
    description:
      "Swiss technical execution partner building high-performance systems and automation.",
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
      className={`${inter.variable} h-full antialiased`}
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
