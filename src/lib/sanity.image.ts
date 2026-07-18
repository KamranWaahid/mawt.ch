import imageUrlBuilder from "@sanity/image-url";
import type { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";

import { getSanityClient } from "@/lib/sanity.client";
import type { SanityImageSource } from "@/lib/types";

let builder: ImageUrlBuilder | null = null;

const getImageBuilder = (): ImageUrlBuilder | null => {
  const client = getSanityClient();

  if (!client) {
    return null;
  }

  builder ??= imageUrlBuilder(client);

  return builder;
};

export const urlForImage = (source?: SanityImageSource | null) => {
  if (!source?.asset?._ref) {
    return null;
  }

  return getImageBuilder()?.image(source) ?? null;
};

/**
 * Intrinsic dimensions parsed from the Sanity asset ref
 * (`image-<id>-<width>x<height>-<format>`). Lets <img> tags declare
 * width/height so the browser reserves the exact space before the file
 * loads — no layout shift, no content jumping under the reader.
 */
export const imageDimensions = (
  source?: SanityImageSource | null,
): { width: number; height: number } | null => {
  const ref = source?.asset?._ref;
  if (!ref) return null;
  const match = /-(\d+)x(\d+)-/.exec(ref);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!width || !height) return null;
  return { width, height };
};
