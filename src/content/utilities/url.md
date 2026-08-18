---
title: URL Utils — rutas y query params
description: Construir URLs, agregar parámetros, normalizar paths y evitar concatenaciones frágiles con strings.
category: general
order: 10
tags: [typescript, url, browser, backend]
runtime: universal
language: typescript
related:
  - utilities/string
updatedAt: 2026-08-18
---

Usa `URL` y `URLSearchParams` como primitivas; estas utilidades solo encapsulan patrones repetidos.

## Agregar query params

```ts title="lib/url.ts"
type QueryValue = string | number | boolean | null | undefined;

export function withQuery(input: string | URL, query: Record<string, QueryValue>) {
  const url = new URL(input, typeof window === 'undefined' ? 'http://local' : window.location.origin);
  for (const [key, value] of Object.entries(query)) {
    if (value === null || value === undefined || value === '') url.searchParams.delete(key);
    else url.searchParams.set(key, String(value));
  }
  return input instanceof URL || /^https?:\/\//.test(String(input))
    ? url.toString()
    : `${url.pathname}${url.search}${url.hash}`;
}
```

```ts
withQuery('/productos', { page: 2, search: 'café', draft: false });
// /productos?page=2&search=caf%C3%A9&draft=false
```

## Unir paths

```ts
export function joinUrlPath(...parts: string[]) {
  return parts
    .filter(Boolean)
    .map((part, index) => index === 0 ? part.replace(/\/$/, '') : part.replace(/^\/+|\/+$/g, ''))
    .join('/');
}
```

No uses `path.join()` de Node para URLs: en Windows puede producir backslashes. Para URLs absolutas, `new URL(relative, base)` resuelve además `..`, encoding y protocolo correctamente.

## Seguridad

Antes de redirigir a un valor recibido por query param, permití solo rutas internas conocidas o una allowlist de hosts. Un `returnUrl` arbitrario crea un open redirect.
