---
title: Storage, Cache API y coordinación entre pestañas
description: Elegir cookies, Web Storage, IndexedDB, Cache Storage y mecanismos de coordinación según tamaño, vida útil y sensibilidad.
category: general
stack: javascript
order: 27
tags: [javascript, browser, storage, indexeddb, cache]
scope: plataforma web
related:
  - guides/javascript-json-storage
  - guides/http-browser-fundamentals
  - utilities/storage
updatedAt: 2026-08-18
---

## Elegir dónde guardar un dato

| Mecanismo | Tipo de dato | Vida útil | Se envía solo al servidor | Caso adecuado |
| --- | --- | --- | --- | --- |
| Cookie | string pequeño | sesión o expiración | **sí**, según dominio/path | sesión y preferencias requeridas por servidor |
| `sessionStorage` | strings | pestaña actual | no | estado temporal de una pestaña |
| `localStorage` | strings | persistente | no | preferencias pequeñas no sensibles |
| IndexedDB | datos estructurados clonables | persistente | no | datos grandes, índices y trabajo offline |
| Cache Storage | pares Request/Response | persistente | no | respuestas y assets controlados por la app |
| OPFS | archivos y bytes | persistente | no | edición local y archivos de alto rendimiento |

El almacenamiento del navegador es una mejora, no una garantía: el usuario puede borrarlo; el navegador puede aplicar cuotas o desalojo; el modo privado puede cambiar su comportamiento; y un script que se ejecute en el origen puede acceder a gran parte de esos datos.

## Web Storage

`localStorage` y `sessionStorage` son APIs síncronas. Una operación pequeña es sencilla, pero serializar o leer datos grandes puede bloquear el hilo principal.

| Miembro | Devuelve | ¿Muta? |
| --- | --- | --- |
| `length` | cantidad de claves | no |
| `getItem(key)` | string o `null` | no |
| `setItem(key, value)` | `undefined` | **sí** |
| `removeItem(key)` | `undefined` | **sí** |
| `clear()` | `undefined` | **sí, todo el storage del origen** |
| `key(index)` | nombre de clave o `null` | no |

```js
const preferences = { version: 2, theme: 'dark' }

localStorage.setItem('preferences', JSON.stringify(preferences))
// undefined

const raw = localStorage.getItem('preferences')
const restored = raw ? JSON.parse(raw) : null

restored // { version: 2, theme: 'dark' }
```

Envuelve lectura, parseo y escritura en una frontera que maneje JSON corrupto, cuotas y cambios de versión.

```js
function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

readStorage('preferences', { version: 2, theme: 'system' })
// preferencias guardadas o fallback
```

### Sincronizar otras pestañas

El evento `storage` se dispara en otros documentos del mismo origen, no en el que hizo la escritura.

```js
window.addEventListener('storage', event => {
  if (event.key !== 'preferences') return

  event.oldValue // string anterior o null
  event.newValue // string nuevo o null
  event.storageArea === localStorage // true para este caso

  applyPreferences(readStorage('preferences', defaultPreferences))
})
```

## Cookies

Las cookies viajan automáticamente en requests que coinciden con su dominio, path y política. Eso permite sesiones de servidor, pero añade bytes a la red y requiere protección CSRF para mutaciones autenticadas por cookie.

```http
Set-Cookie: session=opaque-id; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
```

| Atributo | Función |
| --- | --- |
| `HttpOnly` | impide lectura desde JavaScript |
| `Secure` | solo se envía por HTTPS |
| `SameSite` | limita envío cross-site |
| `Path` | restringe rutas de envío |
| `Domain` | amplía hosts que la reciben; omitir suele ser más restrictivo |
| `Max-Age` / `Expires` | define persistencia |
| `Partitioned` | almacenamiento particionado en contextos compatibles |

JavaScript solo ve cookies no `HttpOnly` mediante `document.cookie`, una interfaz string poco ergonómica. Las cookies de sesión deberían crearse y expirar desde el servidor.

No guardes objetos completos, contraseñas o tokens legibles por JavaScript sin evaluar el riesgo. Una cookie `HttpOnly` reduce el robo directo mediante XSS, pero XSS todavía puede ejecutar acciones como el usuario.

## IndexedDB

IndexedDB es una base de datos transaccional del navegador. Guarda valores compatibles con structured clone, incluidos objetos, arrays, blobs, fechas, Map y Set. Organiza datos en object stores y puede crear índices.

```text
base de datos
  └─ object store: projects
       ├─ keyPath: id
       └─ index: by-status
```

### Abrir y crear estructura

```js
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('developer-library', 1)

    request.addEventListener('upgradeneeded', () => {
      const database = request.result
      const projects = database.createObjectStore('projects', {
        keyPath: 'id',
      })

      projects.createIndex('by-status', 'status')
    })

    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => reject(request.error))
  })
}

const database = await openDatabase()
database.name    // 'developer-library'
database.version // 1
```

