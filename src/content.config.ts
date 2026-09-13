import { z } from "astro/zod"
import { docsLoader } from "@astrojs/starlight/loaders"
import { docsSchema } from "@astrojs/starlight/schema"
import { defineCollection } from "astro:content"

// Campos propios sobre los de Starlight. Todos opcionales: la categoría
// (la carpeta) ya clasifica la entrada, nada se exige por encima de eso.
const libraryFields = z.object({
  tags: z.array(z.string()).default([]),
  private: z.boolean().default(false),
  order: z.number().int().nonnegative().optional(),
  updatedAt: z.coerce.date().optional(),

  website: z.url().optional(),
  github: z.url().optional(),
  url: z.url().optional(),

  command: z.string().optional(),
  whenToUse: z.string().optional(),
  warnings: z.array(z.string()).default([]),
  problem: z.string().optional(),
  practice: z.string().optional(),
  why: z.string().optional(),
  scope: z.string().optional(),
  tool: z.string().optional(),
  language: z.string().optional(),
  framework: z.string().optional(),
  runtime: z.string().optional(),
  parameters: z.array(z.string()).default([]),
  returns: z.string().optional(),
  personalNote: z.string().optional(),
  official: z.boolean().default(false),
  resourceCategory: z.string().optional(),
  technologies: z.array(z.string()).default([])
})

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({ extend: libraryFields })
})

export const collections = { docs }
