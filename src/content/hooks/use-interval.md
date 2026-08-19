---
title: useInterval
description: Intervalo declarativo con callback actualizado, pausa mediante null y cleanup automático al desmontar.
category: frontend
stack: react
order: 28
tags: [react, hooks, timers, polling]
framework: React
language: typescript
parameters: [callback, delayMs]
returns: void
related:
  - hooks/use-timeout
updatedAt: 2026-08-18
---

```ts title="hooks/useInterval.ts"
import { useEffect, useRef } from 'react';

export function useInterval(callback: () => void, delayMs: number | null): void {
  const callbackRef = useRef(callback);

  useEffect(() => { callbackRef.current = callback; }, [callback]);

  useEffect(() => {
    if (delayMs === null) return;
    const id = window.setInterval(() => callbackRef.current(), delayMs);
    return () => window.clearInterval(id);
  }, [delayMs]);
}
```

```tsx
useInterval(() => setSeconds((value) => value + 1), paused ? null : 1000);
```

## Polling async

`setInterval` no espera una promesa. Si la operación tarda más que el intervalo, las llamadas se superponen. Para consultas periódicas de red, encadena un `setTimeout` al terminar cada solicitud o usa una librería de estado remoto con `refetchInterval`.

Pausa las consultas periódicas cuando la pestaña está oculta si el dato no necesita actualizarse en segundo plano, y evita intervalos para sincronización exacta: el navegador puede retrasarlos por ahorro de energía.
