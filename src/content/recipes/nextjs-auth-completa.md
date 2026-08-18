---
title: Auth completa con Auth.js en Next.js
description: Setup completo — config, Route Handler, proxy.ts, página protegida y botones de login/logout, de punta a punta.
category: backend
stack: nextjs
order: 7
tags: [nextjs, auth, auth-js]
problem: Todas las piezas de Auth.js en Next.js juntas, de cero a una página protegida funcionando.
technologies: [guides/nextjs-auth-js]
updatedAt: 2026-08-16
---

## Setup

```bash
npm install next-auth@beta
```

## Config

```ts title="auth.ts"
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (credentials) => {
        const usuario = await prisma.user.findUnique({ where: { email: credentials.email as string } });
        if (!usuario) return null;

        const valido = await bcrypt.compare(credentials.password as string, usuario.passwordHash);
        return valido ? { id: usuario.id, email: usuario.email, name: usuario.nombre } : null;
      },
    }),
  ],
});
```

## Route Handler

```ts title="app/api/auth/[...nextauth]/route.ts"
export { GET, POST } from '@/auth';
```

## `proxy.ts`

```ts title="proxy.ts"
export { auth as default } from '@/auth';

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

## Formulario de login (Server Action)

```tsx title="app/login/page.tsx"
import { signIn } from '@/auth';

export default function LoginPage() {
  return (
    <form
      action={async (formData) => {
        'use server';
        await signIn('credentials', {
          email: formData.get('email'),
          password: formData.get('password'),
          redirectTo: '/dashboard',
        });
      }}
    >
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

## Página protegida

```tsx title="app/dashboard/page.tsx"
import { auth } from '@/auth';

export default async function DashboardPage() {
  const session = await auth(); // proxy.ts ya redirigió si no había sesión
  return <h1>Hola, {session!.user!.name}</h1>;
}
```

## Consideraciones

- Cada pieza está documentada a fondo en [Auth.js en Next.js](/guides/nextjs-auth-js) — aquí solo el ensamblado end-to-end.
- El provider `Credentials` sigue necesitando [bcrypt](/libraries/bcrypt) a mano dentro de `authorize` — Auth.js no reemplaza esa parte del flujo, solo el manejo de sesión alrededor.
