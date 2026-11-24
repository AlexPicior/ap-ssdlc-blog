# Structure

## Layout

```
.github/workflows/      ci.yml, deploy.yml, auto-merge.yml, health.yml, repair.yml
.github/ISSUE_TEMPLATE/ new-post.yml, change-request.yml, config.yml
.kiro/steering/         product.md, structure.md, tech.md, writing.md, repair.md
.kiro/scheduled/        weekly-maintenance.md
docs/brief.md           the full project brief
src/content.config.ts   content collection + schema
src/content/posts/      the posts
src/layouts/            BaseLayout.astro, PostLayout.astro
src/components/         BaseHead, Header, Footer, FormattedDate
src/lib/                url.ts (link helpers), posts.ts (queries)
src/pages/              index, posts/[...slug], tags/index, tags/[tag],
                        rss.xml.ts, 404
src/styles/global.css
scripts/linkcheck.mjs   internal link check
astro.config.mjs, package.json, package-lock.json, .nvmrc, tsconfig.json
```

(Phase 1 ships everything except the issue templates, auto-merge.yml,
health.yml, repair.yml and .kiro/scheduled/. Phase 2 adds those.)

## Post files

- Path: `src/content/posts/YYYY-MM-DD-slug.md`.
- The date prefix is dropped from the URL; the post is served at
  `/ap-ssdlc-blog/posts/<slug>/`.

## Schema (enforced at build time)

| Field | Rule |
|---|---|
| `title` | string, 1–100 characters |
| `description` | string, 50–160 characters |
| `pubDate` | date |
| `updatedDate` | optional date, not earlier than `pubDate` |
| `tags` | 1–5 strings, lowercase kebab-case |
| `draft` | boolean, default `false` |

An invalid field fails `npm run build` with an error naming the file and
the field. Drafts are excluded from every page, the feed and the sitemap.

## Links

Build every internal link from `import.meta.env.BASE_URL`, via the helpers
in `src/lib/url.ts`. Never hardcode a leading `/`: the site is a project
site under `/ap-ssdlc-blog/`, and a hardcoded `/` link is the most likely
bug here. `npm run linkcheck` catches these.
