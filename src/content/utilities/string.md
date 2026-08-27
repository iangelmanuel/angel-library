---
title: String Utils — Referencia rápida
description: Utilidades tipadas para slugs, truncado, capitalización y escape de HTML sin librerías.
category: general
stack: utils
runtime: universal
language: typescript
related: []
updatedAt: 2026-08-15
---

Utilidades mínimas para trabajar con strings. Importa siempre desde `@/libs/string`.

Nada de esto depende del DOM: funciona igual en el browser, en Node o en un endpoint de Astro.

## Formatear

### `slugify()` — Texto a slug

Convierte un texto a un slug seguro para URLs: quita acentos, pasa a minúsculas y reemplaza cualquier secuencia de caracteres que no sea letra o número por un guion, sin guiones al inicio o al final.

```ts title="lib/string.ts"
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

```ts
import { slugify } from '@/libs/string';

slugify('Referencias entre contenidos');
// "referencias-entre-contenidos"

slugify('¿Cómo usar useDebounce?');
// "como-usar-usedebounce"
```

### `truncate()` — Cortar con sufijo

Corta un texto a un largo máximo y agrega un sufijo (por defecto `…`) cuando lo recorta. El sufijo cuenta dentro del `maxLength`, así el resultado nunca supera ese largo.

```ts title="lib/string.ts"
export function truncate(text: string, maxLength: number, suffix = '…'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length).trimEnd() + suffix
}
```

```ts
import { truncate } from '@/libs/string';

truncate('Utilidades mínimas y declarativas para manipular el DOM', 20);
// "Utilidades mínimas…"
```

### `capitalize()` — Primera letra en mayúscula

Convierte a mayúscula solo la primera letra del texto, dejando el resto tal cual. No toca el resto de palabras si el texto tiene varias.

```ts title="lib/string.ts"
export function capitalize(text: string): string {
  if (!text) return text
  return text[0].toUpperCase() + text.slice(1)
}
```

```ts
import { capitalize } from '@/libs/string';

capitalize('componente de formulario');
// "Componente de formulario"
```

## Seguridad

### `escapeHtml()` — Escapar HTML

Escapa los caracteres especiales de HTML (`& < > " '`) en un texto. Úsala siempre que vayas a insertar contenido dinámico con `innerHTML` en vez de `textContent`, para evitar inyección de HTML.

```ts title="lib/string.ts"
const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}
```

```ts
import { escapeHtml } from '@/libs/string';

const seguro = escapeHtml(comentarioDelUsuario);
elemento.innerHTML = `<p>${seguro}</p>`;
```

## Generar

### `randomId()` — Id aleatorio

Genera un id corto y aleatorio a partir de `crypto.randomUUID()`, con un prefijo opcional. Útil para `id`/`aria-describedby` de elementos generados dinámicamente que necesitan un identificador único.

```ts title="lib/string.ts"
export function randomId(prefix = ''): string {
  const id = crypto.randomUUID().slice(0, 8)
  return prefix ? `${prefix}-${id}` : id
}
```

```ts
import { randomId } from '@/libs/string';

const inputId = randomId('campo');
// "campo-3f1a9c02"
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `slugify()` | Texto a slug seguro para URLs |
| `truncate()` | Cortar texto a un largo máximo con sufijo |
| `capitalize()` | Primera letra en mayúscula |
| `escapeHtml()` | Escapar caracteres especiales de HTML |
| `randomId()` | Generar un id corto aleatorio |

## Consideraciones

- `crypto.randomUUID()` requiere un contexto seguro (HTTPS o `localhost`). En producción sin HTTPS no está disponible.
- `escapeHtml()` no reemplaza sanitizar HTML de terceros (ej. Markdown renderizado): solo protege texto plano que insertas tú mismo con `innerHTML`.
- Prefiere `textContent` sobre `innerHTML` siempre que el contenido no necesite HTML real — no hace falta escapar nada.
