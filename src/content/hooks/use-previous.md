---
title: usePrevious
description: Conservar el valor del render anterior para comparar transiciones, depurar cambios o animar diferencias.
category: frontend
stack: react
order: 29
tags: [react, hooks, state, typescript]
framework: React
language: typescript
parameters: [value]
returns: valor del render anterior o undefined
updatedAt: 2026-08-18
---

```ts title="hooks/usePrevious.ts"
import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);
  useEffect(() => { ref.current = value; }, [value]);
  return ref.current;
}
```

```tsx
const previousStatus = usePrevious(status);

useEffect(() => {
  if (previousStatus === 'saving' && status === 'saved') mostrarConfirmacion();
}, [previousStatus, status]);
```

El primer render devuelve `undefined`. El ref se actualiza después del commit, por eso durante el siguiente render todavía contiene el valor anterior.

No lo uses para duplicar estado derivado. Si solo necesitas calcular algo desde el valor actual, hazlo durante render; `usePrevious` tiene sentido cuando importa la **transición entre dos renders**.
