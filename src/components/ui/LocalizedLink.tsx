import Link from "next/link";
import { localizedHref } from "@/lib/routing/url-helpers";
import type { Locale } from "@/lib/routing/url-map";

interface LocalizedLinkProps {
  /** Canonical FR-style path key (e.g. "services/solutions-ia/crm-intelligent"). */
  to: string;
  lang: Locale;
  children: React.ReactNode;
  className?: string;
}

export function LocalizedLink({
  to,
  lang,
  children,
  className,
}: LocalizedLinkProps) {
  return (
    <Link href={localizedHref(to, lang)} className={className}>
      {children}
    </Link>
  );
}
