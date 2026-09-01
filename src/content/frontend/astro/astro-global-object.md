---
title: El objeto Astro
description: Astro.props, Astro.params, Astro.url, Astro.redirect(), Astro.cookies y Astro.locals — la API disponible en cualquier archivo .astro.
type: guides
order: 7
tags: [astro, api]
scope: astro (global Astro)
related:
  - frontend/astro/astro-middleware
updatedAt: 2026-08-25
---

Dentro del frontmatter de cualquier `.astro`, `Astro` es un objeto global con todo el contexto de esa página/componente en ese render — sin importar nada.

## `Astro.props` — Props del componente

Lo que le pasaron a este componente desde afuera. Tipalo con una interfaz `Props`.

```astro
---
interface Props {
  titulo: string;
  destacado?: boolean;
}
const { titulo, destacado = false } = Astro.props;
---
<h2 class:list={['titulo', { destacado }]}>{titulo}</h2>
```

## `Astro.params` — Segmentos dinámicos

En una ruta `[id].astro`, el valor de `[id]` para el render actual.

```astro title="pages/blog/[slug].astro"
---
const { slug } = Astro.params;
---
```

## `Astro.url` y `Astro.request`

`Astro.url` es un `URL` normalizado de la request actual — útil para construir canonical URLs, leer query params fuera directamente ruta con `getStaticPaths`. `Astro.request` es el `Request` estándar completo (headers, method).

```astro
---
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
const metodo = Astro.request.method;
---
<link rel="canonical" href={canonicalURL} />
```

## `Astro.redirect()` — Redirigir

Solo funciona en rutas on-demand (no prerenderizadas) — hay que hacer `return` del resultado para que surta efecto.

```astro
---
if (!sesionActiva) {
  return Astro.redirect('/login');
}
---
```

## `Astro.cookies` — Leer y escribir cookies

También requiere renderizado on-demand. `get`, `set`, `has`, `delete`.

```astro
---
const tema = Astro.cookies.get('tema')?.value ?? 'oscuro';
Astro.cookies.set('visitas', '1', { maxAge: 60 * 60 * 24 });
---
```

## `Astro.locals` — Lo que dejó el middleware

Lee lo que un [middleware](/frontend/astro/astro-middleware) haya guardado en `context.locals` para esa request — así una página no repite la misma lógica que ya corrió antes.

```astro
---
const usuario = Astro.locals.usuario;
if (!usuario) return Astro.redirect('/login');
---
<p>Hola, {usuario.nombre}</p>
```

## Propiedades de `Astro` en una mirada

| Propiedad | Qué da |
| --- | --- |
| `Astro.props` | Props pasadas al componente |
| `Astro.params` | Segmentos dinámicos de la URL (`[slug]`) |
| `Astro.url` | `URL` normalizada de la request actual |
| `Astro.request` | `Request` estándar completo |
| `Astro.redirect(ruta)` | Redirigir (solo en rutas on-demand) |
| `Astro.cookies` | Leer/escribir cookies (solo en rutas on-demand) |
| `Astro.locals` | Datos dejados por el middleware para esta request |

## Disponibilidad y límites de seguridad

- `Astro.redirect()` y `Astro.cookies.set()` no funcionan en páginas prerenderizadas (estáticas) — necesitan `export const prerender = false` en ese archivo, o el proyecto entero con `output: 'server'`.
- `Astro.params` solo tiene valor en rutas dinámicas (`[algo].astro`) — en una ruta fija, es un objeto vacío.
- `Astro.locals` está tipado como `any` por defecto — para autocompletado, se extiende la interfaz `App.Locals` en `src/env.d.ts`, igual que en Next con `App.Locals` en `env.d.ts`.
