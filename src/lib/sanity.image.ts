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
