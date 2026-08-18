---
title: useDebounce
description: Retrasar un valor hasta que deje de cambiar, útil para búsquedas, filtros y validaciones costosas sin dispararlas en cada tecla.
category: frontend
stack: react
order: 26
tags: [react, hooks, debounce, performance]
framework: React
language: typescript
parameters: [value, delayMs]
returns: valor estabilizado después del delay
related:
  - hooks/use-timeout
updatedAt: 2026-08-18
---

## Código

```ts title="hooks/useDebounce.ts"
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
```

## Uso

```tsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 350);

useEffect(() => {
  if (debouncedQuery.trim()) buscar(debouncedQuery);
}, [debouncedQuery]);
```

Esto retrasa **el valor**, no una función. Para guardar inmediatamente pero limitar una operación, esta forma mantiene el flujo declarativo: el input usa `query`; el efecto costoso usa `debouncedQuery`.

## Consideraciones

- Cancela también el `fetch` anterior con `AbortController`; debounce reduce requests, pero no evita que una respuesta vieja llegue después directamente nueva.
- No lo uses para eventos que deben sentirse instantáneos, como click, foco o validación HTML básica.
- En SSR, el primer valor es el mismo en servidor y cliente, por lo que no introduce mismatch de hidratación.
