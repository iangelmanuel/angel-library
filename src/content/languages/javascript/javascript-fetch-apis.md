---
title: Fetch, HTTP y consumo de APIs
description: Construir requests, validar respuestas, enviar JSON, manejar headers, errores, paginación, cache y seguridad desde JavaScript.
type: guides
order: 27
tags: [javascript, fetch, http, api, json]
scope: consumo de APIs
related:
  - languages/javascript/http-browser-fundamentals
  - languages/javascript/javascript-async-promises
  - languages/javascript/javascript-url-web-apis
  - security/security-aplicacion/security-common-web-attacks
updatedAt: 2026-08-25
---

## Para recordar

`fetch` rechaza por fallos de red, CORS o cancelación, pero normalmente no por un status HTTP de error. El body es un stream consumible una vez. Define timeout, valida status y `Content-Type`, interpreta el body según el contrato y cancela requests que dejaron de ser relevantes.

## Request mínima

`fetch(url, options)` devuelve una Promise de `Response`. No rechaza por status HTTP 404 o 500: comprueba `response.ok` o `response.status` tú mismo.

| API o propiedad          | Devuelve                     | Consume el body                | Caso de uso                         |
| ------------------------ | ---------------------------- | ------------------------------ | ----------------------------------- |
| `fetch(input, init?)`    | `Promise<Response>`          | no aplica                      | realizar la request                 |
| `response.ok`            | booleano para status 200–299 | no                             | validar éxito HTTP general          |
| `response.status`        | número de status             | no                             | aplicar reglas por status           |
| `response.headers`       | objeto `Headers`             | no                             | leer metadatos                      |
| `response.json()`        | Promise con dato parseado    | **sí**                         | JSON                                |
| `response.text()`        | Promise con string           | **sí**                         | texto, HTML o error no estructurado |
| `response.blob()`        | Promise con Blob             | **sí**                         | archivos en navegador               |
| `response.arrayBuffer()` | Promise con bytes            | **sí**                         | binarios y protocolos               |
| `response.formData()`    | Promise con FormData         | **sí**                         | multipart o formularios             |
| `response.clone()`       | Response nueva               | duplica el stream internamente | leer el body por dos consumidores   |

```js
const response = await fetch("/api/projects?page=2", {
  headers: { Accept: "application/json" }
})

if (!response.ok) {
  throw new Error(`No se pudieron cargar proyectos: ${response.status}`)
}

const projects = await response.json()

response.status // por ejemplo: 200
response.ok // true
projects // dato JavaScript parseado desde el body
response.bodyUsed // true
```

El body de `Response` normalmente se consume una vez. `json()`, `text()`, `blob()`, `arrayBuffer()` y `formData()` son asíncronos; elige según el `Content-Type` y el contrato.

### Leer errores sin asumir que siempre son JSON

```js
async function readResponse(response) {
  if (response.status === 204 || response.status === 205) return null

  const type = response.headers.get("content-type") ?? ""
  const body = type.includes("application/json")
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const error = new Error(`Request fallida: ${response.status}`)
    error.status = response.status
    error.body = body
    throw error
  }

  return body
}

const data = await readResponse(await fetch("/api/projects"))
// objeto/array si fue JSON; string para otro contenido
```

Un status `204 No Content` o `205 Reset Content` no tiene representación que parsear. Para contratos estrictos, también puedes rechazar si esperabas JSON y el `Content-Type` no coincide.

## Métodos, seguridad e idempotencia

| Método   | Intención habitual          | Seguro | Idempotente                            |
| -------- | --------------------------- | ------ | -------------------------------------- |
| `GET`    | leer                        | sí     | sí                                     |
| `HEAD`   | leer metadatos              | sí     | sí                                     |
| `POST`   | crear o ejecutar una acción | no     | no por defecto                         |
| `PUT`    | reemplazar un recurso       | no     | sí                                     |
| `PATCH`  | modificar parcialmente      | no     | depende del contrato                   |
| `DELETE` | eliminar                    | no     | debería producir el mismo estado final |

**Seguro** significa que no pretende cambiar estado. **Idempotente** significa que repetir la misma request produce el mismo estado final, no que la respuesta deba ser idéntica. Reintentar automáticamente un `POST` puede duplicar cobros o registros; usa una idempotency key cuando el servidor ofrezca ese contrato.

