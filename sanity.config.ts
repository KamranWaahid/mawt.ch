import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";

import { schemaTypes } from "@/sanity/schemaTypes";

import { deskStructure } from "@/sanity/structure/deskStructure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "demo-project-id";
const isDemo = projectId === "demo-project-id";

export default defineConfig({
  name: "default",
  title: isDemo ? "MAWT Command Center (Demo Mode)" : "MAWT Command Center",
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: deskStructure,
    }),
    codeInput(),
  ],
  schema: { types: schemaTypes },
});
