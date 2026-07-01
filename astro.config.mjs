import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://brilly-bohyun.github.io",
  base: "/brilly",
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
