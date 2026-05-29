import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Generic static page content (legal pages, list-page headers, etc.).
 * Mirrors the methodPage / securityPage pattern but with a free-form
 * Portable Text `body`, so the same type can hold long legal documents
 * and short list-page headers (blog, faqs, clients/partners).
 *
 * `pageKey` identifies which front-end route consumes the document
 * (e.g. "legal-notice", "terms", "privacy", "cookies", "contact",
 * "clients", "faqs", "blog"). The front-end queries by pageKey + language.
 */
export const pageContentType = defineType({
  name: "pageContent",
  title: "Static Pages",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page key",
      type: "string",
      description:
        "Stable identifier for the front-end route. Same key for the FR and EN versions.",
      options: {
        list: [
          { title: "Legal notice (Mentions légales)", value: "legal-notice" },
          { title: "Terms (CGU)", value: "terms" },
          { title: "Privacy (Confidentialité)", value: "privacy" },
          { title: "Cookies", value: "cookies" },
          { title: "Contact (hero)", value: "contact" },
          { title: "Clients / Partners", value: "clients" },
          { title: "FAQs (header)", value: "faqs" },
          { title: "Blog (header)", value: "blog" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "French", value: "fr" },
          { title: "English", value: "en" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "heroH1", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroH1",
      title: "Hero H1",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heroH2", title: "Hero H2", type: "text", rows: 2 }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "body",
      title: "Body (Portable Text)",
      description:
        "Main content. Use H2 headings for sections (used for legal documents).",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({ name: "bottomCtaH2", title: "Bottom CTA H2", type: "string" }),
    defineField({ name: "bottomCtaBody", title: "Bottom CTA body", type: "text", rows: 3 }),
    defineField({ name: "bottomCtaLabel", title: "Bottom CTA label", type: "string" }),
    defineField({ name: "seo", title: "SEO Settings", type: "seo" }),
  ],
  preview: {
    select: { title: "heroH1", subtitle: "pageKey", lang: "language" },
    prepare({ title, subtitle, lang }) {
      return {
        title: title || subtitle,
        subtitle: `${subtitle} · ${(lang || "").toUpperCase()}`,
      };
    },
  },
});
