# Crear una entrada, paso a paso

Guía para añadir contenido a la biblioteca. No hace falta tocar código.

## Paso 1 · Elige dónde va

La carpeta decide la clasificación:

```
src/content/docs/<categoría>/<subcategoría>/<nombre-del-archivo>.md
```

- **Categoría**: una de las 23 carpetas que ya existen (`frontend`, `backend`,
  `git`…). La lista vive en `src/config/categories.ts`.
- **Subcategoría**: la carpeta de dentro (`astro`, `react`, `node`…). La lista
  vive en `src/config/subcategories.ts`.
- **Nombre del archivo**: en minúsculas y con guiones. Es la URL.

```
src/content/docs/frontend/astro/astro-view-transitions.md
        → https://angel-library.vercel.app/frontend/astro/astro-view-transitions
```

Si la carpeta no existe en el config, el build falla. Para crear una nueva mira
el [paso 6](#paso-6--si-necesitas-una-carpeta-nueva).

## Paso 2 · Copia el frontmatter mínimo

```markdown
---
title: View Transitions en Astro
description: Transiciones entre páginas sin volverse una SPA.
type: guides
tags: [astro, navegación]
updatedAt: 2026-09-06
---
```

Cuatro campos son obligatorios en toda entrada:

| Campo         | Qué es                                              |
| ------------- | --------------------------------------------------- |
| `title`       | El título. Sale en la página, el menú y el buscador |
| `description` | Una frase. Sale en los listados y en el SEO         |
| `type`        | El tipo editorial (paso 3)                          |
| `tags`        | Lista de tags en minúsculas                         |

Opcionales que se usan mucho: `updatedAt` (fecha), `related` (paso 4),
`draft: true` (no se publica) y `private: true` (conserva su URL pero sale de
menús, listados y buscador).

## Paso 3 · Elige el tipo y sus campos

El `type` decide qué campos extra pide el esquema:

| `type`         | Para qué                           | Campos que exige              |
| -------------- | ---------------------------------- | ----------------------------- |
| `guides`       | Explicar cómo se hace algo         | —                             |
| `technologies` | Qué es una tecnología              | —                             |
| `libraries`    | Una librería concreta              | —                             |
| `recipes`      | Resolver un problema puntual       | —                             |
| `patterns`     | Un patrón reutilizable             | —                             |
| `practices`    | Una buena práctica                 | —                             |
| `snippets`     | Un fragmento de código             | —                             |
| `hooks`        | Un hook                            | —                             |
| `utilities`    | Una función de utilidad            | —                             |
| `tricks`       | Un truco corto                     | —                             |
| `skills`       | Una skill de una herramienta       | —                             |
| `commands`     | Un comando                         | **`command`**                 |
| `resources`    | Un enlace externo                  | **`url`, `resourceCategory`** |
| `integrations` | Usar una tecnología dentro de otra | **2+ `technologies`**         |

Ejemplo de un comando:

```markdown
---
title: git switch
description: Cambiar de rama sin los efectos secundarios de checkout.
type: commands
command: git switch -c nueva-rama
tags: [git, ramas]
---
```

Ejemplo de un recurso:

```markdown
---
title: Astro Docs
description: La documentación oficial de Astro.
type: resources
url: https://docs.astro.build
resourceCategory: learning
official: true
tags: [astro, documentación]
---
```

## Paso 4 · Conecta la entrada (opcional)

`related` apunta a otras entradas **por su ruta**, sin barra inicial:

```yaml
related:
  - frontend/astro/astro-islands
  - frontend/astro/astro-content-collections
```

No hace falta declarar la relación en las dos direcciones: el sitio calcula solo
los retroenlaces. Tampoco hace falta listar las integraciones ni las recetas que
citan a esta entrada: aparecen al pie automáticamente.

Si la ruta no existe, el build falla.

## Paso 5 · Escribe el cuerpo

Markdown normal. Tres cosas que da el sitio:

**Bloques de código con nombre de archivo.**

````markdown
```ts title="src/content.config.ts"
export const collections = { docs }
```
````

**Pestañas de gestor de paquetes.** Escribe la instalación en un bloque `bash` y
se convierte sola en pnpm · bun · npm:

````markdown
```bash
npm install astro
```
````

**Enlaces internos** con la ruta absoluta:

```markdown
Ver [Content Collections](/frontend/astro/astro-content-collections).
```

Si el enlace apunta a una página que no existe, el build falla.

## Paso 6 · Si necesitas una carpeta nueva

**Subcategoría nueva** (`src/config/subcategories.ts`):

1. Añade `mi-carpeta: "Mi carpeta"` a `SUBCATEGORY_LABELS`.
2. Colócala en `CATEGORY_SUBCATEGORY_ORDER` bajo su categoría.
3. Crea `src/content/docs/<categoría>/mi-carpeta/`.

**Categoría nueva** (`src/config/categories.ts`):

1. Añade su entrada a `CATEGORY_DEFINITIONS` (etiqueta, icono, descripción,
   color).
2. Colócala en `CATEGORY_GROUPS`; si te olvidas, el build avisa.
3. Crea `src/content/docs/mi-categoria/`.

El menú se actualiza solo: lo construye `src/config/sidebar.ts` leyendo el config
y las carpetas.

## Paso 7 · Comprueba

```bash
pnpm dev
```

Y antes de publicar:

```bash
pnpm build
```

El build valida el esquema, las carpetas, las relaciones y los enlaces internos.
Si algo está mal, se detiene con un mensaje en español que dice qué archivo es.

## Errores frecuentes

| Mensaje                              | Qué pasó                                       |
| ------------------------------------ | ---------------------------------------------- |
| `no declara "type"`                  | Falta el campo `type` en el frontmatter        |
| `El tipo "commands" exige "command"` | El tipo pide un campo que no pusiste           |
| Carpeta desconocida                  | La subcarpeta no está en el config             |
| Referencia rota                      | Un `related` apunta a una ruta inexistente     |
| Enlace interno muerto                | Un `](/…)` del cuerpo no lleva a ninguna parte |
