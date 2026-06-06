import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);

  return locale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Studio/Admin Normalization & Protection
  // If someone visits /en/studio or /fr/studio, redirect them to root /studio
  const isLocalizedStudio = i18n.locales.some(locale => pathname.startsWith(`/${locale}/studio`));
  if (isLocalizedStudio) {
    const cleanPath = pathname.replace(/^\/(en|fr)/, '');
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }

  const isStudio = pathname.startsWith("/studio") || pathname.startsWith("/admin");

  if (isStudio) {
    const adminSecret = process.env.ADMIN_SECRET || "mawt-dev-key";
    const cookieSecret = request.cookies.get("admin-token")?.value;

    // Allow access if token matches secret
    if (cookieSecret === adminSecret) {
      return NextResponse.next();
    }

    // Otherwise redirect to login
    const locale = getLocale(request) || i18n.defaultLocale;
    if (!pathname.includes("/login")) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // 2. Ignore Public Assets from Locale Redirection
  const isPublicAsset = [
    "/App Icons/",
    "/HeroImages/",
    "/Client Logos.png",
    "/HeroImage.gif",
    "/HeroImage.png",
    "/MAWT Logo.svg",
    "/PlanetBackground.png",
    "/Service Background.png",
    "/Service%20Background.png",
    "/file.svg",
    "/globe.svg",
    "/next.svg",
    "/vercel.svg",
    "/window.svg",
    "/logo-black.svg",
    "/logo-white.svg",
    "/favicon.svg",
    "/favicon.ico"
  ].some((path) => pathname.startsWith(path));

  if (isPublicAsset) {
    return NextResponse.next();
  }

  // 3. Locale Redirection (Exclude Studio)
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale && !isStudio) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url
      )
    );
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
