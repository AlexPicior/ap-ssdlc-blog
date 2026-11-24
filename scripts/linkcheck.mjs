// Internal link check for the built site.
//
// The site is a GitHub Pages *project* site served under the base path
// `/ap-ssdlc-blog/`. Links in the built HTML are absolute, e.g.
// `/ap-ssdlc-blog/posts/hello/`. To let lychee resolve those against local
// files, we copy `dist/` into `tmp/site/ap-ssdlc-blog/` and run lychee with
// `--root-dir tmp/site`, so `/ap-ssdlc-blog/...` maps onto the copied tree.
//
// We check internal links only (`--offline`). Any broken internal link makes
// lychee exit non-zero, which fails this script and the CI `build` job.
//
// lychee is a standalone binary (https://github.com/lycheeverse/lychee),
// not an npm package. In CI it is provided by lycheeverse/lychee-action.
// Locally it must be on PATH; if it is missing we say so and exit non-zero
// rather than silently passing.

import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, rmSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = "ap-ssdlc-blog";
const DIST = "dist";
const SITE_ROOT = join("tmp", "site");
const SITE_DIR = join(SITE_ROOT, BASE);

// On Windows the binary is lychee.exe; execFile needs the exact name.
const LYCHEE = process.platform === "win32" ? "lychee.exe" : "lychee";

function fail(msg) {
  console.error(`linkcheck: ${msg}`);
  process.exit(1);
}

function haveLychee() {
  const probe = spawnSync(LYCHEE, ["--version"], { stdio: "ignore" });
  return probe.status === 0;
}

if (!existsSync(DIST)) {
  fail(`no ${DIST}/ directory. Run "npm run build" first.`);
}

if (!haveLychee()) {
  fail(
    "lychee is not installed or not on PATH.\n" +
      "Install it from https://github.com/lycheeverse/lychee " +
      "(e.g. `cargo install lychee` or download a release binary).\n" +
      "CI uses the lycheeverse/lychee-action, so this only affects local runs."
  );
}

// Fresh copy of dist/ under the base path so absolute links resolve.
rmSync(SITE_ROOT, { recursive: true, force: true });
mkdirSync(SITE_DIR, { recursive: true });
cpSync(DIST, SITE_DIR, { recursive: true });

const args = [
  "--offline",
  "--no-progress",
  "--include-fragments",
  "--root-dir",
  // lychee wants an absolute root dir.
  join(process.cwd(), SITE_ROOT),
  `${SITE_DIR}/**/*.html`,
];

console.log(`linkcheck: ${LYCHEE} ${args.join(" ")}`);

try {
  execFileSync(LYCHEE, args, { stdio: "inherit" });
  console.log("linkcheck: all internal links resolve.");
} catch {
  fail("broken internal link(s) found (see lychee output above).");
}
