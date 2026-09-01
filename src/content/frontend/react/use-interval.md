---
title: useInterval
description: Intervalo declarativo con callback actualizado, pausa mediante null y cleanup automático al desmontar.
type: hooks
order: 8
tags: [react, hooks, timers, polling]
framework: React
language: typescript
parameters: [callback, delayMs]
returns: void
related:
  - frontend/react/use-timeout
updatedAt: 2026-08-25
---

`useInterval` repite una intención mientras el componente permanece montado. La implementación separa la identidad del callback de la frecuencia para no destruir y recrear el intervalo en cada render.

## Implementación

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

El ref siempre apunta al callback reciente, por lo que el intervalo no captura para siempre props o estado antiguos. `delayMs = null` pausa el comportamiento y el cleanup elimina el registro anterior al desmontar o cambiar la frecuencia.

## Caso de uso

```tsx
useInterval(() => setSeconds((value) => value + 1), paused ? null : 1000);
```

La actualización funcional evita cerrar sobre un valor antiguo de `seconds`. Para un cronómetro real, no sumes uno suponiendo precisión: conserva una marca de tiempo inicial y calcula la diferencia con `performance.now()` o `Date.now()`.

## Polling async

`setInterval` no espera una promesa. Si la operación tarda más que el intervalo, las llamadas se superponen. Para consultas periódicas de red, encadena un `setTimeout` al terminar cada solicitud o usa una librería de estado remoto con `refetchInterval`.

Pausa las consultas periódicas cuando la pestaña está oculta si el dato no necesita actualizarse en segundo plano, y evita intervalos para sincronización exacta: el navegador puede retrasarlos por ahorro de energía.

## Cuándo elegir otra herramienta

| Necesidad | Alternativa |
| --- | --- |
| ejecutar una sola vez | `useTimeout` |
| esperar inactividad al escribir | `useDebounce` |
| refrescar datos remotos | TanStack Query/SWR con política de refetch |
| animar cada frame | `requestAnimationFrame` |
| ejecutar aunque la página esté cerrada | tarea del servidor, no un hook |

Un intervalo cliente no garantiza ejecución en segundo plano ni entrega. No lo uses para facturación, expiraciones de seguridad o trabajos que deban ocurrir aunque la persona cierre la pestaña.
