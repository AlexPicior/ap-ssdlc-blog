# Alex Picior's blog

A personal blog about the gym, training and fitness. It's built with Astro
and published to GitHub Pages at
**https://alexpicior.github.io/ap-ssdlc-blog/**.

You never need to write code to run this blog. You open GitHub issues and
merge the occasional pull request. Everything else is automated.

## Request a new post

Open a new issue using the **New post** template and fill in the topic and
your notes. A Kiro task drafts the post and opens a pull request. Once the
checks pass, it merges and goes live on its own.

> If a Kiro task doesn't start within a few minutes of opening the issue,
> comment `/kiro` on it.

## Request a change

Open a new issue using the **Change request** template. Say what to change
and, if useful, why. Kiro opens a pull request with the change.

## Stop a pull request from merging itself

Add the **`hold`** label to the pull request. It will not auto-merge while
that label is on it. Remove the label to let it merge once checks pass.

## Labels you'll see

- **`hold`** — you added this to a PR to stop it auto-merging.
- **`needs-alex`** — automation has stepped back and wants you to act,
  usually to merge a PR by hand (anything touching `.github/` or `.kiro/`)
  or to look at a repair that didn't work.
- **`incident`** — something failed on the live site or in the build. Add
  the **`kiro`** label to an incident issue to start an automatic repair.
  If you don't, the weekly maintenance task picks it up on Monday.

## Where things live

- Live site: https://alexpicior.github.io/ap-ssdlc-blog/
- RSS feed: https://alexpicior.github.io/ap-ssdlc-blog/rss.xml
- Posts are Markdown files under `src/content/posts/`.

## For a developer (not needed for day-to-day use)

```
npm ci           # install locked dependencies
npm run check    # type check
npm run build    # build the site (also enforces the post schema)
npm run linkcheck # check internal links (needs the lychee binary on PATH)
```

Node version is pinned in `.nvmrc`.
