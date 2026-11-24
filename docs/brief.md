# Brief: an agent-run blog on GitHub Pages

You are Kiro, working on the repository `AlexPicior/ap-ssdlc-blog`. You build and run this blog. A human never types code into it. Alex Picior, the owner, only does the following:

- opens GitHub issues that ask for posts or changes,
- does the one-time setup clicks listed in section 3,
- merges the PRs that auto-merge holds back for him.

Read this whole brief before you start. If any part of it contradicts current official documentation (Astro, GitHub Actions, GitHub Pages, Kiro), follow the documentation and note the difference in your PR description.

---

## 1. Decisions already made

| Topic | Decision |
|---|---|
| Repo | `AlexPicior/ap-ssdlc-blog`, public, default branch `main` |
| URL | `https://alexpicior.github.io/ap-ssdlc-blog/` (a project site, so the base path is `/ap-ssdlc-blog`) |
| Custom domain | None |
| Generator | Astro. Use the current stable major version, with exact versions pinned and `package-lock.json` committed |
| Node | Current Active LTS, pinned in `.nvmrc` and used by every workflow |
| Theme | Small and custom, kept in the repo. No theme packages and no git submodules |
| Images | None. Posts are text only |
| Language | English |
| Author | Alex Picior. Posts are written in his voice, in the first person |
| Topic | A personal blog about the gym, training and fitness. Alex chooses each post's subject in an issue |
| Who starts a post | Only Alex, through an issue. You never publish a post on your own initiative |
| Merging | Automatic once checks pass, with the exceptions in section 6.3 |
| Alex's Kiro plan | Student plan: 1,000 credits a month. Scheduled tasks are available. **API keys are not available**, so GitHub Actions cannot start Kiro by itself (see section 6.5). Keep credit use low (see section 8) |

---

## 2. How the system works

| Stage | Trigger | What happens |
|---|---|---|
| Write | Alex opens a "New post" issue that carries the `kiro` label | Kiro drafts the post and opens a PR |
| Check | Every PR | The `CI` workflow runs the `build` job: type check, build, internal link check |
| Merge | `build` passes | The `Auto-merge` workflow squash-merges the PR unless an exception applies |
| Deploy | Push to `main` | The `Deploy` workflow publishes to GitHub Pages |
| Monitor | Daily cron | The `Health` workflow checks the live site |
| Repair | `CI`, `Deploy` or `Health` fails on `main` | The `Repair` workflow opens or updates an incident issue and asks Alex to add the `kiro` label (one click). Kiro then opens a fix PR. If Alex doesn't add the label, the weekly task picks up the incident |
| Maintain | A weekly Kiro Web scheduled task | Open incidents, dependency updates and broken external links, delivered as at most one PR |

The live site always shows the last successful deploy. A failed build never takes the site down.

---

## 3. Setup Alex does himself (clicks only)

There is no `KIRO_API_KEY` secret, because the student plan doesn't include API keys.

### Before session 1

1. ✅ The **public** repo `AlexPicior/ap-ssdlc-blog` exists. It needs at least one commit (for example a README) so that `main` exists.
2. At app.kiro.dev → **Settings → Integrations**, connect GitHub and give the **Kiro Agent GitHub app** access to `AlexPicior/ap-ssdlc-blog`. If you gave it access to only one repo earlier, add this one.
3. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Repo **Settings → General → Pull Requests**: tick **Allow auto-merge** and **Automatically delete head branches**.
5. Create a **fine-grained personal access token** at GitHub → Settings → Developer settings:
   - Repository access: only `AlexPicior/ap-ssdlc-blog`.
   - Permissions: Contents read/write, Pull requests read/write, Issues read/write.
   - Expiry: the maximum allowed. Set a calendar reminder to renew it.
   - Save it as the repo secret `AUTOMATION_PAT` (repo **Settings → Secrets and variables → Actions**).
   - Session 1 doesn't use it yet, but it must exist before session 2.

### After the session 1 PR is merged

6. Check that `https://alexpicior.github.io/ap-ssdlc-blog/` loads.
7. Repo **Settings → Rules → Rulesets → New branch ruleset**:
   - Target: `main`. Enforcement: Active.
   - Require a pull request before merging, with 0 required approvals.
   - Require status checks to pass, and add the `build` check. It appears in the list once `CI` has run.
   - Block force pushes and restrict deletions.
   - Do this before session 2. Auto-merge only waits for checks that a ruleset requires; without the ruleset it would merge PRs before `build` finishes.

