/**
 * BUG-011 fix:
 * - Correct text color: use text-black (white on white was unreadable in light layout).
 * - "Back home" links directly to /en (avoids / → locale redirect hop).
 * - Both EN and FR are offered so the user lands on the right locale.
 * - The 404 page lives outside [lang] layout, so it applies its own contrast/bg.
 */
import Link from "next/link";
import { AnimatedTitle } from "@/components/ui/animated-title";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-6 text-center bg-white">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">404</p>
      <AnimatedTitle
        as="h1"
        text="Page not found"
        className="mt-4 text-2xl font-normal text-black md:text-3xl"
        splitBy="word"
        eager={true}
      />
      <p className="mt-4 max-w-xl text-neutral-500 font-normal leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
        {/* BUG-011: Direct locale links — no redirect chain via "/" */}
        <Link
          href="/en"
          className="rounded-sm border border-black px-8 py-3 text-sm uppercase tracking-[0.16em] text-black transition-colors hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          Back to home (EN)
        </Link>
        <Link
          href="/fr"
          className="rounded-sm border border-black/20 px-8 py-3 text-sm uppercase tracking-[0.16em] text-black/60 transition-colors hover:border-black hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          Retour à l&apos;accueil (FR)
        </Link>
      </div>
    </main>
  );
}
