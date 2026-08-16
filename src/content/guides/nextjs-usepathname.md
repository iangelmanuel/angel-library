---
title: usePathname
description: Leer la ruta actual desde un Client Component — para resaltar un link activo o reaccionar a la navegación.
category: frontend
stack: nextjs
order: 6
tags: [nextjs, routing, hooks]
scope: next.js (next/navigation)
related:
  - guides/nextjs-usesearchparams
  - guides/nextjs-userouter
updatedAt: 2026-08-16
---

Un Server Component no puede leer la URL actual (es intencional: mantiene el layout estable entre navegaciones). `usePathname` es la forma de acceder a ella, y por eso es un hook de Client Component — necesita `'use client'`.

## Uso básico

```tsx title="app/ui/nav-link.tsx"
'use client'

import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const activo = pathname === href;

  return (
    <a href={href} className={activo ? 'activo' : ''}>
      {children}
    </a>
  );
}
```

| URL visitada | `usePathname()` devuelve |
| --- | --- |
| `/` | `'/'` |
| `/dashboard` | `'/dashboard'` |
| `/dashboard?v=2` | `'/dashboard'` (sin la query) |
| `/blog/hola-mundo` | `'/blog/hola-mundo'` |

## Reaccionar a un cambio de ruta

No hay un evento "cambió la ruta" directo — se combina con `useEffect`, poniendo `pathname` (y `searchParams` si también importa) en el array de dependencias.

```tsx
'use client'

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    trackPageView(pathname, searchParams.toString());
  }, [pathname, searchParams]);

  return null;
}
```

## Resumen

| API | Uso |
| --- | --- |
| `usePathname()` | String con el pathname actual, sin query string |
| Requiere `'use client'` | Sí, siempre |
| Combinado con `useEffect` | Para reaccionar a cambios de ruta (analytics, cerrar un modal, etc.) |

## Consideraciones

- No existe versión de esto para Server Components — es una decisión de diseño de Next, no una limitación temporal: leer la URL en un Server Component rompería el modelo de layouts persistentes entre navegaciones.
- Si el proyecto usa `rewrites` (en `next.config`) o [Proxy](/guides/nextjs-proxy), `usePathname()` puede devolver la ruta reescrita (destino), no la que el usuario ve en la barra de direcciones — puede causar un mismatch de hidratación si el componente depende de eso en el primer render.
- Devuelve `null` en algunos casos de compatibilidad con el Pages Router antiguo (fallback routes) — si el proyecto mezcla `app/` y `pages/`, contemplar ese caso.
