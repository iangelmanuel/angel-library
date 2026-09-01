---
title: Timeout y combinación de AbortSignal
description: Cancelar fetch por timeout y combinar la cancelación del usuario con un límite de tiempo sin administrar timers a mano.
type: tricks
tags: [javascript, fetch, abort-controller, timeout]
problem: Una petición debe cancelarse por timeout, navegación o acción explícita sin dejar trabajo colgado.
related:
  - languages/javascript/javascript-async-promises
  - languages/javascript/javascript-fetch-apis
  - general/utils/fetch
  - general/utils/promise
updatedAt: 2026-08-25
---

Los runtimes modernos incluyen `AbortSignal.timeout()` y `AbortSignal.any()`. La primera señal que se aborta determina el estado y el `reason` de la señal combinada.

```js
const controller = new AbortController()
const timeoutSignal = AbortSignal.timeout(8_000)
const signal = AbortSignal.any([
  controller.signal,
  timeoutSignal,
])

try {
  const response = await fetch('/api/reporte', { signal })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
} catch (error) {
  if (!signal.aborted) throw error

  if (signal.reason?.name === 'TimeoutError') {
    console.log('La petición superó el tiempo máximo')
  } else if (signal.reason?.name === 'AbortError') {
    console.log('La persona canceló la petición')
  } else {
    console.log('Petición detenida', signal.reason)
  }
}

// Cancelación explícita, por ejemplo al cerrar un modal:
controller.abort(new DOMException('Modal cerrado', 'AbortError'))
```

No compruebes únicamente el error capturado: inspecciona `signal.aborted` y `signal.reason` para diferenciar timeout, navegación y acción manual. La operación también puede fallar por red o HTTP sin que la señal se haya abortado.

Si el runtime no soporta estas funciones, crea un `AbortController`, programa un timer y límpialo en `finally`. La señal comunica cancelación; no garantiza que un servidor remoto detenga trabajo que ya comenzó.
