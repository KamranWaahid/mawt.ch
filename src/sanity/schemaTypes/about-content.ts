import { defineField, defineType } from "sanity";

export const aboutContentType = defineType({
  name: "aboutContent",
  title: "About Content",
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
    defineField({ name: "heroH1", title: "Hero H1", type: "string" }),
    defineField({ name: "heroH2", title: "Hero H2", type: "text", rows: 3 }),
    defineField({ name: "storyH2", title: "Story H2", type: "string" }),
    defineField({ name: "storyP1", title: "Story paragraph 1", type: "text", rows: 3 }),
    defineField({ name: "storyP2", title: "Story paragraph 2", type: "text", rows: 3 }),
    defineField({ name: "storyP3", title: "Story paragraph 3", type: "text", rows: 3 }),
    defineField({ name: "teamH2", title: "Team H2", type: "string" }),
    defineField({ name: "teamBody", title: "Team body", type: "text", rows: 4 }),
    defineField({
      name: "principles",
      title: "How we work principles",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "emoji", type: "string", title: "Emoji" },
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 2 },
          ],
        },
      ],
    }),
    defineField({ name: "trackRecordH2", title: "Track record H2", type: "string" }),
    defineField({ name: "trackRecordBody", title: "Track record body", type: "string" }),
    defineField({ name: "bottomCtaH2", title: "Bottom CTA H2", type: "string" }),
    defineField({ name: "bottomCtaBody", title: "Bottom CTA body", type: "text", rows: 3 }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "subheading", type: "text", rows: 3 }),
    defineField({ name: "story", title: "Our Story (legacy)", type: "text", rows: 6 }),
    defineField({
      name: "values",
      title: "Core Values (legacy)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 2 },
          ],
        },
      ],
    }),
    defineField({
      name: "locations",
      title: "Our Locations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "city", type: "string" },
            { name: "description", type: "string" },
          ],
        },
      ],
    }),
  ],
});
