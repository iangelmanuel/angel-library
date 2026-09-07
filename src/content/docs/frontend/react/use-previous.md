---
title: usePrevious
description: Conservar el valor del render anterior para comparar transiciones, depurar cambios o animar diferencias.
type: hooks
order: 9
tags: [react, hooks, state, typescript]
framework: React
language: typescript
parameters: [value]
returns: valor del render anterior o undefined
updatedAt: 2026-08-25
---

`usePrevious` conserva el valor observado en el commit anterior sin solicitar un render adicional. Es útil para detectar una transición —por ejemplo, de `saving` a `saved`—, no para mantener una segunda copia del estado actual.

## Implementación

```ts title="hooks/usePrevious.ts"
import { useEffect, useRef } from "react"

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
```

Durante render, `ref.current` todavía contiene el valor anterior. Después de que React confirma los cambios en el DOM, el efecto guarda el valor actual para el próximo render. Cambiar un ref no vuelve a renderizar el componente.

## Caso de uso

```tsx
const previousStatus = usePrevious(status)

useEffect(() => {
  if (previousStatus === "saving" && status === "saved") mostrarConfirmacion()
}, [previousStatus, status])
```

El primer render devuelve `undefined`. El ref se actualiza después del commit, por eso durante el siguiente render todavía contiene el valor anterior.

## Valor anterior o historial

Este hook conserva un solo valor. Para deshacer acciones, auditoría o una secuencia completa necesitas un historial explícito, normalmente un reducer o almacenamiento externo. Tampoco sirve para ejecutar lógica “antes de cambiar”: React ya está renderizando el nuevo valor cuando el hook devuelve el anterior.

No lo uses para duplicar estado derivado. Si solo necesitas calcular algo desde el valor actual, hazlo durante render; `usePrevious` tiene sentido cuando importa la **transición entre dos renders**.

## Límites

- El `undefined` inicial debe formar parte del tipo y del caso de uso.
- En Strict Mode de desarrollo pueden ocurrir renders adicionales; la lógica debe depender de commits, no de contar renders.
- Si la comparación es costosa, decide primero si realmente necesitas conservar el objeto completo o una propiedad estable.
- Para limpiar una suscripción anterior, usa directamente la función de cleanup del efecto; no necesitas `usePrevious`.
