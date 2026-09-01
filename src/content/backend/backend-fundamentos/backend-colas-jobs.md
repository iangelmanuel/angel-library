---
title: Colas, workers y jobs en segundo plano
description: Mover trabajo lento fuera de la solicitud con entrega reintentable, idempotencia, backoff, dead-letter queues y observabilidad.
type: guides
order: 5
tags: [backend, queues, workers, jobs, retries]
related:
  - backend/backend-fundamentos/backend-idempotencia-cache
  - devops/observabilidad/observability-fundamentals
  - security/security-infra/security-ddos-resilience
updatedAt: 2026-08-19
---

Una **cola** desacopla al productor del consumidor. La API confirma que aceptó una tarea y un **worker** la procesa después. Es útil para correos, generación de archivos, importaciones, webhooks y trabajos costosos que no deben mantener una conexión HTTP abierta.

```text
API → guardar cambio + evento → cola → worker → proveedor externo
                                  └→ reintento / dead-letter queue
```

## Semántica de entrega

Muchas colas ofrecen entrega **al menos una vez**: un mensaje puede reaparecer si el worker termina después de ejecutar el efecto pero antes de confirmar. Por ello el consumidor debe ser idempotente.

```ts
async function processEmail(job: EmailJob) {
  if (await processedJobs.exists(job.id)) return

  await emailProvider.send(job.payload)
  await processedJobs.mark(job.id)
}
```

Para efectos críticos, el registro de procesamiento requiere una transacción o una clave idempotente aceptada por el proveedor. El ejemplo muestra la intención, no una garantía atómica completa.

## Reintentos

- Reintenta errores transitorios: timeout, `429` o indisponibilidad.
- No reintentes indefinidamente datos inválidos o permisos denegados.
- Usa **exponential backoff** con jitter para no golpear al proveedor al mismo tiempo.
- Envía fallos agotados a una **DLQ** (_Dead-Letter Queue_ o cola de mensajes no procesados) para inspección y reproceso controlado.

## Operación

Mide profundidad de cola, edad del mensaje más antiguo, tasa de éxito, reintentos y duración. Escalar workers por cantidad de mensajes puede ser insuficiente si la dependencia externa tiene límites; aplica concurrencia y rate limiting.

Cada job debe incluir identificador, versión de payload, fecha, tenant y correlación, pero no secretos innecesarios. Define también cancelación, prioridad y cuánto tiempo conserva sentido ejecutarlo.
