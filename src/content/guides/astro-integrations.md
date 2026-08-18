---
title: Integrations — astro add
description: Cómo se agrega una librería/framework al proyecto — el CLI astro add y la config manual en astro.config.mjs.
category: frontend
stack: astro
order: 18
tags: [astro, config]
scope: astro (astro add / astro.config.mjs)
updatedAt: 2026-08-16
---

Todo lo que extiende Astro más allá de lo nativo (React, Tailwind, sitemap, un CMS) es una integration — se declaran en un solo lugar, `astro.config.mjs`.

## `astro add` — Instalar y configurar en un paso

Instala el paquete, lo agrega al array `integrations` de `astro.config.mjs`, y hace cualquier ajuste extra que la integration necesite (por ejemplo, Tailwind también toca el `vite.plugins`) — todo con un solo comando.

```bash
npx astro add react
npx astro add react tailwind sitemap
```

## Cómo queda en `astro.config.mjs`

```ts title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
});
```

Este mismo sitio tiene una sola: `react()`, para las islas de `CommandPalette`/`MobileNav`/`SearchResults` — Tailwind aquí va aparte, como plugin de Vite (`@tailwindcss/vite`), no como integration.

## Instalación manual

Cuando `astro add` no cubre el caso (una integration local, algo sin paquete de Astro oficial), se agrega a mano.

```ts title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import miIntegracionLocal from './integrations/mi-integracion.js';

export default defineConfig({
  integrations: [miIntegracionLocal()],
});
```

## Resumen

| Comando / config | Uso |
| --- | --- |
| `npx astro add <nombre>` | Instala y configura en un paso |
| `npx astro add <a> <b> <c>` | Varias integrations directamente |
| `integrations: [...]` en `astro.config.mjs` | Dónde quedan declaradas, siempre |
| Instalación manual | Para integrations locales o sin soporte de `astro add` |

## Consideraciones

- `astro add` modifica `astro.config.mjs` automáticamente — si el archivo tiene una estructura muy custom, vale la pena revisar el diff que deja antes de commitear, no asumir que quedó perfecto.
- No todo lo que se instala es una integration: un plugin de Vite (como el propio `@tailwindcss/vite` de este proyecto) va en `vite.plugins`, no en `integrations` — son dos sistemas de extensión distintos que conviven en el mismo archivo de config.
- Las integrations oficiales (`@astrojs/react`, `@astrojs/mdx`, etc.) son las mantenidas por el equipo de Astro — hay muchas de la comunidad también, mismo mecanismo, mismo array.
