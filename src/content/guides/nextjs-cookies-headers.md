---
title: cookies(), headers() y datos de la request
description: Leer y escribir cookies, inspeccionar headers y entender por qué estas APIs vuelven dinámica una ruta.
category: backend
stack: nextjs
order: 3
tags: [nextjs, cookies, headers, http, auth]
scope: next/headers
related:
  - guides/nextjs-server-actions
  - guides/nextjs-endpoints
updatedAt: 2026-08-18
---

`cookies()` y `headers()` vienen de `next/headers` y son APIs asíncronas. Leen datos de la request actual, por lo que no pueden conocerse durante un build estático.

## Leer cookies y headers

```tsx title="app/cuenta/page.tsx"
import { cookies, headers } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const headersList = await headers();
  const theme = cookieStore.get('theme')?.value ?? 'system';
  const userAgent = headersList.get('user-agent');
  return <pre>{JSON.stringify({ theme, userAgent })}</pre>;
}
```

## Escribir cookies

Los headers directamente respuesta no se pueden cambiar después de empezar a transmitir el body. Por eso `set`, `delete` y `clear` deben ejecutarse en una Server Action o Route Handler.

```ts title="app/actions.ts"
'use server';
import { cookies } from 'next/headers';

export async function guardarTema(theme: 'light' | 'dark') {
  const store = await cookies();
  store.set('theme', theme, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
}
```

## Cookies de sesión

Una cookie de autenticación debería usar `httpOnly`, `secure` en producción, `sameSite` y un `maxAge`/`expires` explícito. Guarda un identificador opaco o token firmado, no el perfil completo del usuario. La autorización real siempre se vuelve a comprobar en el servidor.

## Headers de respuesta

Para devolver headers propios usa un Route Handler, `NextResponse` en `proxy.ts`, o la opción `headers()` de `next.config`. No intentes mutar el objeto devuelto por `headers()`; es una vista de solo lectura de la request.

## Impacto en renderizado

Leer estas APIs hace que ese árbol dependa de la request. Con Cache Components, aislalo detrás de `<Suspense>` y pasa solo valores concretos a funciones cacheadas; no llames `cookies()` dentro de un scope `'use cache'` compartido.

Referencias oficiales: [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies) y [headers](https://nextjs.org/docs/app/api-reference/functions/headers).
