---
title: Errores, depuración y limpieza de recursos
description: Excepciones, Error, try/catch/finally, errores personalizados, causas, debugging y liberación segura de recursos.
type: guides
order: 14
tags: [javascript, errors, debugging, exceptions, resource-management]
scope: robustez del lenguaje
website: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Control_flow_and_error_handling
related:
  - languages/javascript/javascript-control-functions
  - languages/javascript/javascript-async-promises
  - languages/javascript/javascript-runtime-event-loop
updatedAt: 2026-08-25
---

## En 30 segundos

- **Lanzar** un error interrumpe el flujo normal hasta encontrar un `catch`.
- `throw` acepta cualquier valor, pero debes lanzar objetos `Error` para conservar tipo, mensaje, causa y stack.
- Captura únicamente donde puedas recuperar, traducir o agregar contexto.
- `finally` sirve para limpieza que debe ocurrir tanto en éxito como en fallo.
- Un error esperado del dominio no siempre debe tratarse como un fallo inesperado del sistema.

## Error de sintaxis, excepción y rechazo

| Situación | Ejemplo | Momento habitual |
| --- | --- | --- |
| error de sintaxis | llave sin cerrar | antes de ejecutar el archivo |
| excepción síncrona | leer una propiedad de `undefined` | durante la pila actual |
| Promise rechazada | falla dentro de una función `async` | se observa al esperar o encadenar la Promise |
| error de dominio | saldo insuficiente | resultado esperado que el producto debe presentar |

```js
function parseSettings(text) {
  return JSON.parse(text)
}

try {
  parseSettings('{ invalid }')
} catch (error) {
  error instanceof SyntaxError // true
  error.message                // mensaje del runtime
}
```

Una Promise rechazada no se captura con un `try` que no la espera:

```js
try {
  loadProfile() // la Promise queda sin await
} catch {
  // No captura un rechazo posterior.
}

try {
  await loadProfile()
} catch (error) {
  console.error(error)
}
```

## Clases de error incorporadas

| Clase | Indica normalmente | Ejemplo |
| --- | --- | --- |
| `Error` | fallo general de aplicación | operación imposible |
| `TypeError` | tipo o forma incompatible | se esperaba un objeto |
| `RangeError` | valor fuera de rango | página negativa |
| `SyntaxError` | sintaxis inválida | JSON mal formado |
| `ReferenceError` | identificador no disponible | variable no declarada |
| `URIError` | codificación URI inválida | secuencia corrupta |
| `AggregateError` | varios errores reunidos | todas fallan en `Promise.any` |

```js
function setPage(page) {
  if (!Number.isInteger(page)) {
    throw new TypeError('page debe ser un entero')
  }
  if (page < 1) {
    throw new RangeError('page debe ser mayor o igual a 1')
  }
}
```

El tipo ayuda al consumidor a clasificar el problema sin comparar un texto que podría cambiar o traducirse.

### Detectar errores con `Error.isError`

`instanceof Error` depende de que el objeto y el constructor pertenezcan al mismo **realm**, es decir, al mismo conjunto de objetos globales. Un error procedente de un `iframe`, otro contexto o una máquina virtual (VM) puede ser auténtico y aun así fallar esa comparación. ECMAScript 2026 añadió `Error.isError` para comprobar la marca interna de los objetos Error sin confiar en el prototype ni en una propiedad que pueda falsificarse.

```js
const error = new TypeError('Dato inválido')
const imitation = { name: 'TypeError', message: 'Dato inválido' }

Error.isError(error)     // true
Error.isError(imitation) // false
Error.isError('fallo')   // false
```

Incluye instancias de `Error`, errores nativos y `AggregateError`. Si soportas un runtime anterior, `value instanceof Error` continúa siendo una comprobación útil dentro del mismo realm, pero no es un reemplazo idéntico.

## `throw`, `try`, `catch` y `finally`

```js
let connection

try {
  connection = await connect()
  return await connection.read()
} catch (error) {
  reportError(error)
  throw error
} finally {
  await connection?.close()
}
```

`finally` se ejecuta incluso si existe `return` o `throw`. Evita retornar desde `finally`: ese retorno puede reemplazar el valor o esconder el error anterior.

El binding de `catch` es opcional cuando no necesitas el error:

```js
try {
  return JSON.parse(text)
} catch {
  return null
}
```

Esa recuperación solo es correcta si `null` forma parte explícita del contrato. En otros casos, ocultar el error destruye información necesaria para depurar.

## Agregar contexto con `cause`

Cada capa conoce una parte diferente del problema. Conserva el error original mediante `cause`:

```js
async function loadConfiguration() {
  try {
    return await readConfigurationFile()
  } catch (error) {
    throw new Error('No se pudo cargar la configuración de inicio', {
      cause: error,
    })
  }
}
```

