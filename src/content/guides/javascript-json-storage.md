---
title: JSON, serialización y almacenamiento local
description: Convertir datos con seguridad, entender límites de JSON y elegir localStorage, sessionStorage, cookies o IndexedDB.
category: languages
stack: javascript
order: 24
tags: [javascript, json, storage, serialization, browser]
scope: datos locales
related:
  - guides/browser-storage-and-web-apis
  - tricks/safe-json-parse
  - utilities/storage
updatedAt: 2026-08-25
---

## Para recordar

JSON es un formato de texto, no un clon completo de JavaScript. Web Storage guarda strings de forma síncrona; cookies pueden viajar al servidor; IndexedDB almacena más datos y trabaja de forma asíncrona. Ninguno debe contener secretos accesibles a scripts sin un análisis de riesgo.

## `JSON.stringify` y `JSON.parse`

JSON solo representa null, booleanos, números finitos, strings, arrays y objetos con claves string. No conserva funciones, `undefined` en objetos, `Symbol`, `Map`, `Set`, prototipos ni instancias de clase. `Date` se convierte a ISO mediante `toJSON` y luego vuelve como string, no como `Date`.

| API | Devuelve | ¿Muta? | Puede fallar |
| --- | --- | --- | --- |
| `JSON.stringify(value, replacer?, space?)` | string o `undefined` | no | ciclos y BigInt sin personalizar |
| `JSON.parse(text, reviver?)` | valor reconstruido | no | JSON inválido o un reviver que lance |

```js
const payload = JSON.stringify({ name: 'Ana', tags: ['web'] })
const data = JSON.parse(payload)

payload // '{"name":"Ana","tags":["web"]}'
data    // { name: 'Ana', tags: ['web'] }
```

`JSON.parse` puede lanzar `SyntaxError`; úsalo dentro de una frontera controlada. El tercer argumento de `JSON.stringify(value, replacer, space)` sirve para seleccionar campos o formatear salida, no para ocultar un secreto de manera accidental.

```js
const safe = JSON.stringify(user, ['id', 'name', 'role'])
const pretty = JSON.stringify(config, null, 2)

safe   // solo incluye id, name y role
pretty // string con indentación de 2 espacios
```

### Valores que cambian o desaparecen

```js
const value = {
  missing: undefined,
  invalidNumber: NaN,
  infinite: Infinity,
  createdAt: new Date('2026-08-18T00:00:00Z'),
  items: [undefined],
}

JSON.stringify(value)
// '{"invalidNumber":null,"infinite":null,"createdAt":"2026-08-18T00:00:00.000Z","items":[null]}'
```

El `undefined` de un objeto desaparece; dentro de un array se convierte en `null`. `NaN` e infinitos también se serializan como `null`.

### `replacer` y `reviver`

```js
const json = JSON.stringify(
  { id: 7, password: 'secret', role: 'admin' },
  (key, value) => key === 'password' ? undefined : value,
)

json // '{"id":7,"role":"admin"}'

const restored = JSON.parse(
  '{"createdAt":"2026-08-18T00:00:00.000Z"}',
  (key, value) => key === 'createdAt' ? new Date(value) : value,
)

restored.createdAt instanceof Date // true
restored.createdAt.getUTCFullYear() // 2026
```

No uses un `reviver` genérico que convierta cualquier texto parecido a fecha: podría cambiar campos que debían seguir siendo strings.

### Texto original del valor con `context.source`

Desde ECMAScript 2026, el `reviver` recibe un tercer argumento `context` al procesar valores primitivos no modificados. `context.source` contiene exactamente el fragmento del JSON que originó el valor. Es importante cuando `Number` ya habría perdido precisión antes de que el reviver pudiera convertirlo.

```js
const record = JSON.parse(
  '{"id":900719925474099312345}',
  (key, value, context) => {
    if (key === 'id') return BigInt(context.source)
    return value
  },
)

record.id // 900719925474099312345n
```

El objeto `context` solo incluye `source` para primitivos; al revivir objetos o arrays puede estar vacío. El consumidor debe conocer qué campos acepta como `BigInt`: convertir todos los números cambiaría el contrato y esos valores tampoco se serializan de nuevo con JSON tradicional sin una estrategia.

