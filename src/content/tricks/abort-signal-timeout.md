---
title: Timeout y combinación de AbortSignal
description: Cancelar fetch por timeout y combinar la cancelación del usuario con un límite de tiempo sin administrar timers a mano.
category: general
stack: javascript
tags: [javascript, fetch, abort-controller, timeout]
problem: Una petición debe cancelarse por timeout, navegación o acción explícita sin dejar trabajo colgado.
related:
  - utilities/fetch
  - utilities/promise
updatedAt: 2026-08-18
---

Los runtimes modernos incluyen `AbortSignal.timeout()` y `AbortSignal.any()`.

```ts
const controller = new AbortController();
const signal = AbortSignal.any([
  controller.signal,
  AbortSignal.timeout(8000),
]);

try {
  const response = await fetch('/api/reporte', { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
} catch (error) {
  if (error instanceof DOMException && error.name === 'AbortError') {
    console.log('Petición cancelada');
  } else {
    throw error;
  }
}

// Cancelación explícita, por ejemplo al cerrar un modal:
controller.abort();
```

`AbortSignal.any()` pierde la distinción automática entre las causas si solo mirás `AbortError`; guarda el contexto o inspeccioná `signal.reason` cuando el mensaje al usuario deba diferenciar timeout de cancelación manual.
