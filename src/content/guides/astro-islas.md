---
title: Islas de UI (client:*)
description: Cuándo y cómo hidratar un componente de React/Vue/Svelte dentro de Astro — load, idle, visible, media y only.
category: frontend
stack: astro
order: 1
tags: [astro, islands, performance]
scope: astro (directivas client:)
updatedAt: 2026-08-16
---

Esta es la idea central de Astro, la que explica todo lo demás: por defecto, un componente de framework (`.tsx`, `.vue`, `.svelte`) dentro de un `.astro` se renderiza a HTML estático en build — cero JS enviado al navegador, aunque el componente esté escrito en React. Una directiva `client:*` es la única forma de decir "esto sí necesita JavaScript en el cliente", y además decide *cuándo* se hidrata, no solo *si*. Sin ninguna directiva, el componente es puro HTML; con una, se convierte en una "isla": un fragmento interactivo que hidrata de forma aislada, sin arrastrar al resto de la página.

## `client:load` — Inmediato

Hidrata apenas carga la página. Para lo que el usuario necesita interactivo desde el primer segundo.

```astro
<BuyButton client:load />
```

## `client:idle` — Cuando el navegador esté libre

Usa `requestIdleCallback`: hidrata cuando el hilo principal ya terminó lo urgente. Para interactividad que no es crítica al instante.

```astro
<ShowHideButton client:idle />
<ShowHideButton client:idle={{ timeout: 500 }} />
```

## `client:visible` — Al entrar en pantalla

Usa `IntersectionObserver`: hidrata recién cuando el componente entra en el viewport. Ideal para algo pesado más abajo en la página (un carrusel, un mapa).

```astro
<HeavyImageCarousel client:visible />
<HeavyImageCarousel client:visible={{ rootMargin: '200px' }} />
```

## `client:media` — Según un media query

Hidrata solo si la media query coincide — útil para un componente que solo existe en mobile (un menú hamburguesa) y no tiene sentido cargar en desktop.

```astro
<SidebarToggle client:media="(max-width: 50em)" />
```

## `client:only` — Sin renderizar en servidor

Salta el renderizado server-side por completo; el componente solo existe en el cliente. Necesario cuando el componente usa APIs de browser en su primer render (`window`, `localStorage`) que romperían el SSR. Requiere indicar el framework.

```astro
<SomeReactComponent client:only="react" />
```

Este mismo sitio usa `client:only="react"` para el `CommandPalette`, justamente porque depende de eventos globales del navegador desde el arranque.

## Resumen

| Directiva | Cuándo hidrata |
| --- | --- |
| `client:load` | Inmediatamente al cargar la página |
| `client:idle` | Cuando el navegador está libre (`requestIdleCallback`) |
| `client:visible` | Al entrar en el viewport (`IntersectionObserver`) |
| `client:media="query"` | Cuando la media query coincide |
| `client:only="framework"` | Nunca en servidor, solo en cliente |
| (sin directiva) | Nunca — HTML estático, cero JS |

## Consideraciones

- Sin directiva, el componente renderiza su HTML pero **cero** JS viaja al cliente — ideal para el 90% de un sitio de contenido.
- `client:only` necesita el nombre exacto del framework (`"react"`, `"vue"`, `"svelte"`, `"preact"`, `"solid-js"`) tal como está configurado en `astro.config.mjs`.
- Cada isla hidrata de forma completamente aislada: dos islas de React en la misma página **no** comparten estado entre sí a menos que lo saques del componente (ver [Nanostores](/libraries/nanostores)).
