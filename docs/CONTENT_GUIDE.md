# Guía de contenido

Cómo crear, modificar, mover y borrar cada pieza de la biblioteca.

```bash
pnpm build
```

`pnpm build` es la validación real: falla con un mensaje en español si una carpeta, una referencia o un enlace interno no existe.

## El modelo

```
Categoría  →  Subcategoría  →  Módulo  →  Secciones
frontend   →  react         →  react-context-api.md  →  ## Cuándo usarlo
```

| Pieza             | Dónde vive                    | Qué decide                                                                   |
| ----------------- | ----------------------------- | ---------------------------------------------------------------------------- |
| **Categoría**     | 1.ª carpeta de `src/content/` | Área de conocimiento. Su página `/categories/<id>` y su bloque en la sidebar |
| **Subcategoría**  | 2.ª carpeta                   | El grupo dentro de la categoría                                              |
| **Módulo**        | el archivo `.md`              | Una página. Su URL es su ruta                                                |
| **Sección**       | los `##` dentro del `.md`     | El índice lateral (TOC) de esa página                                        |
| **Tipo** (`type`) | frontmatter                   | Insignia, icono, color y sitio en el orden de lectura                        |
| **Tags**          | frontmatter                   | Conexiones entre categorías. No afectan la ubicación                         |

**La carpeta manda.** La ruta del archivo es su id y su URL:

```
src/content/git/github-actions/variables-y-secrets.md
        →  /git/github-actions/variables-y-secrets
```

El catálogo de ids válidos está en `src/config/site.ts`. Una carpeta que no esté declarada ahí rompe el build.

---

## Módulos (las entradas)

### Crear uno

Crea el `.md` en la carpeta de su categoría y subcategoría. No hay que tocar rutas ni componentes.

```yaml
---
title: "Variables y secrets en GitHub Actions"
description: "Cómo definir, limitar y consumir configuración segura en workflows."
type: guides # obligatorio, id de CONTENT_TYPES
order: 20 # opcional, orden manual dentro del grupo
tags: [github-actions, secrets, ci-cd]
related: ["git/git/git-pull"] # ids = ruta del archivo, sin .md
draft: false # true = solo visible en pnpm dev
private: false # true = con URL propia, fuera de nav/tags/búsqueda
updatedAt: 2026-08-30
---
```

La categoría y la subcategoría **no se escriben**: salen de la carpeta.

Un `.md` colocado directamente bajo la categoría (sin subcarpeta) sale como contenido suelto, en la sección "Fundamentos y referencias", después de los grupos.

### Modificarlo

- **Cambiar de categoría o subcategoría:** mueve el archivo. Nada más.
- **Cambiar el nombre del archivo:** cambia su URL. Actualiza las entradas que lo referencien (`related`, `technologies`, `libraries`) y los enlaces `](/…)` de otros módulos; el build te dirá cuáles si te saltas alguno.
- **Cambiar su orden dentro del grupo:** `order` (menor = primero). Sin `order`, manda el tipo (`LEARNING_TYPE_ORDER`) y después el título.
- **Cambiar su tipo:** edita `type` y ajusta los campos propios de ese tipo.

### Borrarlo

Borra el `.md` y ejecuta `pnpm build`: si alguien lo referenciaba, el build falla listando quién.

### Campos propios por tipo

| `type`         | Úsalo para                              | Campos propios                                            |
| -------------- | --------------------------------------- | --------------------------------------------------------- |
| `technologies` | Fundamento de una tecnología o lenguaje | `website`, `github`                                       |
| `libraries`    | API e instalación de un paquete         | `install`, `technologies`, `website`, `github`            |
| `integrations` | Combinar dos o más tecnologías          | `technologies` (mínimo 2)                                 |
| `recipes`      | Solución completa a un problema         | `problem`, `technologies`                                 |
| `snippets`     | Fragmento corto de código               | `language`                                                |
| `hooks`        | Hook reutilizable                       | `framework`, `language`, `parameters`, `returns`          |
| `utilities`    | Función auxiliar pequeña                | `runtime`, `language`                                     |
| `resources`    | Enlace externo recomendado              | `url`, `resourceCategory`, `official`, `personalNote`     |
| `skills`       | Flujo de una herramienta de IA          | `tool`                                                    |
| `commands`     | Comando de terminal y sus riesgos       | `command`, `whenToUse`, `warnings`                        |
| `patterns`     | Solución estructural reutilizable       | `problem`                                                 |
| `practices`    | Regla de calidad o mantenimiento        | `practice`, `why`                                         |
| `guides`       | Explicación práctica con varios pasos   | `scope`, `technologies`, `libraries`, `website`, `github` |
| `tricks`       | Atajo o solución puntual                | `problem`                                                 |

Si enseña un proceso, suele ser `guides`. Si resuelve un caso concreto con código listo para adaptar, `recipes`. Si solo guarda una orden de terminal, `commands`.

---

## Secciones (dentro de un módulo)