La capa superior obtiene un mensaje relacionado con la operación y todavía puede inspeccionar `error.cause`. No incluyas secretos, tokens ni datos personales en mensajes enviados al cliente o a servicios de logging.

## Errores personalizados

```js
class HTTPError extends Error {
  constructor(status, message, options = {}) {
    super(message, options)
    this.name = 'HTTPError'
    this.status = status
    this.retryable = status === 429 || status >= 500
  }
}

const error = new HTTPError(503, 'Servicio no disponible')

error instanceof Error     // true
error instanceof HTTPError // true
error.status               // 503
error.retryable            // true
```

Una subclase es útil cuando varias partes necesitan reaccionar al mismo tipo de fallo. No crees una jerarquía por cada mensaje; empieza con datos claros y tipos que cambien realmente la estrategia.

## Errores esperados frente a fallos inesperados

Una contraseña incorrecta, un cupón vencido o un nombre ya ocupado son situaciones previstas por el producto. Una conexión de base de datos caída o una propiedad imposible son fallos operativos o defectos.

```js
function reserve(stock, quantity) {
  if (quantity > stock) {
    return { ok: false, reason: 'INSUFFICIENT_STOCK' }
  }

  return { ok: true, remaining: stock - quantity }
}
```

No existe una única regla para usar retornos o excepciones. Define el contrato: una excepción es apropiada cuando la función no puede cumplirlo; un resultado discriminado puede ser mejor cuando el consumidor debe presentar varias alternativas normales.

## Depurar con evidencia

1. Reproduce el fallo con la entrada más pequeña posible.
2. Lee la primera línea propia del stack trace.
3. Coloca un breakpoint antes del estado incorrecto.
4. Inspecciona valores, tipos y orden de llamadas.
5. Formula una hipótesis y cambia una sola variable.
6. Añade una prueba que falle antes de corregir.

```js
function calculateDiscount(price, percentage) {
  console.assert(Number.isFinite(price), 'price no es finito', { price })
  console.assert(percentage >= 0 && percentage <= 1, 'porcentaje inválido')
  return price * (1 - percentage)
}
```

`console.assert` ayuda durante una investigación, pero no sustituye validación, manejo de errores ni pruebas automatizadas.

## Stack, logging y límites de error

Un **stack trace** muestra la cadena de llamadas. El bundler puede transformarla; los source maps permiten relacionar el archivo generado con el código fuente.

Registra contexto operativo estructurado:

```js
logger.error('No se pudo guardar el proyecto', {
  projectId,
  operation: 'project.save',
  error,
})
```

Evita registrar el objeto completo de usuario, headers de autorización o bodies sensibles. En interfaces, una **error boundary** o límite equivalente evita que un fallo local derribe toda la experiencia y ofrece una acción de recuperación.

## Limpieza clásica con `finally`

Recursos como locks, listeners, streams, archivos y conexiones tienen una vida útil que debe terminar de forma explícita.

```js
const controller = new AbortController()

try {
  window.addEventListener('resize', updateLayout, {
    signal: controller.signal,
  })
  await runView()
} finally {
  controller.abort()
}
```

El recolector de basura administra memoria, no garantiza cerrar a tiempo un archivo, liberar un lock o cancelar una suscripción.

## `using` y `await using`

La gestión explícita de recursos terminó el proceso de estandarización de TC39 y está prevista para ECMAScript 2027; no forma parte de la edición ECMAScript 2026. Objetos que implementan `Symbol.dispose` o `Symbol.asyncDispose` pueden declararse con `using` o `await using`. El runtime los libera en orden inverso al salir del scope, incluso mediante `return` o excepción.

```js
class Subscription {
  constructor(unsubscribe) {
    this.unsubscribe = unsubscribe
  }

  [Symbol.dispose]() {
    this.unsubscribe()
  }
}

{
  using subscription = new Subscription(subscribeToUpdates())
  renderDashboard()
} // ejecuta subscription[Symbol.dispose]()
```

Para limpieza asíncrona se usa `await using` dentro de un contexto que admita `await`. Trátala como una capacidad futura o dependiente del runtime hasta que tus objetivos la soporten: una sintaxis desconocida impide analizar todo el archivo y no siempre se resuelve con un polyfill. `try/finally` continúa siendo el patrón portable.

## Lista de comprobación

- ¿El error conserva una causa útil?
- ¿La capa que captura puede recuperar o agregar contexto?
- ¿Existe limpieza para recursos y listeners?
- ¿El mensaje público evita información sensible?
- ¿Un rechazo asíncrono está esperado o capturado?
- ¿Hay una prueba para el camino de error y no solo para el éxito?
