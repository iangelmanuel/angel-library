---
title: Instrumentation y observabilidad
description: Inicialización del servidor, trazas OpenTelemetry y captura global de errores de request con instrumentation.ts.
type: guides
order: 4
tags: [nextjs, observability, logging, opentelemetry]
scope: next.js instrumentation
related:
  - backend/nextjs/nextjs-backend-arquitectura
  - backend/express/express-logging
updatedAt: 2026-08-25
---

`instrumentation.ts` es el punto de entrada para registrar observabilidad antes de que la aplicación empiece a atender requests. Vive en la raíz del proyecto o dentro de `src/`, al mismo nivel que `app/`.

**Instrumentación** es el código que produce señales para entender el sistema. **Observabilidad** es la capacidad de inferir qué ocurre usando logs, métricas y trazas. OpenTelemetry es un estándar para crear y exportar esas señales sin acoplar toda la aplicación a un proveedor.

## Ciclo de vida

`register()` se ejecuta una vez por instancia de servidor. En serverless pueden existir muchas instancias y cada una ejecutará su inicialización. El código debe ser idempotente y no asumir un singleton global del despliegue.

```ts title="instrumentation.ts"
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./src/instrumentation.node")
  }
}
```

La importación condicional evita cargar dependencias específicas de Node en un runtime incompatible. Mantén el archivo ligero: inicializa SDKs o hooks, pero no consultes datos de negocio ni ejecutes migraciones.

## Capturar errores de request

```ts title="instrumentation.ts"
import type { Instrumentation } from "next"

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context
) => {
  console.error({
    message: error.message,
    path: request.path,
    routerKind: context.routerKind,
    routeType: context.routeType
  })
}
```

En producción, envía el error a Sentry, OpenTelemetry u otro backend y sanitiza URLs, headers y payloads. No registres cookies, tokens, contraseñas ni cuerpos completos por defecto.

`onRequestError` recibe contexto de ruta además del error. Úsalo para agrupar fallos por `routePath`, tipo de router y fase de render. Una URL real puede contener identificadores o query sensible; registra una plantilla estable cuando sea posible.

## Las tres señales

| Señal    | Responde principalmente                         |
| -------- | ----------------------------------------------- |
| logs     | qué evento ocurrió y con qué contexto           |
| métricas | con qué frecuencia, latencia o saturación       |
| trazas   | por qué camino pasó una request entre servicios |

Un `requestId` correlaciona líneas del mismo flujo. Una **trace** agrega spans: unidades con inicio, fin, atributos y relación padre/hijo. No conviertas identificadores de alta cardinalidad, como `userId`, en nombres de métricas.

## Instrumentar una operación propia

```ts
import { trace } from "@opentelemetry/api"

const tracer = trace.getTracer("posts")

export async function publishPost(input: PublishPostInput) {
  return tracer.startActiveSpan("posts.publish", async (span) => {
    try {
      span.setAttribute("posts.visibility", input.visibility)
      return await repository.publish(input)
    } catch (error) {
      span.recordException(error as Error)
      throw error
    } finally {
      span.end()
    }
  })
}
```

Los atributos deben ser útiles, limitados y no sensibles. No incluyas contenido del post, email, tokens ni SQL completo.

## Qué inicializar aquí

- SDK de OpenTelemetry y exporters.
- Integración global de errores y métricas.
- Recursos que deben configurarse una vez por proceso.

También puede registrar instrumentación automática de `fetch`, base de datos y runtime, siempre que se revise su costo y redacción de datos.

No lo uses para abrir una conexión nueva por request ni para lógica de negocio. En entornos serverless pueden existir varias instancias: “una vez” significa una vez por instancia, no una vez global para toda la aplicación.

## Lista de comprobación

- ¿Los errores inesperados incluyen ruta, release y request id?
- ¿Se eliminan cookies, autorización, bodies y query sensible?
- ¿Las métricas usan nombres estables y cardinalidad limitada?
- ¿Los exporters tienen timeout y no bloquean la respuesta?
- ¿La instrumentación funciona en Node y se excluye del runtime que no soporta su SDK?
- ¿Se probó un error real en preview y se verificó su llegada al backend?

Referencia oficial: [Instrumentation](https://nextjs.org/docs/app/guides/instrumentation).