Las secciones son los encabezados del cuerpo. `Toc.astro` construye el índice lateral con los `##` y `###`, y el scroll-spy marca la que se está leyendo.

```markdown
## Cuándo usarlo ← sección (entra en el índice)

### Con formularios ← apartado (entra en el índice)

#### Detalle ← no entra en el índice
```

- El `#` de nivel 1 no se escribe: el título sale del frontmatter.
- **Añadir una sección** = añadir un `##`. **Reordenarlas** = mover el bloque. **Renombrarla** = editar el texto (rompe los enlaces `#ancla` que apunten a ella).
- Orden recomendado dentro del módulo: concepto → pasos → resultado esperado → errores frecuentes.

Bloques de código con nombre de archivo:

````markdown
```ts title="src/app.ts"
export const saludo = "hola"
```
````

Los bloques `bash` que solo contienen instalaciones (`npm install`, `npx`, `npm create`) se convierten solos en pestañas pnpm / bun / npm.

Los enlaces internos apuntan al id de otro módulo: `[Zod](/general/packages/zod)`.

---

## Subcategorías

### Crear una

1. `SUBCATEGORY_LABELS` en `src/config/site.ts`: `"mi-subcategoria": "Mi subcategoría"`.
2. `SUBCATEGORY_DESCRIPTIONS`: una línea que explica qué se encuentra ahí (sale bajo el título del grupo).
3. `CATEGORY_SUBCATEGORY_ORDER[categoría]`: colócala en la posición donde quieras que salga.
4. **Icono**: por defecto busca `brand-mi-subcategoria` en `src/config/icons.ts`. Regístralo ahí o añade una excepción en `SUBCATEGORY_ICONS`. Sin icono, el build falla.
5. Crea la carpeta `src/content/<categoría>/mi-subcategoria/`.

```ts
// src/config/site.ts
const SUBCATEGORY_LABELS = {
  "mi-subcategoria": "Mi subcategoría"
}

const SUBCATEGORY_DESCRIPTIONS = {
  "mi-subcategoria": "Qué se encuentra en este grupo."
}

const CATEGORY_SUBCATEGORY_ORDER = {
  frontend: ["frontend-fundamentos", "mi-subcategoria", "react"]
}
```

```ts
// src/config/icons.ts
const RECOLORED_ICONS = {
  "brand-mi-subcategoria": { base: "layers", color: "#38bdf8" }
}
```

Una misma subcategoría puede reutilizarse en varias categorías (`astro` vive en `frontend`, `backend`, `seo` y `testing`): basta con listarla en cada `CATEGORY_SUBCATEGORY_ORDER` y crear su carpeta en cada categoría.

### Modificarla

- **Renombrar lo que se ve:** cambia su valor en `SUBCATEGORY_LABELS`. No afecta a URLs.
- **Cambiar su id:** renombra la carpeta, la clave en `SUBCATEGORY_LABELS` / `SUBCATEGORY_DESCRIPTIONS` / `CATEGORY_SUBCATEGORY_ORDER` y el icono. Cambian las URLs de todos sus módulos, así que hay que actualizar referencias y enlaces.
- **Reordenar:** mueve su id dentro de `CATEGORY_SUBCATEGORY_ORDER[categoría]`. Una subcategoría no declarada ahí sigue funcionando, pero sale al final.

### Borrarla

Mueve o borra sus módulos, borra la carpeta y quita sus entradas de `SUBCATEGORY_LABELS`, `SUBCATEGORY_DESCRIPTIONS` y `CATEGORY_SUBCATEGORY_ORDER`. Un grupo sin contenido no se dibuja, pero deja configuración muerta.

---

## Categorías

### Crear una

1. `CATEGORY_DEFINITIONS` en `src/config/site.ts`: `label`, `icon` (nombre de lucide), `description`, `color` (variable de `tokens.css`). El id es la clave.
2. `CATEGORY_GROUPS`: coloca su id en el bloque de la sidebar que le toque. **Si te olvidas, el build falla** — una categoría sin grupo desaparecería de la navegación sin avisar.
3. `CATEGORY_SUBCATEGORY_ORDER`: declara sus subcategorías en orden.
4. Crea `src/content/<id>/` y dentro las carpetas de sus subcategorías.

```ts
// src/config/site.ts
const CATEGORY_DEFINITIONS = {
  mobile: {
    label: "Mobile",
    icon: "smartphone",
    description:
      "Aplicaciones móviles: React Native, Expo y publicación en tiendas.",
    color: "--accent-cyan"
  }
}

export const CATEGORY_GROUPS = [
  { id: "construir", categories: ["general", "frontend", "mobile", "backend"] }
]
```

### Modificarla