### After the session 2 PR is merged

8. At app.kiro.dev → **Schedule → Create scheduled task**, use the name, schedule and prompt from section 8.

---

## 4. Work plan: two build sessions, then tests

### 4.0 How to split the work

**Use separate Kiro chats, one per phase. Don't do everything in one chat.**

Reasons:
- **Smaller PRs are easier to check.** Each PR has its own acceptance list (section 9), and Alex merges each one by hand because each touches `.github/` or `.kiro/`.
- **Each phase depends on the previous one being live.** Phase 2's auto-merge and repair logic depends on a working site, a `CI` run that has produced the `build` check, and the ruleset from step 7. None of these exist until Phase 1 is merged.
- **A fresh chat starts with a clean context.** A long chat that covers the whole project is more likely to lose details. Every chat after the first reads this brief from `docs/brief.md` in the repo, so nothing has to be re-explained.
- **Failures stay contained.** If one phase goes wrong, Alex redoes that phase only.

| Phase | Chat | Delivers | PR title | Alex does afterwards |
|---|---|---|---|---|
| 1. Site | New Kiro chat on `AlexPicior/ap-ssdlc-blog` with this file attached | Sections 4.1 (Phase 1 files), 4.2, 4.3, 4.4, 4.6, 5, 6.1, 6.2, 7 (as `repair.md`), plus `docs/brief.md` | `Phase 1: site, CI and deploy` | Merge, then steps 6–7 in section 3 |
| 2. Automation | New Kiro chat on the same repo | Sections 4.5, 6.3, 6.4, 6.5, 8 (as `.kiro/scheduled/weekly-maintenance.md`), and README additions for labels | `Phase 2: auto-merge, health and repair` | Merge, then step 8 in section 3 |
| 3. Tests | No build chat. Alex uses the issue templates | Section 10 | none | Opens one "New post" issue and runs the repair simulation |

**Message to paste in the Phase 1 chat** (with this file attached):

> Follow the attached brief. Do Phase 1 only, as listed in section 4.0. Commit the brief as `docs/brief.md`. Open one PR and do not merge it. Report every Phase 1 acceptance item from section 9 in the PR description.

**Message to paste in the Phase 2 chat:**

> Read `docs/brief.md` in this repo. Do Phase 2 only, as listed in section 4.0. Phase 1 is merged and live. Open one PR and do not merge it. Report every Phase 2 acceptance item from section 9 in the PR description.

In each phase, the agent:
- opens a feature branch, opens one PR into `main`, and never merges it,
- does not start the next phase,
- updates `docs/brief.md` in the same PR if something in the brief turns out to be wrong, and explains the change in the PR description.

Phase 1 files from 4.1: everything except `.github/ISSUE_TEMPLATE/`, `auto-merge.yml`, `health.yml`, `repair.yml` and `.kiro/scheduled/`.

### 4.1 Repo layout

```
.github/
  ISSUE_TEMPLATE/
    new-post.yml
    change-request.yml
    config.yml
  workflows/
    ci.yml
    deploy.yml
    auto-merge.yml
    health.yml
    repair.yml
.kiro/
  steering/
    product.md
    structure.md
    tech.md
    writing.md
    repair.md
  scheduled/
    weekly-maintenance.md     # copy of the scheduled-task prompt, kept for reference
docs/
  brief.md
src/
  content.config.ts           # or whatever path current Astro docs use for content collections
  content/posts/
  layouts/
  components/
  pages/
    index.astro               # list of posts, newest first
    posts/[...slug].astro
    tags/index.astro
    tags/[tag].astro
    rss.xml.(js|ts)
    404.astro
  styles/
astro.config.mjs
package.json
package-lock.json
.nvmrc
README.md
```

### 4.2 Site requirements

- In `astro.config.mjs`, set `site: 'https://alexpicior.github.io'` and `base: '/ap-ssdlc-blog'`.
- Build every internal link from `import.meta.env.BASE_URL`, and never hardcode `/`. A hardcoded `/` link breaks under a project site, and it is the most likely bug in this setup.
- Pages: a home page listing posts (title, date, description), a page per post, a tag index, a page per tag, an RSS feed, a sitemap (official Astro integration) and a 404 page.
- No client-side JavaScript unless a feature cannot work without it.
- Design:
  - One readable column, about 65–75 characters wide, using system fonts.
  - Light and dark themes that follow `prefers-color-scheme`.
  - Visible focus styles and semantic HTML.
