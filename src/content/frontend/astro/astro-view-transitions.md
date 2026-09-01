---
title: View Transitions
description: Transiciones animadas entre páginas con el ClientRouter — transition:name, eventos de navegación, animaciones custom y redirección.
type: guides
order: 24
tags: [astro, animation, routing]
scope: astro:transitions
related:
  - languages/css/css-animations
updatedAt: 2026-08-25
---

Sin esto, cada click en un link hace que el navegador descarte la página entera y cargue la siguiente desde cero — parpadeo blanco incluido. El `<ClientRouter />` intercepta esa navegación: pide la página nueva por `fetch`, la compara con la actual usando la View Transitions API nativa del navegador, y anima el cambio entre ambas. El sitio sigue siendo estático (cada URL es HTML real, funciona sin JS), pero se *siente* como una SPA — sin escribir un router a mano. Este mismo sitio lo usa; por eso navegar entre entradas no recarga toda la página.

## Activarlo

Un solo import en el `<head>`, normalmente en el layout base.

```astro title="layouts/BaseLayout.astro"
---
import { ClientRouter } from 'astro:transitions';
---
<head>
  <ClientRouter />
</head>
```

## `transition:name` — Animar un elemento específico

Cuando el mismo elemento visual existe en la página de origen y en la de destino (una imagen de portada, un título), `transition:name` le dice al navegador que anime la transformación entre ambos en vez de un fade genérico. El nombre tiene que coincidir en las dos páginas.

```astro title="pages/blog/[slug].astro"
<img src={post.cover} transition:name={`cover-${post.slug}`} />
```

## `transition:persist` — Mantener el estado de un componente

Un componente con `transition:persist` no se remonta al navegar: conserva su estado interno (útil para un video que sigue sonando, o un contador de React que no debería resetear).

```astro
<Counter client:load transition:persist initialCount={5} />
```

## `transition:animate` — Cambiar la animación

Por defecto Astro usa un fade cruzado (`morph`). Se puede pedir una de las animaciones incluidas (`fade`, `slide`, `initial`, `none`) o una custom.

```astro
<header transition:animate="slide">
```

Las animaciones incluidas aceptan opciones si las importas:

```astro
---
import { fade } from 'astro:transitions';
---
<header transition:animate={fade({ duration: '0.4s' })}>
```

## Eventos de navegación (client script)

`<ClientRouter />` dispara eventos en `document` durante cada navegación, en este orden. Sirven para re-inicializar scripts que dependen del DOM de la página nueva (ver también cómo lo resuelve `astro:after-swap` en `BaseLayout.astro` de este sitio, para la sidebar).

```ts
document.addEventListener('astro:before-preparation', () => {
  // antes de cargar la página nueva
});

document.addEventListener('astro:after-swap', () => {
  // el DOM ya cambió, los scripts todavía no corrieron de nuevo
  // aquí se resincroniza estado que depende del nuevo DOM
});

document.addEventListener('astro:page-load', () => {
  // la navegación terminó, la página es interactiva
  iniciarLoQueSeaNecesario();
});
```

## Navegación programática — `navigate()`

Redirige por código (después de un submit, un timeout, etc.) sin perder la animación de transición.

```ts
import { navigate } from 'astro:transitions/client';

navigate('/gracias', { history: 'push' }); // o "replace" / "auto"
```

## Excluir un link de las transiciones

`data-astro-reload` fuerza una recarga completa (sin animación, sin persistir estado) — útil para links que salen del sitio o rompen algo si se interceptan.

```html
<a href="/logout" data-astro-reload>Cerrar sesión</a>
```

## Directivas y eventos en una mirada

| Directiva / API | Qué hace |
| --- | --- |
| `<ClientRouter />` | Activa las view transitions en todo el sitio |
| `transition:name` | Anima un elemento entre su versión en la página vieja y la nueva |
| `transition:persist` | El componente no se remonta al navegar |
| `transition:animate` | Cambia la animación (`fade`, `slide`, `initial`, `none`, custom) |
| `astro:page-load` | Evento: la navegación terminó, página interactiva |
| `astro:after-swap` | Evento: el DOM cambió, para resincronizar estado |
| `navigate()` | Navegar por código sin perder la transición |
| `data-astro-reload` | Excluir un link de las transiciones (recarga completa) |

## Navegación, estado y accesibilidad

- Un script `<script>` normal (no `type="module"` con listener global) se re-ejecuta en cada navegación por defecto — si necesitas que corra una sola vez por sesión, hay que engancharlo a `document` fuera del ciclo de swap, como hace este sitio en `BaseLayout.astro`.
- `transition:name` con el mismo valor en dos elementos de la misma página rompe la animación — tiene que ser único por página.
- `navigate()` respeta las view transitions; cambiar `window.location.href` a mano no.
