import { defineField, defineType } from "sanity";

export const contactType = defineType({
  name: "contact",
  title: "Contact Settings",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "email",
      title: "Main Email",
      type: "string",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "offices",
      title: "Office Locations",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "city", title: "City", type: "string" },
            { name: "address", title: "Address", type: "text", rows: 3 },
            { name: "mapUrl", title: "Google Maps URL", type: "url" },
            { name: "isMain", title: "Main Office", type: "boolean", initialValue: false },
          ],
        },
      ],
    }),
    defineField({
      name: "socialHeadline",
      title: "Social Links Headline",
      type: "string",
      initialValue: "Follow our execution",
    }),
  ],
});
