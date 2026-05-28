import { defineArrayMember, defineField, defineType } from "sanity";

export const methodPageType = defineType({
  name: "methodPage",
  title: "Method Page",
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
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "heroH1", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "heroH1", title: "Hero H1", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "heroH2", title: "Hero H2", type: "text", rows: 2 }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "steps",
      title: "Process steps (5 temps)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
            defineField({
              name: "body",
              title: "Body (Portable Text)",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        }),
      ],
      validation: (Rule) => Rule.max(5),
    }),
    defineField({
      name: "differentiators",
      title: "What makes us different",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({ name: "bottomCtaH2", title: "Bottom CTA H2", type: "string" }),
    defineField({ name: "bottomCtaBody", title: "Bottom CTA body", type: "text", rows: 3 }),
    defineField({ name: "bottomCtaLabel", title: "Bottom CTA label", type: "string" }),
    defineField({ name: "seo", title: "SEO Settings", type: "seo" }),
  ],
});
