---
title: Worker threads y trabajo de CPU
description: Ejecutar cálculos en paralelo sin bloquear el event loop, comunicar mensajes y diseñar un pool reutilizable.
type: guides
order: 14
tags: [node, worker-threads, cpu, concurrency]
scope: node:worker_threads
related:
  - backend/node/node-runtime-event-loop
  - backend/node/node-child-process
  - backend/backend-fundamentos/backend-colas-jobs
updatedAt: 2026-08-25
---

`worker_threads` ejecuta JavaScript en otros hilos dentro del mismo proceso. Es útil para CPU: compresión, parsing costoso, cálculos o transformaciones que bloquearían el event loop. No mejora una consulta HTTP o de base de datos que ya es asíncrona.

## Worker mínimo

```js title="worker.js"
import { parentPort, workerData } from 'node:worker_threads';

function fibonacci(n) {
  return n < 2 ? n : fibonacci(n - 1) + fibonacci(n - 2);
}

parentPort.postMessage({ result: fibonacci(workerData.n) });
```

```js title="main.js"
import { Worker } from 'node:worker_threads';

function runWorker(n) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker.js', import.meta.url), {
      workerData: { n },
    });

    worker.once('message', resolve);
    worker.once('error', reject);
    worker.once('exit', (code) => {
      if (code !== 0) reject(new Error(`Worker terminó con código ${code}`));
    });
  });
}
```

`workerData` se clona al crear el worker. Los mensajes usan clonación estructurada; para datos binarios grandes se puede transferir un `ArrayBuffer` o compartir memoria con `SharedArrayBuffer`, lo que requiere sincronización cuidadosa.

## No crear uno por cada operación

Iniciar un worker tiene costo. En un servidor, crea un **pool** con una cantidad cercana a la capacidad de CPU y asigna tareas. Una cola ilimitada delante del pool sigue siendo un riesgo: aplica tamaño máximo, timeout y cancelación.

## Worker thread, child process o job queue

| Herramienta | Aislamiento | Uso principal |
| --- | --- | --- |
| `worker_threads` | mismo proceso, memoria compartible | CPU paralela en JavaScript |
| `child_process` | proceso separado | programa externo o aislamiento mayor |
| cola de jobs | puede vivir en otra máquina | trabajo durable, reintentos y desacoplamiento HTTP |

Un worker thread no hace durable una tarea: si el proceso termina, se pierde. Para generar un reporte que debe completarse aunque se reinicie el servidor, usa una cola persistente y permite que su consumidor utilice workers internamente.

## Seguridad y operación

Valida el tamaño del input antes de enviarlo, limita duración y registra el identificador de la tarea. Un worker que falla no debería dejar una promesa sin resolver. Durante shutdown deja de aceptar trabajo, espera un periodo limitado y termina los workers restantes.

