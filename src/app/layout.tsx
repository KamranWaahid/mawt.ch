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
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-black text-white" suppressHydrationWarning>
        <LenisProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-black"
          >
            Skip to content
          </a>
          <div id="main-content" className="flex min-h-full flex-col">
            {children}
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
