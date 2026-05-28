import { defineField, defineType, defineArrayMember } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog & Insights",
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
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required().custom((slug) => {
        if (typeof slug === "undefined") return true;
        const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
        return regex.test(slug.current!) || "Slug must only contain lowercase letters, numbers, and hyphens.";
      }),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
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
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Cas clients / Case studies", value: "cas-clients" },
          { title: "Tendances IA / AI trends", value: "tendances-ia" },
          { title: "Guides pratiques / Practical guides", value: "guides-pratiques" },
          { title: "Opinions", value: "opinions" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
      description:
        "Free-form tags. Suggested: service slugs (crm-intelligent, agent-ia...), sectors (immobilier, ecommerce...), or technologies (nextjs, sanity...). 2-5 tags ideal.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
        defineArrayMember({
           type: "code",
           title: "Code Block",
           options: { withFilename: true }
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});
