import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/**
 * Published posts, newest first. Drafts are excluded everywhere:
 * list pages, per-post pages, tag pages, the RSS feed and the sitemap.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection(
    "posts",
    ({ data }) => data.draft !== true
  );
  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

/** The slug used in URLs, derived from the file id (YYYY-MM-DD-slug). */
export function postSlug(post: Post): string {
  // Drop a leading YYYY-MM-DD- date prefix from the id for a clean URL.
  return post.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/** All tags used by published posts, sorted, de-duplicated. */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPublishedPosts();
  const set = new Set<string>();
  for (const post of posts) {
    for (const tag of post.data.tags) set.add(tag);
  }
  return [...set].sort();
}
