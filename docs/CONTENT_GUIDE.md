# Guía para añadir contenido

Añadir una entrada son tres pasos: crear un `.md` dentro de una colección, escribir el frontmatter y ejecutar `pnpm build`. No hay que tocar rutas ni componentes: `src/pages/[type]/[...slug].astro` descubre el archivo solo.

```bash
pnpm build
```

## El modelo en cuatro conceptos

1. **Colección (tipo de contenido):** la carpeta dentro de `src/content/`. Decide la URL: `src/content/guides/prettier.md` → `/guides/prettier`.
2. **Categoría:** el área de conocimiento. Decide en qué página de `/categories/` aparece.
3. **Stack (subcategoría):** agrupa la categoría en temas. Opcional.
4. **Tags:** conectan temas entre categorías. No afectan a la ubicación.

```yaml
category: git
stack: github-actions
tags: [github, github-actions, ci-cd]
```

Esa entrada sale en la categoría **Git & GitHub**, dentro del grupo **GitHub Actions**.

El catálogo válido de categorías, stacks y categorías de recurso está en `src/config/site.ts`. Si escribes un id que no existe, `pnpm build` falla y te dice cuál es.

## Frontmatter base

Todas las colecciones aceptan estos campos (definidos en `src/content.config.ts`):

```yaml
---
title: "Título visible"
description: "Una frase que explique de qué va."
category: git # obligatorio, id de CATEGORIES
stack: github-actions # opcional, id de CATEGORY_STACK_ORDER[category]
order: 20 # opcional, orden manual dentro del stack
tags: [github, ci-cd]
related: ["commands/git-pull"] # referencias "colección/id"
draft: false # true = solo visible en pnpm dev
private: false # true = con URL propia, fuera de nav/tags/búsqueda
updatedAt: 2026-08-30
---
```

Las referencias (`related`, `technologies`, `libraries`) siempre llevan la colección delante: `technologies/react`, no `react`. En `resources`, que usa subcarpetas, el id las incluye: `resources/design/uiverse`.

## Campos propios por colección

| Colección | Úsala para | Campos propios |
| --- | --- | --- |
| `technologies` | Fundamento de una tecnología o lenguaje | `website`, `github` |
| `libraries` | API e instalación de un paquete | `install`, `technologies`, `website`, `github` |
| `integrations` | Combinar dos o más tecnologías | `technologies` (mínimo 2) |
| `recipes` | Solución completa a un problema | `problem`, `technologies` |
| `snippets` | Fragmento corto de código | `language` |
| `hooks` | Hook reutilizable | `framework`, `language`, `parameters`, `returns` |
| `utilities` | Función auxiliar pequeña | `runtime`, `language` |
| `resources` | Enlace externo recomendado | `url`, `resourceCategory`, `official` |
| `skills` | Flujo de una herramienta de IA | `tool` |
| `commands` | Comando de terminal y sus riesgos | `command`, `whenToUse`, `warnings` |
| `patterns` | Solución estructural reutilizable | `problem` |
| `practices` | Regla de calidad o mantenimiento | `practice`, `why` |
| `guides` | Explicación práctica con varios pasos | `scope`, `technologies`, `libraries`, `website`, `github` |
| `tricks` | Atajo o solución puntual | `problem` |

Si enseña un proceso, suele ser `guides`. Si resuelve un caso concreto con código listo para adaptar, `recipes`. Si solo guarda una orden de terminal, `commands`.

## Plantillas listas para copiar

### Guía dentro de un stack

`src/content/guides/github-actions-variables-y-secrets.md`

```yaml
---
title: "Variables y secrets en GitHub Actions"
description: "Cómo definir, limitar y consumir configuración segura en workflows."
category: git
stack: github-actions
order: 20
tags: [github-actions, secrets, ci-cd]
updatedAt: 2026-08-30
---
```

Sin `stack`, la entrada aparece como contenido introductorio, antes de los grupos.

### Recurso externo

`src/content/resources/developer-tools/github-cli.md`

```yaml
---
title: "GitHub CLI"
description: "Cliente oficial para trabajar con GitHub desde la terminal."
category: resources
url: "https://cli.github.com/"
resourceCategory: developer-tools
official: true
tags: [github, cli]
---
```

