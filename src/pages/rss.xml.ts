import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPublishedPosts, postSlug } from "../lib/posts";

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  const site = context.site;
  if (!site) {
    throw new Error("`site` must be set in astro.config.mjs for the RSS feed.");
  }
  const base = import.meta.env.BASE_URL.replace(/\/*$/, "/");

  return rss({
    title: "Alex Picior",
    description:
      "A personal blog about the gym, training and fitness, by Alex Picior.",
    site: site.origin,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `${base}posts/${postSlug(post)}/`,
    })),
  });
}
