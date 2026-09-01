---
title: PUG
description: Motor de templates server-side para Express — sintaxis por indentación, layouts, y cuándo un template engine sigue teniendo sentido.
type: libraries
order: 21
tags: [express, templates, pug, ssr]
website: https://pugjs.org
install: npm install pug
updatedAt: 2026-08-16
---

Pug (antes Jade) es un motor de plantillas que Express reconoce: genera HTML en el servidor a partir de una sintaxis compacta basada en indentación y sin etiquetas de cierre.

## Setup en Express

```ts title="app.ts"
import express from 'express';
import path from 'node:path';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(process.cwd(), 'views'));
```

```ts
app.get('/', (req, res) => {
  res.render('index', { titulo: 'Mi sitio', usuarios: ['Ana', 'Luis'] });
});
```

## Sintaxis básica

```pug title="views/index.pug"
doctype html
html
  head
    title= titulo
  body
    h1 Bienvenido
    ul
      each usuario in usuarios
        li= usuario
    if usuarios.length === 0
      p No hay usuarios todavía
```

Sin `<` `>` ni etiquetas de cierre — la indentación define el anidamiento (como Python). `=` interpola una variable JS escapando HTML automáticamente (protege contra XSS); `!=` interpola sin escapar, para cuando el contenido ya es HTML de confianza.

## Layouts reutilizables

```pug title="views/layout.pug"
doctype html
html
  head
    title= titulo
  body
    block contenido
```

```pug title="views/index.pug"
extends layout

block contenido
  h1 Página de inicio
```

`extends` + `block` es el mecanismo de layouts — un template base define "huecos" (`block`) que las páginas hijas rellenan.

## Includes (parciales)

```pug title="views/partials/header.pug"
header
  nav
    a(href="/") Inicio
    a(href="/contacto") Contacto
```

```pug title="views/index.pug"
extends layout

block contenido
  include partials/header
  h1 Página de inicio
```

## Resumen

| Sintaxis | Qué hace |
| --- | --- |
| `tag= variable` | Interpola escapando HTML |
| `tag!= variable` | Interpola sin escapar (HTML de confianza) |
| `extends` / `block` | Layout base + huecos que las páginas rellenan |
| `include` | Insertar un parcial (header, footer, etc.) |
| `each ... in ...` | Iterar sobre un array |

## Consideraciones — cuándo un template engine server-side sigue teniendo sentido

- Para una app con mucha interactividad del lado del cliente, un framework de componentes (React, Astro con islas) generalmente reemplaza esto — PUG (o EJS, Handlebars) tiene sentido cuando el backend es Express puro y la UI es mayormente estática/renderizada en servidor, sin necesidad de un framework de frontend aparte.
- La interpolación con `=` (no `!=`) escapa HTML automáticamente — usar `!=` con contenido que viene de un usuario (no de confianza) reabre el mismo riesgo de XSS que escapar existe para evitar.
- Si el proyecto ya tiene un frontend separado (React, Astro, Next.js) consumiendo esta misma API, probablemente no hace falta PUG en absoluto — sirve específicamente para cuando Express también es responsable de renderizar HTML final, no solo de servir JSON.
