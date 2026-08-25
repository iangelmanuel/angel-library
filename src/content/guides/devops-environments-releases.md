---
title: Entornos, configuración y promoción de releases
description: Separar artefacto y configuración, promover la misma build, administrar secretos y diseñar releases verificables y reversibles.
category: devops
stack: devops-fundamentos
order: 2
tags: [devops, environments, releases, configuration, deployment]
related:
  - guides/cicd-pipeline-fundamentals
  - guides/cicd-deployment-strategies
  - guides/security-secrets-supply-chain
updatedAt: 2026-08-25
---

Un entorno es una combinación de infraestructura, configuración y datos donde corre un artefacto. Desarrollo, preview, staging y producción tienen propósitos distintos; intentar hacerlos idénticos suele ser menos útil que conservar las mismas garantías importantes.

## Artefacto inmutable

```text
commit → verificar → construir artefacto v42
                         ├→ preview + config preview
                         ├→ staging + config staging
                         └→ producción + config producción
```

Promueve el mismo artefacto probado. Si producción vuelve a compilar, ya no se despliega exactamente lo validado. La configuración cambia por entorno mediante variables o un servicio de configuración, sin incluir secretos en la imagen.

## Qué debe variar

| Configuración | Ejemplo |
| --- | --- |
| endpoint externo | sandbox frente a proveedor real |
| credencial | clave propia del entorno |
| capacidad | réplicas o límites |
| telemetría | dataset y release identificable |
| feature flag | activación controlada |

No uses `NODE_ENV` como único interruptor para decenas de comportamientos. Configura capacidades explícitas y valida al iniciar.

## Datos y migraciones

Staging no necesita una copia sin sanitizar de producción. Usa datos sintéticos o anonimizados. Una migración compatible con despliegue gradual sigue **expand/contract**:

1. agregar estructura compatible;
2. desplegar código que entiende versión anterior y nueva;
3. migrar o rellenar datos;
4. retirar campo anterior en otro release.

Así rollback del código no depende de reconstruir de inmediato el esquema antiguo.

## Release y despliegue

Un **release** es una versión aprobada del producto. Un **deployment** instala una versión en un entorno. Puede existir un deployment sin exponer la función gracias a flags, y un release puede promoverse progresivamente.

Después de desplegar verifica health, errores, métricas de negocio y una operación sintética. Define quién detiene la promoción y qué señal activa rollback.

## Rollback y roll-forward

Rollback restaura un artefacto anterior; roll-forward publica una corrección. El primero debe ser rápido, pero puede fallar si hubo cambios de datos incompatibles. Practica ambos caminos y conserva artefactos, configuración y procedimiento.

## Criterio de confianza

Puedes responder qué commit corre, con qué configuración no secreta, quién lo promovió, qué migraciones aplicó, cómo se verifica y cuánto tarda volver a una versión segura.

