import { defineField, defineType } from "sanity";

export const faqType = defineType({
  name: "faq",
  title: "FAQ",
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
      initialValue: "en",
    }),
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "General", value: "general" },
          { title: "Technical", value: "technical" },
          { title: "Pricing", value: "pricing" },
          { title: "Support", value: "support" },
        ],
      },
      initialValue: "general",
    }),
    defineField({
      name: "tags",
      title: "Family filter tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Tags for pillar page filtering: sites, branding, ecommerce, ia, crm, agent-ia, rag, automatisation, mobile, conseil, strategie, audit, transformation, change, formation, chatgpt, coaching, renfort, developpeur, fractional, qa",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
});
