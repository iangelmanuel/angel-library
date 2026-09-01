---
title: Auth.js (auth-astro) en Astro
description: Instalación con astro add, providers (social y Credentials), los callbacks jwt/session para meter datos propios en la sesión, y cómo tiparlos.
type: guides
order: 6
tags: [astro, auth-js, nextauth, auth]
website: https://authjs.dev
related: [backend/astro/astro-backend-arquitectura]
updatedAt: 2026-08-17
---

Auth.js empezó como **NextAuth.js**, pensado solo para Next.js — hoy su core (`@auth/core`) es agnóstico de framework. Para Astro, la integración oficial es el paquete `auth-astro`, que se instala como cualquier integración de Astro (no como un endpoint manual).

## Instalación

```bash
npx astro add auth-astro
```

El comando `astro add` instala el paquete y agrega la integración a `astro.config.mjs` automáticamente — a diferencia de better-auth (que se monta a mano en un endpoint catch-all), `auth-astro` se registra como integración y expone las rutas por su cuenta. **No hace falta crear un endpoint propio.**

## Configuración rápida — de cero a una sesión funcionando

**1. Providers, incluyendo Credentials:**

```ts title="auth.config.ts"
import GitHub from '@auth/core/providers/github';
import Credentials from '@auth/core/providers/credentials';
import { defineConfig } from 'auth-astro';
import bcrypt from 'bcrypt';
import { prisma } from './src/libs/prisma';

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const usuario = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!usuario) return null;

        const passwordValida = await bcrypt.compare(credentials.password as string, usuario.passwordHash);
        if (!passwordValida) return null;

        return { id: usuario.id, email: usuario.email, name: usuario.nombre, rol: usuario.rol };
      },
    }),
  ],
  // callbacks va aquí — ver la sección de abajo
});
```

Devolver `null` en `authorize` (nunca lanzar) es la forma correcta de decir "credenciales inválidas" — Auth.js lo traduce en un error genérico del lado del cliente.

Este archivo se ubica en la raíz del proyecto (`auth.config.ts`, junto a `astro.config.mjs`) — es lo que `auth-astro` lee automáticamente al registrarse como integración.

## Los callbacks `jwt` y `session` — meter datos propios en la sesión

`session.user` solo trae `id`/`name`/`email`/`image` por default — el `rol` devuelto en `authorize` no aparece solo:

```ts title="auth.config.ts"
export default defineConfig({
  providers: [ /* ... */ ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.rol = (user as { rol: string }).rol;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.rol = token.rol as string;
      return session;
    },
  },
});
```

`user` solo está disponible en `jwt` durante el login inicial (de `authorize()` o el provider OAuth) — en requests siguientes, `jwt` corre de nuevo pero solo con el `token` ya existente, de ahí el `if (user)`.

## Tipar `session.user.rol` y `token.rol`

```ts title="src/env.d.ts"
import type { DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  interface Session {
    user: {
      id: string;
      rol: string;
    } & DefaultSession['user'];
  }

  interface User {
    rol: string;
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    rol: string;
  }
}
```

Con esto, `session.user.rol` queda tipado en cualquier página/endpoint que lea la sesión, sin necesitar `as` en el resto del código.

## Leer la sesión en una página

```astro title="src/pages/perfil.astro"
---
import { getSession } from 'auth-astro/server';

const session = await getSession(Astro.request);

if (!session?.user) {
  return Astro.redirect('/login');
}
---
<h1>Hola, {session.user.name} ({session.user.rol})</h1>
```

## Leer la sesión en un endpoint

```ts title="src/pages/api/posts.ts"
import type { APIRoute } from 'astro';
import { getSession } from 'auth-astro/server';

export const POST: APIRoute = async ({ request }) => {
  const session = await getSession(request);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
  }

  const post = await postsRepository.create({ authorId: session.user.id });
  return new Response(JSON.stringify(post), { status: 201 });
};
```

## Login/registro desde un componente

```astro title="src/components/AuthButtons.astro"
<script>
  import { signIn, signOut } from 'auth-astro/client';

  document.querySelector('#login')?.addEventListener('click', () => signIn('github'));
  document.querySelector('#logout')?.addEventListener('click', () => signOut());
</script>

<button id="login">Iniciar sesión con GitHub</button>
<button id="logout">Cerrar sesión</button>
```

## Piezas de Auth.js en Astro

| Pieza | Rol |
| --- | --- |
| `npx astro add auth-astro` | Instala e integra automáticamente, sin endpoint propio |
| `Credentials({ authorize })` | Login con email/password propio; `null` = credenciales inválidas |
| `callbacks.jwt` / `callbacks.session` | Pasar datos custom del login al JWT, y del JWT a la sesión expuesta |
| `declare module '@auth/core/types'` / `'/jwt'` | Tipar los campos custom |
| `auth-astro/server` (`getSession`) | Leer sesión en páginas/endpoints |
| `auth-astro/client` (`signIn`/`signOut`) | Login/logout desde un script de cliente |

## Callbacks, sesión y rutas

- `auth-astro` es un paquete más nuevo que la integración de Next.js — con menos superficie de uso en producción a gran escala.
- Olvidar el callback `jwt` (y solo agregar `session`) es un error común: `session` solo puede leer lo que `jwt` ya haya copiado al `token`.
- Sin CORS: misma app Astro sirve UI y auth, mismo origen.
