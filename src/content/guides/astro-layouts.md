---
title: Layouts (.astro) y &lt;slot /&gt;
description: Componentes que envuelven el contenido de una página con <slot />, layouts anidados y el layout de frontmatter en Markdown.
category: frontend
stack: astro
order: 2
tags: [astro, layouts, templating]
scope: astro (componentes de layout)
updatedAt: 2026-08-16
---

Un layout en Astro no es un archivo especial con nombre reservado (como `layout.tsx` en Next) — es un componente `.astro` normal, convencionalmente en `src/layouts/`, que usa `<slot />` para marcar dónde va el contenido de quien lo use. Este mismo sitio tiene dos, anidados: `BaseLayout.astro` (el `<html>`, fuentes, command palette) envuelve a `DocsLayout.astro` (header, sidebar, footer).

## Lo básico — `<slot />`

`<slot />` es el placeholder: lo que el que consume el layout ponga entre las etiquetas del componente, aparece ahí.

```astro title="layouts/BaseLayout.astro"
---
interface Props {
  title: string;
}
const { title } = Astro.props;
---
<html lang="es">
  <head>
    <title>{title}</title>
  </head>
  <body>
    <slot />
  </body>
</html>
```

```astro title="pages/index.astro"
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Inicio">
  <h1>Contenido de la página</h1>
</BaseLayout>
```

## Slots con nombre

Un layout puede tener varios huecos, no solo el contenido principal — un slot con `name` recibe únicamente lo que se le pasa con `slot="ese-nombre"`.

```astro title="layouts/DocsLayout.astro"
<div class="flex">
  <main><slot /></main>
  <slot name="aside" />
</div>
```

```astro
<DocsLayout>
  <Toc slot="aside" headings={headings} />
  <article>Contenido normal, va al slot por defecto</article>
</DocsLayout>
```

Este sitio usa exactamente este patrón: `[...slug].astro` le pasa un `<Toc slot="aside" />` a `DocsLayout`, además del contenido normal.

## Layouts anidados

Un layout puede envolver a otro, igual que en Next — pasa su propio `<slot />` hacia arriba.

```astro title="layouts/DocsLayout.astro"
---
import BaseLayout from './BaseLayout.astro';
---
<BaseLayout title="...">
  <Header />
  <main><slot /></main>
  <Footer />
</BaseLayout>
```

## Layout desde el frontmatter de Markdown

Un archivo Markdown puede declarar su layout directo en el frontmatter, sin envolverlo a mano — recibe todo el frontmatter como prop `frontmatter`.

```md title="src/pages/post.md"
---
layout: ../layouts/PostLayout.astro
title: Mi post
---

Contenido en Markdown.
```

```astro title="layouts/PostLayout.astro"
---
const { frontmatter } = Astro.props;
---
<h1>{frontmatter.title}</h1>
<slot />
```

## Resumen

| Concepto | Qué es |
| --- | --- |
| `<slot />` | Dónde se inyecta el contenido del que usa el layout |
| `<slot name="x" />` + `slot="x"` | Slots con nombre, para más de un hueco (sidebar, footer custom, etc.) |
| Layouts anidados | Un layout importa y envuelve a otro, pasando su propio `<slot />` hacia arriba |
| `layout:` en frontmatter Markdown | Layout automático para un `.md`, recibe `frontmatter` como prop |

## Consideraciones

- A diferencia de Next, un layout de Astro **sí se re-ejecuta** en cada navegación completa (no hay concepto de "layout persistente" salvo que uses `transition:persist` con View Transitions activas) — es un componente más, no un límite especial del router.
- El patrón de este sitio (`BaseLayout` con el `<html>` + `DocsLayout` con el chrome de la UI) separa "documento HTML" de "estructura visual" — vale la pena copiarlo cuando un proyecto tiene páginas que necesitan el `<html>` pero no el header/sidebar (una landing, por ejemplo).
- Un slot sin contenido pasado no rompe nada — simplemente no renderiza nada ahí, a menos que le des contenido de respaldo entre las etiquetas `<slot>...</slot>`.
