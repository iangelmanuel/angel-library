---
title: Axios
description: Cliente HTTP con interceptores, instancias configuradas y manejo de errores más cómodo que fetch nativo.
type: libraries
order: 2
tags: [react, http, api]
website: https://axios-http.com
github: https://github.com/axios/axios
install: npm install axios
related:
  - frontend/react/tanstack-query
updatedAt: 2026-08-25
---

`fetch` es nativo y alcanza para lo simple, pero `axios` ahorra código repetitivo: parsea JSON solo (no hace falta `await res.json()`), trata cualquier respuesta 4xx/5xx como error (con `fetch` hay que chequear `res.ok` a mano), y permite configurar una instancia una vez (base URL, headers, timeout) en vez de repetirlo en cada llamada.

## Uso básico

```ts
import axios from "axios"

const { data } = await axios.get("/api/usuarios")
// data ya es el JSON parseado, no un Response

await axios.post("/api/usuarios", { nombre: "Ana" })
```

## Una instancia configurada

Para no repetir la URL base ni los headers en cada llamada, se crea una instancia una vez y se reusa en todo el proyecto.

```ts title="lib/api.ts"
import axios from "axios"

export const api = axios.create({
  baseURL: "https://api.ejemplo.com",
  timeout: 8000,
  headers: { "Content-Type": "application/json" }
})
```

```ts
import { api } from "./lib/api"

const { data } = await api.get("/usuarios") // usa baseURL automáticamente
```

## Interceptores

Corren antes de cada request o después de cada response, en todas las llamadas hechas con esa instancia — el lugar típico para agregar un token de auth o manejar un 401 de forma centralizada.

```ts title="lib/api.ts"
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // sesión expirada: redirigir a login, limpiar token, etc.
    }
    return Promise.reject(error)
  }
)
```

## Manejo de errores

Una respuesta no exitosa lanza (`axios` la trata como error automáticamente, a diferencia de `fetch`) — el detalle de la respuesta del servidor queda en `error.response`.

```ts
try {
  await api.post("/usuarios", datosInvalidos)
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.log(error.response?.status, error.response?.data)
  }
}
```

## API cotidiana de Axios

| API                                                  | Uso                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------- |
| `axios.get/post/put/delete(url, data?)`              | Llamada directa, sin instancia configurada                        |
| `axios.create({ baseURL, headers, timeout })`        | Instancia reusable con config compartida                          |
| `instancia.interceptors.request.use(fn)`             | Modificar cada request antes de que salga (ej. agregar token)     |
| `instancia.interceptors.response.use(onOk, onError)` | Manejar cada response, incluidos los errores, en un solo lugar    |
| `axios.isAxiosError(error)`                          | Type guard para acceder a `error.response` con seguridad de tipos |

## Errores, cancelación y elección de cliente

- A diferencia de `fetch`, una respuesta 404/500 **lanza** en vez de resolver con `ok: false` — el `try/catch` es obligatorio si te importa distinguir error de servidor de error de red.
- Para proyectos que ya usan [TanStack Query](/frontend/react/tanstack-query) para cachear datos, axios sigue siendo útil como el "fetcher" de adentro — Query maneja el cache/estado, axios hace la llamada en sí.
- `data` en la respuesta ya viene parseado — un error común migrando desde `fetch` es escribir `await response.json()` sobre algo que ya es el JSON.
