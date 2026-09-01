---
title: Desarrollo seguro — controles desde diseño hasta producción
description: Integrar threat modeling, revisión, análisis de dependencias, pruebas y monitoreo en el SDLC sin convertir seguridad en un paso final.
type: guides
order: 1
tags: [security, sdlc, testing, review, supply-chain]
related:
  - security/security-fundamentos/security-threat-modeling
  - security/security-infra/security-secrets-supply-chain
  - security/security-testing/web-security-checklist
updatedAt: 2026-08-25
---

**SDLC** significa *Software Development Life Cycle* o ciclo de vida del desarrollo. Un SDLC seguro coloca controles donde son más baratos y efectivos: requisitos, diseño, implementación, CI, despliegue y operación.

## Controles por etapa

| Etapa | Pregunta y evidencia |
| --- | --- |
| requisito | ¿qué datos y abuso deben considerarse? |
| diseño | modelo de amenazas y fronteras |
| código | validación, permisos y revisión |
| CI | tests, SAST, secretos y dependencias |
| deploy | configuración, mínimo privilegio y rollback |
| producción | logs, alertas, rate limits e incidentes |

**SAST** analiza código sin ejecutarlo. **DAST** prueba una aplicación en ejecución desde fuera. Ninguna herramienta demuestra seguridad completa; detectan clases distintas y producen falsos positivos y negativos.

## Pull request sensible

Una PR que toca autenticación, parser, upload, redirect, consulta, webhook o permisos debe responder:

- ¿qué entrada deja de ser confiable y dónde se valida?
- ¿qué identidad y permiso se comprueban?
- ¿hay un recurso concreto que exige ownership?
- ¿qué dato podría aparecer en logs o errores?
- ¿cómo se prueba un intento no autorizado?

```ts
it('impide leer una orden de otro tenant', async () => {
  const response = await apiAs(userFromTenantA).get('/orders/order-from-tenant-b');
  expect(response.status).toBe(404);
});
```

Responder `404` puede evitar confirmar que el recurso existe; la política debe ser consistente.

## Pipeline con señal útil

Ejecuta rápido primero: lint de seguridad y secretos, tests, auditoría de dependencias y build. Escaneos profundos pueden ir en jobs paralelos o programados. Un hallazgo necesita propietario, severidad, ruta de excepción y fecha; bloquear todo sin triage enseña al equipo a ignorar la herramienta.

## Probar abuso

Incluye autorización horizontal/vertical, límites, tipos inesperados, duplicación, replay, archivos, redirects y dependencia caída. Prueba controles en la frontera real HTTP, no únicamente helpers internos.

## Producción cierra el ciclo

Monitorea picos de `401/403/429`, cambios de permisos, creación de claves y acciones administrativas. Un incidente genera casos de regresión, mejora del modelo de amenazas y actualización del runbook.

## Espacio seguro de aprendizaje

Realiza pruebas activas únicamente en sistemas propios, entornos de laboratorio o con autorización explícita. Documentar ataques sirve para reconocer y prevenir, no para ampliar el alcance sobre terceros.

## Fuentes para profundizar

- [OWASP Developer Guide](https://owasp.org/www-project-developer-guide/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/latest/)

OWASP plantea la seguridad como parte del mismo ciclo de desarrollo, no como una revisión aislada al final. Las herramientas cambian; los requisitos, el modelo de amenazas y la verificación del control deben permanecer documentados.