- **Renombrar lo que se ve:** `label` en `CATEGORY_DEFINITIONS`. No afecta a URLs.
- **Cambiar icono, descripción o color:** en la misma entrada. El color debe ser una variable declarada en `src/styles/tokens.css`.
- **Moverla de bloque o reordenarla:** cambia su posición en `CATEGORY_GROUPS`. Ese arreglo es el orden real en la home, la sidebar y las páginas de tags.
- **Cambiar su id:** renombra la carpeta y la clave, y actualiza referencias y enlaces (cambian todas las URLs de la categoría).

### Borrarla

Mueve sus módulos, borra la carpeta y quita su id de `CATEGORY_DEFINITIONS` y de `CATEGORY_GROUPS`.

---

## Categorías de recurso

La categoría `resources` es el único caso especial: sus subcarpetas no son subcategorías, son **categorías de recurso** (`RESOURCE_CATEGORY_DEFINITIONS`).

1. Añade `id: { label, description }` a `RESOURCE_CATEGORY_DEFINITIONS`.
2. Crea `src/content/resources/<id>/`.

```yaml
# src/content/resources/developer-tools/github-cli.md
---
title: "GitHub CLI"
description: "Cliente oficial para trabajar con GitHub desde la terminal."
type: resources
url: "https://cli.github.com/"
resourceCategory: developer-tools
official: true
tags: [github, cli]
---
```

`resourceCategory` repite el id de la subcarpeta porque es lo que se muestra en la insignia del recurso. Un recurso puede vivir en otra categoría (por ejemplo `courses/cursos-midudev/`): ahí la subcarpeta es una subcategoría normal y `resourceCategory` solo alimenta la insignia.

---

## Tipos de contenido

1. `CONTENT_TYPE_DEFINITIONS` en `src/config/site.ts`: `label`, `singular`, `icon`, `description`, `color`.
2. Una línea `entryType("<id>", { … })` en la unión de `src/content.config.ts`.
3. Colócalo en `LEARNING_TYPE_ORDER` (`src/lib/content.ts`) según cuándo se lee.
4. Añade su color de insignia en `src/styles/components/primitives.css` (`.type-<id>`).
5. `pnpm sync && pnpm check && pnpm build`.

No hay carpeta que crear: el tipo vive en el frontmatter y su listado sale solo en `/tipos/<id>`.

---

## Iconos

Todos viven en `src/config/icons.ts`, que leen tanto Astro como React:

- Nombre de [lucide](https://lucide.dev/icons) tal cual (`search`, `database`): no hay que registrar nada.
- Icono de lucide con un color fijo: añádelo a `RECOLORED_ICONS` (`base` + `color`).
- Logo o glifo propio: añádelo a `BRAND_ICONS` (`viewBox`, `fill`, `body`).

Un nombre que no exista en lucide ni en esa tabla rompe el build.

---

## Qué archivo tocar según el objetivo

| Objetivo                                      | Archivo                                      |
| --------------------------------------------- | -------------------------------------------- |
| Crear un módulo                               | `src/content/<categoría>/<subcategoría>/`    |
| Mover un módulo                               | mueve el `.md` de carpeta                    |
| Cambiar campos permitidos del frontmatter     | `src/content.config.ts`                      |
| Añadir o reordenar categorías y subcategorías | `src/config/site.ts`                         |
| Cambiar cómo se agrupa una categoría          | `src/lib/content.ts` (`getCategoryEntries`)  |
| Cambiar el orden de lectura                   | `src/lib/content.ts` (`LEARNING_TYPE_ORDER`) |
| Cambiar las relaciones automáticas            | `src/lib/relations.ts`                       |
| Añadir un icono                               | `src/config/icons.ts`                        |
| Cambiar un color                              | `src/styles/tokens.css`                      |

---

## Lo que valida el build

| Validación                 | Falla cuando                                                          |
| -------------------------- | --------------------------------------------------------------------- |
| `validateContentStructure` | Una carpeta no es una categoría o subcategoría declarada              |
| `validateContentRelations` | `related`, `technologies` o `libraries` apuntan a un id que no existe |
| `validateInternalLinks`    | Un enlace `](/…)` del cuerpo no lleva a ninguna parte                 |
| `CATEGORY_GROUPS`          | Una categoría no está en ningún bloque de la sidebar                  |
| `PUBLIC_COMMANDS`          | Un comando de la terminal con descripción no está listado             |

## Errores habituales

- **`bad indentation of a mapping entry`:** un valor contiene `: ` sin comillas y YAML lo lee como otra clave. Envuélvelo en comillas dobles:

  ```yaml
  description: "Editor de escritorio: graba y monta video."
  ```

  Pasa sobre todo en `title`, `description` y `personalNote`.

- **`Invalid discriminator value`:** falta `type:` o su id no existe.
- **No aparece en producción:** sigue con `draft: true` o `private: true`.
- **No aparece en el grupo esperado:** está en otra subcarpeta, o esa subcarpeta no está en `CATEGORY_SUBCATEGORY_ORDER[categoría]`.
- **El build falla por una referencia:** usa el id completo, con categoría y subcategoría.
- **Los tipos generados están viejos:** `pnpm sync` y después `pnpm check`.
