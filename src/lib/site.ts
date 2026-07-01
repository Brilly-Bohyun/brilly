export const site = {
  name: "Brilly",
  owner: "Brilly-Bohyun",
  repo: "Brilly-Bohyun/brilly",
  description: "Open source, systems, talks, and things learned the hard way.",
  github: "https://github.com/Brilly-Bohyun"
};

export const languages = ["ko", "en"] as const;
export type Lang = (typeof languages)[number];

export const labels = {
  ko: {
    navPosts: "글",
    navCategories: "카테고리",
    navTags: "태그",
    search: "검색",
    theme: "테마",
    readMore: "읽기",
    latest: "최신 글",
    categories: "카테고리",
    tags: "태그",
    allPosts: "전체 글",
    comments: "댓글",
    language: "EN",
    empty: "아직 글이 없습니다."
  },
  en: {
    navPosts: "Posts",
    navCategories: "Categories",
    navTags: "Tags",
    search: "Search",
    theme: "Theme",
    readMore: "Read",
    latest: "Latest",
    categories: "Categories",
    tags: "Tags",
    allPosts: "All posts",
    comments: "Comments",
    language: "KO",
    empty: "No posts yet."
  }
} satisfies Record<Lang, Record<string, string>>;

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string) {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

export function isLang(value: string | undefined): value is Lang {
  return value === "ko" || value === "en";
}

export function otherLang(lang: Lang): Lang {
  return lang === "ko" ? "en" : "ko";
}

export const giscus = {
  repo: site.repo,
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID || "",
  category: "Comments",
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID || ""
};
