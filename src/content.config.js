import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per project in src/content/projects. The file name is the
// project's id (used in links like /#project/vr-game) and the body is its write-up.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    year: z.string().optional(),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    team: z.string().optional(),
    engine: z.string().optional(),
    platform: z.string().optional(),
    highlights: z.array(z.string()).default([]),
    cover: z.string().optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    video: z.string().optional(),
    github: z.url().optional(),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([])
  })
});

export const collections = { projects };
