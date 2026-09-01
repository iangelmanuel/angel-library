---
title: GSAP
description: Animaciones con timelines y scroll con GSAP + ScrollTrigger, y cómo limpiarlas correctamente al navegar con View Transitions.
type: libraries
order: 2
tags: [astro, animation, scroll]
website: https://gsap.com
install: npm install gsap
related:
  - frontend/astro/astro-view-transitions
  - languages/css/css-animations
updatedAt: 2026-08-25
---

Animaciones imperativas con control fino (timelines, secuencias, scroll) que CSS puro no cubre bien. En un proyecto Astro corre normalmente en un `<script>` de cliente o dentro directamente isla.

## Lo básico: `to`, `from`, `fromTo`

```ts
import gsap from "gsap"

gsap.to(".card", { opacity: 1, y: 0, duration: 0.5 })
gsap.from(".card", { opacity: 0, y: 20 }) // anima DESDE ese estado hasta el actual
gsap.fromTo(".card", { opacity: 0 }, { opacity: 1, duration: 0.5 })
```

## Timelines — Secuencias

Una timeline encadena tweens en orden, sin manejar `delay` a mano para cada uno.

```ts
const tl = gsap.timeline()

tl.from(".titulo", { opacity: 0, y: 20 })
  .from(".subtitulo", { opacity: 0, y: 20 }, "-=0.3") // arranca 0.3s antes de que termine el anterior
  .from(".cta", { opacity: 0, scale: 0.9 })
```

## ScrollTrigger — Animar según el scroll

Plugin oficial, hay que registrarlo antes de usarlo. Liga el progreso (o el disparo) directamente animación a la posición de scroll de un elemento.

```ts
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

gsap.from(".seccion", {
  opacity: 0,
  y: 40,
  scrollTrigger: {
    trigger: ".seccion",
    start: "top 80%" // cuando el top de .seccion llega al 80% del viewport
  }
})
```

Scrub (la animación sigue el scroll en vez de dispararse una vez):

```ts
gsap.to(".imagen", {
  scale: 1.3,
  scrollTrigger: {
    trigger: ".imagen",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
})
```

## Uso en un `<script>` de Astro

```astro
<div class="card">...</div>

<script>
  import gsap from "gsap"

  gsap.from(".card", { opacity: 0, y: 20, duration: 0.5 })
</script>
```

## Limpiar animaciones al navegar (View Transitions)

Con `<ClientRouter />` activo, el DOM se reemplaza pero los `ScrollTrigger` viejos no se destruyen solos — quedan escuchando un elemento que ya no existe. Hay que matarlos en `astro:before-swap`.

```astro
<script>
  import gsap from "gsap"
  import { ScrollTrigger } from "gsap/ScrollTrigger"

  gsap.registerPlugin(ScrollTrigger)

  function animar() {
    gsap.from(".seccion", {
      opacity: 0,
      scrollTrigger: { trigger: ".seccion", start: "top 80%" }
    })
  }

  animar()
  document.addEventListener("astro:after-swap", animar)
  document.addEventListener("astro:before-swap", () => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
  })
</script>
```

## API de animación en una mirada

| API                                             | Uso                                                |
| ----------------------------------------------- | -------------------------------------------------- |
| `gsap.to(target, vars)`                         | Animar hacia un estado                             |
| `gsap.from(target, vars)`                       | Animar desde un estado hasta el actual             |
| `gsap.timeline()`                               | Encadenar varios tweens en secuencia               |
| `gsap.registerPlugin(ScrollTrigger)`            | Habilitar animaciones ligadas al scroll            |
| `scrollTrigger: { trigger, start, scrub }`      | Configurar cuándo/cómo dispara según scroll        |
| `ScrollTrigger.getAll().forEach(t => t.kill())` | Limpiar triggers viejos antes de un swap de página |

## Ciclo de vida, rendimiento y movimiento reducido

- Sin matar los `ScrollTrigger` en `astro:before-swap`, cada navegación con View Transitions activas acumula listeners fantasma sobre elementos que ya no están en el DOM — fugas de memoria progresivas en una SPA-like de varias páginas.
- El posicionamiento `start`/`end` de ScrollTrigger usa "posición del trigger" + "posición del viewport" (`"top 80%"` = cuando el top del elemento llega al 80% de la altura del viewport) — no son porcentajes de scroll de la página.
- Para animaciones simples de entrada (fade, slide) sin scroll, la alternativa nativa sin dependencia es `animation-timeline: view()` en CSS — ver [Animaciones CSS](/languages/css/css-animations). GSAP vale la pena cuando necesitas timelines complejas o control que CSS no da.
