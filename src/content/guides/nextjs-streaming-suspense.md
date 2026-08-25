---
title: Streaming, Suspense y loading.tsx
description: Enviar una shell rápida y transmitir las partes lentas cuando terminan, con límites de carga útiles y fetching paralelo.
category: frontend
stack: nextjs
order: 19
tags: [nextjs, react, suspense, performance, streaming]
scope: next.js app router
related:
  - guides/nextjs-page-error-loading
  - guides/nextjs-server-client-components
  - guides/nextjs-cache-components
updatedAt: 2026-08-25
---

Streaming permite empezar a enviar HTML antes de que termine toda la ruta. El usuario recibe navegación, título y placeholders rápidamente; cada bloque lento aparece cuando sus datos están listos.

**Suspense** define dónde puede mostrarse una alternativa mientras una rama espera. **Streaming** es el transporte progresivo de esas ramas desde el servidor. No son sinónimos: Suspense también coordina carga en el cliente, mientras streaming describe cómo se envía la respuesta.

## En una mirada

| Necesidad | Herramienta |
| --- | --- |
| fallback de todo un segmento | `loading.tsx` |
| fallback de una sección lenta | `<Suspense fallback={...}>` |
| errores del segmento | `error.tsx` |
| consultas independientes | componentes hermanos o `Promise.all` |
| mantener una shell estática | Cache Components + límites de Suspense |

## Límite automático con `loading.tsx`

Un `loading.tsx` envuelve el segmento en Suspense y se muestra durante navegación o render dinámico.

```tsx title="app/dashboard/loading.tsx"
export default function Loading() {
  return <div aria-busy="true">Cargando dashboard…</div>;
}
```

El archivo permite mostrar feedback inmediato mientras se prepara la nueva ruta y conserva interactivos los layouts compartidos. No debe duplicar toda la página real; representa su geometría o estado general de carga.

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

Puedes crear varios límites para que cada región aparezca cuando esté lista. Demasiados fallbacks pequeños generan parpadeo y ruido; agrupa contenido que tenga sentido revelar junto.

## Evitar waterfalls

Si dos operaciones son independientes, inicia ambas antes de esperarlas o sepáralas en componentes hermanos suspendidos.

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

Un skeleton es apropiado cuando la forma es predecible. Para una operación breve, texto como “Cargando resultados…” puede ser suficiente. Usa `aria-busy` en la región que se actualiza y evita anunciar repetidamente cada bloque decorativo del skeleton.

## Lo que Suspense no resuelve

- No convierte una consulta secuencial en paralela por sí sola.
- No captura errores; necesitas un Error Boundary o `error.tsx`.
- No reduce el costo de la consulta ni define su caché.
- No justifica ocultar contenido que ya estaba disponible.
- No reemplaza un estado pendiente de una mutación en curso.

## Diagnóstico

Si nunca aparece el fallback, revisa si el `await` ocurrió antes de devolver el límite. Si toda la página queda esperando, mueve el trabajo lento a un descendiente. Si el contenido cambia de tamaño al llegar, ajusta el fallback para reservar espacio. Si los bloques aparecen uno tras otro sin dependencia real, inicia las consultas en paralelo.

Referencia oficial: [Fetching Data y Streaming](https://nextjs.org/docs/app/getting-started/fetching-data).
