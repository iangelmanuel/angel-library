import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_IDS, RESOURCE_CATEGORY_IDS, STACK_IDS } from './config/site';

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
const refs = z
  .array(z.string().regex(/^[a-z-]+\/[a-z0-9-/]+$/))
  .default([]);

const baseFields = {
  title: z.string(),
  description: z.string(),
  category: z.enum(CATEGORY_IDS),
  tags: z.array(z.string()).default([]),
  /** Contenido relacionado explícito (ids). Las relaciones inversas y por tags se calculan solas. */
  related: refs,
  /** Subcategoría dentro de una categoría (hoy solo "frontend": astro/react/nextjs). */
  stack: z.enum(STACK_IDS).optional(),
  /** Orden manual dentro de su grupo (stack, o categoría). Menor = primero. Sin definir = al final, alfabético. */
  order: z.number().optional(),
  draft: z.boolean().default(false),
  updatedAt: z.coerce.date().optional(),
};

const linkFields = {
  website: z.url().optional(),
  github: z.url().optional(),
};

const technologies = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/technologies' }),
  schema: z.object({
    ...baseFields,
    ...linkFields,
  }),
});

const libraries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/libraries' }),
  schema: z.object({
    ...baseFields,
    ...linkFields,
    /** Comando de instalación, p. ej. "npm install zod" */
    install: z.string().optional(),
    technologies: refs,
  }),
});

const integrations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/integrations' }),
  schema: z.object({
    ...baseFields,
    /** Tecnologías que combina esta integración (mínimo 2). */
    technologies: z.array(z.string()).min(2),
  }),
});

const snippets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/snippets' }),
  schema: z.object({
    ...baseFields,
    language: z.string().optional(),
  }),
});

const hooks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/hooks' }),
  schema: z.object({
    ...baseFields,
    framework: z.string().optional(),
    language: z.string().optional(),
    parameters: z.array(z.string()).default([]),
    returns: z.string().optional(),
  }),
});

const components = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/components' }),
  schema: z.object({
    ...baseFields,
    framework: z.string().optional(),
    library: z.string().regex(/^[a-z-]+\/[a-z0-9-]+$/).optional(),
    install: z.string().optional(),
    source: z.url().optional(),
    dependencies: refs,
  }),
});

const utilities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/utilities' }),
  schema: z.object({
    ...baseFields,
    runtime: z.string().optional(),
    language: z.string().optional(),
  }),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    ...baseFields,
    /** Problema que resuelve la receta, en una frase. */
    problem: z.string().optional(),
    technologies: refs,
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    ...baseFields,
    url: z.url(),
    resourceCategory: z.enum(RESOURCE_CATEGORY_IDS),
    technologies: refs,
    personalNote: z.string().optional(),
    official: z.boolean().default(false),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/skills' }),
  schema: z.object({
    ...baseFields,
    /** Herramienta a la que aplica: "Claude Code", "Cursor", "OpenCode"… */
    tool: z.string().optional(),
  }),
});

const commands = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/commands' }),
  schema: z.object({
    ...baseFields,
    /** El comando en sí, p. ej. "git reset --soft HEAD~1" */
    command: z.string(),
    whenToUse: z.string().optional(),
    warnings: z.array(z.string()).default([]),
  }),
});

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    ...baseFields,
    problem: z.string().optional(),
  }),
});

const practices = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/practices' }),
  schema: z.object({
    ...baseFields,
    practice: z.string().optional(),
    why: z.string().optional(),
  }),
});

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    ...baseFields,
    scope: z.string().optional(),
    technologies: refs,
    libraries: refs,
  }),
});

const tricks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tricks' }),
  schema: z.object({
    ...baseFields,
    problem: z.string().optional(),
  }),
});

export const collections = {
  technologies,
  libraries,
  integrations,
  recipes,
  snippets,
  hooks,
  components,
  utilities,
  resources,
  skills,
  commands,
  patterns,
  practices,
  guides,
  tricks,
};