## Enviar datos

Para JSON, declara el header y serializa el body. Para archivos o formularios, `FormData` permite enviar multipart sin construir el boundary manualmente.

```js
await fetch("/api/projects", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Biblioteca" })
})
// Response; todavía debes comprobar response.ok
```

Guarda la respuesta para comprobarla:

```js
const response = await fetch("/api/projects", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Biblioteca" })
})

if (!response.ok) throw new Error(`HTTP ${response.status}`)
const created = await response.json()

created // por ejemplo: { id: 12, name: 'Biblioteca' }
```

No envíes el token o precio que el cliente puede modificar como fuente de verdad. El servidor debe autenticar, autorizar, validar y calcular los valores sensibles.

## Headers, credenciales y CORS

`headers` puede ser un objeto o `Headers`. `credentials: 'same-origin'` usa cookies del mismo origen; `include` permite cookies cross-origin cuando el servidor y CORS lo autorizan. CORS no es autenticación y no evita que un servidor reciba una request directa.

```js
fetch("https://api.example.com/profile", {
  credentials: "include",
  headers: { Accept: "application/json" }
})
```

No pongas secretos de servidor en el bundle. Los valores públicos del frontend deben considerarse visibles.

## Query params y URLs

Construye URLs con `URL` y `URLSearchParams`, no concatenando strings sin escapar:

```js
const url = new URL("/api/search", window.location.origin)
url.searchParams.set("q", query)
url.searchParams.set("page", String(page))
const response = await fetch(url)

url.toString()
// por ejemplo: 'https://example.com/api/search?q=astro&page=2'
```

`set` reemplaza el valor; `append` añade otro parámetro con la misma clave. Esto es útil para filtros repetidos y evita errores con espacios, `&`, Unicode o valores vacíos.

## Paginación, cache y errores

Define si la API usa cursor o página, el máximo de elementos y el status para límite inválido. Un `429` puede traer `Retry-After`; una respuesta `304` no tiene body; un error JSON puede contener `code`, `message` y errores por campo. No muestres el texto técnico completo al usuario.

El cache del navegador y el cache de una librería de datos son capas distintas. Usa `Cache-Control` del servidor y una key que incluya todos los parámetros que cambian la respuesta. Cancela requests obsoletas y evita reintentar mutaciones sin idempotency key.

## Cancelación y tiempo máximo

```js
async function fetchJSON(url, { timeout = 8_000, ...options } = {}) {
  const signal = AbortSignal.timeout(timeout)
  const response = await fetch(url, { ...options, signal })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

await fetchJSON("/api/projects", { timeout: 3_000 })
// dato JSON o rechazo por HTTP, red, parseo o timeout
```

Si también recibes una señal del componente, combina ambas con `AbortSignal.any([externalSignal, AbortSignal.timeout(timeout)])` en runtimes compatibles. Distingue cancelación esperada de fallos que sí deben mostrarse o registrarse.

## Procesar un body como stream

`response.text()` o `response.json()` acumulan el body completo. Para respuestas grandes o progresivas, lee `response.body`, un `ReadableStream` de bytes.

```js
const response = await fetch("/api/logs")
if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`)

const decoder = new TextDecoder()
let text = ""

for await (const chunk of response.body) {
  text += decoder.decode(chunk, { stream: true })
  renderProgress(text.length)
}

text += decoder.decode()
```

Los chunks no coinciden necesariamente con líneas, objetos JSON ni caracteres completos. Mantén un buffer y define un protocolo como NDJSON o Server-Sent Events cuando necesites mensajes delimitados.

## Caso de uso: paginación por cursor

```js
async function loadAllProjects() {
  const projects = []
  let cursor = null

  do {
    const url = new URL("/api/projects", window.location.origin)
    url.searchParams.set("limit", "50")
    if (cursor) url.searchParams.set("cursor", cursor)

    const response = await fetch(url)
    const page = await readResponse(response)

    projects.push(...page.items)
    cursor = page.nextCursor ?? null
  } while (cursor)

  return projects
}

const projects = await loadAllProjects()
projects // todos los proyectos acumulados en orden de página
```

Para un listado grande no siempre conviene cargar todo: conserva el cursor y solicita la siguiente página al acercarse al final. El servidor debe imponer un límite máximo aunque el cliente envíe otro valor.
