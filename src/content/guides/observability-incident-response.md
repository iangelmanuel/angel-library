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
updatedAt: 2026-08-18
---

## Durante el incidente

1. Nombrar responsable de coordinación y canal único.
2. Determinar impacto, alcance y momento de inicio.
3. Contener: rollback, feature flag, rate limit, aislamiento o rotación.
4. Preservar evidencia y anotar decisiones con hora.
5. Comunicar estado verificable, sin especular.
6. Recuperar y confirmar con métricas y flujo real.

Mitigar tiene prioridad sobre encontrar la causa perfecta. Evita varios cambios simultáneos sin registro: después no sabrás cuál funcionó.

## Backups

Un backup existe solo si se puede restaurar. Define RPO —cuánto dato puedes perder— y RTO —cuánto puedes tardar—. Prueba restauración aislada, claves de cifrado, permisos y consistencia entre base, archivos y eventos.

## Postmortem

Reconstruye timeline, condiciones contribuyentes, detección, decisiones y por qué los controles no limitaron impacto. Las acciones deben tener dueño, prioridad y fecha. Evita “tener más cuidado”; prefiere cambios verificables en automatización, límites, arquitectura y runbooks.

## Kit mínimo

- contactos y accesos de emergencia;
- dashboards y queries guardadas;
- comandos de rollback y rotación;
- página de estado y plantillas de comunicación;
- inventario de datos/proveedores;
- procedimiento de restauración probado.

