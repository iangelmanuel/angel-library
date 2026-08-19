---
title: Content Collections
description: Colecciones de contenido tipadas con Zod — defineCollection, loaders, getCollection, render y referencias entre colecciones.
category: frontend
stack: astro
order: 10
tags: [astro, content, zod]
scope: astro:content
related:
  - libraries/zod
  - guides/content-references
updatedAt: 2026-08-16
---

Content Collections tipa y valida Markdown/MDX/JSON con Zod en build — este mismo sitio está construido enteramente sobre esto (ver `src/content.config.ts`, la config real detrás de cada colección que ves en la sidebar).

## Definir una colección

Vive en `src/content.config.ts`, en la raíz de `src/` (no dentro de `content/`). `loader` dice de dónde salen las entradas; `schema` valida su frontmatter con Zod. Esto es la llamada **Content Layer API**, la forma actual desde Astro 5 — antes (Astro 2–4) una colección se detectaba sola por el nombre de la carpeta dentro de `src/content/`, sin declarar loader. Ese modelo implícito ya no existe: hoy toda colección se declara aquí, explícita, con su loader.

```ts title="src/content.config.ts"
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
```

## Loaders: `glob` y `file`

`glob` lee varios archivos (típicamente Markdown, uno por entrada). `file` lee un único JSON/YAML/TOML con varias entradas adentro — cada una necesita un `id` único.

```ts
glob({ pattern: '**/*.md', base: './src/content/blog' });

file('src/data/autores.json'); // requiere { id: "...", ... } por entrada
```

## Leer entradas

```ts
import { getCollection, getEntry } from 'astro:content';

const posts = await getCollection('blog');
const publicados = await getCollection('blog', ({ data }) => !data.draft);

const post = await getEntry('blog', 'primer-post');
```

## Renderizar el contenido

`render(entry)` compila el Markdown/MDX a un componente `<Content />`, más la lista de `headings` (para un índice de la página).

```astro
---
import { render, getEntry } from 'astro:content';

const post = await getEntry('blog', 'primer-post');
const { Content, headings } = await render(post);
---
<Content />
```

## Referenciar otra colección

`reference()` tipa un campo como id de otra colección, en vez de un string suelto — falla en build si apunta a algo que no existe.

```ts
import { reference } from 'astro:content';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    autor: reference('autores'),
    relacionados: z.array(reference('blog')).default([]),
  }),
});
```

```ts
import { getEntry, getEntries } from 'astro:content';

const post = await getEntry('blog', 'primer-post');
const autor = await getEntry(post.data.autor);
const relacionados = await getEntries(post.data.relacionados);
```

## Resumen

| API | Uso |
| --- | --- |
| `defineCollection({ loader, schema })` | Declarar una colección |
| `glob()` / `file()` | Loader desde varios archivos / uno solo |
| `getCollection(nombre, filtro?)` | Todas las entradas, con filtro opcional |
| `getEntry(nombre, id)` | Una entrada puntual |
| `render(entry)` | `{ Content, headings }` para renderizar el body |
| `reference(coleccion)` | Tipar un campo como referencia a otra colección |
| `getEntries(refs)` | Resolver varias referencias directamente |

## Consideraciones

- El schema es la única fuente de verdad del frontmatter — si un campo no está declarado ahí, TypeScript no lo conoce aunque exista en el `.md`.
- `reference()` valida que el id exista, pero recién en build — una referencia rota no rompe el editor, rompe el `astro build`. Ver cómo este sitio lo aprovecha en [Referencias entre contenidos](/guides/content-references).
- Cambiar el esquema no actualiza los tipos generados automáticamente en el editor: ejecuta `astro sync` —o `pnpm sync` en este proyecto— después de modificar `content.config.ts`.
