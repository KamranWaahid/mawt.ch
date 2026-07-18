"use client";

/**
 * Route error boundary for the whole localized tree. Two jobs:
 * 1. Give the user a branded recovery path (retry / go home) instead of the
 *    default unstyled Next error screen.
 * 2. Restore interaction: an error mid page-transition can strand the frozen
 *    curtain snapshot or a Lenis scroll lock on screen — clear both so the
 *    site is never stuck behind an overlay or with scrolling disabled.
 *
 * Copy is inline (EN + FR by pathname) like not-found.tsx: error boundaries
 * render when data loading itself may have failed, so they must not depend
 * on fetched dictionaries.
 */

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LangError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const isFr = pathname?.startsWith("/fr");

  useEffect(() => {
    // Recovery cleanup: never leave the page covered or scroll-locked.
    document.getElementById("mawt-slide-snapshot")?.remove();
    document.documentElement.classList.remove("lenis-stopped");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center bg-white px-6 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
        {isFr ? "Erreur" : "Error"}
      </p>
      <h1 className="mt-4 text-2xl font-normal text-black md:text-3xl">
        {isFr ? "Un problème est survenu" : "Something went wrong"}
      </h1>
      <p className="mt-4 max-w-xl font-normal leading-relaxed text-neutral-500">
        {isFr
          ? "Cette page n'a pas pu se charger. Vous pouvez réessayer ou revenir à l'accueil."
          : "This page couldn't load. You can try again or head back home."}
      </p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-sm border border-black px-8 py-3 text-sm uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          {isFr ? "Réessayer" : "Try again"}
        </button>
        <Link
          href={isFr ? "/fr" : "/en"}
          className="rounded-sm border border-black/20 px-8 py-3 text-sm uppercase tracking-[0.16em] text-black/60 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          {isFr ? "Retour à l'accueil" : "Back to home"}
        </Link>
      </div>
    </main>
  );
}
