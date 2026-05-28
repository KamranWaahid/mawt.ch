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
    defineField({
      name: "featuredProjects",
      title: "Featured Projects",
      description: "Select projects that best demonstrate this service.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
  ],
});
