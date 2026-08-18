---
title: Checklist de seguridad para aplicaciones web
description: Controles esenciales en autenticación, autorización, validación, sesiones, headers, dependencias y manejo de secretos.
category: security
tags: [security, backend, auth, validation]
practice: Tratar todo input y toda identidad como no confiables hasta validarlos en el servidor.
why: La mayoría de fallos graves aparecen en límites repetidos — permisos, datos externos, secretos y configuración—, no en algoritmos sofisticados.
related:
  - practices/validate-at-boundaries
  - guides/express-seguridad
updatedAt: 2026-08-18
---

## Identidad y permisos

- Autenticar no es autorizar: comprobar rol y ownership en cada operación sensible.
- Invalidar o rotar sesiones después de cambios de credenciales.
- Rate limit en login, recuperación, invitaciones y endpoints costosos.
- MFA para acciones administrativas cuando el riesgo lo justifique.

## Input y salida

- Validar body, params, query, headers y archivos en el servidor.
- Queries parametrizadas; nunca concatenar SQL.
- Escapar según contexto de salida y evitar HTML crudo no confiable.
- Limitar tamaño, tipo y cantidad de uploads.

## Cookies y navegador

- Cookies de sesión con `httpOnly`, `secure` y `sameSite` apropiado.
- Protección CSRF cuando la autenticación viaja automáticamente en cookies.
- CSP, HSTS, `X-Content-Type-Options` y política de framing según la aplicación.
- CORS con orígenes explícitos; no es un mecanismo de autenticación.

## Secretos y operación

- Secretos fuera del repositorio, logs, imágenes Docker y bundles cliente.
- Dependencias bloqueadas y actualizadas con revisión de advisories.
- Logs auditables sin tokens ni datos personales innecesarios.
- Backups restaurables; probar restauración, no solo creación.

## Respuesta a incidentes

Saber qué rotar, cómo cerrar sesiones, dónde buscar trazas y cómo notificar es parte del diseño. Una aplicación sin plan de recuperación depende de improvisar cuando ya está bajo presión.

## Antes de publicar

- Modelo de amenazas actualizado para las rutas nuevas y sus límites de confianza.
- Autorización probada con usuario propietario, usuario ajeno, rol bajo y cuenta suspendida.
- Validación de body, query, headers, archivos y respuestas externas en el servidor.
- Rate limits, timeouts, límites de tamaño y límites de costo definidos para operaciones caras.
- Cookies, CSP, CORS, HSTS y headers revisados desde la respuesta pública.
- Dependencias bloqueadas, acciones de CI revisadas y secretos fuera de repositorio, bundles y artefactos.
- Logs con request id y auditoría suficiente, sin tokens, contraseñas ni PII innecesaria.
- Backups restaurados en un entorno aislado y runbook de incidente probado.

## Cuando aparece una señal

No borres logs ni reinicies todo sin preservar contexto. Reduce impacto con una regla temporal, revoca sesiones o secretos afectados, limita endpoints costosos y comunica un estado claro. Después de contener, identifica el alcance, corrige la causa, agrega una prueba de regresión y registra las acciones con dueño y fecha.
