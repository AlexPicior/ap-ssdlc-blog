<#
.SYNOPSIS
  Assemble the audit trail for one ticket (issue) into a single timeline.

.DESCRIPTION
  Pulls, from the GitHub API, everything tied to a ticket and prints a
  who / what / when timeline: the issue, the PR that closed it, the checks
  and workflow runs on that PR, the fresh-context review verdict, the merge,
  and the production deploy with its approver.

  Read-only. Needs gh authenticated (see toggle-workflows.ps1 for how gh is
  located).

.PARAMETER Issue
  The ticket (issue) number.

.PARAMETER Repo
  owner/name. Defaults to AlexPicior/ap-ssdlc-blog.

.EXAMPLE
  pwsh scripts/audit-report.ps1 -Issue 7
#>

param(
  [Parameter(Mandatory = $true)][int]$Issue,
  [string]$Repo = "AlexPicior/ap-ssdlc-blog"
)

$ErrorActionPreference = "Stop"

$gh = (Get-Command gh -ErrorAction SilentlyContinue).Source
if (-not $gh) { $gh = "C:\Program Files\GitHub CLI\gh.exe" }

function Api($path) { & $gh api $path | ConvertFrom-Json }

Write-Host "===== AUDIT TRAIL: ticket #$Issue in $Repo =====" -ForegroundColor Cyan

# 1. The ticket.
$iss = Api "repos/$Repo/issues/$Issue"
Write-Host "`n[TICKET] #$Issue  $($iss.title)"
Write-Host "  opened by $($iss.user.login) at $($iss.created_at)"
Write-Host "  labels: $(($iss.labels | ForEach-Object { $_.name }) -join ', ')"
Write-Host "  state: $($iss.state)"

# 2. Timeline comments on the ticket (agent questions, repair attempts, etc.)
$comments = Api "repos/$Repo/issues/$Issue/comments"
foreach ($c in $comments) {
  $first = ($c.body -split "`n")[0]
  Write-Host "  comment by $($c.user.login) at $($c.created_at): $first"
}

# 3. The PR(s) that reference this issue.
$prs = Api "repos/$Repo/pulls?state=all&per_page=100"
$linked = $prs | Where-Object { $_.body -match "#$Issue\b" -or $_.title -match "#$Issue\b" }
if (-not $linked) {
  Write-Host "`n(no PR references this ticket yet)" -ForegroundColor Yellow
  return
}

foreach ($pr in $linked) {
  Write-Host "`n[PR] #$($pr.number)  $($pr.title)"
  Write-Host "  opened by $($pr.user.login) at $($pr.created_at)"
  Write-Host "  head sha: $($pr.head.sha)"
  Write-Host "  merged: $($pr.merged_at)  by $($pr.merged_by.login)"

  # Checks / statuses on the head SHA (includes agent-review).
  $statuses = Api "repos/$Repo/commits/$($pr.head.sha)/status"
  foreach ($s in $statuses.statuses) {
    Write-Host "  status '$($s.context)': $($s.state)  ($($s.description)) at $($s.updated_at)"
  }

  # Workflow runs for the head SHA.
  $runs = Api "repos/$Repo/actions/runs?head_sha=$($pr.head.sha)&per_page=50"
  foreach ($r in $runs.workflow_runs) {
    Write-Host "  run '$($r.name)': $($r.conclusion)  triggered by $($r.actor.login) ($($r.event)) at $($r.created_at)"
  }
}

# 4. Deployments (production) and who approved them.
Write-Host "`n[DEPLOYMENTS]"
$deps = Api "repos/$Repo/deployments?environment=github-pages&per_page=10"
foreach ($d in $deps | Select-Object -First 5) {
  Write-Host "  deployment $($d.id) at $($d.created_at) by $($d.creator.login) (ref $($d.ref))"
}

Write-Host "`n(The github-pages environment requires a named reviewer to approve each production deploy; see the deployment activity log in the repo UI for the approver and timestamp.)" -ForegroundColor DarkGray
