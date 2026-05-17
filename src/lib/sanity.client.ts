import { createClient } from "next-sanity";

const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-01-01";
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();

export const hasSanityEnv = Boolean(projectId && dataset);

export type SanityClient = ReturnType<typeof createClient>;

let sanityClient: SanityClient | null = null;

export function getSanityClient(): SanityClient | null {
  if (!projectId || !dataset) {
    return null;
  }

  sanityClient ??= createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
    perspective: "published",
  });

  return sanityClient;
}
