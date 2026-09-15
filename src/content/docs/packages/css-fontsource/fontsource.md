---
title: Fontsource
description: Tipografías de código abierto empaquetadas en npm para autoalojarlas — un import por peso, fuentes variables y subsets, sin pedirle nada a Google Fonts en runtime.
tags: [css, tipografia, fuentes, rendimiento, privacidad]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://fontsource.org
github: https://github.com/fontsource/fontsource
note: "La licencia es la de cada familia (OFL, Apache, MIT según el caso), no la de Fontsource: revísala antes de redistribuir la fuente."
updatedAt: 2026-09-14
---

Enlazar `fonts.googleapis.com` mete un tercero en el camino crítico de cada visita: una petición más a otro dominio, un `@font-face` que no controlas y la IP del visitante viajando a un servidor ajeno. Fontsource publica esas mismas familias **como paquetes npm**: las fuentes quedan en `node_modules`, entran al build como cualquier asset y se sirven desde tu dominio.

Lo que se gana al autoalojar: no hay latencia de un CDN externo, la versión de la fuente queda fijada en el lockfile, funciona sin red en desarrollo y hay familias que no están en el catálogo de Google.

## Instalación

Cada familia es su propio paquete. Fuentes estáticas:

```bash
pnpm add @fontsource/roboto
```

Fuentes variables — un solo archivo cubre todo el rango de pesos:

```bash
pnpm add @fontsource-variable/inter
```

Prefiere la variable cuando exista: un archivo en vez de cinco, y pesos intermedios disponibles.

## Importar

El paquete trae los `@font-face` ya escritos. Importar el índice carga los pesos habituales:

```css title="src/styles/global.css"
@import "@fontsource-variable/inter";
```

O desde JavaScript, si el bundler procesa CSS importado:

```ts
import "@fontsource-variable/inter"
```

Para una fuente estática conviene importar **solo los pesos que usas**, no el índice completo:

```css
@import "@fontsource/roboto/400.css";
@import "@fontsource/roboto/700.css";
@import "@fontsource/roboto/400-italic.css";
```

Después se usa por su nombre real:

```css
:root {
  --font-sans: "Inter Variable", system-ui, sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

El nombre de la familia variable lleva el sufijo `Variable` (`"Inter Variable"`); la estática no (`"Roboto"`). Equivocarlo no lanza ningún error: simplemente se ve el fallback.

## Subsets

Si no necesitas todos los alfabetos, importa el subset:

```css
@import "@fontsource-variable/inter/latin.css";
```

Así el navegador no descarga cirílico, griego ni vietnamita. Es el ahorro más grande y el más fácil de olvidar.

## Qué carga cada import

| Ruta del import                           | Qué carga                             |
| ----------------------------------------- | ------------------------------------- |
| `@fontsource/<familia>`                   | Los pesos por defecto de la familia   |
| `@fontsource/<familia>/400.css`           | Un peso concreto                      |
| `@fontsource/<familia>/400-italic.css`    | Un peso en cursiva                    |
| `@fontsource/<familia>/latin.css`         | Solo el subset latino                 |
| `@fontsource-variable/<familia>`          | La fuente variable completa           |
| `@fontsource-variable/<familia>/wght.css` | Solo el eje de peso de la variable    |

## Carga y salto de fuente

Los paquetes declaran `font-display: swap`: el texto aparece con la fuente de sistema y cambia al terminar la descarga. Si ese salto molesta en la primera pantalla, precarga el archivo concreto:

```html
<link
  rel="preload"
  href="/fonts/inter-latin-wght-normal.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

Precargar solo tiene sentido para la fuente del texto visible al abrir; precargar cinco pesos empeora justo lo que intenta arreglar.

## Notas

- Las licencias son de cada familia (OFL, Apache, MIT según el caso), no de Fontsource: revísalas antes de redistribuir.
- Instalar la familia entera y usar un peso es normal — solo los `@import` que escribas terminan en el CSS final.
- Con Tailwind son dos pasos: declarar la familia en el tema y poner el `@import` en la hoja global. Sin el import, la clase apunta a una fuente que no existe.
- El catálogo se actualiza seguido; la versión del paquete fija el corte de la fuente que ves en tu build.
