---
title: Atributos de calidad y diseño por escenarios
description: Traducir disponibilidad, rendimiento, seguridad, mantenibilidad y costo en escenarios medibles que guíen decisiones arquitectónicas.
category: architecture
stack: principios
order: 2
tags: [architecture, quality, reliability, performance, tradeoffs]
related:
  - guides/architecture-fundamentals-terminology
  - guides/architecture-decision-guide
  - practices/adr
updatedAt: 2026-08-25
---

Los requisitos funcionales dicen qué hace el sistema. Los **atributos de calidad** describen cómo debe comportarse: cuánto tarda, qué ocurre si falla una zona, quién puede acceder o cuánto cuesta cambiarlo.

## De adjetivo a escenario

“Debe ser escalable” no permite decidir ni probar. Conviértelo en un escenario:

```text
estímulo: campaña produce 2.000 requests/s
entorno: producción, una instancia degradada
respuesta: rechazar exceso de forma controlada y escalar
medida: p95 < 400 ms, errores < 1 %, sin pérdida de escrituras
```

La estructura completa identifica fuente, estímulo, entorno, artefacto afectado, respuesta y medida. La cifra puede cambiar; lo importante es hacer visible el contrato.

## Atributos frecuentes

| Atributo | Pregunta medible |
| --- | --- |
| disponibilidad | ¿qué porcentaje y qué funciones deben seguir? |
| rendimiento | ¿latencia y throughput bajo qué carga? |
| seguridad | ¿qué activo, actor y control se prueban? |
| modificabilidad | ¿qué cambio debe quedar localizado? |
| observabilidad | ¿cuánto tardamos en detectar y explicar? |
| recuperación | ¿RTO y RPO aceptables? |
| costo | ¿qué límite por usuario, request o mes? |

**RTO** (*Recovery Time Objective*) es el tiempo objetivo para restaurar. **RPO** (*Recovery Point Objective*) es cuántos datos se acepta perder medidos en tiempo.

## Los tradeoffs son el trabajo

Replicar mejora disponibilidad, pero aumenta costo y complejidad de consistencia. Cachear reduce latencia, pero introduce invalidación. Separar servicios permite despliegue independiente, pero añade red y operación.

```text
decisión → atributo que mejora → costo introducido → mitigación → evidencia
```

Registra el razonamiento en un ADR. Evita frases absolutas como “microservicios escalan mejor”; especifica qué dimensión y bajo qué escenario.

## Caso de uso

Para un checkout:

- pago: consistencia e idempotencia son críticas;
- recomendaciones: pueden degradarse;
- confirmación visual: necesita baja latencia percibida;
- correo: puede pasar a una cola;
- recuperación: una orden confirmada no puede perderse.

El diagrama resultante nace de prioridades distintas, no de aplicar el mismo patrón a todas las operaciones.

## Para aprender y recordar

Si aprendes, escribe tres escenarios antes de dibujar componentes. Si vienes a recordar, usa la tabla para revisar si una propuesta menciona carga, fallo, medida y costo. Una arquitectura sin escenarios no puede demostrar que es apropiada.
