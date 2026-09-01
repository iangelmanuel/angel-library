---
title: useDebounce
description: Retrasar un valor hasta que deje de cambiar, útil para búsquedas, filtros y validaciones costosas sin dispararlas en cada tecla.
type: hooks
order: 5
tags: [react, hooks, debounce, performance]
framework: React
language: typescript
parameters: [value, delayMs]
returns: valor estabilizado después del delay
related:
  - frontend/react/use-timeout
updatedAt: 2026-08-25
---

**Debounce** espera un periodo sin cambios antes de publicar el último valor. Reduce operaciones repetidas durante una ráfaga, como búsquedas mientras se escribe. Se diferencia de **throttle**, que permite como máximo una ejecución por intervalo aunque los eventos continúen.

## Modelo rápido

```text
entrada:   a -- ab -- abc --------
debounce:                  abc ----
```

Cada cambio cancela el timeout anterior. Solo el último valor sobrevive cuando transcurre `delayMs` sin otra actualización.

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

## Búsqueda con cancelación

```tsx
useEffect(() => {
  if (!debouncedQuery.trim()) return;

  const controller = new AbortController();

  fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`, {
    signal: controller.signal,
  })
    .then((response) => response.json())
    .then(setResults)
    .catch((error) => {
      if (error.name !== 'AbortError') setError('No se pudo buscar');
    });

  return () => controller.abort();
}, [debouncedQuery]);
```

Debounce reduce el número de solicitudes. `AbortController` resuelve otro problema: evita que una solicitud anterior continúe o que su respuesta obsoleta gane la carrera.

## Límites y decisiones

- Cancela también el `fetch` anterior con `AbortController`; debounce reduce solicitudes, pero no evita por sí solo que una respuesta vieja llegue después de una nueva.
- No lo uses para eventos que deben sentirse instantáneos, como click, foco o validación HTML básica.
- En SSR, el primer valor es el mismo en servidor y cliente, por lo que no introduce mismatch de hidratación.
- Comunica el estado de carga y conserva resultados previos cuando reemplazarlos por un vacío genere parpadeo.
- Para postergar un render costoso sin esperar un tiempo fijo, compara este patrón con `useDeferredValue`.
