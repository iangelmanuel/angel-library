---
title: "Estilos con &lt;style&gt; — scoped por defecto"
description: Cómo Astro aísla el CSS de cada componente automáticamente, is:global para salirse del scope, y define:vars para pasar valores del frontmatter.
category: frontend
stack: astro
order: 6
tags: [astro, css, styling]
scope: astro (&lt;style&gt;)
related:
  - snippets/css-variables
updatedAt: 2026-08-16
---

Un `<style>` dentro de un `.astro` está **scoped al componente por defecto** — Astro le agrega un atributo de datos único a cada selector en build, así que un `h1 { color: red }` en un componente no se filtra a los `h1` de otros. Nada de nombrar clases con cuidado para evitar choques, como sí hace falta con un CSS global.

## Lo básico

```astro
<h1>Título</h1>

<style>
  h1 {
    color: var(--accent-blue);
  }
</style>
```

Ese `h1 { }` solo afecta al `<h1>` de este archivo, aunque haya otros `h1` sin esa regla en el resto del sitio.

## `is:global` — Salir del scope

Cuando el estilo tiene que aplicar más allá de este componente (estilos base, algo que afecta HTML generado por markdown que no es "tuyo").

```astro
<style is:global>
  h1 { color: red; }
</style>
```

## `:global()` — Mezclar scoped y global en el mismo bloque

Para estilar contenido de un hijo (un componente de terceros, HTML inyectado con `set:html`) sin volver global todo el `<style>`.

```astro
<style>
  h1 { color: red; }              /* scoped: solo el h1 de este archivo */
  article :global(h1) { color: blue; } /* afecta cualquier h1 dentro de .article, incluido contenido de hijos */
</style>
```

## `define:vars` — Variables del frontmatter en CSS

Pasa valores calculados en el frontmatter directo al `<style>`, como custom properties.

```astro
---
const colorAcento = destacado ? '#f59e0b' : '#60a5fa';
---
<div class="card">...</div>

<style define:vars={{ colorAcento }}>
  .card {
    border-color: var(--colorAcento);
  }
</style>
```

## Importar un archivo CSS

Un `import './estilos.css'` en el frontmatter **no** se scopea — se comporta como un `<link>` normal, aplica globalmente donde sea que ese componente se use.

```astro
---
import '../styles/utilidades.css';
---
```

## Resumen

| Técnica | Alcance |
| --- | --- |
| `<style>` (sin nada más) | Scoped a este componente, por defecto |
| `<style is:global>` | Sin scope, aplica en todo el sitio |
| `:global(selector)` dentro de un `<style>` scoped | Ese selector puntual sale del scope, el resto sigue aislado |
| `define:vars={{...}}` | Custom properties CSS calculadas en el frontmatter |
| `import '...css'` | Global, como un `<link>` — nunca se scopea |

## Consideraciones

- El scoping es a nivel de build (atributos de datos en cada selector), no runtime — no hay costo de JS por esto, es CSS plano con selectores más específicos.
- Orden de prioridad si hay conflicto: `<link>` en el head < CSS importado < `<style>` scoped del propio componente gana, a igual especificidad.
- `define:vars` sirve el mismo propósito que `--variable` manual en `class:list` o inline `style` — preferilo cuando el valor viene calculado en el frontmatter y se usa en varias reglas del bloque, en vez de repetirlo en cada `style="--x: ..."`.
