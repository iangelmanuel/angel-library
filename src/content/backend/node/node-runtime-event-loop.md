---
title: Runtime, event loop y concurrencia
description: Cómo Node coordina callbacks, promesas, timers e I/O, qué bloquea el hilo de JavaScript y cómo detectar saturación.
type: guides
order: 4
tags: [node, event-loop, async, concurrency]
scope: event loop de Node.js
related:
  - languages/javascript/javascript-runtime-event-loop
  - backend/node/node-streams
  - backend/node/node-worker-threads
updatedAt: 2026-08-25
---

Node puede mantener muchas operaciones de red pendientes sin crear un hilo de JavaScript por request. Eso no significa que todo se ejecute en paralelo: el código JavaScript de un proceso normalmente avanza en un hilo principal, coordinado por el **event loop**.

## Modelo mental

```text
código JavaScript
  → solicita timer, archivo, DNS o red
  → el runtime coordina la espera
  → la operación queda lista
  → su callback/promesa vuelve a una cola
  → JavaScript la ejecuta cuando el hilo está disponible
```

**Concurrencia** significa progresar varias tareas durante el mismo periodo. **Paralelismo** significa ejecutar trabajo al mismo tiempo en varios núcleos o procesos. Node ofrece concurrencia de I/O en un proceso; para CPU paralela se usan workers o procesos.

## Microtareas y timers

```js
console.log('A');

setTimeout(() => console.log('timer'), 0);
Promise.resolve().then(() => console.log('promise'));
queueMicrotask(() => console.log('microtask'));

console.log('B');
```

```text
A
B
promise
microtask
timer
```

El código síncrono termina primero. Las callbacks de promesas y `queueMicrotask` son microtareas; se drenan antes de avanzar a la fase donde el timer puede ejecutarse. Un timeout de `0` significa “cuando corresponda, no antes de este mínimo”, no ejecución inmediata.

Node también tiene `process.nextTick()`. Su cola se atiende con prioridad especial y abusar de ella puede impedir que el loop llegue a I/O. Para código general, una promesa o `queueMicrotask` suele expresar mejor la intención.

## Qué bloquea

```js
app.get('/report', (_req, res) => {
  const result = calcularDuranteDosSegundos();
  res.json(result);
});
```

Mientras `calcularDuranteDosSegundos()` ocupa JavaScript, ese proceso no puede ejecutar handlers de otras requests. También bloquean una expresión regular catastrófica, `JSON.parse()` de entradas enormes y variantes síncronas de filesystem usadas en una ruta.

`await` no vuelve una operación mágicamente no bloqueante. Solo cede el control si la promesa espera trabajo asíncrono; envolver CPU síncrona en una función `async` sigue bloqueando.

## Pool interno y límites

Parte del filesystem, DNS, compresión y criptografía utiliza un pool de hilos administrado por libuv. Saturarlo aumenta la latencia aunque el hilo de JavaScript parezca libre. La solución suele ser limitar concurrencia y medir, no aumentar el pool sin conocer la carga.

## Elegir una estrategia

| Trabajo | Estrategia habitual |
| --- | --- |
| HTTP, base de datos, archivos | API asíncrona y límites de concurrencia |
| transformar imagen o calcular CPU | `worker_threads` o servicio especializado |
| ejecutar un programa externo | `child_process` |
| trabajo lento que no debe retener HTTP | cola + worker de aplicación |
| archivo grande | stream con backpressure |

## Observar el loop

Latencia alta con CPU alta, pero sin aumento equivalente de I/O, puede indicar bloqueo. Mide duración de handlers, utilización y retraso del event loop. Una prueba de carga pequeña suele revelar endpoints que aceptan una request pero congelan las demás.

## Regla práctica

Mantén corto el trabajo síncrono por turno. Usa APIs asíncronas para esperar, streams para no acumular datos y workers para CPU. La meta no es evitar todo cálculo, sino impedir que una tarea monopolice el proceso.
