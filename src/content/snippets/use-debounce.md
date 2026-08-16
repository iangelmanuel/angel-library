---
title: useDebounce
description: Hook que retrasa la actualización de un valor hasta que pasa un tiempo sin cambios. Para búsquedas y llamadas costosas.
category: frontend
tags: [react, hooks, performance]
language: typescript
related: [technologies/react]
updatedAt: 2026-08-08
---

## Cuándo usarlo

- Inputs de búsqueda que llaman a una API.
- Validaciones costosas mientras se escribe.
- Cualquier efecto que no deba ejecutarse en cada tecla.

## Código

```ts title="hooks/useDebounce.ts"
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

## Uso

```tsx title="SearchInput.tsx"
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 400);

useEffect(() => {
  if (!debouncedQuery) return;
  // fetch(`/api/search?q=${debouncedQuery}`)
}, [debouncedQuery]);
```

## Consideraciones

- El cleanup del `useEffect` cancela el timer anterior: no hace falta lógica extra.
- Para cancelar la petición en vuelo, combinar con `AbortController`.
- No lo uses sobre el valor del input en sí (el input debe responder al instante); úsalo sobre el valor que dispara el efecto.
