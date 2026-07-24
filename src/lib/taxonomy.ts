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
      conference: { ko: "컨퍼런스", en: "Conference" },
      workshop: { ko: "워크숍", en: "Workshop" }
    }
  },
  methods: {
    label: { ko: "방법론", en: "Methods" },
    subcategories: {
      "working-backwards": { ko: "Working Backwards", en: "Working Backwards" }
    }
  },
  projects: {
    label: { ko: "프로젝트", en: "Projects" },
    subcategories: {
      kuberca: { ko: "KubeRCA", en: "KubeRCA" },
      "runai-rca": { ko: "Run:AI RCA", en: "Run:AI RCA" },
      prototypes: { ko: "AI 프로토타입", en: "AI Prototypes" }
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
      debugging: { ko: "디버깅", en: "Debugging" },
      "ai-platform": { ko: "AI 플랫폼", en: "AI Platform" },
      "incident-response": { ko: "장애 대응", en: "Incident Response" }
    }
  }
} satisfies Record<string, { label: Localized; subcategories: Record<string, Localized> }>;

export function categoryLabel(category: string, lang: Lang) {
  return taxonomy[category]?.label[lang] ?? category;
}

export function subcategoryLabel(category: string, subcategory: string, lang: Lang) {
  return taxonomy[category]?.subcategories[subcategory]?.[lang] ?? subcategory;
}
