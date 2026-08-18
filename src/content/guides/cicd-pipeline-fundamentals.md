---
title: CI/CD — pipeline desde commit hasta producción
description: Diseñar integración y entrega continua con validaciones rápidas, artefactos inmutables, ambientes y promoción segura.
category: devops
stack: ci-cd
order: 1
tags: [devops, ci, cd, deployment]
scope: fundamentos de entrega continua
related:
  - guides/cicd-github-actions-node
  - guides/cicd-deployment-strategies
  - guides/security-secrets-supply-chain
updatedAt: 2026-08-18
---

## CI y CD

**Integración continua** valida cada cambio: formato, tipos, tests, seguridad y build. **Entrega continua** produce un artefacto listo y repetible. **Despliegue continuo** además lo publica automáticamente cuando pasa las políticas.

## Pipeline base

1. Instalar con lockfile de forma reproducible.
2. Ejecutar checks rápidos en paralelo.
3. Correr integración/E2E según riesgo.
4. Construir una sola vez.
5. Escanear y guardar el artefacto con versión.
6. Desplegar el mismo artefacto por ambientes.
7. Ejecutar smoke tests y observar métricas.

No recompiles para producción con dependencias distintas: promocioná el artefacto ya validado e inyectá configuración en runtime cuando la plataforma lo permita.

## Feedback y seguridad

La ruta feliz debe ser rápida. Guarda en caché dependencias con clave basada en lockfile y cancela runs obsoletos de la misma rama. Protege secretos de forks, otorgá permisos mínimos al token del workflow y separa quien modifica el pipeline de quien aprueba producción.

## Fallos

Un pipeline rojo debe decir qué falló y conservar logs/artefactos útiles. No ocultes tests flaky con reintentos ilimitados. Si una etapa no es confiable, asignale dueño, mide su tasa de fallo y corregila o retirala temporalmente de forma explícita.

