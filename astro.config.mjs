// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Project site on GitHub Pages: served under /ap-ssdlc-blog/.
// `site` + `base` must match the repo name, or internal links and the
// sitemap will point at the wrong URLs.
export default defineConfig({
  site: "https://alexpicior.github.io",
  base: "/ap-ssdlc-blog",
  trailingSlash: "always",
  integrations: [
    // Excludes draft posts via a filter; see the page code for drafts.
    sitemap(),
  ],
});
