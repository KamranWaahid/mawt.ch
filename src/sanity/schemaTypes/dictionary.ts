import { defineType, defineField } from "sanity";

export const dictionaryType = defineType({
  name: "dictionary",
  title: "UI Dictionary",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "French", value: "fr" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "namespace",
      title: "Namespace",
      type: "string",
      description: "e.g., 'common', 'contact', 'footer'",
      options: {
        list: [
          { title: "Common", value: "common" },
          { title: "Home", value: "home" },
          { title: "Contact", value: "contact" },
          { title: "Footer", value: "footer" },
          { title: "Documentation", value: "docs" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "labels",
      title: "Labels",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "key", title: "Key", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: {
            select: {
              title: "key",
              subtitle: "value",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      language: "language",
      namespace: "namespace",
    },
    prepare({ language, namespace }) {
      return {
        title: `${namespace.toUpperCase()} (${language.toUpperCase()})`,
      };
    },
  },
});
