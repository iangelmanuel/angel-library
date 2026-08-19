---
title: useTimeout
description: Ejecutar un callback una vez después de un tiempo, conservando siempre la versión más reciente y limpiando al desmontar.
category: frontend
stack: react
order: 27
tags: [react, hooks, timers, typescript]
framework: React
language: typescript
parameters: [callback, delayMs]
returns: función para cancelar el timeout
related:
  - hooks/use-interval
  - hooks/use-debounce
updatedAt: 2026-08-18
---

```ts title="hooks/useTimeout.ts"
import { useCallback, useEffect, useRef } from 'react';

export function useTimeout(callback: () => void, delayMs: number | null) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => { callbackRef.current = callback; }, [callback]);

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  useEffect(() => {
    if (delayMs === null) return;
    timeoutRef.current = window.setTimeout(() => callbackRef.current(), delayMs);
    return cancel;
  }, [delayMs, cancel]);

  return cancel;
}
```

```tsx
const cancel = useTimeout(() => setVisible(false), 3000);
return <button onClick={cancel}>Mantener visible</button>;
```

`null` significa pausado. El callback vive en un ref para que cambiar una función inline no reinicie el reloj; cambiar `delayMs` sí lo reinicia deliberadamente.

No uses temporizadores para esperar a que exista un elemento o para sincronizar efectos: modela esa condición como estado. Los temporizadores sirven cuando el tiempo es parte real del comportamiento.
