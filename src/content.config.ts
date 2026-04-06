import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // <-- Nouveau loader

const blog = defineCollection({
  // On dit à Astro d'aller chercher les .md dans le dossier blog
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    image: z.string().optional(),
    author: z.string().default('Antoine Estarellas'),
  })
});

export const collections = { blog };import { defineCollection } from 'astro:content';

const blog = defineCollection({
  schema: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    author: { type: 'string', required: true },
    date: { type: 'date', required: true },
    image: { type: 'string', required: false }
  }
});

export const collections = { blog };
