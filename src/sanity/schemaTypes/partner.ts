import { defineField, defineType } from "sanity";

export const partnerType = defineType({
  name: "partner",
  title: "Partners",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Partner Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "url",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Technology Partner", value: "technology" },
          { title: "Strategic Partner", value: "strategic" },
          { title: "Engineering Partner", value: "engineering" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
       name: "featured",
       title: "Featured on Homepage",
       type: "boolean",
       initialValue: true,
    }),
  ],
});
