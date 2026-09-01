---
title: Storage Utils — Referencia rápida
description: Wrapper tipado sobre localStorage/sessionStorage con parseo JSON seguro y detección de disponibilidad.
type: utilities
runtime: browser
language: typescript
related: []
updatedAt: 2026-08-15
---

Utilidades mínimas sobre `localStorage`/`sessionStorage`. Importa siempre desde `@/libs/storage`.

`Storage` guarda solo strings: estas funciones agregan `JSON.parse`/`JSON.stringify` con manejo de errores, para no repetir el mismo `try/catch` cada vez que lees o escribes algo.

## Disponibilidad

### `isStorageAvailable()` — Detectar si se puede usar

Comprueba si el almacenamiento indicado está disponible escribiendo y borrando una clave de prueba. `localStorage` puede lanzar un error en Safari con navegación privada (cuota 0) o no existir en un contexto sin `window`, como el código del servidor. Llama a esta función antes de depender del almacenamiento para algo crítico.

```ts title="lib/storage.ts"
export function isStorageAvailable(storage: Storage): boolean {
  try {
    const testKey = "__storage_test__"
    storage.setItem(testKey, "1")
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
```

```ts
import { isStorageAvailable } from "@/libs/storage"

if (isStorageAvailable(localStorage)) {
  // guardar preferencias del usuario
}
```

## Leer y escribir

### `getStorageItem()` — Leer con fallback tipado

Lee una clave, la parsea como JSON y la tipa según el genérico `T`. Si la clave no existe o el valor guardado no es JSON válido, retorna `fallback` en vez de lanzar. El tercer argumento permite elegir `sessionStorage` en vez de `localStorage`.

```ts title="lib/storage.ts"
export function getStorageItem<T>(
  key: string,
  fallback: T,
  storage: Storage = localStorage
): T {
  try {
    const raw = storage.getItem(key)
    return raw === null ? fallback : (JSON.parse(raw) as T)
  } catch {
    return fallback
  }
}
```

```ts
import { getStorageItem } from "@/libs/storage"

interface Preferencias {
  tema: "claro" | "oscuro"
}

const prefs = getStorageItem<Preferencias>("preferencias", { tema: "oscuro" })
```

### `setStorageItem()` — Guardar serializado

Serializa el valor con `JSON.stringify` y lo guarda. Si falla (cuota excedida, storage no disponible), no lanza: falla en silencio, ya que guardar una preferencia nunca debería romper el flujo principal de la página.

```ts title="lib/storage.ts"
export function setStorageItem<T>(
  key: string,
  value: T,
  storage: Storage = localStorage
): void {
  try {
    storage.setItem(key, JSON.stringify(value))
  } catch {}
}
```

```ts
import { setStorageItem } from "@/libs/storage"

setStorageItem("preferencias", { tema: "claro" })
```

### `removeStorageItem()` — Eliminar una clave

Elimina una clave del storage indicado. Es un alias directo de `storage.removeItem()`, incluido para no mezclar imports de `@/libs/storage` con llamadas directas a la API nativa.

```ts title="lib/storage.ts"
export function removeStorageItem(
  key: string,
  storage: Storage = localStorage
): void {
  storage.removeItem(key)
}
```

```ts
import { removeStorageItem } from "@/libs/storage"

removeStorageItem("preferencias")
```

## Resumen

| Función                | Qué hace                                      |
| ---------------------- | --------------------------------------------- |
| `isStorageAvailable()` | Detectar si el storage se puede usar          |
| `getStorageItem()`     | Leer y parsear una clave, con fallback tipado |
| `setStorageItem()`     | Serializar y guardar un valor                 |
| `removeStorageItem()`  | Eliminar una clave                            |

## Consideraciones

- Estas funciones son para `localStorage`/`sessionStorage`, no para cookies: no viajan al servidor y no sirven para datos que el backend necesite leer.
- No guardes nada sensible (tokens, contraseñas): cualquier script en la página puede leer `localStorage`.
- En componentes React que se hidratan en el cliente, lee el storage dentro de `useEffect`, nunca durante el render inicial — en SSR/build no existe `window`.
