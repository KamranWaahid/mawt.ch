import type { Locale } from "./i18n-config";
import { getDictionaryFromSanity } from "./lib/sanity.queries";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  const loadLocalDictionary = dictionaries[locale] || dictionaries.en;
  const localDict = await loadLocalDictionary();
  
  try {
    const sanityDict = await getDictionaryFromSanity(locale);
    
    // Merge logic: Sanity overrides local JSON
    // We do a deep merge for each namespace
    const mergedDict: Record<string, any> = { ...localDict };
    
    Object.keys(sanityDict).forEach((namespace) => {
      if (mergedDict[namespace]) {
        mergedDict[namespace] = {
          ...mergedDict[namespace],
          ...sanityDict[namespace],
        };
      } else {
        mergedDict[namespace] = sanityDict[namespace];
      }
    });

    return mergedDict;
  } catch (err) {
    console.error("Failed to merge Sanity dictionary, falling back to local:", err);
    return localDict;
  }
};
