---
title: nuqs
description: useQueryState — estado de React guardado en los query params de la URL, tipado, con parsers, valores por defecto y control del historial.
tags: [react, nextjs, typescript, url, estado]
sidebar:
  order: 1
draft: false
resourceCategory: Documentación del paquete
website: https://nuqs.dev
github: https://github.com/47ng/nuqs
technologies: [packages/react-tanstack-table/tanstack-table]
note: "nuqs 2 pide Next.js 14.2 o superior (app y pages), React 18.3/19, React Router v6–v8, Remix v2 o TanStack Router v1. Con Next.js anterior hay que usar nuqs 1."
updatedAt: 2026-09-14
---

Un filtro, una pestaña activa o una página de tabla guardados en `useState` se pierden al recargar y no se pueden compartir: el enlace que mandas no muestra lo que tú estabas viendo. nuqs mueve ese estado a la **URL** con una API que se usa igual que `useState`, pero tipada y con la serialización resuelta.

Versión actual 2.10.1. Soporta Next.js ≥14.2 (app y pages router), React SPA 18.3/19, React Router v6/v7/v8, Remix v2 y TanStack Router v1.

## Instalación

```bash
pnpm add nuqs
```

## El adaptador

nuqs necesita saber cómo navega tu aplicación. Se envuelve la app una sola vez con el adaptador correspondiente:

```tsx title="app/layout.tsx"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
```

Los imports cambian según el entorno: `nuqs/adapters/next/app`, `nuqs/adapters/next/pages`, `nuqs/adapters/react`, `nuqs/adapters/react-router/v7`, `nuqs/adapters/remix` o `nuqs/adapters/tanstack-router`. Olvidar el adaptador da un error explícito al primer hook.

## Un valor en la URL

```tsx
"use client"

import { useQueryState } from "nuqs"

function Buscador() {
  const [busqueda, setBusqueda] = useQueryState("q", { defaultValue: "" })

  return (
    <input
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value || null)}
      placeholder="Buscar"
    />
  )
}
```

La firma es la de `useState`. Dos detalles propios:

- Con `defaultValue`, el valor nunca es `null` y el tipo se estrecha a `string`.
- Asignar `null` **borra el parámetro** de la URL en vez de escribir `?q=`. Es lo que mantiene los enlaces limpios.

## Parsers: el tipo lo pone la URL

Una URL solo guarda texto. Los parsers convierten en las dos direcciones y dan el tipo de TypeScript:

```tsx
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState
} from "nuqs"

const [pagina, setPagina] = useQueryState(
  "pagina",
  parseAsInteger.withDefault(1)
)

const [soloActivos, setSoloActivos] = useQueryState(
  "activos",
  parseAsBoolean.withDefault(false)
)

const [orden, setOrden] = useQueryState(
  "orden",
  parseAsStringLiteral(["asc", "desc"] as const).withDefault("asc")
)

const [etiquetas, setEtiquetas] = useQueryState(
  "tags",
  parseAsArrayOf(parseAsString).withDefault([])
)
```

`parseAsStringLiteral` es el que evita el problema real de guardar estado en la URL: cualquiera puede escribir `?orden=cualquiercosa`, y ahí el parser descarta el valor inválido y devuelve el default en vez de romper la pantalla.

Hay parsers para enteros, flotantes, booleanos, fechas (`parseAsIsoDate`, `parseAsTimestamp`), literales, arrays y JSON con esquema.

## Varios parámetros a la vez

`useQueryStates` agrupa un conjunto y escribe **una sola entrada** en el historial, en lugar de una por campo:

```tsx
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

const [filtros, setFiltros] = useQueryStates({
  q: parseAsString.withDefault(""),
  pagina: parseAsInteger.withDefault(1),
  categoria: parseAsString
})

// cambiar la búsqueda reinicia la página, en una sola navegación
setFiltros({ q: "astro", pagina: 1 })
```

Ese patrón — actualizar el filtro y resetear la paginación juntos — es el motivo principal para usar `useQueryStates` en vez de varios `useQueryState`.

## Historial, scroll y transiciones

```tsx
const [pestana, setPestana] = useQueryState("tab", {
  defaultValue: "resumen",
  history: "push", // "replace" es el valor por defecto
  scroll: false,
  shallow: true, // true: no avisa al servidor
  clearOnDefault: true
})
```

| Opción            | Efecto                                                                    |
| ----------------- | ------------------------------------------------------------------------- |
| `history`         | `"replace"` no ensucia el botón atrás; `"push"` hace cada cambio navegable |
| `scroll`          | Si la navegación sube la página al inicio                                  |
| `shallow`         | `false` vuelve a ejecutar la carga de datos del servidor                    |
| `clearOnDefault`  | Quita el parámetro de la URL cuando vale su default                        |
| `throttleMs`      | Espacia las escrituras a la URL al teclear                                 |

La regla práctica: `history: "replace"` para lo que se teclea (una búsqueda no debería llenar el historial) y `"push"` para lo que el usuario entiende como cambiar de vista.

## Leer los parámetros en el servidor

Con el app router de Next.js, los mismos parsers se reutilizan para leer la URL en un componente de servidor:

```ts title="app/search/searchParams.ts"
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server"

export const searchParamsSchema = {
  q: parseAsString.withDefault(""),
  pagina: parseAsInteger.withDefault(1)
}

export const loadSearchParams = createLoader(searchParamsSchema)
```

```tsx title="app/search/page.tsx"
import { loadSearchParams } from "./searchParams"

export default async function Page({ searchParams }) {
  const { q, pagina } = await loadSearchParams(searchParams)
  const resultados = await buscar(q, pagina)
  // ...
}
```

Una sola definición de parsers para el cliente y el servidor: es lo que evita que el tipo del filtro se desincronice entre los dos lados.

## Notas

- La URL es pública: no guardes ahí datos sensibles, y recuerda que queda en el historial y en los logs del servidor.
- Un array largo o un objeto JSON en la URL la vuelve ilegible y puede topar con límites de longitud; para eso sigue siendo mejor un store.
- Con debounce en un input, usa `throttleMs` en vez de retrasar el `setState`: la URL se actualiza sin pelear con el render.
- Encaja bien con el estado controlado de [TanStack Table](/packages/react-tanstack-table/tanstack-table): orden y página dejan de perderse al recargar.
