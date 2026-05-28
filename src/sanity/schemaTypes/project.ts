import { defineArrayMember, defineField, defineType } from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
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
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required().custom((slug) => {
        if (typeof slug === "undefined") return true;
        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return regex.test(slug.current!) || "Slug must only contain lowercase letters, numbers, and hyphens.";
      }),
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
    defineField({
      name: "pitch",
      title: "Hero pitch",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "cardTeaser",
      title: "Card teaser",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "challenge",
      title: "The challenge",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "featuredHomepage",
      title: "Featured on homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "family",
      title: "Primary family",
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
    }),
    defineField({
      name: "secondaryFamily",
      title: "Secondary family",
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
    }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "overview", type: "text", rows: 8 }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "workType", title: "Work Type", type: "string" }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({
      name: "tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "coverImage",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", type: "string", title: "Alt text" }),
            defineField({ name: "caption", type: "string", title: "Caption" }),
          ],
        }),
      ],
    }),
    defineField({ name: "testimonialQuote", type: "text", rows: 3 }),
    defineField({ name: "testimonialAuthor", type: "string" }),
    defineField({
      name: "services",
      title: "Utilized Services",
      type: "array",
      of: [{ type: "reference", to: [{ type: "service" }] }],
    }),
    defineField({
      name: "phases",
      title: "Project Phases",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "phase",
          fields: [
            defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", type: "text", rows: 3 }),
            defineField({
              name: "deliverables",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
    }),
    defineField({ name: "problemStatement", title: "Problem Statement", type: "text", rows: 4 }),
    defineField({ name: "problemImage", title: "Problem Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "solution", title: "What we built", type: "text", rows: 8 }),
    defineField({ name: "solutionImage", title: "Solution Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "outcome",
      title: "Outcome",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "deliverables",
      title: "Deliverables",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "technologies",
      title: "Technologies Used",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
});