### Guardar dentro de una transacción

```js
function saveProject(database, project) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction('projects', 'readwrite')
    const store = transaction.objectStore('projects')

    store.put(project)

    transaction.addEventListener('complete', () => resolve(project))
    transaction.addEventListener('abort', () => reject(transaction.error))
    transaction.addEventListener('error', () => reject(transaction.error))
  })
}

await saveProject(database, { id: 1, name: 'Docs', status: 'active' })
// { id: 1, name: 'Docs', status: 'active' }
```

La transacción puede cerrarse cuando ya no tiene requests pendientes. No coloques un `await` arbitrario de red en medio y asumas que seguirá activa. Para aplicaciones reales, una pequeña capa o librería puede reducir el manejo repetitivo sin ocultar las transacciones.

### Leer por clave o índice

```js
function requestAsPromise(request) {
  return new Promise((resolve, reject) => {
    request.addEventListener('success', () => resolve(request.result))
    request.addEventListener('error', () => reject(request.error))
  })
}

const transaction = database.transaction('projects', 'readonly')
const store = transaction.objectStore('projects')

await requestAsPromise(store.get(1))
// { id: 1, name: 'Docs', status: 'active' }

await requestAsPromise(store.index('by-status').getAll('active'))
// array de proyectos activos
```

Planifica migraciones en `upgradeneeded`; abre una versión superior para cambiar stores o índices y maneja pestañas antiguas que bloquean la actualización.

## Cache Storage

Cache Storage guarda pares de `Request` y `Response`. No es la misma caché HTTP automática, aunque puede conservar respuestas con headers HTTP.

```js
const cache = await caches.open('docs-v1')

await cache.add('/offline.html')
await cache.put(
  '/api/profile',
  Response.json({ name: 'Ana' }),
)

const cached = await cache.match('/api/profile')
await cached.json() // { name: 'Ana' }
```

`Response` tiene un body consumible una vez. Usa `clone()` cuando una copia va a caché y otra al consumidor.

```js
const response = await fetch(request)

if (response.ok) {
  await cache.put(request, response.clone())
}

return response
```

Define versión, invalidación y límite. No caches respuestas privadas bajo una clave compartida que pueda devolver datos de otro usuario. Cache API no vence entradas automáticamente según una política de aplicación.

## Service Worker y estrategia offline

Un service worker puede interceptar requests dentro de su scope:

```js
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached ?? fetch(event.request)
    }),
  )
})
```

Cache-first sirve para assets estables; network-first puede servir para datos cambiantes con fallback; stale-while-revalidate prioriza velocidad y actualiza después. La estrategia debe corresponder al dato, no aplicarse igual a todas las URLs.

## Cuota, persistencia y uso estimado

```js
const estimate = await navigator.storage?.estimate()

estimate?.usage // bytes usados aproximados
estimate?.quota // cuota aproximada

const persisted = await navigator.storage?.persisted()
// true si el almacenamiento ya es persistente
```

`navigator.storage.persist()` puede solicitar que el origen sea menos propenso al desalojo, pero el navegador decide y no todos muestran un prompt.

```js
const granted = await navigator.storage?.persist()
granted // true, false o undefined si no existe la API
```

No llenes la cuota preventivamente. Informa tamaños, limpia versiones viejas y ofrece borrar descargas offline.

## BroadcastChannel

Permite enviar datos clonables entre pestañas, iframes y workers del mismo origen.

```js
const channel = new BroadcastChannel('auth-state')

channel.addEventListener('message', event => {
  if (event.data.type === 'signed-out') redirectToLogin()
})

channel.postMessage({ type: 'signed-out' })
channel.close()
```

No es almacenamiento: los mensajes no quedan disponibles para una pestaña que se abra después. No envíes secretos innecesarios; cualquier contexto comprometido del origen puede participar.

## Web Locks

Web Locks coordina trabajo exclusivo entre contextos del mismo origen cuando existe compatibilidad.

```js
await navigator.locks.request('sync-projects', async lock => {
  lock.name // 'sync-projects'
  await synchronizeProjects()
})
```

Sirve para evitar que varias pestañas ejecuten la misma sincronización a la vez. No reemplaza bloqueos, transacciones o idempotencia del servidor.

## Checklist de persistencia

- Define fuente de verdad y vida útil del dato.
- Guarda el mínimo necesario y añade versión de formato.
- Maneja ausencia, corrupción, cuota y desalojo.
- Separa datos por usuario y limpia al cerrar sesión.
- No confíes en storage del cliente para permisos, precios o decisiones de seguridad.
- Evita datos personales innecesarios en equipos compartidos.
- Cierra conexiones, canales y recursos al terminar.
- Prueba modo privado, varias pestañas, offline y migraciones.
