import { defineCollection } from "astro:content";
import { z } from "astro:schema";
import { glob } from "astro/loaders";

// Posts live at src/content/posts/YYYY-MM-DD-slug.md.
// The schema is enforced at build time: any invalid field fails
// `astro build` (and `astro check`) with an error that names the file
// and the field.
const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: z
    .object({
      title: z.string().min(1).max(100),
      description: z.string().min(50).max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z
        .array(
          z
            .string()
            .regex(
              /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              "tags must be lowercase kebab-case"
            )
        )
        .min(1)
        .max(5),
      draft: z.boolean().default(false),
    })
    .refine(
      (data) =>
        !data.updatedDate || data.updatedDate.getTime() >= data.pubDate.getTime(),
      {
        message: "updatedDate must not be earlier than pubDate",
        path: ["updatedDate"],
      }
    ),
});

export const collections = { posts };
