---
title: URL Utils — rutas y query params
description: Construir URLs, agregar parámetros, normalizar paths y evitar concatenaciones frágiles con strings.
type: utilities
order: 10
tags: [typescript, url, browser, backend]
runtime: universal
language: typescript
related:
  - general/utils/string
updatedAt: 2026-08-18
---

Usa `URL` y `URLSearchParams` como primitivas; estas utilidades solo encapsulan patrones repetidos.

## Construir URLs

### `withQuery()` — Agregar query params

Agrega o actualiza parámetros de consulta en una URL (string o `URL`) sin concatenar strings a mano. Un valor `null`, `undefined` o string vacío elimina ese parámetro en vez de agregarlo como `key=undefined`.

```ts title="lib/url.ts"
type QueryValue = string | number | boolean | null | undefined

export function withQuery(
  input: string | URL,
  query: Record<string, QueryValue>
) {
  const url = new URL(
    input,
    typeof window === "undefined" ? "http://local" : window.location.origin
  )
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === "")
      url.searchParams.delete(key)
    else url.searchParams.set(key, String(value))
  }
  return input instanceof URL || /^https?:\/\//.test(String(input))
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`
}
```

```ts
withQuery("/productos", { page: 2, search: "café", draft: false })
// /productos?page=2&search=caf%C3%A9&draft=false
```

### `joinUrlPath()` — Unir paths

Une varios segmentos de ruta en un solo path, normalizando las barras repetidas o faltantes entre segmentos.

```ts
export function joinUrlPath(...parts: string[]) {
  return parts
    .filter(Boolean)
    .map((part, index) =>
      index === 0 ? part.replace(/\/$/, "") : part.replace(/^\/+|\/+$/g, "")
    )
    .join("/")
}
```

No uses `path.join()` de Node para URLs: en Windows puede producir backslashes. Para URLs absolutas, `new URL(relative, base)` resuelve además `..`, encoding y protocolo correctamente.

## Resumen

| Función         | Qué hace                                          |
| --------------- | ------------------------------------------------- |
| `withQuery()`   | Agrega, actualiza o quita query params de una URL |
| `joinUrlPath()` | Une segmentos de path normalizando las barras     |

## Seguridad

Antes de redirigir a un valor recibido por un parámetro de consulta, permite solo rutas internas conocidas o una lista de hosts permitidos. Un `returnUrl` arbitrario crea una redirección abierta.