### Emitir un primitivo sin perder su representación

`JSON.rawJSON(text)` crea un marcador para que `JSON.stringify` inserte un texto JSON primitivo ya validado. `JSON.isRawJSON(value)` permite reconocer ese marcador. Esto complementa `context.source` al transportar enteros que JavaScript no puede representar como `Number`.

```js
const exactId = JSON.rawJSON('900719925474099312345')
const payload = JSON.stringify({ id: exactId })

JSON.isRawJSON(exactId) // true
payload // '{"id":900719925474099312345}'
```

`rawJSON` solo admite la representación válida de un string, número, booleano o `null`; no acepta objetos ni arrays completos. No lo uses para insertar texto arbitrario ni para omitir validación. Estas APIs son de ECMAScript 2026 y requieren un runtime compatible.

No hagas `JSON.parse` de una respuesta HTTP sin comprobar que el status y el `Content-Type` corresponden a lo esperado. Un error HTML de proxy no es JSON válido.

## `localStorage` y `sessionStorage`

Ambos guardan strings y exponen `getItem`, `setItem`, `removeItem`, `clear`, `key` y `length`. Convierte explícitamente:

| Miembro | Devuelve | ¿Muta el storage? |
| --- | --- | --- |
| `length` | cantidad de claves | no |
| `getItem(key)` | string o `null` | no |
| `setItem(key, value)` | `undefined` | **sí** |
| `removeItem(key)` | `undefined` | **sí** |
| `clear()` | `undefined` | **sí, elimina todo el origen** |
| `key(index)` | nombre de clave o `null` | no |

```js
const raw = localStorage.getItem('settings')
const settings = raw ? JSON.parse(raw) : { theme: 'system' }
localStorage.setItem('settings', JSON.stringify(settings))

raw      // string o null
settings // objeto JavaScript
localStorage.getItem('settings') // JSON como string
```

Maneja cuotas llenas, JSON corrupto, modo privado y storage bloqueado. No guardes contraseñas, tokens de alto impacto o PII innecesaria: un script inyectado en el origen puede leer `localStorage`.

El evento `storage` se dispara en otros documentos del mismo origen cuando una pestaña cambia `localStorage`; no se dispara en la misma pestaña que realizó el cambio.

```js
window.addEventListener('storage', (event) => {
  if (event.key !== 'settings' || !event.newValue) return
  const nextSettings = JSON.parse(event.newValue)
  applySettings(nextSettings)
})
```

## Cookies

Las cookies son strings y pueden enviarse automáticamente al servidor. A diferencia de storage, permiten atributos como `HttpOnly`, `Secure`, `SameSite`, `Path`, `Domain`, `Max-Age` y `Expires`. JavaScript no puede leer una cookie `HttpOnly`, pero tampoco puede eliminarla directamente; el servidor debe enviar otra con expiración.

Usa cookies pequeñas para sesión o preferencias que el servidor necesita. No guardes un objeto completo de usuario ni datos que podrían viajar en cada request.

## IndexedDB y `structuredClone`

IndexedDB sirve para datos locales grandes, estructurados o que deben consultarse sin cargar todo en memoria. Su API es asíncrona y transaccional; encapsúlala detrás de una capa para no repartir detalles de object stores por toda la UI.

`structuredClone(value)` copia muchos tipos incorporados, incluidos Map, Set, Date y objetos anidados clonables. No clona funciones, nodos DOM ni ciertos recursos; además, clonar no valida que el dato sea seguro o pequeño.

## Caso de uso: preferencias resilientes

Guarda solo preferencias no sensibles, añade una versión al formato y migra datos antiguos:

```js
function parseJSON(text, fallback = null) {
  try {
    return JSON.parse(text)
  } catch {
    return fallback
  }
}

const stored = parseJSON(localStorage.getItem('prefs') ?? 'null')
const prefs = stored?.version === 2
  ? stored
  : { version: 2, theme: stored?.theme ?? 'system' }

prefs // siempre tiene la versión y el tema esperados
```

Cuando el dato sea importante para el negocio, la fuente de verdad debe estar en el servidor y el storage local solo actuar como caché o mejora de UX.
