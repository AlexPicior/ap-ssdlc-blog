# Tech

## Stack

- Astro (static output), with `@astrojs/sitemap` and `@astrojs/rss`.
- TypeScript via `@astrojs/check`.
- Node version is pinned in `.nvmrc`; every workflow reads it.

## Commands

- `npm ci` — install exact, locked dependencies.
- `npm run check` — `astro check` (type check).
- `npm run build` — `astro build` (also enforces the content schema).
- `npm run linkcheck` — internal link check with lychee over the built site,
  staged under the base path. Needs the lychee binary on PATH
  (https://github.com/lycheeverse/lychee). CI installs it.

## Definition of done

`npm ci && npm run check && npm run build && npm run linkcheck` all pass
locally before you open a PR.

## Dependencies

- Pin exact versions (no `^` or `~`). Commit `package-lock.json`.
- Don't add a dependency without stating the reason in the PR description.