- Every page sets `<title>`, a meta description, a canonical URL, and Open Graph title and description.
- The site title is "Alex Picior". The footer reads "Written with help from Kiro" and links to the repo.
- `draft: true` posts are excluded from every page, the feed and the sitemap.

### 4.3 Content schema (the build must enforce it)

Posts live at `src/content/posts/YYYY-MM-DD-slug.md`.

| Field | Rule |
|---|---|
| `title` | string, 1–100 characters |
| `description` | string, 50–160 characters |
| `pubDate` | date |
| `updatedDate` | optional date, must not be earlier than `pubDate` |
| `tags` | 1–5 strings, lowercase kebab-case |
| `draft` | boolean, default `false` |

If a field is invalid, the build must fail with an error that names the file and the field.

### 4.4 First post

Add one short post (about 150 words), "Hello", in Alex's voice. It should say that the blog exists, that it's about the gym, training and fitness, and that its posts begin as GitHub issues. It must not invent personal facts about Alex.

### 4.5 Issue templates

- `new-post.yml` is an issue form that applies the labels `kiro` and `post`. Fields:
  - Topic (required)
  - Key points or notes (required)
  - Approximate length (dropdown: short ~300, medium ~800, long ~1500 words)
  - Tags (optional)
  - Anything to avoid (optional)
- `change-request.yml` is an issue form that applies the labels `kiro` and `change`. Fields: what to change (required) and why (optional).
- `config.yml` sets `blank_issues_enabled: true`.
- In the README, tell Alex: "If a Kiro task doesn't start within a few minutes of opening the issue, comment `/kiro` on it." (Labels applied by a template may not trigger the Kiro app. This has not been verified.)

### 4.6 README

A short README for Alex. Cover:

- how to request a post,
- how to request a change,
- how to stop a PR from auto-merging (add the `hold` label),
- what the `needs-alex` label means,
- that adding the `kiro` label to an `incident` issue starts a repair,
- where the live site is.

Do not include instructions that require writing code.

---

## 5. Steering files (`.kiro/steering/`)

Keep each file short and specific. Every future Kiro session reads them.

- **product.md**: what the blog is (a personal blog about the gym, training and fitness), who Alex is (use only facts given in issues), the audience (general readers), and the rule that only Alex decides what gets posted.
- **structure.md**: the layout from section 4.1, the post filename format, the schema from section 4.3, and the rule that links use `BASE_URL`.
- **tech.md**:
  - Commands: `npm ci`, `npm run check`, `npm run build`, `npm run linkcheck`.
  - Definition of done: all three checks pass locally before you open a PR.
  - Pin exact dependency versions.
  - Do not add dependencies without a reason stated in the PR.
- **writing.md**:
  - Write in Alex's voice: first person, plain words, short paragraphs, no hype, no filler.
  - Follow the requested length to within ±20%.
  - **Never invent personal experiences, opinions, quotes or facts about Alex.** If the issue does not give enough to write the post, comment on the issue with specific questions and do not open a PR.
  - Link a reputable source for any factual claim that isn't common knowledge.
  - Choose 1–5 existing tags where they fit. Create a new tag only when nothing fits.
  - The PR description summarizes the post and lists any assumptions you made.
  - Because PRs merge automatically, anything uncertain belongs in an issue comment, not in the post.
- **repair.md**: the rules in section 7.

---

## 6. Workflows

Before writing each workflow, look up the current major versions of every action it uses (`actions/checkout`, `actions/setup-node`, `actions/configure-pages`, `actions/upload-pages-artifact`, `actions/deploy-pages`, `lycheeverse/lychee-action`). Give each workflow minimal `permissions`.

### 6.1 `ci.yml` (workflow name `CI`, job id `build`)

- Triggers: `pull_request` to `main`, `push` to `main`, `workflow_dispatch`.
- Steps:
  1. Check out the repo.
  2. Set up Node from `.nvmrc` with the npm cache.
  3. `npm ci`
  4. `npm run check` (`astro check`)
  5. `npm run build`
  6. `npm run linkcheck`
- How `linkcheck` handles the base path: copy `dist/` into `tmp/site/ap-ssdlc-blog/`, then run lychee with `--offline` and `--root-dir tmp/site` so that `/ap-ssdlc-blog/...` links resolve. It checks internal links only, and any broken internal link fails the job.
- The job id must stay `build`, because the ruleset requires it by that name.

### 6.2 `deploy.yml` (workflow name `Deploy`)

