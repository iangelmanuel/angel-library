---
title: Errores, promesas y cancelación
description: Propagar fallos asíncronos, evitar promesas huérfanas, cancelar operaciones y distinguir errores operativos de bugs.
type: guides
order: 5
tags: [node, errors, promises, abortcontroller]
scope: errores asíncronos en Node.js
related:
  - backend/node/node-runtime-event-loop
  - backend/node/node-process
  - backend/express/express-error-handling
updatedAt: 2026-08-25
---

Un error útil conserva contexto, llega a una frontera capaz de decidir y produce una respuesta o cierre controlado. Capturar todo y continuar puede dejar datos inconsistentes; no capturar nada puede terminar el proceso sin liberar recursos.

## Propagación con `async`/`await`

```ts
async function loadUser(id: string) {
  const response = await fetch(`https://example.test/users/${id}`)
  if (!response.ok)
    throw new HttpError(response.status, "No se pudo cargar el usuario")
  return response.json()
}

try {
  const user = await loadUser("42")
  console.log(user)
} catch (error) {
  console.error("Falló el caso de uso", { cause: error })
}
```

Una función `async` siempre devuelve una promesa. Un `throw` dentro de ella la rechaza. El `try/catch` solo cubre promesas que se esperan con `await` dentro de su bloque.

```ts
try {
  startJob() // promesa no esperada: este catch no ve su rechazo
} catch {}

await startJob() // el rechazo sí se propaga
```

Una promesa iniciada sin `await`, `return` o `.catch()` queda **huérfana**: quien llamó no puede saber cuándo terminó ni qué falló.

## Conservar la causa

```ts
try {
  await repository.save(input)
} catch (cause) {
  throw new Error("No se pudo guardar el perfil", { cause })
}
```

El mensaje superior expresa el contexto de negocio y `cause` conserva el fallo original. Evita registrar el mismo error en cada capa; normalmente se registra una vez en la frontera HTTP, worker o CLI con un identificador de correlación.

## Cancelación cooperativa

```ts
async function search(query: string, signal: AbortSignal) {
  return fetch(`https://example.test/search?q=${encodeURIComponent(query)}`, {
    signal
  })
}

const controller = new AbortController()
setTimeout(() => controller.abort(new Error("Tiempo agotado")), 2_000)

await search("node", controller.signal)
```

`AbortController` no detiene código arbitrario. La función receptora debe observar la señal o pasarla a una API compatible. Propaga el mismo `signal` por todas las capas para cancelar el árbol completo de trabajo cuando el cliente se desconecta o vence el presupuesto.

## Errores operativos y de programación

| Tipo                   | Ejemplo                                    | Respuesta                                        |
| ---------------------- | ------------------------------------------ | ------------------------------------------------ |
| operativo esperado     | archivo ausente, timeout, entrada inválida | manejar, mapear y quizá reintentar               |
| bug o estado imposible | acceso a `undefined`, invariante rota      | registrar, fallar la operación y corregir código |

No uses `uncaughtException` para “seguir como si nada”. Después de una excepción no capturada, el estado del proceso puede ser desconocido. El patrón seguro es registrar, dejar de aceptar trabajo, cerrar recursos y permitir que el supervisor reinicie.

## Combinadores de promesas

- `Promise.all`: falla al primer rechazo y sirve cuando todas son obligatorias.
- `Promise.allSettled`: espera todos los resultados y conserva éxitos y fallos.
- `Promise.race`: resuelve o rechaza con la primera que termine; las demás no se cancelan automáticamente.
- `Promise.any`: devuelve el primer éxito y rechaza si todas fallan.

Para concurrencia masiva no crees miles de promesas con `Promise.all`; procesa por lotes o con un limitador.

## Fronteras finales

Un servidor transforma errores conocidos en respuestas estables. Un worker decide reintento o DLQ. Una CLI imprime un mensaje y establece `process.exitCode`. Cada frontera debe ocultar secretos y conservar suficiente contexto para diagnosticar.