`resourceCategory` no es lo mismo que `category`: es la segunda clasificación que agrupa la página de Recursos.

### Integración

`src/content/integrations/astro-react.md`

```yaml
---
title: "React dentro de Astro"
description: "Cómo hidratar componentes React en una aplicación Astro."
category: frontend
stack: astro
technologies: ["technologies/astro", "technologies/react"]
tags: [astro, react, islands]
---
```

### Comando personal

`src/content/commands/mi-alias-de-despliegue.md`

```yaml
---
title: "Alias personal de despliegue"
description: "Recordatorio del comando que uso en mi entorno local."
category: terminal
stack: terminal
command: "mi-comando"
private: true
tags: [terminal]
---
```

No guardes tokens ni datos reales, aunque la entrada sea privada.

## Cómo escribir el cuerpo

Primero el concepto, después los pasos, el resultado esperado y los errores frecuentes. Los bloques de código admiten un nombre de archivo:

````markdown
```ts title="src/app.ts"
export const saludo = "hola"
```
````

Los bloques `bash` que solo contienen instalaciones (`npm install`, `npx`, `npm create`) se convierten solos en pestañas pnpm / bun / npm. No hay que escribir las tres variantes.

## Ampliar la estructura editorial

Todo empieza en `src/config/site.ts`.

**Categoría nueva**

1. Añade su entrada a `CATEGORY_DEFINITIONS` (`label`, `icon`, `description`, `color`). El id es la clave; `CATEGORY_IDS` se deriva sola.
2. Añade su id al bloque que le corresponda en `CATEGORY_GROUPS`. Si te olvidas, el build falla avisando.
3. Si tendrá subcategorías, añade su id a `CATEGORY_STACK_ORDER`.
4. Si el icono es nuevo, mira la sección de iconos más abajo.

**Subcategoría (stack) nueva**

1. Añade `id: "Etiqueta"` a `STACK_LABELS`.
2. Colócala en la posición que quieras dentro de `CATEGORY_STACK_ORDER[category]`.
3. Su icono será `brand-<id>`; regístralo en `src/config/icons.ts`. Si quieres reutilizar el icono de otro stack, añade la excepción a `STACK_ICONS`.

**Categoría de recurso nueva**

Añade una línea a `RESOURCE_CATEGORY_DEFINITIONS`. El resto se deriva.

**Tipo de contenido nuevo**

1. Añade su entrada a `CONTENT_TYPE_DEFINITIONS`.
2. Declara su colección en `src/content.config.ts` con `contentCollection` y añádela al objeto `collections`.
3. Añade su `CollectionEntry<...>` a `AnyEntry` en `src/lib/content.ts`.
4. Crea la carpeta `src/content/<id>/`.
5. `pnpm sync && pnpm check && pnpm build`.

**Icono nuevo**

Todos los iconos viven en `src/config/icons.ts`, que leen tanto Astro como React:

- Nombre de [lucide](https://lucide.dev/icons) tal cual: no hay que registrar nada.
- Icono de lucide con un color fijo: añádelo a `RECOLORED_ICONS` (`base` + `color`).
- Logo o glifo propio: añádelo a `BRAND_ICONS` (`viewBox`, `fill`, `body`).

## Qué archivo modificar según el objetivo

| Objetivo | Archivo |
| --- | --- |
| Crear una entrada | `src/content/<colección>/` |
| Cambiar campos permitidos | `src/content.config.ts` |
| Añadir categoría, stack u orden | `src/config/site.ts` |
| Cambiar cómo se agrupa una categoría | `src/lib/content.ts` (`getCategoryEntries`) |
| Cambiar el orden de lectura | `src/lib/content.ts` (`LEARNING_TYPE_ORDER`) |
| Cambiar relaciones automáticas | `src/lib/relations.ts` |
| Añadir un icono | `src/config/icons.ts` |

## Errores habituales

- **No aparece en producción:** sigue con `draft: true` o `private: true`.
- **No aparece en el stack esperado:** el `stack` no está en `CATEGORY_STACK_ORDER[category]`.
- **El build falla por una referencia:** usa `colección/id` e incluye la subcarpeta en los recursos.
- **El recurso no sale en su grupo:** revisa `resourceCategory`, no `category`.
- **Los tipos generados están viejos:** `pnpm sync` y después `pnpm check`.
