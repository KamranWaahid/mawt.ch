import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18n } from "./i18n-config";
import { toFilesystemPathname } from "@/lib/routing/url-helpers";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;

  // Use negotiator + intl-localematcher to pick the best locale from Accept-Language.
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  return matchLocale(languages, locales, i18n.defaultLocale);
}

// Forward the active locale to Server Components via a request header so the
// root layout (which has no `lang` route param) can set `<html lang>` correctly.
const LOCALE_HEADER = "x-mawt-locale";

function localeFromPathname(pathname: string): string | undefined {
  return i18n.locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

function withLocaleHeader(request: NextRequest, locale: string) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  return requestHeaders;
}

// Next.js 16 renamed `middleware` to `proxy`. Same functionality.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Studio/Admin normalization & protection.
  // If someone visits /en/studio or /fr/studio, redirect them to root /studio.
  const isLocalizedStudio = i18n.locales.some((locale) =>
    pathname.startsWith(`/${locale}/studio`),
  );
  if (isLocalizedStudio) {
    const cleanPath = pathname.replace(/^\/(en|fr)/, "");
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }

  const isStudio =
    pathname.startsWith("/studio") || pathname.startsWith("/admin");

  if (isStudio) {
    const adminSecret = process.env.ADMIN_SECRET || "mawt-dev-key";
    const cookieSecret = request.cookies.get("admin-token")?.value;

    if (cookieSecret === adminSecret) {
      return NextResponse.next();
    }

    const locale = getLocale(request) || i18n.defaultLocale;
    if (!pathname.includes("/login")) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // 2. Ignore public assets from locale redirection.
  const isPublicAsset = [
    "/App Icons/",
    "/HeroImages/",
    "/Client Logos.png",
    "/HeroImage.gif",
    "/HeroImage.png",
    "/MAWT Logo.svg",
    "/MAWT Branding/",
    "/PlanetBackground.png",
    "/file.svg",
    "/globe.svg",
    "/next.svg",
    "/vercel.svg",
    "/window.svg",
    "/logo-black.svg",
    "/logo-white.svg",
    "/favicon.svg",
    "/favicon.ico",
  ].some((path) => pathname.startsWith(path));

  if (isPublicAsset) {
    return NextResponse.next();
  }

  // 3. Locale redirection (exclude studio).
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale && !isStudio) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }

  // 4. Localized URL → filesystem rewrite.
  // Public URLs are fully localized (e.g. /fr/a-propos, /en/privacy); rewrite them
  // onto the shared on-disk folder (/fr/about, /en/legal) without changing the URL.
  const activeLocale =
    localeFromPathname(pathname) || getLocale(request) || i18n.defaultLocale;
  const headers = withLocaleHeader(request, activeLocale);

  if (!isStudio) {
    const fsPathname = toFilesystemPathname(pathname);
    if (fsPathname !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = fsPathname;
      return NextResponse.rewrite(url, { request: { headers } });
    }
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Matcher ignoring `/_next/`, `/api/`, and root metadata files (sitemap, robots,
  // favicon) so they are not caught by the locale redirect/rewrite.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
