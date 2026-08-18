---
title: URL, requests, archivos y datos binarios
description: URL, URLSearchParams, Headers, Request, Response, FormData, Blob, codificación y cancelación con resultados visibles.
category: general
stack: javascript
order: 12
tags: [javascript, url, web-api, formdata, blob, abortcontroller]
scope: APIs del runtime web
related:
  - guides/javascript-built-ins
  - guides/javascript-browser-constructors
  - guides/javascript-dom-events
  - guides/javascript-fetch-apis
  - guides/browser-storage-and-web-apis
updatedAt: 2026-08-18
---

## Lenguaje y runtime no son lo mismo

`Array`, `Object`, `Map` o `Promise` pertenecen al lenguaje JavaScript. `URL`, `fetch`, `Headers`, `FormData`, `Blob`, `AbortController`, `DOMParser` y los observers son APIs proporcionadas por el runtime. Muchas existen tanto en navegadores como en runtimes de servidor modernos, pero su compatibilidad y capacidades pueden variar.

Antes de usar una API en código compartido, confirma:

- si existe en el navegador o runtime mínimo del proyecto;
- si necesita contexto seguro HTTPS;
- si depende del DOM y por tanto no puede ejecutarse durante SSR;
- si requiere permiso del usuario, como ubicación, cámara o portapapeles.

## `URL`

`new URL(input, base?)` analiza y normaliza una URL. Es más seguro que concatenar strings porque entiende protocolo, host, ruta, query y fragmento.

| Miembro | Devuelve o representa | Muta la URL |
| --- | --- | --- |
| `href` | URL completa serializada | sí al asignar |
| `origin` | protocolo + host + puerto | solo lectura |
| `protocol` | protocolo con `:` | sí al asignar |
| `hostname` | dominio sin puerto | sí al asignar |
| `port` | puerto explícito | sí al asignar |
| `pathname` | ruta | sí al asignar |
| `search` | query con `?` | sí al asignar |
| `searchParams` | objeto `URLSearchParams` vivo | sus cambios actualizan la URL |
| `hash` | fragmento con `#` | sí al asignar |
| `toString()` / `toJSON()` | URL completa como string | no |

```js
const url = new URL('/products/keyboard?sort=price#reviews', 'https://example.com')

url.href      // 'https://example.com/products/keyboard?sort=price#reviews'
url.origin    // 'https://example.com'
url.hostname  // 'example.com'
url.pathname  // '/products/keyboard'
url.search    // '?sort=price'
url.hash      // '#reviews'

url.pathname = '/products/mouse'
url.href
// 'https://example.com/products/mouse?sort=price#reviews'
```

### Resolver rutas relativas

```js
new URL('../image.png', 'https://example.com/docs/guide/')
  .toString()
// 'https://example.com/docs/image.png'

URL.canParse('/docs', 'https://example.com') // true
URL.canParse('http://[invalid')              // false
```

Usa `URL.canParse` cuando esté disponible para comprobar sin depender de `try/catch`; si el runtime objetivo no lo incluye, captura el `TypeError` de `new URL()`.

## `URLSearchParams`

Representa los parámetros de una query. Codifica caracteres al serializar y permite claves repetidas.

| Método | Devuelve | Muta | Caso de uso |
| --- | --- | --- | --- |
| `get(name)` | primer valor o `null` | no | leer un filtro único |
| `getAll(name)` | array de valores | no | filtros repetidos |
| `has(name, value?)` | booleano | no | comprobar presencia |
| `set(name, value)` | `undefined` | **sí** | reemplazar todos por un valor |
| `append(name, value)` | `undefined` | **sí** | añadir otro valor |
| `delete(name, value?)` | `undefined` | **sí** | eliminar parámetros |
| `sort()` | `undefined` | **sí** | estabilizar el orden |
| `keys()`, `values()`, `entries()` | iteradores | no | recorrer la query |
| `toString()` | query sin `?` | no | serializar |

```js
const params = new URLSearchParams('tag=js&tag=web&page=2')

params.get('tag')      // 'js'
params.getAll('tag')   // ['js', 'web']
params.get('missing')  // null
params.has('page')     // true

params.set('page', '3')    // undefined
params.append('tag', 'dom') // undefined
params.delete('missing')    // undefined

params.toString()
// 'tag=js&tag=web&page=3&tag=dom'
```

### Construir una URL de filtros

```js
function createSearchURL(base, { query, tags = [], page = 1 }) {
  const url = new URL('/search', base)

  if (query?.trim()) url.searchParams.set('q', query.trim())
  for (const tag of tags) url.searchParams.append('tag', tag)
  if (page > 1) url.searchParams.set('page', String(page))

  return url
}

createSearchURL('https://example.com', {
  query: 'javascript moderno',
  tags: ['web', 'api'],
  page: 2,
}).toString()
// 'https://example.com/search?q=javascript+moderno&tag=web&tag=api&page=2'
```

No insertes el resultado de `URLSearchParams` dentro de HTML sin el escape correspondiente. La codificación de URL y el escape de HTML resuelven problemas distintos.

## `Headers`, `Request` y `Response`

Estas clases representan las piezas de Fetch. Sus cuerpos son streams y, por regla general, se consumen una vez.

| API | Método | Devuelve | Muta |
| --- | --- | --- | --- |
| `Headers` | `get`, `has` | string, `null` o booleano | no |
| `Headers` | `set`, `append`, `delete` | `undefined` | **sí** |
| `Request` | `clone()` | Request nuevo | no |
| `Response` | `json()`, `text()`, `blob()`, `arrayBuffer()` | Promise con el cuerpo | consume el cuerpo |
| `Response` | `clone()` | Response nuevo | no |
| `Response` | `Response.json(data, init?)` | Response nuevo | no |

