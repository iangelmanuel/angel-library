---
title: Runtime de JavaScript y event loop
description: Entender call stack, microtasks, tasks, renderizado y por qué una operación asíncrona puede bloquear la interfaz.
category: languages
stack: javascript
order: 20
tags: [javascript, event-loop, async, browser]
scope: fundamentos del runtime
related:
  - technologies/javascript
  - guides/javascript-async-promises
  - utilities/promise
updatedAt: 2026-08-25
---

## Para recordar

JavaScript ejecuta cada agente mediante una pila. Cuando una operación del runtime termina, programa trabajo futuro. Al vaciarse la pila se procesan todas las microtasks pendientes; después el runtime puede renderizar y tomar otra task. Una función `async` también bloquea mientras ejecuta trabajo síncrono.

## Piezas del runtime

- **Call stack:** ejecuta funciones síncronas hasta vaciarse.
- **Web/Node APIs:** realizan timers, red, archivos u otras operaciones fuera de la pila.
- **Cola de microtasks:** continuaciones de Promises y `queueMicrotask`; se vacía antes de la siguiente task.
- **Cola de tasks:** eventos, timers y mensajes.
- **Render:** el navegador pinta entre tareas cuando la pila y las microtasks lo permiten.

| Origen | Cola o lugar | Ejemplos | Prioridad práctica |
| --- | --- | --- | --- |
| código síncrono | call stack | llamadas normales | termina primero |
| microtasks | cola de microtasks | `then`, `await`, `queueMicrotask` | se vacían antes de la siguiente task |
| tasks | cola de tasks | timers, eventos, mensajes | una nueva vuelta del event loop |
| render del navegador | oportunidad de render | layout, paint, `requestAnimationFrame` | entre tareas cuando es posible |

```js
console.log('A')
setTimeout(() => console.log('task'), 0)
Promise.resolve().then(() => console.log('microtask'))
console.log('B')

// A, B, microtask, task
```

La salida aparece en este orden:

```text
A
B
microtask
task
```

`setTimeout(..., 0)` significa “no antes de cero milisegundos”, no “ahora”. Primero termina el código actual y se vacían las microtasks.

## Bloqueo y tareas largas

Una función síncrona de 300 ms bloquea la entrada del usuario y la pintura aunque haya sido iniciada dentro de una función `async`. Para trabajo grande:

- dividirlo en lotes y ceder control;
- mover CPU intensiva a Web Workers o worker threads;
- paginar o virtualizar colecciones grandes;
- evitar cadenas ilimitadas de microtasks.

## Concurrencia y secuencia

```js
// Independientes: inician juntas
const [user, posts] = await Promise.all([getUser(), getPosts()])

// Dependientes: la segunda necesita la primera
const user = await getUser()
const posts = await getPosts(user.id)
```

Usa `AbortController` para cancelar trabajo que dejó de ser relevante. Cancelar la espera en UI no garantiza que el servidor detenga la operación: ambos lados necesitan límites y timeouts.

### Qué hace realmente `await`

La expresión anterior a `await` se evalúa de inmediato. La continuación de la función se programa como microtask cuando la Promise termina.

```js
async function example() {
  console.log('B')
  await null
  console.log('D')
}

console.log('A')
example()
console.log('C')

// A, B, C, D
```

`await null` normaliza el valor a una Promise ya cumplida, pero la continuación `D` no ocurre dentro de la pila actual. Esta frontera explica por qué un `try/catch` debe envolver el `await` y por qué una actualización posterior puede observar estado diferente.

## `queueMicrotask`, timers y animación

| API | Devuelve | Ejecuta aproximadamente | Caso de uso |
| --- | --- | --- | --- |
| `queueMicrotask(callback)` | `undefined` | al terminar el stack, antes de otra task | finalizar un estado síncrono |
| `setTimeout(callback, delay)` | id del timer | en una task, no antes del retraso | espera no exacta o trabajo diferido |
| `requestAnimationFrame(callback)` | id numérico | antes de una pintura | animación y escritura visual |
| `requestIdleCallback(callback)` | id numérico | cuando hay tiempo libre; compatibilidad limitada | trabajo opcional de baja prioridad |

```js
console.log('inicio')

queueMicrotask(() => console.log('microtask'))
requestAnimationFrame(() => console.log('frame'))
setTimeout(() => console.log('timer'), 0)

console.log('fin')

// Siempre primero: 'inicio', 'fin', 'microtask'.
// El orden relativo de frame y timer depende de la oportunidad de render.
```

No encadenes microtasks sin límite: el navegador debe vaciarlas antes de avanzar y podrías retrasar eventos y renderizado.

## Caso de uso: ceder entre lotes

```js
async function processInBatches(items, batchSize = 100) {
  for (let start = 0; start < items.length; start += batchSize) {
    const batch = items.slice(start, start + batchSize)
    for (const item of batch) processItem(item)

    // Cede a una task para permitir input y render entre lotes.
    await new Promise(resolve => setTimeout(resolve, 0))
  }
}

await processInBatches(largeList)
// todos los elementos procesados sin una única tarea síncrona enorme
```

Esto mejora la capacidad de respuesta, pero no reduce el costo total de CPU. Para cálculos pesados que no necesitan DOM, un Web Worker evita competir con el hilo principal.
