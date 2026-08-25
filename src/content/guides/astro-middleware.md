---
title: Middleware
description: Interceptar cada request antes de que llegue a la página — context.locals, encadenar middlewares con sequence() y rewrite.
category: frontend
stack: astro
order: 20
tags: [astro, middleware, auth]
scope: astro:middleware
updatedAt: 2026-08-25
---

Repetir la misma comprobación (¿hay sesión?, ¿qué idioma pide el usuario?) al principio de cada página no escala. El middleware es una única función que Astro corre antes de cualquier página o endpoint, sin importar cuál — el lugar central para auth, logging, o para calcular una vez algo que varias páginas van a necesitar y dejarlo listo en `locals`.

## Ubicación y forma básica

Vive en `src/middleware.ts` (o `src/middleware/index.ts`). Exporta `onRequest`, siempre con ese nombre, nunca `default`.

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  context.locals.tema = 'oscuro';
  return next();
});
```

`defineMiddleware` no es obligatorio, pero da tipado automático al `context` — sin él hay que tipar a mano.

## `context.locals` — Compartir datos con la página

Cualquier cosa guardada en `locals` está disponible en `Astro.locals` dentro de las páginas y en el `context.locals` de las actions/endpoints que corran después.

```ts title="src/middleware.ts"
export const onRequest = defineMiddleware((context, next) => {
  context.locals.usuario = obtenerUsuarioDeCookie(context.cookies);
  return next();
});
```

```astro title="pages/perfil.astro"
---
const usuario = Astro.locals.usuario;
if (!usuario) return Astro.redirect('/login');
---
```

Para autocompletado tipado de `Astro.locals`, se declara la forma en `env.d.ts`:

```ts title="env.d.ts"
declare namespace App {
  interface Locals {
    usuario: { id: string; nombre: string } | null;
  }
}
```

## Encadenar middlewares con `sequence()`

Cada uno corre en orden; el control pasa al siguiente al llamar `next()`.

```ts title="src/middleware.ts"
import { sequence } from 'astro:middleware';

async function logging(context, next) {
  console.log(context.url.pathname);
  return next();
}

async function auth(context, next) {
  context.locals.usuario = obtenerUsuarioDeCookie(context.cookies);
  return next();
}

export const onRequest = sequence(logging, auth);
```

## Redirigir o reescribir

`next(new Request(...))` cambia la request sin volver a correr el middleware; `context.rewrite(...)` la reescribe y sí vuelve a pasar por toda la cadena.

```ts
export const onRequest = defineMiddleware((context, next) => {
  if (!context.locals.usuario && context.url.pathname.startsWith('/admin')) {
    return context.rewrite('/login');
  }
  return next();
});
```

## Contexto y helpers en una mirada

| API | Uso |
| --- | --- |
| `onRequest(context, next)` en `src/middleware.ts` | Punto de entrada, corre antes de cada página/endpoint |
| `defineMiddleware(fn)` | Igual, con tipado automático del `context` |
| `context.locals` | Compartir datos entre middleware → página/endpoint/action |
| `sequence(a, b, ...)` | Encadenar varios middlewares en orden |
| `next()` | Pasar el control al siguiente middleware / renderizar la página |
| `context.rewrite(destino)` | Servir otra ruta sin cambiar la URL, re-corriendo el middleware |

## Orden, alcance y seguridad

- `locals` no se puede reasignar completo (`context.locals = {...}` tira error) — solo se le agregan propiedades.
- El middleware corre en build para páginas prerenderizadas y en cada request para las on-demand — si depende de algo que solo existe en runtime (headers reales, cookies del usuario), esa página necesita `prerender = false`.
- Las Server Actions no pasan automáticamente por el middleware de páginas: si necesitas que también las cubra, hay que usar `getActionContext()` dentro del middleware.
