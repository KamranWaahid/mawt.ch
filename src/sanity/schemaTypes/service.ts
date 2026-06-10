import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
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
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "family",
      title: "Famille / Family",
      type: "string",
      options: {
        list: [
          { title: "Sites & Branding", value: "sites-et-branding" },
          { title: "Solutions IA", value: "solutions-ia" },
          { title: "Conseil IA", value: "conseil-ia" },
          { title: "Renfort & Équipe", value: "renfort-equipe" },
          { title: "Formation IA", value: "formation-ia" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayAsCard",
      title: "Show as card on family page",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "tier",
      title: "Tier (priority on family page)",
      type: "number",
      initialValue: 50,
    }),
    defineField({
      name: "h2SeoCapture",
      title: "H2 SEO capture (optional)",
      type: "string",
    }),
    defineField({
      name: "heroH1",
      title: "Hero H1",
      type: "string",
    }),
    defineField({
      name: "heroH2",
      title: "Hero H2",
      type: "string",
    }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({
      name: "icon",
      title: "Icon Name",
      description: "Lucide icon name (e.g. Layers, Code, Cpu)",
      type: "string",
    }),
    defineField({
      name: "longDescription",
      title: "Full Narrative",
      description: "Detailed explanation of this service.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "features",
      title: "Capabilities / Features",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),

    // ─────────────────────────────────────────────────────────────
    // RICH SEO / GEO CONTENT — additive, all optional. Shapes match
    // the generated content so the populate is a 1:1 mapping.
    // ─────────────────────────────────────────────────────────────
    defineField({
      name: "answerBox",
      title: "Answer Box (direct answer / definition)",
      description:
        "Self contained 40 to 60 word answer placed high on the page. GEO/AI extraction fuel. Plain text, no links.",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(700).warning("Keep the answer box concise (~150 words max)."),
    }),
    defineField({
      name: "whoFor",
      title: "Who this is for",
      description: "Short paragraph qualifying the audience (PME suisses, entreprises en croissance).",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "sections",
      title: "Content Sections (H2 blocks)",
      type: "array",
      of: [
        {
          type: "object",
          name: "contentSection",
          title: "Section",
          fields: [
            defineField({ name: "h2", title: "Section heading (H2)", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "paragraphs", title: "Paragraphs", type: "array", of: [{ type: "text", rows: 3 }] }),
            defineField({ name: "bullets", title: "Bullet points (optional)", type: "array", of: [{ type: "string" }] }),
          ],
          preview: { select: { title: "h2" }, prepare: ({ title }) => ({ title: title || "Section" }) },
        },
      ],
    }),
    defineField({
      name: "comparisonTable",
      title: "Comparison Table",
      description: "Comparison data (e.g. template vs sur-mesure). Renders as a table; powers comparison snippets.",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Table title", type: "string" }),
        defineField({ name: "columns", title: "Column headers", type: "array", of: [{ type: "string" }] }),
        defineField({
          name: "rows",
          title: "Rows",
          type: "array",
          of: [
            {
              type: "object",
              name: "tableRow",
              fields: [defineField({ name: "cells", title: "Cells", type: "array", of: [{ type: "string" }] })],
              preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: (cells || []).join(" | ") }) },
            },
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables / What you get",
      description: "Concrete benefit framed outcomes of this service.",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "keyTakeaways",
      title: "Key Takeaways",
      description: "3 to 6 punchy summary points (rendered as a highlighted box).",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      description: "Questions/answers. Rendered on-page AND emitted as FAQPage JSON-LD.",
      type: "array",
      of: [
        {
          type: "object",
          name: "faqItem",
          title: "Q & A",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 4, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: "question" } },
        },
      ],
    }),
    defineField({
      name: "relatedServices",
      title: "Related Services (internal links)",
      description: "Cross-link to sibling services in the SAME language.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "cta",
      title: "Localized CTA",
      description: "Bottom call to action. Falls back to localized defaults if empty.",
      type: "object",
      fields: [
        defineField({ name: "headline", title: "Headline", type: "string" }),
        defineField({ name: "primaryLabel", title: "Primary button label", type: "string" }),
        defineField({ name: "primaryHref", title: "Primary href (relative, without /lang)", type: "string" }),
        defineField({ name: "secondaryLabel", title: "Secondary link label", type: "string" }),
        defineField({ name: "secondaryHref", title: "Secondary href (relative, without /lang)", type: "string" }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    defineField({
      name: "featuredProjects",
      title: "Featured Projects",
      description: "Select projects that best demonstrate this service.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
});
