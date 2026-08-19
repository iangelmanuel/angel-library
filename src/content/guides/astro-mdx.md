---
title: MDX en Astro
description: Cuándo combinar Markdown con componentes, configurar la integración y mantener contenido portable sin abusar de JSX.
category: frontend
stack: astro
order: 22
tags: [astro, mdx, markdown, content]
scope: "@astrojs/mdx"
related:
  - guides/astro-content-collections
  - guides/astro-components-props-slots
  - guides/astro-integrations
updatedAt: 2026-08-18
---

MDX permite importar y usar componentes dentro de Markdown. Conviene cuando una entrada necesita demos, tabs o visualizaciones que no se expresan bien con Markdown normal.

## Instalar

```bash
npx astro add mdx
```

```mdx title="src/content/blog/demo.mdx"
---
title: Demo interactiva
---

import Callout from '../../components/Callout.astro';

# Ejemplo

<Callout type="warning">Este bloque es un componente real.</Callout>
```

## Markdown o MDX

- `.md`: contenido portable, simple, fácil de buscar y transformar.
- `.mdx`: contenido acoplado a componentes y al runtime de compilación del proyecto.

No conviertas toda la biblioteca a MDX “por si acaso”. Si una entrada solo necesita texto, tablas y bloques de código, Markdown conserva una superficie más pequeña y menos posibilidades de romper el build.

## Componentes globales

Puedes pasar un mapa de componentes al renderizar o configurar componentes reutilizables para reemplazar etiquetas como `h2` y `a`. Evita cambiar la semántica HTML: un componente visual debe seguir produciendo encabezados, enlaces y controles accesibles.

## Seguridad

MDX ejecuta importaciones y expresiones durante el build o renderizado. Trata los archivos MDX como código confiable; no compiles contenido arbitrario enviado por usuarios.

Referencia oficial: [MDX integration](https://docs.astro.build/en/guides/integrations-guide/mdx/).
