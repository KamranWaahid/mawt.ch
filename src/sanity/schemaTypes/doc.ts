import { defineField, defineType, defineArrayMember } from "sanity";

export const docType = defineType({
  name: "doc",
  title: "Documentation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().custom((slug) => {
        if (typeof slug === "undefined") return true;
        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return regex.test(slug.current!) || "Slug must only contain lowercase letters, numbers, and hyphens.";
      }),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: {
        list: [
          { title: "Getting Started", value: "getting-started" },
          { title: "Core Concepts", value: "core-concepts" },
          { title: "Guides", value: "guides" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
        defineArrayMember({ type: "comparisonTable" }),
        {
          type: "code",
          title: "Code Block",
          options: {
            withLineNumbers: true,
          },
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Technical", value: "technical" },
          { title: "Operational", value: "operational" },
          { title: "Strategic", value: "strategic" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "estimatedReadTime",
      title: "Estimated Read Time (minutes)",
      type: "number",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "relatedDocs",
      title: "Related Guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "doc" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
});
