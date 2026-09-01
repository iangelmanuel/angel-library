---
title: Estrategias de despliegue y rollback
description: Elegir rolling, blue-green, canary o recreate según riesgo, capacidad, migraciones y tiempo de recuperación.
type: guides
order: 3
tags: [deployment, rollback, canary, devops]
scope: publicación a producción
related:
  - devops/ci-cd/cicd-pipeline-fundamentals
  - devops/observabilidad/observability-fundamentals
  - devops/observabilidad/observability-incident-response
updatedAt: 2026-08-18
---

| Estrategia | Ventaja | Costo/riesgo |
| --- | --- | --- |
| Recreate | simple | ventana de caída |
| Rolling | usa capacidad existente | conviven versiones |
| Blue-green | cambio y rollback rápidos | duplica ambiente temporalmente |
| Canary | limita impacto a parte del tráfico | requiere routing y observación fiables |

## Compatibilidad durante el deploy

Con rolling/canary, versión vieja y nueva acceden al mismo sistema. Aplica migraciones expand-contract:

1. añadir columnas/tablas compatibles;
2. desplegar código que soporte ambos modelos;
3. migrar datos;
4. retirar la forma antigua en un release posterior.

Una migración destructiva y un deploy de código en el mismo paso hacen que el rollback sea falso: el binario viejo ya no entiende la base.

## Criterios de éxito

Automatiza health checks y smoke tests, pero decide con señales de negocio y sistema: errores, latencia, saturación, login, checkout o creación de recursos. Define umbral y ventana antes de desplegar.

## Rollback y roll-forward

El rollback sirve cuando el artefacto anterior sigue siendo compatible. Si los datos o eventos ya cambiaron, puede ser más seguro corregir hacia adelante o apagar la funcionalidad con un flag. Practica ambos caminos y mide el tiempo real de recuperación.
