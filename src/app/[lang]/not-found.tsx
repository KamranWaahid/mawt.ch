import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeaderTheme } from "@/components/ui/header-theme";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#161616] text-center text-white">
      <HeaderTheme theme="light" />
      <div className="site-container-xwide flex flex-col items-center">
      <p className="text-[13px] font-normal tracking-wide text-white/40">404</p>
      <h1 className="mt-4 max-w-[16ch] text-[clamp(2rem,4vw,3.2rem)] font-medium leading-[1.05] tracking-tight text-white">
        This page is not here
      </h1>
      <p className="mt-5 max-w-xl text-base font-normal leading-relaxed text-white/50">
        The address may have changed, or the page may never have existed. You can return home and
        continue from there.
      </p>
      <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
        <Link
          href="/en"
          className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-6 py-3 text-sm font-normal text-white/90 transition-colors hover:border-white/40 hover:bg-white/[0.14] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Return home (EN)
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/fr"
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-normal text-white/60 transition-colors hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          Retour à l&apos;accueil (FR)
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
      </div>
    </div>
  );
}