- Triggers: `push` to `main` and `workflow_dispatch`.
- Use the official Pages flow: build, `upload-pages-artifact` from `dist/`, then `deploy-pages`.
- Permissions: `pages: write`, `id-token: write`, `contents: read`.
- Concurrency: group `pages`, `cancel-in-progress: false`.

### 6.3 `auto-merge.yml` (workflow name `Auto-merge`)

- Trigger: `pull_request` with types `opened`, `reopened`, `synchronize`, `ready_for_review`, `labeled`, `unlabeled`.
- Run only when the PR's head repo is this repo. **Never auto-merge PRs from forks.** The repo is public, so anyone can open a PR.
- Use `secrets.AUTOMATION_PAT` for the `gh` commands. Merges done with `GITHUB_TOKEN` do not trigger the `push` event, so with that token `Deploy` would never run.
- Logic:
  - If the PR is a draft, do nothing.
  - If the PR has the `hold` label, run `gh pr merge --disable-auto` (ignore errors) and stop.
  - If any changed file is under `.github/` or `.kiro/`, add the `needs-alex` label, comment once that Alex must merge it by hand, and stop. Agents must not change their own guardrails without review.
  - Otherwise run `gh pr merge --auto --squash`. GitHub merges the PR once `build` passes.

### 6.4 `health.yml` (workflow name `Health`)

- Triggers: daily cron `0 6 * * *` and `workflow_dispatch`.
- **Hard checks** (fail the job if any fails):
  - These URLs return HTTP 200: `https://alexpicior.github.io/ap-ssdlc-blog/`, `.../ap-ssdlc-blog/rss.xml`, `.../ap-ssdlc-blog/sitemap-index.xml` (or whichever sitemap path the integration produces), and the newest post's URL.
  - Every internal link on the live site resolves.
- **Soft check** (never fails the job): external links, checked with lychee.
  - If any are broken, create or update a single open issue labeled `broken-links` with the list. Do not start Kiro; the weekly task handles it.
  - If none are broken and that issue is open, close it.

### 6.5 `repair.yml` (workflow name `Repair`)

- Triggers:
  - `workflow_run` on `CI`, `Deploy` and `Health` with type `completed`, filtered to branch `main`.
  - `workflow_dispatch` with a boolean input `simulate`. When `simulate` is `true`, run the failure path against the most recent `CI` run on `main` and add the label `test` to the incident. Kiro must recognize that a `test` incident has nothing to fix, comment on it and close it without opening a PR.
- Permissions: `issues: write`, `actions: read`, `contents: read`.
- Concurrency: group `repair`, `cancel-in-progress: false`.

**On success:** if an issue labeled `incident` is open, comment with a link to the passing run and close it.

**On failure:**

1. Collect the run URL, the failing workflow name, the head SHA and the last 200 lines of `gh run view <id> --log-failed`.
2. Find an open issue labeled `incident`.
   - If there is none, create one titled `Incident: <workflow> failing on main`, with the collected details in the body.
   - If one exists, add a comment with the new details.
3. Count the comments on that issue that start with `Repair attempt`.
   - If the issue already has the `needs-alex` label, stop.
   - If the count is 2 or more, add `needs-alex`, comment "Automatic repair failed twice. Alex, please take a look," and stop.
   - Otherwise, comment `Repair attempt N`, where N is the count plus 1, and continue.
4. Hand the incident to Kiro.
   - Alex's plan has no API key, so a workflow cannot start Kiro. The Kiro app only starts a task when Alex himself adds the `kiro` label or comments `/kiro`. A label added by `github-actions` does not count.
   - If the issue does not yet have the `kiro` label, comment: "Alex: add the `kiro` label to this issue to start an automatic repair. If you don't, the weekly maintenance task will pick it up on Monday."
   - If the issue already has the `kiro` label, do nothing more. The Kiro app follows later comments on a labeled issue, so the new `Repair attempt N` comment with fresh logs reaches the running task.
   - The issue body must include this instruction for Kiro: "Read .kiro/steering/repair.md first. The details and logs are in this issue. Open one PR with the fix and reference this issue."
5. Fix PRs go through `CI` and `Auto-merge` like any other PR. When `main` turns green, step "On success" closes the incident. After 2 attempts the incident gets `needs-alex`, so the loop has a limit.

