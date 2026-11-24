# Weekly maintenance (scheduled task)

Alex creates this as a scheduled task in Kiro Web. This file is a reference
copy of the task so the repo documents it.

- **Name:** Weekly maintenance
- **Repo:** `AlexPicior/ap-ssdlc-blog`
- **Schedule:** CRON `0 7 * * 1` (Mondays at 07:00 UTC)

## Prompt

> Weekly maintenance for AlexPicior/ap-ssdlc-blog. Read .kiro/steering/ first.
>
> 1. If an open issue is labeled `incident` and not `needs-alex` or `test`,
>    fix it first, following .kiro/steering/repair.md. Put the fix in its own
>    PR that references the issue. That PR doesn't count toward the one-PR
>    limit in step 5.
> 2. If an open issue is labeled `broken-links`, fix or remove each broken
>    external link. Replace a link with a working source for the same claim
>    where one exists. Do not change any other wording in the post.
> 3. Update dependencies to their latest patch and minor versions. Update
>    Astro to a new major version only if `npm run check`, `npm run build` and
>    `npm run linkcheck` all pass afterwards. Otherwise stay on the current
>    major and mention the available upgrade in the PR.
> 4. Do not write or change posts for any other reason.
> 5. Open at most one maintenance PR, titled "Weekly maintenance YYYY-MM-DD".
>    If there is nothing to do, open no PR and stop.

Only this task and actual failures spend credits. Writing a post costs one
Kiro task per issue. Don't add more scheduled tasks without Alex asking.
