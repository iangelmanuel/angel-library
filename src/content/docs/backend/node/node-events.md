---
title: EventEmitter
description: El patrón pub/sub nativo de Node — emitir eventos custom, suscribirse, y por qué medio ecosistema de Node está construido sobre esto.
type: guides
order: 12
tags: [node, events, eventemitter]
scope: node:events
updatedAt: 2026-08-16
---

`EventEmitter` es el mecanismo nativo de Node para el patrón publish/subscribe: un objeto "emite" eventos con nombre, y cualquier cantidad de listeners puede suscribirse a ellos. Streams, `req`/`res` en HTTP, procesos hijos — gran parte del ecosistema nativo de Node está construido encima de esta misma clase.

## Uso básico

```ts
import { EventEmitter } from "node:events"

const emitter = new EventEmitter()

emitter.on("usuario-creado", (usuario) => {
  console.log("Nuevo usuario:", usuario.email)
})

emitter.on("usuario-creado", (usuario) => {
  // un segundo listener, independiente del primero
  enviarEmailDeBienvenida(usuario)
})

emitter.emit("usuario-creado", { email: "a@b.com" })
// dispara AMBOS listeners, en el orden en que se registraron
```

`.emit()` es síncrono — todos los listeners corren antes de que `.emit()` devuelva el control, en el mismo orden en que se registraron con `.on()`.

## Escuchar una sola vez

```ts
emitter.once("primera-conexion", () => {
  console.log("Solo se ejecuta la primera vez que se emite este evento")
})
```

## Sacar un listener

```ts
function handler(data: unknown) {
  console.log(data)
}

emitter.on("evento", handler)
emitter.off("evento", handler) // necesita la MISMA referencia de función
```

Una función anónima (`emitter.on('x', () => {...})`) no se puede sacar después con `.off()`, porque cada vez que se escribe una arrow function es una referencia distinta — hace falta guardarla en una variable primero.

## Crear una clase propia que emite eventos

El patrón real en código de aplicación casi siempre es **extender** `EventEmitter`, no instanciarlo suelto:

```ts
class ColaDeTrabajos extends EventEmitter {
  agregar(trabajo: string) {
    // ... lógica ...
    this.emit("trabajo-agregado", trabajo)
  }

  completar(trabajo: string) {
    // ... lógica ...
    this.emit("trabajo-completado", trabajo)
  }
}

const cola = new ColaDeTrabajos()
cola.on("trabajo-completado", (trabajo) => console.log(`Listo: ${trabajo}`))
cola.agregar("procesar imagen")
```

## Manejo de errores: el evento `'error'` es especial

```ts
emitter.on("error", (err) => {
  console.error("Algo falló:", err)
})

emitter.emit("error", new Error("falló algo"))
```

Si se emite `'error'` y **no hay ningún listener** suscrito a ese evento puntual, Node **lanza la excepción y tira el proceso** — a diferencia de cualquier otro nombre de evento, que simplemente no hace nada si nadie escucha. Cualquier `EventEmitter` que pueda emitir errores necesita un listener de `'error'`, siempre.

## Mapa de EventEmitter

| API                             | Qué hace                                                 |
| ------------------------------- | -------------------------------------------------------- |
| `emitter.on(evento, fn)`        | Suscribirse, se ejecuta cada vez que se emite            |
| `emitter.once(evento, fn)`      | Se ejecuta solo la primera vez                           |
| `emitter.off(evento, fn)`       | Des-suscribirse (necesita la misma referencia)           |
| `emitter.emit(evento, ...args)` | Dispara el evento, síncrono, en orden de registro        |
| Evento `'error'` sin listener   | Tira el proceso — caso especial, siempre necesita manejo |

## Ciclo de vida de los listeners

- `EventEmitter` es para comunicación **dentro del mismo proceso** — no es un sistema de mensajería entre procesos o servidores (para eso hace falta algo como Redis pub/sub, una cola real, etc.).
- Node emite un warning (`MaxListenersExceededWarning`) si un mismo evento acumula más de 10 listeners — casi siempre señal de un listener que se agrega repetidas veces sin sacarse (un leak), no un límite real a subir sin pensar.
