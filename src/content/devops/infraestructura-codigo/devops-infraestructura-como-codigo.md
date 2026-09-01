---
title: Infraestructura como código — estado, plan y despliegue
description: Versionar recursos cloud mediante cambios revisables, estado protegido, módulos pequeños y detección de drift.
type: guides
order: 1
tags: [devops, iac, terraform, infrastructure, cloud]
related:
  - devops/cloud-fundamentos/devops-cloud-fundamentals
  - devops/ci-cd/cicd-pipeline-fundamentals
  - security/security-infra/security-secrets-supply-chain
updatedAt: 2026-08-19
---

**IaC** significa _Infrastructure as Code_ o infraestructura como código. Describe redes, permisos y servicios en archivos versionados para revisar, repetir y auditar cambios.

```hcl
resource "example_bucket" "assets" {
  name       = "app-assets-production"
  public     = false
  versioning = true
}
```

La sintaxis depende de la herramienta; el principio es declarar el estado deseado y comparar con el estado real antes de aplicar.

## Plan antes de aplicar

```text
código → validar → plan → revisión → aplicar → verificar → observar
```

Un plan puede mostrar creación, actualización o destrucción. Las operaciones de reemplazo merecen revisión especial porque pueden borrar datos o cambiar endpoints.

## Estado

Herramientas como Terraform conservan un **state** que relaciona recursos declarados y remotos. Trátalo como dato sensible:

- backend remoto con bloqueo;
- cifrado y versiones;
- acceso limitado a CI y responsables;
- nunca en Git;
- recuperación probada.

El **drift** aparece cuando alguien cambia recursos fuera de IaC. Detecta diferencias de forma periódica y decide si importar el cambio o devolver el recurso a lo declarado.

## Módulos y entornos

Un módulo debe representar una unidad con interfaz pequeña, no esconder toda la plataforma. Separa estados con distinto ciclo de vida o nivel de riesgo. Producción y desarrollo pueden compartir módulos, pero no credenciales ni el mismo estado.

## Secretos

El código referencia secretos desde un gestor; no incluye valores. Revisa que el plan y logs tampoco los impriman. Usa identidad temporal para CI en vez de claves cloud permanentes.

## Cambios seguros

- Fija versiones de proveedores y módulos.
- Ejecuta formato, validación y políticas en CI.
- Requiere aprobación para producción.
- Aplica desde una única ruta controlada.
- Verifica salud después del cambio y documenta rollback.
