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
          { title: "Hero", value: "hero" },
          { title: "Clients (Who trust us)", value: "clients" },
          { title: "Description", value: "description" },
          { title: "Problem", value: "problem" },
          { title: "Vision", value: "vision" },
          { title: "Solution", value: "solution" },
          { title: "Work", value: "work" },
          { title: "Process", value: "process" },
          { title: "Insights", value: "insights" },
          { title: "Services", value: "services" },
          { title: "Help Center", value: "help" },
          { title: "FAQ", value: "faq" },
          { title: "Results", value: "results" },
          { title: "Login", value: "login" },
          { title: "Partners Page", value: "partners" },
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
