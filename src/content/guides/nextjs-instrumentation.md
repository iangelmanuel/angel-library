---
title: Instrumentation y observabilidad
description: Inicialización del servidor, trazas OpenTelemetry y captura global de errores de request con instrumentation.ts.
category: backend
stack: nextjs
order: 4
tags: [nextjs, observability, logging, opentelemetry]
scope: next.js instrumentation
related:
  - guides/nextjs-backend-arquitectura
  - guides/express-logging
updatedAt: 2026-08-18
---

`instrumentation.ts` es el punto de entrada para registrar observabilidad antes de que la aplicación empiece a atender requests. Vive en la raíz del proyecto o dentro de `src/`, al mismo nivel que `app/`.

```ts title="instrumentation.ts"
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./src/instrumentation.node');
  }
}
```

## Capturar errores de request

```ts title="instrumentation.ts"
import type { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  console.error({
    message: error.message,
    path: request.path,
    routerKind: context.routerKind,
    routeType: context.routeType,
  });
};
```

En producción, enviá el error a Sentry, OpenTelemetry u otro backend y sanitizá URLs, headers y payloads. No registres cookies, tokens, contraseñas ni cuerpos completos por defecto.

## Qué inicializar aquí

- SDK de OpenTelemetry y exporters.
- Integración global de errores y métricas.
- Recursos que deben configurarse una vez por proceso.

No lo uses para abrir una conexión nueva por request ni para lógica de negocio. En entornos serverless pueden existir varias instancias: “una vez” significa una vez por instancia, no una vez global para toda la aplicación.

Referencia oficial: [Instrumentation](https://nextjs.org/docs/app/guides/instrumentation).
