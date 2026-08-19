---
title: Prefetch de enlaces
description: Precargar páginas con data-astro-prefetch, elegir estrategia y evitar descargas innecesarias en conexiones limitadas.
category: frontend
stack: astro
order: 20
tags: [astro, navigation, performance, prefetch]
scope: astro prefetch
related:
  - guides/astro-view-transitions
  - guides/astro-routing
updatedAt: 2026-08-18
---

El prefetch descarga por anticipado el destino probable de un enlace para que la navegación posterior sea más rápida.

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';

export default defineConfig({
  prefetch: { defaultStrategy: 'hover', prefetchAll: false },
});
```

```astro
<a href="/docs" data-astro-prefetch>Documentación</a>
<a href="/siguiente" data-astro-prefetch="viewport">Siguiente</a>
<a href="/pesada" data-astro-prefetch="false">Sin prefetch</a>
```

## Estrategias

| Estrategia | Momento | Uso típico |
| --- | --- | --- |
| `tap` | al tocar/presionar | mínimo consumo de datos |
| `hover` | hover o focus | buen default de escritorio |
| `viewport` | entra en pantalla | siguiente artículo o paginación |
| `load` | después de cargar | pocas rutas críticas y pequeñas |

Con `<ClientRouter />`, el prefetch de enlaces queda habilitado de forma amplia por defecto. Revisa páginas grandes, endpoints con efectos laterales y navegación que casi nadie usa; descargar todo por adelantado puede empeorar el rendimiento total.

El prefetch debe ser seguro e idempotente: una petición GET nunca debería mutar datos. Respeta señales de ahorro de datos y mide antes de usar `prefetchAll` en una biblioteca con cientos de enlaces.

Referencia oficial: [Prefetch](https://docs.astro.build/en/guides/prefetch/).
