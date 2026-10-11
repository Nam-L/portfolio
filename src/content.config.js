import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Filter order on the page
export const disciplines = ['Gameplay', 'Systems & C++', 'Tools & CI', 'Game jams'];

// One Markdown file per project in src/content/projects. The file name is the
// project's id (used in links like /#project/vr-game) and the body is its write-up.
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number().default(99),
    featured: z.boolean().default(false),
    discipline: z.enum(disciplines),
    status: z.string().optional(), // stamp on the card, e.g. Prototype, Jam build, Shipped
    year: z.string().optional(),
    tags: z.array(z.string()).default([]),
    role: z.string().optional(),
    team: z.string().optional(),
    engine: z.string().optional(),
    platform: z.string().optional(),
    duration: z.string().optional(),
    highlights: z.array(z.string()).default([]), // "My contribution"
    challenge: z.object({ problem: z.string(), solution: z.string() }).optional(),
    code: z.object({ file: z.string(), source: z.string() }).optional(), // short excerpt shown in the details
    cover: z.string().optional(),
    images: z.array(z.object({ src: z.string(), alt: z.string() })).default([]),
    video: z.string().optional(),
    clip: z.string().optional(), // short muted .mp4/.webm loop that plays on the card on hover
    github: z.url().optional(),
    links: z.array(z.object({ label: z.string(), url: z.url() })).default([])
  })
});

export const collections = { projects };
