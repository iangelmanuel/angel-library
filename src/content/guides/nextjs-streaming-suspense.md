---
title: Streaming, Suspense y loading.tsx
description: Enviar una shell rápida y transmitir las partes lentas cuando terminan, con límites de carga útiles y fetching paralelo.
category: frontend
stack: nextjs
order: 13
tags: [nextjs, react, suspense, performance, streaming]
scope: next.js app router
related:
  - guides/nextjs-page-error-loading
  - guides/nextjs-server-client-components
  - guides/nextjs-cache-components
updatedAt: 2026-08-18
---

Streaming permite empezar a enviar HTML antes de que termine toda la ruta. El usuario recibe navegación, título y placeholders rápidamente; cada bloque lento aparece cuando sus datos están listos.

## Límite automático con `loading.tsx`

Un `loading.tsx` envuelve el segmento en Suspense y se muestra durante navegación o render dinámico.

```tsx title="app/dashboard/loading.tsx"
export default function Loading() {
  return <div aria-busy="true">Cargando dashboard…</div>;
}
```

## Límite granular con `<Suspense>`

```tsx title="app/dashboard/page.tsx"
import { Suspense } from 'react';

export default function Page() {
  return <main><h1>Dashboard</h1><Suspense fallback={<p>Cargando ventas…</p>}><Ventas /></Suspense></main>;
}

async function Ventas() {
  const ventas = await obtenerVentas();
  return <pre>{JSON.stringify(ventas)}</pre>;
}
```

El `await` debe vivir dentro del componente suspendido. Si la página hace `await obtenerVentas()` antes de devolver JSX, el fallback todavía no puede renderizarse.

## Evitar waterfalls

Si dos operaciones son independientes, iniciá ambas antes de esperarlas o separalas en componentes hermanos suspendidos.

```ts
const usuarioPromise = getUsuario();
const pedidosPromise = getPedidos();
const [usuario, pedidos] = await Promise.all([usuarioPromise, pedidosPromise]);
```

## Diseñar buenos fallbacks

- Conserva el tamaño aproximado del contenido para evitar saltos de layout.
- Pon el límite cerca del dato lento; un Suspense alrededor de toda la página oculta demasiado.
- No conviertas automáticamente el componente a cliente. El streaming funciona con Server Components.
- Con Cache Components, el contenido que lee datos de request o datos no cacheados debe quedar detrás de Suspense; la shell estática y el contenido cacheado pueden salir antes.

Referencia oficial: [Fetching Data y Streaming](https://nextjs.org/docs/app/getting-started/fetching-data).
