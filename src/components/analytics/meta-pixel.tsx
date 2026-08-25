"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = "959258244767672";
const COOKIE_CONSENT_KEY = "mawt-cookie-consent";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta Pixel, wired to the site's existing consent model (see
 * cookie-consent.tsx): loads unless the visitor opted for essential-only
 * cookies, mirroring how analytics cookies are handled elsewhere.
 * PageView is re-fired on App Router client navigations, which the base
 * snippet alone would miss.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    if (localStorage.getItem(COOKIE_CONSENT_KEY) === "essential") return;
    loadedRef.current = true;
    if (!document.getElementById("meta-pixel")) {
      const script = document.createElement("script");
      script.id = "meta-pixel";
      script.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`;
      document.head.appendChild(script);
    }
  }, []);

  // SPA navigations don't reload the page, so PageView must follow the route.
  const isFirstRoute = useRef(true);
  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return null;
}
