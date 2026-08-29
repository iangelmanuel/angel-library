import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { CATEGORY_IDS, RESOURCE_CATEGORY_IDS, STACK_IDS } from "./config/site"

/**
 * Modelo de contenido de la biblioteca.
 *
 * Cada tipo de contenido es una colección con su propio schema.
 * Todos comparten un bloque base (título, descripción, categoría, tags,
 * relaciones) y añaden campos específicos según su naturaleza.
 *
 * Las relaciones (`related`, `technologies`) son referencias namespaced
 * (`collection/id`) de otras entradas. La existencia se valida
 * en build (src/lib/relations.ts): si una referencia apunta a una entrada
 * que no existe, el build falla con un mensaje claro.
 */

/** Referencias a otras entradas por colección e id. */
const refs = z.array(z.string().regex(/^[a-z-]+\/[a-z0-9-/]+$/)).default([])

const baseFields = {
  title: z.string(),
  description: z.string(),
  category: z.enum(CATEGORY_IDS),
  tags: z.array(z.string()).default([]),
  /** Contenido relacionado explícito (ids). Las relaciones inversas y por tags se calculan solas. */
  related: refs,
  /** Subcategoría dentro de una categoría ("frontend": astro/react/nextjs; "backend": node/express/astro/nextjs). */
  stack: z.enum(STACK_IDS).optional(),
  /** Orden manual dentro de la misma etapa de aprendizaje y grupo. Menor = primero; nunca adelanta recetas a fundamentos. */
  order: z.number().optional(),
  draft: z.boolean().default(false),
  /** Entrada accesible por ruta directa, pero fuera de la navegación pública. */
  private: z.boolean().default(false),
  updatedAt: z.coerce.date().optional()
}

const linkFields = {
  website: z.url().optional(),
  github: z.url().optional()
}

/** Todas las colecciones comparten loader y campos base; aquí solo declaran lo propio. */
function contentCollection<const Fields extends z.ZodRawShape>(
  directory: string,
  fields: Fields
) {
  return defineCollection({
    loader: glob({ pattern: "**/*.md", base: `./src/content/${directory}` }),
    schema: z.object({ ...baseFields, ...fields })
  })
}

const technologies = contentCollection("technologies", linkFields)

const libraries = contentCollection("libraries", {
  ...linkFields,
  /** Comando de instalación, p. ej. "npm install zod" */
  install: z.string().optional(),
  technologies: refs
})

const integrations = contentCollection("integrations", {
  /** Tecnologías que combina esta integración (mínimo 2). */
  technologies: z.array(z.string()).min(2)
})

const snippets = contentCollection("snippets", {
  language: z.string().optional()
})

const hooks = contentCollection("hooks", {
  framework: z.string().optional(),
  language: z.string().optional(),
  parameters: z.array(z.string()).default([]),
  returns: z.string().optional()
})

const utilities = contentCollection("utilities", {
  runtime: z.string().optional(),
  language: z.string().optional()
})

const recipes = contentCollection("recipes", {
  /** Problema que resuelve la receta, en una frase. */
  problem: z.string().optional(),
  technologies: refs
})

const resources = contentCollection("resources", {
  url: z.url(),
  resourceCategory: z.enum(RESOURCE_CATEGORY_IDS),
  technologies: refs,
  personalNote: z.string().optional(),
  official: z.boolean().default(false)
})

const skills = contentCollection("skills", {
  /** Herramienta a la que aplica: "Claude Code", "Cursor", "OpenCode"… */
  tool: z.string().optional()
})

const commands = contentCollection("commands", {
  /** El comando en sí, p. ej. "git reset --soft HEAD~1" */
  command: z.string(),
  whenToUse: z.string().optional(),
  warnings: z.array(z.string()).default([])
})

const patterns = contentCollection("patterns", {
  problem: z.string().optional()
})

const practices = contentCollection("practices", {
  practice: z.string().optional(),
  why: z.string().optional()
})

const guides = contentCollection("guides", {
  ...linkFields,
  scope: z.string().optional(),
  technologies: refs,
  libraries: refs
})

const tricks = contentCollection("tricks", {
  problem: z.string().optional()
})

export const collections = {
  technologies,
  libraries,
  integrations,
  recipes,
  snippets,
  hooks,
  utilities,
  resources,
  skills,
  commands,
  patterns,
  practices,
  guides,
  tricks
}
