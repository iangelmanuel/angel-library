---
title: useTimeout
description: Ejecutar un callback una vez después de un tiempo, conservando siempre la versión más reciente y limpiando al desmontar.
type: hooks
order: 7
tags: [react, hooks, timers, typescript]
framework: React
language: typescript
parameters: [callback, delayMs]
returns: función para cancelar el timeout
related:
  - frontend/react/use-interval
  - frontend/react/use-debounce
updatedAt: 2026-08-25
---

`useTimeout` modela un temporizador de una sola ejecución como parte del ciclo de vida del componente. Se programa al montar o cambiar el retraso, y se cancela al desmontar para evitar actualizaciones tardías.

## Implementación

```ts title="hooks/useTimeout.ts"
import { useCallback, useEffect, useRef } from "react"

export function useTimeout(callback: () => void, delayMs: number | null) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }, [])

  useEffect(() => {
    if (delayMs === null) return
    timeoutRef.current = window.setTimeout(() => callbackRef.current(), delayMs)
    return cancel
  }, [delayMs, cancel])

  return cancel
}
```

El callback se conserva en un ref. Así puede usar props y estado recientes sin reiniciar el reloj cada vez que cambia la identidad de una función inline. El retraso sí es una dependencia: cambiarlo cancela el timeout anterior y programa uno nuevo.

## Caso de uso

```tsx
const cancel = useTimeout(() => setVisible(false), 3000);
return <button onClick={cancel}>Mantener visible</button>;
```

`null` significa pausado. El callback vive en un ref para que cambiar una función inline no reinicie el reloj; cambiar `delayMs` sí lo reinicia deliberadamente.

## Semántica de la API

| Entrada             | Significado                                 |
| ------------------- | ------------------------------------------- |
| `callback`          | función más reciente que se ejecutará       |
| número en `delayMs` | milisegundos mínimos antes de ejecutar      |
| `null`              | no programar el temporizador                |
| retorno `cancel`    | cancelar manualmente la ejecución pendiente |

El tiempo es mínimo, no exacto. El navegador puede retrasar timers por trabajo en el hilo principal, pestañas en segundo plano o ahorro de energía.

No uses temporizadores para esperar a que exista un elemento o para sincronizar efectos: modela esa condición como estado. Los temporizadores sirven cuando el tiempo es parte real del comportamiento.

## Casos apropiados

- cerrar un aviso después de unos segundos;
- retrasar una ayuda visual no crítica;
- implementar un límite de espera local que también cancele la operación real;
- programar una transición de UI que no dependa de precisión exacta.

En desarrollo con Strict Mode, React monta, limpia y vuelve a montar efectos para detectar fugas. La función de cleanup garantiza que no queden dos temporizadores activos.
