import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    image: z.string().optional(),
    author: z.string().default('Antoine Estarellas'),
  })
});

export const collections = { blog };
