---
title: Fuentes en CSS — Referencia rápida
description: Cómo cargar fuentes propias con @font-face, font-display y fuentes variables sin depender de Google Fonts.
category: general
stack: css
language: css
tags: [css, fonts, performance]
updatedAt: 2026-08-16
---

Cargar fuentes propias (self-hosted) en vez de tirar de Google Fonts: más rápido (sin conexión externa extra), y no dependés de que un servicio de terceros esté arriba.

## `@font-face` básico

Declará la fuente con `@font-face` antes de usarla en `font-family`. `font-display: swap` evita texto invisible mientras carga (FOIT): muestra la fuente del sistema primero y cambia cuando la tuya esté lista.

```css title="styles/fonts.css"
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

## Fuente variable (un solo archivo, todos los pesos)

Una fuente variable (`.woff2` con `-variations`) reemplaza varios archivos (400, 500, 600, 700) por uno solo, declarando el rango de pesos que soporta con `font-weight: min max`.

```css title="styles/fonts.css"
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

```css
.heading {
  font-family: 'Inter', system-ui, sans-serif;
  font-weight: 650; /* cualquier valor dentro del rango, no solo 100/400/700 */
}
```

## Precargar la fuente crítica

Para la fuente del texto principal (la que se ve antes de cualquier scroll), precargarla evita el salto de layout cuando termina de cargar. Solo haz esto con 1-2 fuentes críticas — precargar de más compite por ancho de banda con lo que sí importa.

```html
<link
  rel="preload"
  href="/fonts/inter-variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

## Resumen

| Técnica | Cuándo usarla |
| --- | --- |
| `@font-face` + `font-display: swap` | Base para cualquier fuente self-hosted |
| Fuente variable | Varios pesos directamente misma familia, un solo archivo |
| `<link rel="preload">` | La fuente del texto principal, para evitar layout shift |

## Consideraciones

- `woff2` es el único formato que hace falta hoy: todos los navegadores con soporte relevante lo soportan, no hace falta declarar `woff`/`ttf` de respaldo.
- Este mismo proyecto usa [Fontsource](https://fontsource.org) (`@fontsource/geist-sans`, `@fontsource/geist-mono`) en vez de `@font-face` manual — es la alternativa cuando la fuente es de código abierto: mismo resultado, sin escribir las reglas a mano. Ver `astro.config.mjs` y `global.css`.
- `crossorigin` en el `<link rel="preload">` es obligatorio aunque la fuente sea del mismo dominio — sin eso el navegador la descarga dos veces.
