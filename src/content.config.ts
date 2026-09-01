import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { defineCollection } from "astro:content"
import type { ContentTypeId } from "./config/content-types"
import { RESOURCE_CATEGORY_IDS } from "./config/resources"

/**
 * Esquema del contenido: una sola colección, una rama por `type`.
 * La carpeta da categoría y subcategoría; las referencias son ids (rutas).
 */

/** Ids de otras entradas. */
const refs = z
  .array(z.string().regex(/^[a-z0-9-]+(?:\/[a-z0-9-]+)+$/))
  .default([])

const baseFields = {
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).default([]),
  /** Relacionado; lo inverso se calcula solo. */
  related: refs,
  /** Orden manual; menor = primero. */
  order: z.number().optional(),
  draft: z.boolean().default(false),
  /** Fuera de la navegación. */
  private: z.boolean().default(false),
  updatedAt: z.coerce.date().optional()
}

const linkFields = {
  website: z.url().optional(),
  github: z.url().optional()
}

/** Un tipo = `type` + campos base + los suyos. */
function entryType<const Fields extends z.ZodRawShape>(
  type: ContentTypeId,
  fields: Fields = {} as Fields
) {
  return z.object({ type: z.literal(type), ...baseFields, ...fields })
}

const library = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  schema: z.discriminatedUnion("type", [
    entryType("technologies", linkFields),

    entryType("libraries", {
      ...linkFields,
      /** Comando de instalación. */
      install: z.string().optional(),
      technologies: refs
    }),

    entryType("integrations", {
      /** Mínimo 2 tecnologías. */
      technologies: z.array(z.string()).min(2)
    }),

    entryType("recipes", {
      /** Problema que resuelve. */
      problem: z.string().optional(),
      technologies: refs
    }),

    entryType("snippets", {
      language: z.string().optional()
    }),

    entryType("hooks", {
      framework: z.string().optional(),
      language: z.string().optional(),
      parameters: z.array(z.string()).default([]),
      returns: z.string().optional()
    }),

    entryType("utilities", {
      runtime: z.string().optional(),
      language: z.string().optional()
    }),

    entryType("resources", {
      url: z.url(),
      resourceCategory: z.enum(RESOURCE_CATEGORY_IDS),
      technologies: refs,
      personalNote: z.string().optional(),
      official: z.boolean().default(false)
    }),

    entryType("skills", {
      /** Herramienta a la que aplica. */
      tool: z.string().optional()
    }),

    entryType("commands", {
      /** El comando en sí. */
      command: z.string(),
      whenToUse: z.string().optional(),
      warnings: z.array(z.string()).default([])
    }),

    entryType("patterns", {
      problem: z.string().optional()
    }),

    entryType("practices", {
      practice: z.string().optional(),
      why: z.string().optional()
    }),

    entryType("guides", {
      ...linkFields,
      scope: z.string().optional(),
      technologies: refs,
      libraries: refs
    }),

    entryType("tricks", {
      problem: z.string().optional()
    })
  ])
})

export const collections = { library }
