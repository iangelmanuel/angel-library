---
title: Respuesta a incidentes de seguridad
description: Preparar detección, contención, recuperación y aprendizaje para actuar sin improvisar ante filtraciones, abuso o compromiso.
type: guides
order: 2
tags: [security, incident-response, logging, recovery, forensics]
related:
  - security/security-fundamentos/security-threat-modeling
  - devops/observabilidad/observability-incident-response
  - database/database-operacion/database-migraciones-backups
updatedAt: 2026-08-25
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

Contención corta acceso; erradicación elimina la causa. Rotar una clave sin corregir la ruta que la expuso solo reinicia el problema. Mantén una cadena de custodia adecuada cuando exista requisito legal o forense y solicita asesoría especializada según el impacto.

## Logs útiles

Registra autenticación, cambios de privilegios, acceso administrativo, rotación de claves y acciones críticas con identificadores de correlación. Protege los logs contra alteración y acceso excesivo. No registres contraseñas, tokens completos ni payloads sensibles por defecto.

## Recuperar y aprender

Comprueba que la causa fue eliminada, restaura desde fuentes confiables y aumenta monitoreo temporal. El postmortem debe distinguir causa técnica, condiciones que permitieron el impacto y controles faltantes. Convierte cada acción en responsable, plazo y verificación.

Un simulacro de mesa —recorrer un escenario sin afectar producción— revela permisos, contactos y pasos ausentes antes de necesitarlos.

## Comunicación y personas afectadas

Define quién evalúa obligaciones contractuales y regulatorias. Comunica hechos confirmados, alcance conocido, acciones de protección y próxima actualización. No minimices ni atribuyas causa antes de la investigación.

## Ejercicio de mesa

Escenario: una clave de proveedor aparece en un repositorio público. Recorre detección, revocación, búsqueda de uso, rotación de derivados, revisión de logs, notificación y prevención. Cronometra cuánto tarda el equipo en encontrar accesos y responsables.

## Checklist inmediato

1. Abrir canal y asignar coordinación.
2. Registrar hora, señal y alcance inicial.
3. Preservar evidencia antes de cambios irreversibles.
4. Contener con la acción reversible más segura.
5. Rotar o revocar y buscar persistencia.
6. Recuperar desde estado confiable y aumentar monitoreo.
7. Crear acciones verificables con responsable y fecha.

