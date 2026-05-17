import { defineField } from "sanity";

export const seoObject = {
  name: "seo",
  title: "SEO & Social Media",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description: "Optimized title for search engines (suggested 50-60 characters).",
      validation: (Rule) => Rule.max(60).warning("Longer titles may be truncated by search engines."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "Brief summary for search results (suggested 150-160 characters).",
      validation: (Rule) => Rule.max(160).warning("Longer descriptions may be truncated by search engines."),
    }),
    defineField({
      name: "shareImage",
      title: "Social Share Image",
      type: "image",
      description: "Image used for Open Graph (Facebook, LinkedIn) and Twitter cards.",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
  ],
};
