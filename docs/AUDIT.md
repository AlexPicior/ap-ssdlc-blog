# Audit log

Every agent action on this repo is recorded. "Agent" means the Kiro task that
drafts or reviews a post, and the GitHub Actions workflows that check, merge,
deploy, watch and record. Each record answers **who, what, when, and which
ticket**.

## Where the records live (all first-class GitHub data, not self-reported)

| Source | What it records | Who / what / when / ticket |
|---|---|---|
| **Issue** (the ticket) | the request and its whole timeline: labels, comments, who opened it | who = issue author; ticket = the issue number |
| **Pull request timeline** | commits, status checks, labels, review verdict, who merged | who = commit author / merger; links to the ticket via "Closes #N" |
| **Actions runs** | every workflow run: trigger, actor, commit SHA, logs, timestamps | who = `github-actions` or the PAT owner; when = run time |
| **Commit status `agent-review`** | the fresh-context review verdict on the PR head SHA | who set it, when, success/failure |
| **Deployment log** (environment `github-pages`) | each production deploy and the person who approved it | who = the named approver (the human gate) |

GitHub retains these; nobody on the team can quietly rewrite them.

## One ticket, one report

To assemble the trail for a single ticket into one view (for the demo or an
audit), run:

```
pwsh scripts/audit-report.ps1 -Issue <N>
```

It pulls the issue, the PR that closed it, the Actions runs tied to that PR's
commits, the review status, and the deployment, and prints a timeline with
who/what/when for each step. See the script for details.

## The three human decisions

The harness lets a human decide only three things. Each leaves a record:

1. **Deploy to production** — the approval on the `github-pages` environment
   (deployment log).
2. **Spend above the cap** — recorded when the cost cap triggers (M2).
3. **Destructive changes to data** — none in this project; the agent token
   cannot force-push or delete branches (branch ruleset), and posts are never
   deleted by repair (`.kiro/steering/repair.md`).
