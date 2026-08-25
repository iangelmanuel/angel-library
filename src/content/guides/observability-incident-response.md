---
title: Respuesta a incidentes y recuperación
description: Detectar, contener, comunicar y aprender de caídas, ataques y pérdida de datos con un runbook practicable.
category: devops
stack: observabilidad
order: 3
tags: [incident-response, reliability, backups, security]
scope: operación y recuperación
related:
  - guides/observability-fundamentals
  - guides/security-ddos-resilience
  - guides/cicd-deployment-strategies
updatedAt: 2026-08-25
---

## Durante el incidente

1. Nombrar responsable de coordinación y canal único.
2. Determinar impacto, alcance y momento de inicio.
3. Contener: rollback, feature flag, rate limit, aislamiento o rotación.
4. Preservar evidencia y anotar decisiones con hora.
5. Comunicar estado verificable, sin especular.
6. Recuperar y confirmar con métricas y flujo real.

Mitigar tiene prioridad sobre encontrar la causa perfecta. Evita varios cambios simultáneos sin registro: después no sabrás cuál funcionó.

## Roles y comunicación

Separa coordinación, investigación y comunicación cuando el tamaño lo permita. Mantén un timeline con UTC, evidencia, hipótesis y acción. Una actualización útil indica impacto observado, mitigación en curso y próxima hora de comunicación; evita prometer recuperación sin evidencia.

## Backups

Un backup existe solo si se puede restaurar. Define RPO —cuánto dato puedes perder— y RTO —cuánto puedes tardar—. Prueba restauración aislada, claves de cifrado, permisos y consistencia entre base, archivos y eventos.

## Postmortem

Reconstruye timeline, condiciones contribuyentes, detección, decisiones y por qué los controles no limitaron impacto. Las acciones deben tener dueño, prioridad y fecha. Evita “tener más cuidado”; prefiere cambios verificables en automatización, límites, arquitectura y runbooks.

```text
acción débil: revisar mejor los deploys
acción verificable: bloquear promoción si el smoke test de checkout falla
```

Revisa si detección, contención y recuperación cumplieron objetivos. Un postmortem sin seguimiento solo documenta la repetición futura.

## Kit mínimo

- contactos y accesos de emergencia;
- dashboards y queries guardadas;
- comandos de rollback y rotación;
- página de estado y plantillas de comunicación;
- inventario de datos/proveedores;
- procedimiento de restauración probado.

Realiza ejercicios de mesa y game days controlados. El objetivo no es sorprender al equipo, sino comprobar accesos, alertas, decisiones y rollback antes de una emergencia real.

