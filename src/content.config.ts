import { z } from "astro/zod"
import { docsLoader } from "@astrojs/starlight/loaders"
import { docsSchema } from "@astrojs/starlight/schema"
import { defineCollection } from "astro:content"
import { RESOURCE_CATEGORY_IDS } from "./config/catalog"
import { CONTENT_TYPE_IDS } from "./config/content-types"

// Ids de otras entradas: su ruta.
const refs = z
  .array(z.string().regex(/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/))
  .default([])

// Campos propios sobre los de Starlight.
// `type` es opcional en el schema porque las páginas propias
// (tags, categorías, tipos) también usan este layout; getAllEntries
// exige que toda entrada de contenido lo declare.
const libraryFields = z.object({
  type: z.enum(CONTENT_TYPE_IDS).optional(),
  tags: z.array(z.string()).default([]),
  related: refs,
  private: z.boolean().default(false),
  order: z.number().optional(),
  updatedAt: z.coerce.date().optional(),

  // Enlaces
  website: z.url().optional(),
  github: z.url().optional(),
  url: z.url().optional(),

  // Campos por tipo
  install: z.string().optional(),
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
  resourceCategory: z.enum(RESOURCE_CATEGORY_IDS).optional(),
  technologies: z.array(z.string()).default([]),
  libraries: refs
})

// Lo que cada tipo exige.
const REQUIRED_BY_TYPE = {
  commands: ["command"],
  resources: ["url", "resourceCategory"]
} as const

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: libraryFields.superRefine((data, ctx) => {
      if (!data.type) return

      const required =
        REQUIRED_BY_TYPE[data.type as keyof typeof REQUIRED_BY_TYPE]

      for (const field of required ?? []) {
        if (data[field as keyof typeof data] === undefined) {
          ctx.addIssue({
            code: "custom",
            path: [field],
            message: `El tipo "${data.type}" exige el campo "${field}".`
          })
        }
      }

      if (data.type === "integrations" && data.technologies.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["technologies"],
          message: 'El tipo "integrations" exige al menos 2 tecnologías.'
        })
      }
    })
  })
})

export const collections = { docs }
