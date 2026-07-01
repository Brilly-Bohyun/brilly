import type { Lang } from "./site";

type Localized = Record<Lang, string>;

export const taxonomy = {
  meta: {
    label: { ko: "인사말", en: "Greeting" },
    subcategories: {
      starting: { ko: "시작", en: "Starting" }
    }
  },
  talks: {
    label: { ko: "발표", en: "Talks" },
    subcategories: {
      conference: { ko: "컨퍼런스", en: "Conference" }
    }
  },
  "open-source": {
    label: { ko: "오픈소스", en: "Open Source" },
    subcategories: {
      community: { ko: "커뮤니티", en: "Community" }
    }
  },
  engineering: {
    label: { ko: "엔지니어링", en: "Engineering" },
    subcategories: {
      debugging: { ko: "디버깅", en: "Debugging" }
    }
  }
} satisfies Record<string, { label: Localized; subcategories: Record<string, Localized> }>;

export function categoryLabel(category: string, lang: Lang) {
  return taxonomy[category]?.label[lang] ?? category;
}

export function subcategoryLabel(category: string, subcategory: string, lang: Lang) {
  return taxonomy[category]?.subcategories[subcategory]?.[lang] ?? subcategory;
}
