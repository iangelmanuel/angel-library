---
title: Idempotencia y caché en APIs
description: Evitar operaciones duplicadas y respuestas obsoletas mediante claves de idempotencia, validadores HTTP y estrategias de invalidación.
type: guides
order: 3
tags: [backend, api, idempotency, cache, http]
related:
  - backend/backend-fundamentos/backend-api-design
  - database/database-postgresql/postgresql-transacciones-concurrencia
  - performance/performance-operacion/performance-cache-cdn
updatedAt: 2026-08-19
---

Una operación **idempotente** produce el mismo efecto observable aunque se repita con la misma intención. Es esencial porque clientes, proxies y workers reintentan ante timeouts sin saber si el servidor alcanzó a confirmar la primera solicitud.

## Clave de idempotencia

```http
POST /payments HTTP/1.1
Idempotency-Key: 5c75b14c-...
Content-Type: application/json
```

El servidor guarda la clave junto con identidad, hash del payload, estado y respuesta. Si vuelve a recibirla:

- mismo usuario y payload: devuelve la respuesta registrada;
- payload distinto: rechaza el conflicto;
- operación todavía en curso: informa un estado reintentable;
- clave expirada: aplica la política documentada.

La reserva de la clave y el cambio de negocio deben coordinarse mediante transacción o una garantía equivalente. Guardarla solo en memoria falla al reiniciar o escalar horizontalmente.

## Caché HTTP

```http
Cache-Control: public, max-age=60, stale-while-revalidate=300
ETag: "catalog-v42"
```

- `private` permite caché del navegador, pero no compartida.
- `no-store` evita almacenar información sensible.
- `max-age` define frescura.
- `ETag` permite una solicitud condicional con `If-None-Match` y una respuesta `304` sin cuerpo.

No marques como `public` una respuesta personalizada sin una clave de caché que incluya correctamente autorización, idioma y demás variaciones.

## Caché de aplicación

En **cache-aside**, la aplicación consulta caché, recupera la fuente al fallar y guarda el resultado con TTL. La invalidación es parte del diseño:

```text
actualizar fuente → confirmar → eliminar clave derivada → próxima lectura repuebla
```

Protege contra **cache stampede**: muchas solicitudes detectan la misma ausencia y recalculan a la vez. Usa bloqueo corto, petición compartida o expiración con dispersión aleatoria.

## Regla de decisión

La idempotencia protege escrituras repetidas; la caché evita trabajo repetido de lectura. No uses caché para ocultar una consulta defectuosa ni idempotencia para reemplazar restricciones únicas.

