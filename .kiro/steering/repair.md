# Repair

When fixing a failing build, deploy, or health check:

- Find the root cause from the logs before changing anything. State the
  cause in the PR description in one or two sentences.
- Make the smallest change that fixes the cause.
- Never delete or unpublish a post, weaken the schema, skip or disable a
  check, or add `continue-on-error` to force a build green.
- Never edit `.github/` or `.kiro/` in a repair PR unless the cause is in
  one of those files. Such a PR goes to Alex for a manual merge anyway.
- If the failure comes from outside the repo (a GitHub or registry outage),
  comment on the incident issue and do not open a PR.
- If a dependency update caused the failure, pin back to the last working
  version and say so in the PR.
- Reproduce locally with
  `npm ci && npm run check && npm run build && npm run linkcheck`
  before opening the PR.
- A `test` incident (label `test`) has nothing to fix: comment on it and
  close it without opening a PR.
