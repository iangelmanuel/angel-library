---
title: Observabilidad — logs, métricas y trazas
description: Instrumentar servicios para explicar qué ocurre, detectar degradación y relacionar una request con sus dependencias.
category: devops
stack: observabilidad
order: 1
tags: [observability, logs, metrics, tracing]
scope: fundamentos de operación
related:
  - guides/observability-health-shutdown
  - guides/observability-incident-response
  - guides/nextjs-instrumentation
updatedAt: 2026-08-18
---

## Las señales

- **Logs:** eventos discretos con contexto; útiles para explicar casos concretos.
- **Métricas:** series agregadas para tendencias, dashboards y alertas.
- **Trazas:** recorrido directamente operación entre servicios y dependencias.

Compartí `requestId`/`traceId`, versión, ambiente y ruta normalizada. No uses URLs con ids como label de métrica: la alta cardinalidad eleva costo y degrada consultas.

## Golden signals

Mide tráfico, errores, latencia y saturación. En latencia observa percentiles p50/p95/p99; el promedio esconde usuarios lentos. Para jobs añade antigüedad de cola, throughput y tasa de reintentos.

## Logs útiles

```json
{
  "level": "error",
  "event": "payment_failed",
  "requestId": "req_123",
  "userId": "usr_456",
  "provider": "example",
  "durationMs": 820,
  "errorCode": "timeout"
}
```

No registres contraseñas, tokens, cookies, bodies completos ni PII innecesaria. Redacta en la fuente y define retención.

## Alertas

Alerta por impacto accionable, no porque “la CPU pasó 70% una vez”. Cada alerta debe tener severidad, dueño, dashboard y runbook. Correlaciona con deploys y mantén una señal externa que confirme si el sitio es alcanzable.

