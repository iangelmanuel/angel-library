---
title: Respuesta a incidentes de seguridad
description: Preparar detección, contención, recuperación y aprendizaje para actuar sin improvisar ante filtraciones, abuso o compromiso.
category: security
stack: security-testing
order: 1
tags: [security, incident-response, logging, recovery, forensics]
related:
  - guides/security-threat-modeling
  - guides/observability-incident-response
  - guides/database-migraciones-backups
updatedAt: 2026-08-19
---

Un **incidente** es un evento que compromete o amenaza confidencialidad, integridad o disponibilidad. La preparación reduce tiempo de reacción y evita destruir evidencia durante el pánico.

## Ciclo operativo

```text
preparar → detectar → clasificar → contener → erradicar → recuperar → aprender
```

Define antes del incidente responsables, canales alternos, accesos de emergencia, contactos de proveedores y criterios de severidad. La misma cuenta comprometida no debe ser el único medio para coordinar la respuesta.

## Primeras preguntas

- ¿Qué señal disparó la alerta y desde cuándo?
- ¿Qué usuarios, datos, entornos y regiones pueden estar afectados?
- ¿El atacante mantiene acceso?
- ¿Qué cambio reversible reduce impacto sin borrar evidencia?
- ¿Existen obligaciones de notificación y quién las evalúa?

## Contener con cuidado

Rotar secretos, revocar sesiones, aislar una instancia o deshabilitar una función puede ser necesario. Conserva logs, timestamps, imágenes o snapshots según el entorno. No publiques detalles que faciliten explotación mientras el fallo sigue activo.

## Logs útiles

Registra autenticación, cambios de privilegios, acceso administrativo, rotación de claves y acciones críticas con identificadores de correlación. Protege los logs contra alteración y acceso excesivo. No registres contraseñas, tokens completos ni payloads sensibles por defecto.

## Recuperar y aprender

Comprueba que la causa fue eliminada, restaura desde fuentes confiables y aumenta monitoreo temporal. El postmortem debe distinguir causa técnica, condiciones que permitieron el impacto y controles faltantes. Convierte cada acción en responsable, plazo y verificación.

Un simulacro de mesa —recorrer un escenario sin afectar producción— revela permisos, contactos y pasos ausentes antes de necesitarlos.

