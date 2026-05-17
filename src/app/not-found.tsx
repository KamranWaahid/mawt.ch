import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-neutral-300">
        The content you requested could not be found. Return to the portfolio homepage.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full border border-white/20 px-6 py-3 text-sm uppercase tracking-[0.16em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        Back home
      </Link>
    </main>
  );
}
