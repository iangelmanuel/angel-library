---
title: Prefetch de enlaces
description: Precargar páginas con data-astro-prefetch, elegir estrategia y evitar descargas innecesarias en conexiones limitadas.
category: frontend
stack: astro
order: 23
tags: [astro, navigation, performance, prefetch]
scope: astro prefetch
related:
  - guides/astro-view-transitions
  - guides/astro-routing
updatedAt: 2026-08-25
---

El prefetch descarga por anticipado el destino probable de un enlace para que la navegación posterior sea más rápida.

No acelera el servidor ni reduce el tamaño de una página: adelanta parte del trabajo usando red y caché del navegador. Por eso es una decisión de presupuesto. Si se predice bien, la navegación parece instantánea; si se predice mal, se descargan rutas que nadie visita.

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

`hover` también contempla el foco del teclado, por lo que no depende únicamente de un puntero. `viewport` funciona bien para el siguiente artículo visible, pero puede descargar muchos destinos en una lista larga. `load` es la estrategia más agresiva y debe reservarse para pocos enlaces con alta probabilidad de uso.

Con `<ClientRouter />`, el prefetch de enlaces queda habilitado de forma amplia por defecto. Revisa páginas grandes, endpoints con efectos laterales y navegación que casi nadie usa; descargar todo por adelantado puede empeorar el rendimiento total.

El prefetch debe ser seguro e idempotente: una petición GET nunca debería mutar datos. Respeta señales de ahorro de datos y mide antes de usar `prefetchAll` en una biblioteca con cientos de enlaces.

## Cómo medirlo

1. Abre DevTools y limpia la caché de red.
2. Observa qué solicitud aparece al enfocar, señalar o mostrar el enlace.
3. Compara bytes transferidos y tiempo de navegación.
4. Simula una conexión lenta y ahorro de datos.
5. Revisa que el destino no ejecute efectos laterales mediante GET.

La métrica útil no es solo que una navegación concreta baje unos milisegundos. También importa cuántos bytes se descargaron sin utilizar y si compitieron con la imagen, fuente o script principal.

## Cuándo desactivarlo

- rutas administrativas o poco visitadas;
- páginas pesadas detrás de una decisión explícita;
- listas con cientos de destinos visibles;
- enlaces cuyo recurso cambia con mucha frecuencia y no debe adelantarse;
- conexiones limitadas donde el ahorro de datos importa más que la anticipación.

Referencia oficial: [Prefetch](https://docs.astro.build/en/guides/prefetch/).
