export const site = {
  name: "Brilly",
  author: "Bohyun Choi",
  owner: "Brilly-Bohyun",
  repo: "Brilly-Bohyun/brilly",
  description: "Open source, systems, talks, and things learned the hard way.",
  github: "https://github.com/Brilly-Bohyun",
  linkedin: "https://www.linkedin.com/in/bohyunchoi/"
};

export const languages = ["ko", "en"] as const;
export type Lang = (typeof languages)[number];

export const labels = {
  ko: {
    navCategories: "카테고리",
    navTags: "태그",
    search: "검색",
    searchPlaceholder: "검색어를 입력하세요",
    clearSearch: "검색어 지우기",
    theme: "테마",
    readMore: "읽기",
    latest: "최신",
    categories: "카테고리",
    allCategories: "전체",
    allInCategory: "전체",
    tags: "태그",
    allPosts: "전체",
    noResults: "검색 결과가 없습니다.",
    collapseSidebar: "사이드바 접기",
    expandSidebar: "사이드바 펼치기",
    comments: "댓글",
    language: "EN",
    empty: "아직 글이 없습니다."
  },
  en: {
    navCategories: "Categories",
    navTags: "Tags",
    search: "Search",
    searchPlaceholder: "Search",
    clearSearch: "Clear search",
    theme: "Theme",
    readMore: "Read",
    latest: "Latest",
    categories: "Categories",
    allCategories: "All",
    allInCategory: "All",
    tags: "Tags",
    allPosts: "All posts",
    noResults: "No results.",
    collapseSidebar: "Collapse sidebar",
    expandSidebar: "Expand sidebar",
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
