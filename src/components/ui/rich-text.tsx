import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared flat PortableText renderer for CMS-driven standalone pages
 * (about / security / our-process). Honors the ultra-flat design system:
 * strong stays weight 400, em stays upright. Internal links use next/link.
 */
function createComponents(tone: "light" | "dark"): PortableTextComponents {
  const isDark = tone === "dark";
  const heading = isDark ? "text-white" : "text-black";
  const body = isDark ? "text-white/55" : "text-neutral-600";
  const strong = isDark ? "text-white" : "text-black";
  const quote = isDark ? "text-white/45 border-white/20" : "text-neutral-500 border-[#75DAB4]";
  const linkHover = isDark ? "hover:text-white" : "hover:text-black";

  return {
    block: {
      h2: ({ children }) => (
        <h2 className={`mt-12 mb-6 text-[clamp(1.6rem,2.8vw,2.4rem)] font-medium tracking-tight ${heading}`}>
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className={`mt-10 mb-4 text-[clamp(1.25rem,2vw,1.6rem)] font-medium tracking-tight ${heading}`}>
          {children}
        </h3>
      ),
      normal: ({ children }) => (
        <p className={`mb-6 text-[16px] font-normal leading-relaxed md:text-[17px] ${body}`}>{children}</p>
      ),
      blockquote: ({ children }) => (
        <blockquote className={`my-10 border-l pl-8 py-2 not-italic ${quote}`}>{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className={`mb-6 list-disc space-y-2 pl-6 text-[16px] md:text-[17px] ${body}`}>{children}</ul>
      ),
      number: ({ children }) => (
        <ol className={`mb-6 list-decimal space-y-2 pl-6 text-[16px] md:text-[17px] ${body}`}>{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li className={body}>{children}</li>,
      number: ({ children }) => <li className={body}>{children}</li>,
    },
    marks: {
      strong: ({ children }) => <strong className={`font-normal ${strong}`}>{children}</strong>,
      em: ({ children }) => <em className={`not-italic ${strong}`}>{children}</em>,
      link: ({ children, value }: { children: ReactNode; value?: { href?: string } }) => {
        const href = value?.href || "#";
        if (href.startsWith("/")) {
          return (
            <Link href={href} className={`text-[#75DAB4] underline transition-colors ${linkHover}`}>
              {children}
            </Link>
          );
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[#75DAB4] underline transition-colors ${linkHover}`}
          >
            {children}
          </a>
        );
      },
    },
  };
}

const lightComponents = createComponents("light");
const darkComponents = createComponents("dark");

export function RichText({
  value,
  tone = "light",
}: {
  value?: unknown;
  tone?: "light" | "dark";
}) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <PortableText
      value={value}
      components={tone === "dark" ? darkComponents : lightComponents}
    />
  );
}
