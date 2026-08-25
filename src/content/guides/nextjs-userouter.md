---
title: useRouter
description: Navegar por código desde un Client Component — push, replace, refresh, back/forward. El tercero de los hooks de navegación.
category: frontend
stack: nextjs
order: 13
tags: [nextjs, routing, hooks]
scope: next.js (next/navigation)
related:
  - guides/nextjs-usepathname
  - guides/nextjs-usesearchparams
  - guides/nextjs-link
updatedAt: 2026-08-25
---

[`<Link>`](/guides/nextjs-link) cubre la navegación normal (el usuario hace click en algo). `useRouter` es para cuando el código mismo decide navegar — después de un submit exitoso, un timeout, una condición que no depende de un click directo. Next recomienda `<Link>` como default y `useRouter` solo cuando hace falta control programático real.

## Uso básico

```tsx title="app/ui/boton-dashboard.tsx"
'use client'

import { useRouter } from 'next/navigation';

export default function BotonDashboard() {
  const router = useRouter();

  return <button onClick={() => router.push('/dashboard')}>Ir al dashboard</button>;
}
```

## Los métodos

```ts
router.push('/dashboard');              // navega, agrega entrada al historial
router.replace('/dashboard');           // navega, SIN agregar entrada al historial
router.refresh();                       // re-pide la ruta actual al servidor, re-renderiza
router.back();                          // como el botón "atrás" del navegador
router.forward();                       // como el botón "adelante"
router.prefetch('/dashboard');          // precargar una ruta a mano, fuera de un <Link>
```

## `refresh()` — Qué refresca y qué no

Vuelve a pedir la ruta actual al servidor y re-renderiza los Server Components, sin perder el estado de cliente (`useState`) ni la posición de scroll. Importante: esto limpia la caché del cliente para esa ruta, pero **no** invalida nada del lado del servidor — si los datos vienen de un `fetch` cacheado con `revalidate`, `refresh()` solo te sirve el mismo dato cacheado de nuevo. Para forzar datos realmente frescos, se combina con [`revalidatePath`/`revalidateTag`](/guides/nextjs-revalidate-path) del lado del servidor.

```tsx
'use client'

import { useRouter } from 'next/navigation';

function BotonActualizar() {
  const router = useRouter();
  return <button onClick={() => router.refresh()}>Actualizar</button>;
}
```

## `push` vs `replace`

`push` es la navegación normal — el usuario puede volver atrás. `replace` sirve para casos donde "atrás" no debería volver a esa pantalla: después de un login exitoso, un wizard de varios pasos donde no tiene sentido retroceder a un paso ya completado.

```ts
router.replace('/dashboard'); // el usuario NO vuelve al login con el botón atrás
```

## Métodos del router en una mirada

| Método | Uso |
| --- | --- |
| `router.push(href)` | Navegar, agregando entrada al historial |
| `router.replace(href)` | Navegar, sin agregar entrada al historial |
| `router.refresh()` | Re-pedir la ruta actual al servidor (limpia caché de cliente, no la de servidor) |
| `router.back()` / `router.forward()` | Como los botones del navegador |
| `router.prefetch(href)` | Precargar una ruta fuera de un `<Link>` |

## Semántica, seguridad e historial

- Es de `next/navigation`, no de `next/router` — ese es el hook viejo del Pages Router; en el App Router, importar de `next/router` es el error más común al migrar código copiado de un tutorial viejo.
- Nunca le pases a `router.push`/`router.replace` una URL que venga de input de usuario sin sanitizar — una URL tipo `javascript:...` se ejecuta en el contexto de tu página.
- `refresh()` no es lo mismo que recargar la pestaña (`location.reload()`): mantiene el estado de React y la posición de scroll, solo trae de nuevo el árbol de Server Components.
