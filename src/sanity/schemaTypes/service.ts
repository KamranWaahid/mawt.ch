import { defineField, defineType } from "sanity";

export const serviceType = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "E.g., Strategy, Content, Design, Development, Performance",
      type: "string",
      validation: (Rule) => Rule.required(),
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
