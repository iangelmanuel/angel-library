---
title: Sessions en Astro
description: Estado server-side entre requests, drivers de almacenamiento, tipado, regeneración y uso desde páginas, middleware y Actions.
category: backend
stack: astro
order: 3
tags: [astro, sessions, auth, security, state]
scope: Astro.session
related:
  - guides/astro-ssr-adapters
  - guides/astro-server-actions
  - guides/astro-middleware
updatedAt: 2026-08-18
---

Una sesión guarda los datos en servidor y envía al navegador solo un identificador en cookie. Sirve para carrito, flash messages o estado de autenticación que debe sobrevivir entre requests.

## Leer y escribir

```astro
---
export const prerender = false;
const cart = (await Astro.session?.get('cart')) ?? [];
await Astro.session?.set('lastVisit', new Date());
---
<a href="/cart">Carrito: {cart.length}</a>
```

En endpoints, middleware y Actions se usa `context.session`. La sesión es `undefined` si no hay driver configurado o si la ruta está prerenderizada.

## Tipar claves

```ts title="src/env.d.ts"
declare namespace App {
  interface SessionData {
    user: { id: string; name: string };
    cart: string[];
    flash: string;
  }
}
```

## Ciclo de vida

- `get(key)` y `set(key, value)` leen/escriben.
- `delete(key)` elimina un dato puntual.
- `regenerate()` cambia el id; hazlo después de login para reducir session fixation.
- `destroy()` elimina datos y cookie; usalo al cerrar sesión.

## Drivers y despliegue

Node, Cloudflare y Netlify pueden aportar defaults; otros adapters requieren configurar un driver. En múltiples instancias necesitas almacenamiento compartido como Redis, no memoria local del proceso.

## Seguridad

La sesión facilita persistencia, pero no reemplaza la autorización. Comprueba permisos en cada Action o endpoint sensible, configura la expiración y no almacenes objetos enormes ni datos que deban consultarse actualizados desde la base.

Referencia oficial: [Sessions](https://docs.astro.build/en/guides/sessions/).
