import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    category: z.string(),
    tags: z.array(z.string()),
    hints: z.array(z.string()),
    answer: z.object({
      value: z.number(),
      unit: z.string(),
      tolerance: z.number(),
    }),
    explanation: z.string(),
    keyValues: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    ),
  }),
});

export const collections = { cases };
