import { getCollection, type CollectionEntry } from "astro:content";
import { categoryLabel, subcategoryLabel } from "./taxonomy";
import type { Lang } from "./site";

export type BlogPost = CollectionEntry<"blog">;

export function slugOf(post: BlogPost) {
  return post.id.split("/").at(-1) ?? post.id;
}

export function postPath(post: BlogPost) {
  return `/${post.data.lang}/posts/${slugOf(post)}/`;
}

export async function getPosts(lang?: Lang) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts
    .filter((post) => !lang || post.data.lang === lang)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getTranslation(post: BlogPost) {
  const posts = await getPosts();
  return posts.find(
    (candidate) =>
      candidate.data.translationKey === post.data.translationKey &&
      candidate.data.lang !== post.data.lang
  );
}

export function formatDate(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "ko" ? "ko-KR" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function uniqueTags(posts: BlogPost[]) {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort();
}

export function categoryGroups(posts: BlogPost[], lang: Lang) {
  const groups = new Map<string, { label: string; subcategories: Map<string, string>; count: number }>();

  for (const post of posts) {
    const { category, subcategory } = post.data;
    const group =
      groups.get(category) ??
      { label: categoryLabel(category, lang), subcategories: new Map<string, string>(), count: 0 };
    group.count += 1;
    group.subcategories.set(subcategory, subcategoryLabel(category, subcategory, lang));
    groups.set(category, group);
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}
