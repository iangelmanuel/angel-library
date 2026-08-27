---
title: Clipboard Utils — Referencia rápida
description: Copiar y leer el portapapeles con detección de soporte y fallback, sin librerías.
category: general
stack: utils
runtime: browser
language: typescript
related:
  - utilities/storage
updatedAt: 2026-08-15
---

Utilidades mínimas sobre el portapapeles. Importa siempre desde `@/libs/clipboard`.

La Clipboard API async (`navigator.clipboard`) no está disponible en todos los contextos (requiere HTTPS y a veces permiso explícito), así que `copyToClipboard()` cae a un fallback con `<textarea>` + `execCommand` cuando hace falta.

## Disponibilidad

### `isClipboardSupported()` — Detectar soporte

Comprueba si `navigator.clipboard` existe. Sirve para decidir si mostrar un botón de "copiar" o si directamente usar el fallback.

```ts title="lib/clipboard.ts"
export function isClipboardSupported(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.clipboard
}
```

```ts
import { isClipboardSupported } from '@/libs/clipboard';

if (!isClipboardSupported()) {
  console.warn('Clipboard API no disponible, usando fallback');
}
```

## Copiar y leer

### `copyToClipboard()` — Copiar texto

Copia un texto al portapapeles usando la Clipboard API cuando está disponible, y cae al fallback de `<textarea>` oculto si falla o no existe. Retorna `true`/`false` en vez de lanzar, para que el llamador decida cómo mostrar el resultado sin un `try/catch`.

```ts title="lib/clipboard.ts"
export async function copyToClipboard(text: string): Promise<boolean> {
  if (isClipboardSupported()) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {}
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()

  const success = document.execCommand('copy')
  textarea.remove()
  return success
}
```

```ts
import { copyToClipboard } from '@/libs/clipboard';

const copiado = await copyToClipboard('npm install zod');
mostrarToast(copiado ? 'Copiado' : 'No se pudo copiar');
```

### `readFromClipboard()` — Leer texto

Lee el texto del portapapeles. Retorna `null` si la API no está disponible o si el usuario no dio permiso — leer el portapapeles siempre requiere permiso explícito, a diferencia de escribir.

```ts title="lib/clipboard.ts"
export async function readFromClipboard(): Promise<string | null> {
  if (!isClipboardSupported()) return null

  try {
    return await navigator.clipboard.readText()
  } catch {
    return null
  }
}
```

```ts
import { readFromClipboard } from '@/libs/clipboard';

const texto = await readFromClipboard();
if (texto) input.value = texto;
```

## Resumen

| Función | Qué hace |
| --- | --- |
| `isClipboardSupported()` | Detectar si `navigator.clipboard` existe |
| `copyToClipboard()` | Copiar texto, con fallback automático |
| `readFromClipboard()` | Leer texto del portapapeles, `null` si falla |

## Consideraciones

- El fallback con `execCommand('copy')` está deprecado pero sigue funcionando en todos los navegadores actuales — es el respaldo, no la vía principal.
- `readFromClipboard()` no tiene fallback: leer el portapapeles sin la Clipboard API no es posible por seguridad.
- Ambas funciones necesitan interacción del usuario (click, tecla) para funcionar de forma confiable — no las llames automáticamente al cargar la página.
