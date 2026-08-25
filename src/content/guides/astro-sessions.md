---
title: Sessions en Astro
description: Estado server-side entre requests, drivers de almacenamiento, tipado, regeneración y uso desde páginas, middleware y Actions.
category: backend
stack: astro
order: 4
tags: [astro, sessions, auth, security, state]
scope: Astro.session
related:
  - guides/astro-ssr-adapters
  - guides/astro-server-actions
  - guides/astro-middleware
updatedAt: 2026-08-25
---

Una sesión guarda los datos en servidor y envía al navegador solo un identificador en cookie. Sirve para carrito, flash messages o estado de autenticación que debe sobrevivir entre requests.

**Session** significa sesión: un contexto asociado a un navegador durante varias solicitudes. A diferencia de una cookie con todos los datos, el navegador conserva normalmente un identificador opaco y el servidor consulta el valor real en un **driver** de almacenamiento.

## Cuándo usarla

| Necesidad | Opción |
| --- | --- |
| preferencia pequeña y no sensible | cookie directa |
| estado privado revocable | sesión server-side |
| dato que debe estar siempre actualizado | base de datos, no copiarlo a sesión |
| estado temporal de una sola navegación | flash message en sesión |

Una sesión no debe convertirse en una segunda base de datos. Guarda identificadores y estado pequeño; consulta perfiles, permisos, precios o inventario desde su fuente cuando la actualidad sea importante.

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

```ts title="src/pages/api/cart.ts"
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, session }) => {
  if (!session) return Response.json({ error: 'Sesión no disponible' }, { status: 500 });

  const { productId } = await request.json();
  const cart = (await session.get('cart')) ?? [];
  await session.set('cart', [...cart, productId]);

  return Response.json({ count: cart.length + 1 }, { status: 201 });
};
```

La ruta debe ejecutarse on-demand. Una página prerenderizada no tiene una request de usuario durante el build y, por tanto, no puede tener una sesión individual.

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
- `destroy()` elimina datos y cookie; úsalo al cerrar sesión.

`regenerate()` es importante después de cambiar el nivel de confianza, por ejemplo tras iniciar sesión. Cambiar el identificador reduce **session fixation**, un ataque donde una persona intenta hacer que la víctima use un id que el atacante ya conoce.

```ts
await context.session.regenerate();
await context.session.set('user', { id: user.id, name: user.name });
```

Al cerrar sesión, destruye el estado en servidor y no solo la cookie visible en el cliente.

## Drivers y despliegue

Node, Cloudflare y Netlify pueden aportar defaults; otros adapters requieren configurar un driver. En múltiples instancias necesitas almacenamiento compartido como Redis, no memoria local del proceso.

```js title="astro.config.mjs"
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  session: {
    driver: 'redis',
    options: { url: process.env.REDIS_URL },
  },
});
```

La configuración exacta del driver depende del adapter y del paquete instalado. Comprueba persistencia, TTL (*Time To Live* o tiempo de vida), cifrado en tránsito y comportamiento cuando el store no está disponible.

## Seguridad

La sesión facilita persistencia, pero no reemplaza la autorización. Comprueba permisos en cada Action o endpoint sensible, configura la expiración y no almacenes objetos enormes ni datos que deban consultarse actualizados desde la base.

- Regenera después de login y destruye al cerrar sesión.
- Usa cookies `HttpOnly`, `Secure` en producción y `SameSite` acorde al flujo.
- Protege mutaciones basadas en cookies contra CSRF (*Cross-Site Request Forgery*).
- Evita guardar tokens de terceros si basta una referencia cifrada en base de datos.
- Define comportamiento ante robo, revocación, inactividad y cierre en todos los dispositivos.

## Caso de uso: flash message

Un mensaje flash se escribe durante una mutación y se consume una sola vez en la siguiente página:

```ts
await session.set('flash', 'Perfil actualizado');
return redirect('/profile');

// En la página siguiente
const message = await Astro.session?.get('flash');
await Astro.session?.delete('flash');
```

Este patrón evita incluir el texto en la URL y demuestra una sesión pequeña y temporal.

Referencia oficial: [Sessions](https://docs.astro.build/en/guides/sessions/).
