import { z } from "astro/zod"
import { docsLoader } from "@astrojs/starlight/loaders"
import { docsSchema } from "@astrojs/starlight/schema"
import { defineCollection } from "astro:content"

const libraryFields = z.object({
  tags: z.array(z.string()).default([]),
  private: z.boolean().default(false),
  updatedAt: z.coerce.date().optional(),

  website: z.url().optional(),
  github: z.url().optional(),
  url: z.url().optional(),

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
  note: z.string().optional(),
  official: z.boolean().default(false),
  resourceCategory: z.string().optional(),
  technologies: z.array(z.string()).default([])
})

const docs = defineCollection({
  loader: docsLoader(),
  schema: (context) =>
    docsSchema({ extend: libraryFields })(context).superRefine((data, ctx) => {
      const entry = data as {
        website?: string
        url?: string
        resourceCategory?: string
      }
      if ((entry.website || entry.url) && !entry.resourceCategory) {
        ctx.addIssue({
          code: "custom",
          path: ["resourceCategory"],
          message:
            "Una entrada con `website` o `url` necesita `resourceCategory`: es el texto que acompaña a los botones en la cabecera."
        })
      }
    })
})

export const collections = { docs }