```js
const headers = new Headers({ Accept: 'application/json' })

headers.get('accept')          // 'application/json': no distingue mayúsculas
headers.has('authorization')   // false
headers.set('x-client', 'docs') // undefined
[...headers.entries()]
// [['accept', 'application/json'], ['x-client', 'docs']]
```

```js
const response = Response.json(
  { ok: true, id: 7 },
  { status: 201, headers: { 'x-source': 'example' } },
)

response.status                // 201
response.ok                    // true
response.headers.get('x-source') // 'example'
await response.json()          // { ok: true, id: 7 }
response.bodyUsed              // true
```

`response.ok` cubre estados entre 200 y 299. Fetch no rechaza automáticamente la Promise por un 404 o 500; debes comprobar el estado.

## `FormData`

`FormData` representa pares de campos y admite strings o archivos. Puede crearse desde un formulario HTML o manualmente.

| Método | Devuelve | Muta |
| --- | --- | --- |
| `get(name)` | primer valor o `null` | no |
| `getAll(name)` | array de valores | no |
| `has(name)` | booleano | no |
| `set(name, value)` | `undefined` | **sí** |
| `append(name, value)` | `undefined` | **sí** |
| `delete(name)` | `undefined` | **sí** |
| `entries()` | iterador de pares | no |

```js
const data = new FormData()

data.set('name', 'Lina')
data.append('skill', 'JavaScript')
data.append('skill', 'CSS')

data.get('name')      // 'Lina'
data.getAll('skill')  // ['JavaScript', 'CSS']
Object.fromEntries(data)
// { name: 'Lina', skill: 'CSS' }: pierde valores repetidos
```

Al enviar `FormData` con Fetch, no escribas manualmente el header `Content-Type`; el runtime añade también el límite (*boundary*) correcto.

## `Blob`, `File`, `ArrayBuffer` y typed arrays

| Tipo | Representa | Caso de uso |
| --- | --- | --- |
| `Blob` | bytes inmutables con tipo MIME | descargas, imágenes o respuesta binaria |
| `File` | Blob con nombre y fecha | archivos elegidos o generados |
| `ArrayBuffer` | bloque de memoria binaria | protocolos y procesamiento de bytes |
| `Uint8Array` y otras vistas | lectura/escritura tipada del buffer | manipular bytes y formatos binarios |
| `DataView` | lectura/escritura con endianness explícito | formatos binarios estructurados |

```js
const blob = new Blob(['Hola, mundo'], { type: 'text/plain;charset=utf-8' })

blob.size       // 11 bytes para este texto ASCII/UTF-8
blob.type       // 'text/plain;charset=utf-8'
await blob.text() // 'Hola, mundo'
```

Crear una descarga temporal en el navegador:

```js
const data = new Blob([JSON.stringify({ ok: true }, null, 2)], {
  type: 'application/json',
})
const objectURL = URL.createObjectURL(data)

const link = document.createElement('a')
link.href = objectURL
link.download = 'data.json'
link.click()

URL.revokeObjectURL(objectURL)
```

Revoca las URLs de objeto cuando ya no sean necesarias para liberar recursos. No lo hagas antes de que el navegador pueda iniciar el uso del recurso.

## `TextEncoder` y `TextDecoder`

Convierten entre strings y bytes. `TextEncoder` genera UTF-8.

```js
const encoder = new TextEncoder()
const bytes = encoder.encode('ABC')

bytes // Uint8Array(3) [65, 66, 67]

const decoder = new TextDecoder()
decoder.decode(bytes) // 'ABC'
```

## Cancelar con `AbortController`

Un `AbortSignal` comunica cancelación a APIs compatibles como Fetch y `addEventListener`.

```js
const controller = new AbortController()

controller.signal.aborted // false
controller.abort('El usuario canceló')
controller.signal.aborted // true
controller.signal.reason  // 'El usuario canceló'
```

```js
const controller = new AbortController()

window.addEventListener('resize', updateLayout, {
  signal: controller.signal,
})

// Al desmontar el componente elimina el listener automáticamente.
controller.abort()
```

Para un tiempo máximo, runtimes modernos ofrecen `AbortSignal.timeout(milliseconds)`. `AbortSignal.any(signals)` combina varias causas de cancelación cuando está disponible.

## APIs de análisis y observación

| API | Observa o transforma | Caso de uso |
| --- | --- | --- |
| `DOMParser` | string a documento DOM | analizar XML o HTML controlado |
| `XMLSerializer` | nodo DOM a string | serializar XML/DOM |
| `IntersectionObserver` | intersección con viewport o contenedor | carga diferida y visibilidad |
| `ResizeObserver` | cambios de tamaño de un elemento | componentes responsivos |
| `MutationObserver` | cambios del árbol DOM | integrar sistemas externos |
| `PerformanceObserver` | entradas de rendimiento | métricas y diagnóstico |

```js
const parser = new DOMParser()
const documentXML = parser.parseFromString(
  '<product><name>Mouse</name></product>',
  'application/xml',
)

documentXML.querySelector('name')?.textContent // 'Mouse'
```

Analizar HTML no lo vuelve seguro. Si luego insertas contenido no confiable en la página, debes sanitizarlo con una estrategia diseñada para prevenir XSS.

## Caso de uso: leer parámetros con valores seguros

```js
function readPagination(input) {
  const url = new URL(input, 'https://example.com')
  const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10)
  const requestedLimit = Number.parseInt(url.searchParams.get('limit') ?? '20', 10)

  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0
    ? requestedPage
    : 1

  const limit = Number.isSafeInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 100)
    : 20

  return { page, limit }
}

readPagination('/products?page=3&limit=500')
// { page: 3, limit: 100 }

readPagination('/products?page=no&limit=-2')
// { page: 1, limit: 1 }
```
