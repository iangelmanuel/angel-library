---
title: Animaciones CSS — Referencia rápida
description: Keyframes reutilizables, animaciones ligadas al scroll con animation-timeline y respeto a prefers-reduced-motion.
category: general
stack: css
language: css
tags: [css, animation, scroll]
related:
  - utilities/dom
  - snippets/css-variables
updatedAt: 2026-08-16
---

Keyframes que se repiten en casi todo proyecto, y cómo animar en base al scroll sin JavaScript.

## Keyframes básicos

Un fade-in con un pequeño desplazamiento es la animación de entrada más común. `both` en `animation` aplica el estado inicial (`from`) antes de que arranque y mantiene el final (`to`) después.

```css title="styles/animations.css"
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fade-in 300ms ease-out both;
}
```

```css
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 800ms linear infinite;
}
```

Slide-in para elementos que entran desde un costado (menús, tarjetas en cascada). Cambiá el signo de `translateX` para entrar desde la derecha.

```css
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in-left {
  animation: slide-in-left 350ms ease-out both;
}
```

Pulse, para llamar la atención sobre algo sin ser tan agresivo como un `spin` (un punto de "en vivo", un badge de notificación).

```css
@keyframes pulse {
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
```

Shimmer, para skeletons de carga: un degradado que se desliza sobre el bloque mientras el contenido real todavía no llegó.

```css
@keyframes shimmer {
  from {
    background-position: -200% 0;
  }
  to {
    background-position: 200% 0;
  }
}

.skeleton {
  background: linear-gradient(90deg, var(--muted) 25%, var(--accent) 50%, var(--muted) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

Marquee, para un ticker de texto o logos que se desplaza sin fin. El track duplica el contenido una vez para que el `translateX(-50%)` cierre el loop sin salto visible.

```css
@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.marquee {
  overflow: hidden;
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 2rem;
  animation: marquee 20s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}
```

```html
<div class="marquee">
  <div class="marquee-track">
    <span>Astro</span>
    <span>React</span>
    <span>TypeScript</span>
    <span>Astro</span>
    <span>React</span>
    <span>TypeScript</span>
  </div>
</div>
```

## Animar según el scroll (sin JS)

`animation-timeline: scroll()` liga el progreso de una animación al scroll de la página en vez del tiempo — la animación "avanza" cuando el usuario scrollea, no sola. Es la forma nativa de hacer una barra de progreso de lectura sin un listener de `scroll`.

```css title="styles/animations.css"
@keyframes grow-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  transform-origin: left;
  background: var(--accent-blue);
  animation: grow-progress linear;
  animation-timeline: scroll();
}
```

```html
<div class="scroll-progress"></div>
```

## Crecer o revelar al entrar en pantalla

`animation-timeline: scroll()` liga la animación al scroll de toda la página. `animation-timeline: view()` es distinto: liga la animación a la posición del elemento *dentro del viewport* — así se anima cada vez que ese elemento entra en pantalla, sin importar en qué parte del scroll total esté. Es la técnica para que una imagen "crezca" o una sección aparezca a medida que el usuario llega a ella.

`animation-range` controla en qué tramo de esa entrada ocurre la animación. `entry 0% cover 40%` significa: arranca apenas el elemento empieza a entrar, y termina cuando ya cubrió el 40% del viewport — así el efecto se siente rápido y responsivo, no estirado durante todo el scroll.

```css title="styles/animations.css"
@keyframes reveal-grow {
  from {
    opacity: 0;
    scale: 0.85;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}

.scroll-reveal-image {
  animation: reveal-grow linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

```html
<img src="/foto.jpg" alt="…" class="scroll-reveal-image" />
```

El mismo mecanismo sirve para texto y secciones enteras — solo cambia el keyframe. Reutilizando el `fade-in` de arriba:

```css
.scroll-reveal-text {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 50%;
}
```

```html
<section class="scroll-reveal-text">
  <h2>Un título que aparece al llegar</h2>
  <p>Y el párrafo que lo acompaña.</p>
</section>
```

## Respetar `prefers-reduced-motion`

Igual que en el reset: cualquier animación decorativa (no funcional) debería casi desaparecer si el usuario pidió menos movimiento a nivel sistema operativo.

```css
@media (prefers-reduced-motion: reduce) {
  .fade-in,
  .spinner,
  .slide-in-left,
  .pulse,
  .skeleton,
  .marquee-track,
  .scroll-progress,
  .scroll-reveal-image,
  .scroll-reveal-text {
    animation-duration: 0.01ms !important;
  }
}
```

## Resumen

| Técnica | Cuándo usarla |
| --- | --- |
| `fade-in` | Entrada estándar de cualquier elemento |
| `spin` | Loaders, spinners |
| `slide-in-left` | Elementos que entran desde un costado (menús, cascada de tarjetas) |
| `pulse` | Llamar la atención sin ser agresivo (badge, indicador "en vivo") |
| `shimmer` / `.skeleton` | Loading state mientras el contenido real carga |
| `marquee` | Ticker de texto o logos en loop, con pausa al hover |
| `animation-timeline: scroll()` | Barra de progreso, parallax, efectos ligados al scroll total de la página |
| `animation-timeline: view()` | Crecer/revelar un elemento cuando entra en pantalla (imágenes, texto, secciones) |
| `@media (prefers-reduced-motion: reduce)` | Cualquier animación decorativa, siempre |

## Consideraciones

- `animation-timeline: scroll()` y `animation-timeline: view()` todavía no tienen soporte en todos los navegadores (falta en Safari y Firefox al momento de escribir esto) — para algo crítico, necesitás un fallback con `IntersectionObserver`. Este sitio ya tiene [`onVisible()`](/utilities/dom) para eso.
- CSS no tiene forma de detectar "el usuario está scrolleando ahora mismo" (como un evento `scroll` en JS) — `animation-timeline` liga la animación a una posición (de la página o del elemento), no a la velocidad del scroll ni a si está activo.
- Para saber si un elemento con `position: sticky` está "pegado" (stuck), tampoco hay una pseudo-clase CSS todavía — se resuelve con `IntersectionObserver` observando un elemento centinela justo antes del sticky.
- El `marquee` necesita que el contenido duplicado dentro de `.marquee-track` mida lo mismo en ambas copias — si el contenido es dinámico y puede cambiar de ancho, generá las copias por JS en vez de a mano en el HTML.
- `shimmer` usa `var(--muted)` y `var(--accent)` — ajustá esos tokens a los tuyos si no usás las variables de este sitio (ver [CSS Variables](/snippets/css-variables)).
