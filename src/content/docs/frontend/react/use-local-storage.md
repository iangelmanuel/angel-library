---
title: useLocalStorage
description: Preferencias persistentes con validación, hidratación consistente y sincronización entre componentes y pestañas.
type: hooks
order: 1
tags: [react, hooks, storage, typescript]
framework: React
language: typescript
related: [general/utils/storage, frontend/react/use-media-query]
updatedAt: 2026-09-07
---

## Cuándo usarlo

Para preferencias pequeñas como el tema o filtros. Requiere React 18 o superior. El servidor y la primera hidratación muestran `initialValue`; después se lee la preferencia guardada. Si el tema debe estar aplicado antes de pintar, resuélvelo también en la estrategia de HTML/CSS de tu aplicación.

## Código

El snapshot es el texto JSON, un valor primitivo estable. La conversión se hace fuera de `getSnapshot`: devolver allí un objeto nuevo en cada lectura provocaría renders repetidos.

```ts title="src/hooks/useLocalStorage.ts"
import { useCallback, useMemo, useSyncExternalStore } from "react"

const localChange = "app:local-storage-change"
const serverSnapshot = () => null

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T
) {
  const read = useCallback((): string | null => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  }, [key])

  const decode = useCallback((raw: string | null): T => {
    if (raw === null) return initialValue
    try {
      const parsed: unknown = JSON.parse(raw)
      return isValid(parsed) ? parsed : initialValue
    } catch {
      return initialValue
    }
  }, [initialValue, isValid])

  const subscribe = useCallback((notify: () => void) => {
    function onStorage(event: StorageEvent) {
      if (event.storageArea === window.localStorage &&
          (event.key === key || event.key === null)) notify()
    }
    window.addEventListener("storage", onStorage)
    window.addEventListener(localChange, notify)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(localChange, notify)
    }
  }, [key])

  const raw = useSyncExternalStore(subscribe, read, serverSnapshot)
  const value = useMemo(() => decode(raw), [raw, decode])

  const setValue = useCallback((next: T | ((current: T) => T)) => {
    const resolved = typeof next === "function"
      ? (next as (current: T) => T)(decode(read()))
      : next
    const serialized = JSON.stringify(resolved)
    if (serialized === undefined || !isValid(JSON.parse(serialized))) {
      throw new TypeError("El valor debe conservar su tipo al serializarse a JSON")
    }
    // Si la escritura falla, el llamador recibe el error; no fingimos persistencia.
    window.localStorage.setItem(key, serialized)
    window.dispatchEvent(new Event(localChange))
  }, [key, read, decode, isValid])

  const remove = useCallback(() => {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new Event(localChange))
  }, [key])

  return [value, setValue, remove] as const
}
```

## Uso

```tsx
import { useState } from "react"
import { useLocalStorage } from "./hooks/useLocalStorage"

type Tema = "claro" | "oscuro"
const esTema = (value: unknown): value is Tema =>
  value === "claro" || value === "oscuro"

export function PreferenciaTema() {
  const [tema, setTema, restablecer] = useLocalStorage<Tema>("tema", "claro", esTema)
  const [error, setError] = useState("")

  function guardar(action: () => void) {
    try {
      action()
      setError("")
    } catch {
      setError("No se pudo guardar la preferencia en este navegador.")
    }
  }

  return (
    <section aria-label="Preferencia de tema">
      <p>Tema: {tema}</p>
      <button onClick={() => guardar(() =>
        setTema(actual => actual === "claro" ? "oscuro" : "claro")
      )}>Cambiar tema</button>
      <button onClick={() => guardar(restablecer)}>Restablecer</button>
      <p role="status">{error}</p>
    </section>
  )
}
```

En Next.js, coloca `"use client"` en el archivo del componente que establece la frontera cliente. En Astro, hidrata el componente con una directiva como `client:load`.

## Comprobación

1. Guarda `"oscuro"` bajo la clave `tema` y recarga una página con SSR: no debe haber advertencias de hidratación.
2. Monta dos instancias del componente: cambiar una actualiza ambas. Abre otra pestaña del mismo origen y comprueba la sincronización.
3. Restablece la clave, y prueba `localStorage.clear()` desde otra pestaña: vuelve a `"claro"`.
4. Guarda JSON inválido o un número: se usa el valor inicial. Bloquea el almacenamiento: el botón muestra un error.

## Límites y decisiones

- Usa datos representables en JSON y valida también su estructura interna. Un genérico de TypeScript no valida lo que otro script escribió.
- Comparte el mismo valor inicial y validador para una misma clave. Para objetos, decláralos fuera del componente o estabiliza su identidad.
- Los cambios de esta API notifican a la misma pestaña. Una escritura directa con `localStorage.setItem` en esa pestaña debe emitir también el evento o usar esta API.
- No hay transacciones entre pestañas: dos actualizaciones simultáneas pueden sobrescribirse. El último guardado prevalece.
- La lectura fallida usa el valor inicial; la escritura fallida lanza un error. No hay respaldo en memoria ni garantía de persistencia.
- No almacenes contraseñas ni tokens de sesión aquí. El almacenamiento es síncrono y accesible a JavaScript del mismo origen.

## Recursos

- [React: useSyncExternalStore](https://react.dev/reference/react/useSyncExternalStore)
- [MDN: evento storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
