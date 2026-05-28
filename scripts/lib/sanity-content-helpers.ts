import type { PortableTextBlock } from "@portabletext/types";

export function stepSection(title: string, body: string) {
  return {
    title,
    body: textToBlocks(body),
  };
}

export function textToBlocks(text: string): PortableTextBlock[] {
  return text
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => ({
      _type: "block" as const,
      style: "normal" as const,
      markDefs: [],
      children: [{ _type: "span" as const, text: paragraph, marks: [] as string[] }],
    }));
}

export function parseFeatureList(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.replace(/^-\s*/, "").trim())
    .filter(Boolean);
}

export type ServiceContent = {
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroH2: string;
  description: string;
  longDescription: string;
  features: string[];
};

export type ProjectContent = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  heroH1: string;
  heroH2: string;
  pitch: string;
  cardTeaser: string;
  challenge?: string;
  solution: string;
  outcome: string;
  serviceSlugs: string[];
  family: string;
  secondaryFamily?: string;
  featuredHomepage?: boolean;
};
