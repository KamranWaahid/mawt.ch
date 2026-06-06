import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";

/**
 * Shared flat PortableText renderer for CMS-driven standalone pages
 * (about / security / our-process). Honors the ultra-flat design system:
 * strong stays weight 400, em stays upright. Internal links use next/link.
 */
const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-normal tracking-tight text-black mt-12 mb-6">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-normal text-black mt-10 mb-4">{children}</h3>,
    normal: ({ children }) => <p className="text-lg text-neutral-600 font-normal leading-relaxed mb-6">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#75DAB4] pl-8 py-2 not-italic text-neutral-500 my-10">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 text-neutral-600 space-y-2 text-lg">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-neutral-600">{children}</li>,
    number: ({ children }) => <li className="text-neutral-600">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-normal text-black">{children}</strong>,
    em: ({ children }) => <em className="not-italic text-black">{children}</em>,
    link: ({ children, value }: { children: React.ReactNode; value?: { href?: string } }) => {
      const href = value?.href || "#";
      if (href.startsWith("/")) {
        return <Link href={href} className="text-[#75DAB4] underline hover:text-black transition-colors">{children}</Link>;
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#75DAB4] underline hover:text-black transition-colors">
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value }: { value?: unknown }) {
  if (!Array.isArray(value) || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
}
