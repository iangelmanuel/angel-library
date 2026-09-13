# Crear contenido, paso a paso

Esta guía tiene tres recorridos, de menor a mayor esfuerzo:

- **[A · Una entrada nueva en un apartado que ya existe](#a--una-entrada-nueva-en-un-apartado-que-ya-existe)** — el caso más común.
- **[B · Una subcategoría nueva, dentro de una categoría que ya existe](#b--una-subcategoría-nueva-dentro-de-una-categoría-que-ya-existe)**
- **[C · Una categoría completamente nueva](#c--una-categoría-completamente-nueva)** — el "apartado x" desde cero.

Al final: la [tabla completa de campos](#referencia-todos-los-campos-del-frontmatter) y los [errores más comunes](#errores-comunes).

---

## A · Una entrada nueva en un apartado que ya existe

Ejemplo: agregar un artículo sobre `astro:actions` dentro de
Frontend → Astro (`src/content/docs/frontend/astro/`, que ya existe).

### Paso 1 · Crea el archivo

```text
src/content/docs/frontend/astro/astro-actions.md
```

La ruta del archivo **es** la clasificación: primera carpeta = categoría,
segunda carpeta = subcategoría, nombre de archivo = URL final
(`/frontend/astro/astro-actions`). No hay que registrar el archivo en
ningún lado — con crearlo alcanza.

### Paso 2 · Frontmatter mínimo

```markdown
---
title: Astro Actions
description: Funciones de servidor que se llaman como si fueran locales.
tags: [astro, backend]
---
```

Tres campos alcanzan para publicar:

| Campo         | Qué es                                                                                  |
| ------------- | --------------------------------------------------------------------------------------- |
| `title`       | El título. Sale en la página, el menú y el buscador                                     |
| `description` | Una frase. Sale en los listados y en el SEO                                             |
| `tags`        | Lista de tags en minúsculas — no se muestran en la página, es metadata para el buscador |

Opcionales que se usan seguido:

- `updatedAt: 2026-09-12` — fecha, se muestra en la cabecera de la entrada.
- `draft: true` — no se publica (solo se ve corriendo `pnpm dev`).
- `private: true` — conserva su URL pero sale de menús, listados y
  buscador. **No es control de acceso**: quien tenga el link igual la ve.

### Paso 3 · Orden dentro de la subcategoría (opcional)

Por defecto, Starlight ordena alfabético. Si necesitás que un artículo
aparezca primero (por ejemplo, una introducción antes que el resto), usá
el campo nativo de Starlight:

```yaml
---
title: Astro Actions
sidebar:
  order: 1
---
```

Cuanto más bajo el número, más arriba aparece. Las entradas sin `sidebar.order`
quedan después, en orden alfabético.

### Paso 4 · Campos sueltos, según lo que necesite el artículo

No existe un "tipo" de entrada que decida qué pedir. Usá los campos que
tengan sentido para lo que estás escribiendo — todos son opcionales y cada
uno aparece en la página solo si le pusiste valor:

| Campo                                                                         | Para qué                                                               |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `command`                                                                     | El comando, si la entrada es sobre un comando concreto                 |
| `url`, `website`, `github`                                                    | Enlaces externos (se muestran como botones en la cabecera)             |
| `resourceCategory`                                                            | Subcategoría de `resources/`, solo si la entrada vive en esa categoría |
| `technologies`                                                                | Lista de ids de otras entradas relacionadas (cross-link)               |
| `problem`, `whenToUse`, `tool`, `language`, `framework`, `runtime`, `returns` | Datos sueltos que aparecen como ficha en la cabecera                   |
| `warnings`                                                                    | Lista de avisos que se muestran destacados                             |
| `official`                                                                    | `true`/`false` — para recursos, indica si es la fuente oficial         |

Ejemplo de un comando:

```markdown
---
title: git switch
description: Cambiar de rama sin los efectos secundarios de checkout.
command: git switch -c nueva-rama
tags: [git, ramas]
---
```

Ejemplo de un recurso, con `technologies` cruzando a otra entrada:

```markdown
---
title: Astro Docs
description: La documentación oficial de Astro.
url: https://docs.astro.build
resourceCategory: learning
official: true
technologies: [frontend/astro/astro-islands]
tags: [astro, documentación]
---
```

`technologies` apunta al **id** de la otra entrada (su ruta, sin la
extensión `.md` y sin barra inicial): `frontend/astro/astro-islands`.

### Paso 5 · Escribe el cuerpo

Markdown normal. Dos cosas que da el sitio automáticamente:

**Enlaces internos**, con la ruta absoluta:

```markdown
Ver [Content Collections](/frontend/astro/astro-content-collections).
```

No hay comprobación de enlaces rotos en build — revisá la ruta a mano
antes de publicar.

**Pestañas de instalación.** Escribí el comando en un bloque `bash` normal
y el sitio lo convierte solo en pestañas pnpm/bun/npm:

````markdown
```bash
pnpm add astro
```
````

### Paso 6 · Comprueba

```bash
pnpm dev
```

Abrí la URL de la entrada y fijate que aparezca en el sidebar, en la
categoría/subcategoría correctas. Antes de dar por terminado:

```bash
pnpm check
pnpm build
```

Si el frontmatter tiene un error (un campo con el tipo equivocado, por
ejemplo `tags: astro` en vez de `tags: [astro]`), `pnpm build` se detiene
señalando el archivo exacto.

---

## B · Una subcategoría nueva, dentro de una categoría que ya existe

Ejemplo: agregar la subcategoría "Svelte" dentro de la categoría Frontend,
que ya existe.

### Paso 1 · Crea la carpeta y el primer artículo

```text
src/content/docs/frontend/svelte/svelte-introduccion.md
```

Con el frontmatter mínimo del [paso 2 de la sección A](#paso-2--frontmatter-mínimo).
Astro va a leer este archivo sin problema — pero **todavía no va a
aparecer en el menú**, porque el menú no descubre carpetas solo.

### Paso 2 · Registra la subcategoría en `src/config/categories.ts`

Buscá la entrada `frontend` y agregale una clave dentro de
`subcategories`:

```ts
frontend: {
  label: "Frontend",
  // ...el resto igual...
  subcategories: {
    "frontend-fundamentos": { label: "Fundamentos de frontend", description: "..." },
    astro: { label: "Astro", description: "..." },
    react: { label: "React", description: "..." },
    nextjs: { label: "Next.js", description: "..." },
    svelte: {                                          // ← nueva
      label: "Svelte",
      description: "Framework con compilador propio, sin virtual DOM."
    }
  }
}
```

**La clave (`svelte`) tiene que ser exactamente el nombre de la carpeta**
que creaste en el paso 1. `label` es lo que se ve en el chip de cada
entrada; `description` es opcional (no se pinta en ningún sitio hoy).

### Paso 3 · Registra la subcategoría en `src/config/sidebar.ts`

Buscá el bloque de la categoría `Frontend` y agregale un grupo más dentro
de sus `items`:

```ts
{
  label: "Frontend",
  collapsed: true,
  items: [
    { label: "Fundamentos de frontend", collapsed: true, items: [{ autogenerate: { directory: "frontend/frontend-fundamentos" } }] },
    { label: "Astro", collapsed: true, items: [{ autogenerate: { directory: "frontend/astro" } }] },
    { label: "React", collapsed: true, items: [{ autogenerate: { directory: "frontend/react" } }] },
    { label: "Next.js", collapsed: true, items: [{ autogenerate: { directory: "frontend/nextjs" } }] },
    {                                                   // ← nuevo
      label: "Svelte",
      collapsed: true,
      items: [{ autogenerate: { directory: "frontend/svelte" } }]
    }
  ]
}
```

El `directory` tiene que ser `<categoría>/<subcategoría>` exactamente como
está en el disco. A partir de acá, Starlight arma solo los links de todos
los `.md` que haya dentro de esa carpeta — no hace falta listarlos.

### Paso 4 · Comprueba

`pnpm dev` **no recarga solo** cuando cambiás `categories.ts` o
`sidebar.ts` (son archivos de configuración, no contenido) — reiniciá el
servidor. Después:

```bash
pnpm check
pnpm build
```

---

## C · Una categoría completamente nueva

Ejemplo: crear la categoría "Móvil" (apps nativas/híbridas), que hoy no
existe en absoluto.

### Paso 1 · Crea la carpeta y el primer artículo

Una categoría necesita al menos una subcategoría con al menos un artículo
adentro:

```text
src/content/docs/mobile/mobile-fundamentos/mobile-que-es.md
```

Con el frontmatter mínimo de siempre (`title`, `description`, `tags`).

### Paso 2 · Regístrala en `src/config/categories.ts`

Agregá una entrada nueva al objeto `CATEGORIES` (el orden dentro del
archivo no importa, pero mantenerlo alfabético ayuda a encontrar cosas):

```ts
export const CATEGORIES = {
  // ...categorías existentes...
  mobile: {
    label: "Móvil",
    icon: "smartphone", // un nombre válido de lucide.dev/icons
    description: "Apps nativas e híbridas: qué elegir y cómo empezar.",
    color: "--cat-mobile", // ver paso 3
    group: "construir", // construir | producto | flujo | calidad | referencia
    order: 8, // más alto que el order más grande que ya exista en ese group
    subcategories: {
      "mobile-fundamentos": {
        label: "Fundamentos de móvil",
        description: "Nativo vs. híbrido vs. multiplataforma."
      }
    }
  }
} as const
```

Cada campo:

| Campo           | Qué es                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`         | Nombre visible en los chips de cada entrada y en el índice de la portada                                                                                     |
| `icon`          | Nombre de un icono de [lucide.dev/icons](https://lucide.dev/icons/) — se guarda pero hoy nada lo muestra; podés ponerlo por si en el futuro se vuelve a usar |
| `description`   | Descripción interna; hoy no se pinta en ningún sitio                                                                                                         |
| `color`         | Variable CSS para el acento visual (paso 3)                                                                                                                  |
| `group`         | En qué bloque del menú aparece: `construir`, `producto`, `flujo`, `calidad` o `referencia`                                                                   |
| `order`         | Número; menor aparece antes dentro de su `group`                                                                                                             |
| `subcategories` | Al menos una, con la clave igual al nombre real de la carpeta                                                                                                |

### Paso 3 · Agrega el color en `src/styles/tokens.css`

Buscá el bloque de colores de categoría (comentario
`/* Color de categoría: cada una toma un rol de sintaxis… */`) y agregá
uno que apunte a un rol de sintaxis:

```css
--cat-mobile: var(--syn-cyan); /* violet, green, amber, coral, cyan o pink */
```

Apuntá siempre a un `--syn-*` y nunca a un hexadecimal: esos roles tienen
un valor para el tema oscuro y otro para el claro, así la categoría se lee
bien en los dos.

### Paso 4 · Regístrala en `src/config/sidebar.ts`

Agregala dentro del bloque de navegación (`group`) que le corresponda —
si en el paso 2 pusiste `group: "construir"`, va dentro del objeto
`{ label: "Construir", items: [...] }`:

```ts
{
  label: "Construir",
  items: [
    // ...categorías existentes de este bloque...
    {
      label: "Móvil",
      collapsed: true,
      items: [
        {
          label: "Fundamentos de móvil",
          collapsed: true,
          items: [{ autogenerate: { directory: "mobile/mobile-fundamentos" } }]
        }
      ]
    }
  ]
}
```

### Paso 5 · Comprueba

Reiniciá `pnpm dev` (tocaste archivos de configuración, no contenido) y
fijate que el sidebar muestre el bloque nuevo, y que una entrada de "Móvil"
pinte el chip de categoría con su color. Después:

```bash
pnpm check
pnpm build
```

Si te olvidaste el color en `tokens.css`, no rompe el build — el chip de
categoría simplemente no va a tener color (usa la variable como
`color-mix`, que cae en transparente si la variable no existe).

---

## Referencia: todos los campos del frontmatter

| Campo                      | Tipo                 | Para qué                                                                       |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `title`                    | string (obligatorio) | Título de la página, menú y buscador                                           |
| `description`              | string (obligatorio) | Frase para listados y SEO                                                      |
| `tags`                     | string[]             | Tags en minúsculas — no se muestran en la página, es metadata para el buscador |
| `sidebar.order`            | número               | Orden manual dentro de su subcategoría (nativo de Starlight)                   |
| `sidebar.label`            | string               | Etiqueta distinta a `title` solo para el menú                                  |
| `updatedAt`                | fecha (`2026-09-12`) | Se muestra en la cabecera de la entrada                                        |
| `draft`                    | booleano             | Oculta la entrada fuera de `pnpm dev`                                          |
| `private`                  | booleano             | Oculta de menús/listados/buscador; **la URL sigue pública**                    |
| `command`                  | string               | El comando, para entradas de tipo comando                                      |
| `url`, `website`, `github` | string (URL)         | Enlaces externos, se muestran como botones                                     |
| `resourceCategory`         | string               | Subcategoría de `resources/`, solo dentro de esa categoría                     |
| `technologies`             | string[] (ids)       | Cross-link a otras entradas por su id                                          |
| `problem`                  | string               | Ficha "Problema"                                                               |
| `whenToUse`                | string               | Ficha "Cuándo usarlo"                                                          |
| `tool`                     | string               | Ficha "Herramienta"                                                            |
| `language`                 | string               | Ficha "Lenguaje"                                                               |
| `framework`                | string               | Ficha "Framework"                                                              |
| `runtime`                  | string               | Ficha "Runtime"                                                                |
| `returns`                  | string               | Ficha "Devuelve"                                                               |
| `warnings`                 | string[]             | Lista de avisos destacados                                                     |
| `official`                 | booleano             | Marca si es la fuente oficial (recursos)                                       |

## Errores comunes

| Mensaje / síntoma                                      | Qué pasó                                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm build` falla señalando un archivo                | El frontmatter no cumple el esquema de `src/content.config.ts` — revisá el tipo del campo que indica el error                        |
| La entrada no aparece en el sidebar                    | La subcategoría no está en `src/config/sidebar.ts`, o el `directory` del `autogenerate` no coincide con el nombre real de la carpeta |
| El chip de categoría no aparece en la entrada          | No está en `src/config/categories.ts`, o la carpeta no coincide con la clave                                                         |
| El chip de categoría sale sin color                    | Falta la variable en `src/styles/tokens.css`, o el nombre no coincide con `color` en `categories.ts`                                 |
| Cambié `sidebar.ts`/`categories.ts` y no veo el cambio | Son archivos de configuración: hace falta reiniciar `pnpm dev`, no alcanza con guardar                                               |
| Un enlace interno no lleva a ninguna parte             | No hay comprobación automática — revisalo a mano; asegurate de usar la ruta completa (`/categoria/subcategoria/archivo`)             |

`private: true` es una clasificación editorial, **no un control de
acceso**: la entrada conserva su ruta pública.
