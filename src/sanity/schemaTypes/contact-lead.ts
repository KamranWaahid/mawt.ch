import { defineType, defineField } from "sanity";

export const contactLead = defineType({
  name: "contactLead",
  title: "Contact Lead",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "service",
      title: "Interested Service",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "timeline",
      title: "Project Timeline",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "🟢 New", value: "new" },
          { title: "🟡 Contacted", value: "contacted" },
          { title: "🔵 Qualified", value: "qualified" },
          { title: "⚪ Lost", value: "lost" },
          { title: "🏁 Won", value: "won" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "internalNotes",
      title: "Internal Notes",
      type: "text",
      description: "For internal team use only.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      email: "email",
      status: "status",
    },
    prepare({ title, email, status }) {
      const statusLabels: Record<string, string> = {
        new: "🟢 New",
        contacted: "🟡 Contacted",
        qualified: "🔵 Qualified",
        lost: "⚪ Lost",
        won: "🏁 Won",
      };
      return {
        title: `${title} (${statusLabels[status] || status})`,
        subtitle: email,
      };
    },
  },
});
