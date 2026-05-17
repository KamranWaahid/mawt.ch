import { defineType, defineField, defineArrayMember } from "sanity";

export const comparisonTableType = defineType({
  name: "comparisonTable",
  title: "Comparison Table",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Table Title",
      type: "string",
    }),
    defineField({
      name: "headers",
      title: "Headers",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
        }),
      ],
    }),
  ],
});
