import { defineField, defineType } from "sanity";

export const aboutContentType = defineType({
  name: "aboutContent",
  title: "About Content",
  type: "document",
  fields: [
    defineField({ name: "heading", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subheading", type: "text", rows: 3 }),
    defineField({ name: "story", title: "Our Story", type: "text", rows: 6 }),
    defineField({
      name: "values",
      title: "Core Values",
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
