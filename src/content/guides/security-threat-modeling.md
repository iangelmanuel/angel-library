---
title: Modelo de amenazas para aplicaciones web
description: Identificar activos, atacantes, superficies y controles antes de que un fallo llegue a producción.
category: security
stack: security-fundamentos
order: 2
tags: [security, threat-modeling, architecture, risk]
scope: fundamentos de seguridad
related:
  - guides/security-common-web-attacks
  - practices/web-security-checklist
  - practices/validate-at-boundaries
updatedAt: 2026-08-18
---

## Empezar por el sistema real

Un modelo de amenazas no es una lista genérica. Dibuja navegador, API, base de datos, storage, proveedores, CI/CD y administradores. Marca límites de confianza y qué datos cruzan cada uno.

## Preguntas por flujo

1. ¿Qué activo protegemos: cuentas, dinero, PII, disponibilidad, código o reputación?
2. ¿Quién puede iniciar el flujo y qué controla?
3. ¿Dónde se autentica y dónde se autoriza?
4. ¿Qué input llega a intérpretes, templates, SQL, shell o URLs remotas?
5. ¿Qué ocurre si repiten, alteran, retrasan o multiplican la operación?
6. ¿Cómo detectamos abuso y cómo recuperamos el servicio?

## Ejemplo: cambiar correo

Un atacante puede robar una sesión, forzar una request desde otro sitio, cambiar el id del usuario o abusar del endpoint miles de veces. Controles: reautenticación, autorización sobre el usuario de sesión, protección CSRF, notificación al correo anterior, rate limit y log de auditoría.

## Priorizar

Evalúa probabilidad, impacto y exposición. Un panel interno no es automáticamente seguro; una credencial filtrada puede volverlo público. Prioriza acceso roto, secretos, operaciones irreversibles, dependencias de supply chain y rutas que consumen recursos caros.

Revisa el modelo cuando cambien autenticación, proveedores, datos sensibles o arquitectura. Cada incidente y bug de autorización debe alimentar el documento.

## Inventario y límites de confianza

Empieza con una tabla sencilla: activo, propietario, impacto, ubicación y controles actuales. Después dibuja cada salto entre navegador, CDN, API, workers, base de datos, almacenamiento, proveedor de pagos y panel administrativo. Un límite de confianza existe cuando cambia la identidad, el nivel de privilegio o la capacidad de controlar el dato.

| Flujo | Activo | Riesgo si se altera | Control mínimo |
| --- | --- | --- | --- |
| Crear una orden | dinero e inventario | cobro duplicado o stock negativo | autorización, idempotencia y transacción |
| Subir avatar | archivo y disponibilidad | malware o consumo de almacenamiento | límites, tipo real y storage no ejecutable |
| Webhook de pago | estado de la orden | marcar como pagada una orden falsa | firma, replay protection y auditoría |

## Del riesgo al requisito

Cada riesgo debe terminar en un control verificable y una prueba. “Proteger el endpoint” es demasiado abstracto; “rechazar una orden si el usuario no es propietario, repetir el webhook no cambia el total y registrar el evento” sí puede comprobarse. Define también la señal que mostraría un abuso y quién debe responder.

## Revisión liviana en cada feature

Antes de fusionar una funcionalidad, pregunta qué datos nuevos entran, qué permisos cambian, qué operaciones cuestan dinero o CPU, qué tercero se incorpora y cómo se revoca el acceso. Para cambios pequeños basta una nota en el pull request; para pagos, datos sensibles o nuevos límites de confianza, realiza una sesión breve con desarrollo, producto y operaciones.