If Alex later moves to a plan with API keys, step 4 can start Kiro directly with `kiro-cli chat --no-interactive` (see https://kiro.dev/docs/cli/headless.md). Don't build that part now.

---

## 7. Repair rules (copy into `.kiro/steering/repair.md`)

- Find the root cause from the logs before you change anything. State the cause in the PR description in one or two sentences.
- Make the smallest change that fixes the cause.
- Never delete or unpublish a post, weaken the schema, skip or disable a check, or add `continue-on-error` to make a build pass.
- Never edit `.github/` or `.kiro/` in a repair PR unless the cause is in one of those files. Such a PR goes to Alex for a manual merge anyway.
- If the failure comes from outside the repo (a GitHub outage, a registry outage), comment on the incident issue and do not open a PR.
- If a dependency update caused the failure, pin back to the last working version and say so in the PR.
- Reproduce locally with `npm ci && npm run check && npm run build && npm run linkcheck` before opening the PR.

---

## 8. Weekly scheduled task (Alex creates it in Kiro Web)

- **Name:** Weekly maintenance
- **Repo:** `AlexPicior/ap-ssdlc-blog`
- **Schedule:** CRON `0 7 * * 1` (Mondays at 07:00 UTC)
- **Prompt** (also save it as `.kiro/scheduled/weekly-maintenance.md`):

> Weekly maintenance for AlexPicior/ap-ssdlc-blog. Read .kiro/steering/ first.
> 1. If an open issue is labeled `incident` and not `needs-alex` or `test`, fix it first, following .kiro/steering/repair.md. Put the fix in its own PR that references the issue. That PR doesn't count toward the one-PR limit in step 5.
> 2. If an open issue is labeled `broken-links`, fix or remove each broken external link. Replace a link with a working source for the same claim where one exists. Do not change any other wording in the post.
> 3. Update dependencies to their latest patch and minor versions. Update Astro to a new major version only if `npm run check`, `npm run build` and `npm run linkcheck` all pass afterwards. Otherwise stay on the current major and mention the available upgrade in the PR.
> 4. Do not write or change posts for any other reason.
> 5. Open at most one maintenance PR, titled "Weekly maintenance YYYY-MM-DD". If there is nothing to do, open no PR and stop.

Only this task and actual failures spend credits. Writing a post costs one Kiro task per issue. Don't add more scheduled tasks without Alex asking for them.

---

## 9. Acceptance criteria

Verify each item and report the result in the PR description. If you cannot verify an item, say so; don't assume it passes.

### Phase 1 PR

- [ ] `npm ci && npm run check && npm run build && npm run linkcheck` passes locally.
- [ ] `CI` passes on the PR, and its job is named `build`.
- [ ] A post with a missing `description` fails `npm run build` with an error that names the file and the field. Test this, then revert the test.
- [ ] A hardcoded `/posts/...` link without the base fails `npm run linkcheck`. Test this, then revert the test.
- [ ] `dist/` contains the home page, the "Hello" post, the tag pages, `rss.xml`, a sitemap and `404.html`, and every internal link starts with `/ap-ssdlc-blog/`.
- [ ] A `draft: true` post does not appear in the built output.
- [ ] `ci.yml` and `deploy.yml` set explicit minimal `permissions`.
- [ ] `docs/brief.md` is committed.
- [ ] The PR description lists what Alex does next: merge, then steps 6–7 in section 3, then start the Phase 2 chat.

### Phase 2 PR

- [ ] `CI` still passes.
- [ ] Every new workflow sets explicit minimal `permissions`.
- [ ] `auto-merge.yml` skips forks, drafts, PRs labeled `hold`, and PRs that touch `.github/` or `.kiro/`.
- [ ] `repair.yml` stops after 2 attempts per incident and adds `needs-alex`.
- [ ] `repair.yml` uses no `KIRO_API_KEY` secret and does not install `kiro-cli`.
- [ ] `health.yml` checks the live URLs under `/ap-ssdlc-blog/` and handles external links as a soft check.
- [ ] The issue templates exist, and the README explains the `kiro`, `hold`, `needs-alex` and `incident` labels.
- [ ] The PR description lists what Alex does next: merge, step 8 in section 3, then the tests in section 10.

## 10. Phase 3: tests (Alex, no build chat)

1. Open a "New post" issue about a gym topic. If no Kiro task starts within a few minutes, comment `/kiro`. Check that the PR merges by itself and the post appears on the site.
2. Actions tab → `Repair` → **Run workflow** with `simulate` ticked (see section 6.5). Add the `kiro` label to the incident issue it creates. Check that Kiro comments and closes it without opening a PR.

If either test fails, open a "Change request" issue describing what happened. That starts a Kiro task to fix it.
