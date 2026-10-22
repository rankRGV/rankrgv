import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // Shorter <title> tag when the headline runs past ~60 characters; the H1 keeps `title`.
    seoTitle: z.string().optional(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('RankRGV Team'),
    category: z.enum(['local-seo', 'web-design', 'business-automation', 'google-maps']),
    targetKeyword: z.string(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
    faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  }),
});

export const collections = { blog };
