// Build internal links from Astro's BASE_URL so they work under the
// project-site base path (/ap-ssdlc-blog/). Never hardcode a leading "/":
// that breaks on a project site. See the brief, section 4.2.

const BASE = import.meta.env.BASE_URL; // e.g. "/ap-ssdlc-blog/"

/** Join path segments onto BASE_URL, collapsing duplicate slashes. */
export function href(...segments: string[]): string {
  const tail = segments
    .join("/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
  const base = BASE.endsWith("/") ? BASE : BASE + "/";
  if (tail === "") return base;
  // A final segment with a file extension (e.g. rss.xml) stays as-is;
  // route paths get a trailing slash to match trailingSlash: "always".
  const lastSegment = tail.split("/").pop() ?? "";
  if (/\.[a-z0-9]+$/i.test(lastSegment)) {
    return base + tail;
  }
  return (base + tail).replace(/\/*$/, "/");
}

/** Absolute canonical URL for a page path, using the configured site. */
export function canonical(site: URL | undefined, pathname: string): string {
  const origin = site ? site.origin : "";
  return origin + pathname;
}
