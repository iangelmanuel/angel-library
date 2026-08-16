---
title: Directivas — 'use client', 'use server', 'use cache'
description: Las tres directivas que definen dónde corre cada parte de tu app — la base de todo lo demás en el App Router.
category: frontend
stack: nextjs
order: 1
tags: [nextjs, rendering]
scope: next.js app router (directivas)
updatedAt: 2026-08-16
---

En el App Router, todo componente es Server Component **por defecto** — corre solo en el servidor, nunca viaja al navegador. Las directivas son las que cambian ese comportamiento por defecto. Entender esto primero hace que todo lo demás (Server Actions, Route Handlers, caché) tenga sentido.

## `'use client'` — Límite hacia el cliente

Al principio del archivo, antes de cualquier import. Marca ese módulo (y todo lo que importe o renderice directamente) como parte del bundle que sí viaja al navegador — ahí es donde podés usar `useState`, `onClick`, `window`, cualquier hook.

```tsx title="app/ui/contador.tsx"
'use client'

import { useState } from 'react'

export default function Contador() {
  const [cuenta, setCuenta] = useState(0)
  return <button onClick={() => setCuenta(cuenta + 1)}>{cuenta}</button>
}
```

No hace falta ponerlo en cada componente: una vez que un archivo tiene `'use client'`, todo lo que ese archivo importa y renderiza directamente ya es parte del bundle de cliente. Marcá el límite lo más abajo posible en el árbol (el componente interactivo puntual, no el layout entero) para no mandar más JS del necesario.

## `'use server'` — Funciones que corren en el servidor

Marca las funciones que cubre como Server Functions: se pueden llamar desde un Client Component, pero el código nunca viaja al cliente — solo una referencia que hace un POST al servidor cuando se invoca. Esto es lo que habilita [Server Actions](/guides/nextjs-server-actions).

```ts title="app/actions.ts"
'use server'

export async function crearPost(formData: FormData) {
  // corre en el servidor, nunca en el navegador
}
```

Puede ir al principio de un archivo (aplica a todos los exports, todos deben ser `async`) o al principio de una función específica dentro de un Server Component.

## `'use cache'` — Cachear el resultado

Directiva de Next.js (no de React) que cachea el resultado de una función o componente async según sus argumentos. Se puede poner a nivel de una función de datos puntual, o de una página/componente entero.

```ts title="app/lib/data.ts"
export async function getUsuarios() {
  'use cache'
  return db.query('SELECT * FROM usuarios')
}
```

Esta directiva es parte de un modelo de caché más nuevo ("Cache Components", opt-in vía `cacheComponents: true` en `next.config`) — para el modelo clásico de caché (el más común hoy en proyectos existentes), ver [Fetching con revalidate](/guides/nextjs-fetching-revalidate).

## Resumen

| Directiva | Definida por | Efecto |
| --- | --- | --- |
| `'use client'` | React | Crea un límite hacia el bundle de cliente |
| `'use server'` | React | Expone funciones como Server Functions callables desde el cliente |
| `'use cache'` | Next.js | Cachea el resultado de una función/componente según sus inputs |

## Consideraciones

- `'use client'` no significa "esto corre solo en el cliente" — el componente igual se renderiza una vez en el servidor para el HTML inicial, y después se hidrata en el navegador.
- Los props que cruzan de un Server Component a un Client Component tienen que ser serializables (nada de funciones, clases, `Date` sin convertir) — excepto las propias Server Functions, que sí pueden pasar como referencia.
- `'use server'` no es intercambiable con "esto es seguro" — cualquier Server Function es un endpoint POST alcanzable por cualquiera, no solo desde tu UI. Ver la sección de seguridad en [Server Actions](/guides/nextjs-server-actions).
