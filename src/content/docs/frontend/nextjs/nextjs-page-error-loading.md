---
title: "page.tsx, error.tsx, loading.tsx"
description: Los archivos especiales directamente ruta — qué hace cada uno y cómo se envuelven entre sí (Suspense + error boundary automáticos).
type: guides
order: 7
tags: [nextjs, routing]
scope: next.js app router (file conventions)
updatedAt: 2026-08-25
---

Cada carpeta dentro de `app/` es un segmento de ruta, y unos pocos nombres de archivo reservados definen su comportamiento — sin registrar rutas en ningún lado, la estructura de carpetas **es** el router.

## `page.tsx` — La UI de esa ruta

Es lo único obligatorio para que una carpeta sea una ruta pública. Server Component por defecto.

```tsx title="app/blog/[slug]/page.tsx"
export default function Page() {
  return <h1>Mi página</h1>
}
```

## `loading.tsx` — Estado de carga automático

Envuelve `page.tsx` (y todo lo de abajo) en un `<Suspense>` automáticamente — sin que tengas que escribir el `<Suspense>` a mano. Se muestra de inmediato al navegar, mientras el contenido real todavía está resolviendo en el servidor.

```tsx title="app/blog/loading.tsx"
export default function Loading() {
  return <p>Cargando…</p>
}
```

La navegación no se bloquea esperando esto: el layout compartido sigue interactivo, y este fallback se pre-carga junto con el link.

## `error.tsx` — Error boundary automático

Envuelve `page.tsx` en un error boundary. A diferencia de `loading.tsx`, **tiene** que ser Client Component (`'use client'` obligatorio) — los error boundaries de React son una clase/hook que solo funciona en cliente. Recibe el error y una función `reset` para reintentar sin recargar toda la página.

```tsx title="app/blog/error.tsx"
"use client"

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <p>Algo salió mal.</p>
      <button onClick={() => reset()}>Reintentar</button>
    </div>
  )
}
```

## `not-found.tsx` — 404 de esa ruta

Se renderiza cuando la función `notFound()` se llama dentro de ese segmento (ver [redirect() y notFound()](/frontend/nextjs/nextjs-redirect-notfound)), o cuando la URL no matchea ninguna ruta.

```tsx title="app/blog/[slug]/not-found.tsx"
export default function NotFound() {
  return <p>No encontramos ese post.</p>
}
```

## Cómo se envuelven entre sí

De afuera hacia adentro: `layout.tsx` → `error.tsx` → `loading.tsx` (Suspense) → `not-found.tsx` → `page.tsx`. `error.tsx` queda **fuera** del `<Suspense>` de `loading.tsx` a propósito — así un error mientras carga la página también lo captura.

## Convenciones de archivo en una mirada

| Archivo         | Qué hace                                                  | Client Component obligatorio |
| --------------- | --------------------------------------------------------- | ---------------------------- |
| `page.tsx`      | La UI de la ruta                                          | No (por defecto Server)      |
| `layout.tsx`    | UI compartida entre rutas hijas, no se remonta al navegar | No                           |
| `loading.tsx`   | Fallback automático, envuelve en `<Suspense>`             | No                           |
| `error.tsx`     | Error boundary automático                                 | Sí                           |
| `not-found.tsx` | UI cuando se llama `notFound()` o no matchea ninguna ruta | No                           |

## Recuperación, estado y límites de error

- `error.tsx` no captura errores en el propio `layout.tsx` del mismo segmento — para eso hace falta `global-error.tsx` en la raíz, o un `error.tsx` en el layout padre.
- Si el layout de la ruta lee datos sin caché —`cookies()` o un `fetch` dinámico—, `loading.tsx` no muestra su alternativa para esa parte: la navegación espera a que el layout termine. Mueve ese `fetch` a `page.tsx` si el layout debe responder de inmediato.
- `reset()` en `error.tsx` no recarga la página — vuelve a intentar renderizar el segmento. Si el error viene de datos que siguen rotos, va a volver a fallar, y eso es esperado.
