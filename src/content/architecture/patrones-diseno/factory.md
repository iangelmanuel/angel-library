---
title: Factory
description: Centralizar la construcción de instancias en una función, para que el código que las usa no dependa del detalle de cómo se arman.
type: patterns
order: 1
tags: [arquitectura, patrones-diseno, factory]
related: [architecture/patrones-diseno/strategy]
problem: El código que necesita una instancia (un cliente HTTP, un notificador) termina duplicando la lógica de configuración en cada lugar que la usa.
updatedAt: 2026-08-17
---

## Problema

Cuando construir algo implica elegir entre varias configuraciones (según entorno, según canal, según tipo de cuenta), esa decisión no debería vivir repetida en cada `new` o cada `fetch()` del código. Factory la centraliza en un solo lugar: una función que devuelve la instancia lista, con la misma interfaz sin importar qué construyó por dentro.

## Ejemplo: cliente HTTP según entorno

```ts title="lib/http-client.ts"
interface HttpClient {
  get<T>(path: string): Promise<T>
  post<T>(path: string, body: unknown): Promise<T>
}

function createHttpClient(env: "development" | "production"): HttpClient {
  const config =
    env === "production"
      ? { baseURL: "https://api.miapp.com", retries: 3, timeout: 8000 }
      : { baseURL: "http://localhost:3000", retries: 0, timeout: 30000 }

  return {
    async get(path) {
      const res = await fetchConReintentos(
        `${config.baseURL}${path}`,
        { method: "GET" },
        config.retries
      )
      return res.json()
    },
    async post(path, body) {
      const res = await fetchConReintentos(
        `${config.baseURL}${path}`,
        { method: "POST", body: JSON.stringify(body) },
        config.retries
      )
      return res.json()
    }
  }
}

export const httpClient = createHttpClient(
  process.env.NODE_ENV === "production" ? "production" : "development"
)
```

El resto de la app importa `httpClient` y llama `.get()` / `.post()`. Nadie más necesita saber que la URL base y los reintentos cambian según el entorno.

## Ejemplo: factory de notificaciones

```ts title="lib/notifications/create-notifier.ts"
interface Notifier {
  send(to: string, message: string): Promise<void>
}

type Channel = "email" | "sms" | "push"

export function createNotifier(channel: Channel): Notifier {
  switch (channel) {
    case "email":
      return { send: (to, message) => enviarEmail(to, message) }
    case "sms":
      return { send: (to, message) => enviarSms(to, message) }
    case "push":
      return { send: (to, message) => enviarPush(to, message) }
  }
}

// Uso: el caller no sabe (ni le importa) qué proveedor hay detrás.
const notifier = createNotifier(usuario.canalPreferido)
await notifier.send(usuario.id, "Tu pedido fue enviado")
```

## En JS/TS es una función, no una jerarquía de clases

En Java o C# el patrón Factory suele implementarse con una clase `Factory` y una jerarquía de clases `Product`. En JS/TS eso es innecesario en la mayoría de los casos: una función que devuelve un objeto literal (o cierra sobre variables vía closure) cumple el mismo rol, con menos ceremonia. Guarda las clases para cuando el objeto construido necesita mantener estado interno complejo.

## Cuándo NO usarlo

- Si solo existe una forma de construir el objeto, un `new` directo o una función constructora simple alcanza — envolver eso en un "factory" es indirección sin beneficio.
- No agregues una fábrica “por si mañana necesito otro tipo”: espera a tener el segundo caso real antes de abstraer. **YAGNI** significa _You Aren't Gonna Need It_: no implementes una capacidad antes de que exista una necesidad real.
