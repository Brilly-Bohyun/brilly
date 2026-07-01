# Brilly

Astro-powered bilingual tech blog for Brilly.

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages

In the repository settings, open Pages and set Source to GitHub Actions.
The deploy workflow publishes the site to:

```text
https://brilly-bohyun.github.io/brilly/
```

## Comments

Create `Brilly-Bohyun/brilly`, enable Discussions, create a `Comments` category,
install giscus, then set:

```bash
PUBLIC_GISCUS_REPO_ID=...
PUBLIC_GISCUS_CATEGORY_ID=...
```
