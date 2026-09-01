---
title: useSearchParams
description: Leer la query string desde un Client Component — con URLSearchParams real, y por qué casi siempre necesita Suspense.
type: guides
order: 12
tags: [nextjs, routing, hooks]
scope: next.js (next/navigation)
related:
  - frontend/nextjs/nextjs-usepathname
  - frontend/nextjs/nextjs-userouter
updatedAt: 2026-08-25
---

Como `usePathname`, pero para la query string (`?a=1&b=2`) — con la diferencia de que devuelve una instancia real de `URLSearchParams`, no un objeto plano como el `searchParams` de `page.tsx`.

## Uso básico

```tsx title="app/ui/filtros.tsx"
'use client'

import { useSearchParams } from 'next/navigation';

export function Filtros() {
  const searchParams = useSearchParams();
  const orden = searchParams.get('orden') ?? 'relevancia';

  return <p>Ordenando por: {orden}</p>;
}
```

Al ser `URLSearchParams`, tiene sus métodos normales: `.get()`, `.getAll()`, `.has()`, `.toString()`.

## Actualizar la query string

`useSearchParams` es de solo lectura — para cambiar la URL se arma el nuevo string y se navega con `router.push` del hook [`useRouter`](/frontend/nextjs/nextjs-userouter) (ver esa entrada para el resto de sus métodos), o con un `<Link>`.

```tsx
'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function SelectorOrden() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function cambiarOrden(valor: string) {
    const params = new URLSearchParams(searchParams);
    params.set('orden', valor);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select onChange={(e) => cambiarOrden(e.target.value)}>
      <option value="relevancia">Relevancia</option>
      <option value="precio">Precio</option>
    </select>
  );
}
```

## Por qué casi siempre necesita `<Suspense>`

Durante el pre-renderizado estático, Next no puede saber la query string de antemano — así que un componente que llama `useSearchParams()` "suspende" en ese momento. Sin un `<Suspense>` envolviéndolo, el build tira error (o, según el modo, hace que toda la ruta sea dinámica sin avisar).

```tsx title="app/buscar/page.tsx"
import { Suspense } from 'react';
import Resultados from './resultados';

export default function Page() {
  return (
    <Suspense fallback={<p>Cargando…</p>}>
      <Resultados />
    </Suspense>
  );
}
```

```tsx title="app/buscar/resultados.tsx"
'use client'

import { useSearchParams } from 'next/navigation';

export default function Resultados() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  return <p>Resultados para: {query}</p>;
}
```

## API de consulta en una mirada

| API | Uso |
| --- | --- |
| `useSearchParams()` | `URLSearchParams` de solo lectura, con `.get()`/`.getAll()` |
| `useRouter().push(url)` | Navegar con una query string nueva |
| `<Suspense>` alrededor | Necesario para que el resto de la página se pre-renderice sin bloquear por esto |

## Suspense, escritura y validación

- `useSearchParams()` es de solo lectura: mutar el objeto que devuelve no cambia la URL — siempre hay que pasar por `router.push`/`router.replace`.
- Es distinto del `searchParams` que recibe `page.tsx` como prop (ese es un objeto plano, no `URLSearchParams`, y no necesita `'use client'` ni Suspense porque ya es async por naturaleza).
- Olvidar el `<Suspense>` es el error más común con este hook — el síntoma típico es un build que falla o una ruta que "se volvió dinámica sola" sin que quede claro por qué.
