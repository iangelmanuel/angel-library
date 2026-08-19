---
title: Ataques web comunes — cómo ocurren y cómo evitarlos
description: XSS, CSRF, inyección, SSRF, traversal y uploads explicados desde el punto de entrada hasta el control defensivo.
category: security
stack: security-aplicacion
order: 2
tags: [security, xss, csrf, injection, ssrf]
scope: vulnerabilidades web
related:
  - guides/security-threat-modeling
  - guides/security-headers-csp
  - practices/web-security-checklist
updatedAt: 2026-08-18
---

| Ataque | Cómo ocurre | Defensa principal |
| --- | --- | --- |
| XSS | input no confiable termina como HTML o script ejecutable | escape por contexto, sanitización y CSP defensiva |
| SQL/command injection | datos se concatenan en una consulta o comando | parámetros, APIs seguras y mínimo privilegio |
| CSRF | el navegador envía cookies a una acción iniciada desde otro sitio | SameSite, token/origin checks y métodos correctos |
| SSRF | el servidor solicita una URL elegida por el atacante | allowlist, bloquear redes internas y validar redirects/DNS |
| Path traversal | una ruta manipulada escapa del directorio permitido | ids opacos, normalización y raíz fija |
| Upload malicioso | contenido, tamaño o nombre abusa del servidor | límites, detección real de tipo, storage aislado y no ejecutar |

## XSS

Un comentario, query param o nombre de archivo puede alcanzar `innerHTML`, `set:html` o una template insegura. Prefiere text nodes y escaping automático. Si necesitas HTML enriquecido, sanitízalo con una política explícita. CSP reduce impacto, pero no sustituye la sanitización.

## Inyección

Validar que un id sea numérico ayuda, pero la defensa decisiva es no construir el intérprete con strings. Queries parametrizadas separan código y datos. Evita pasar input a shell; si es inevitable, usa una API sin shell y argumentos separados.

## SSRF y URLs

No basta comprobar que la URL empieza por `https`. Un dominio puede redirigir o resolver a localhost/metadata interna. Revalida destino tras resolución y redirects, limita protocolos, puertos, tamaño y tiempo, y aísla la red del worker.

## Señales de ataque

Picos de `403/429`, payloads con tags o metacaracteres, acceso a rutas internas, uploads atípicos y errores de parser deben quedar en logs estructurados sin almacenar secretos. Alerta por patrón y contexto, no por cada request aislada.

## CSRF y solicitudes repetidas

Si el navegador envía la cookie automáticamente, un sitio externo puede intentar una mutación aunque no pueda leer la respuesta. Usa `SameSite` apropiado, valida `Origin` o `Referer` cuando sea posible y un token CSRF para operaciones sensibles. No confundas CORS con CSRF: CORS controla lectura desde otro origen, no evita que se envíe la solicitud.

Los ataques no siempre son técnicamente complejos. Un atacante puede repetir un endpoint válido para enviar miles de correos, iniciar muchas recuperaciones de contraseña o consumir una API de pago. Aplica límites por identidad, IP, recurso y costo; usa idempotency keys cuando repetir la operación no deba duplicarla.

## Archivos y traversal

Guarda uploads fuera del directorio público o detrás de un servicio que no los ejecute, genera un nombre propio y valida tamaño, MIME real y dimensiones. Para descargas, usa un identificador que resuelva a una ruta permitida y verifica que la ruta normalizada siga dentro de la raíz. Nunca construyas la ruta final con un nombre de archivo sin validar.

## Respuesta y aprendizaje

Conserva suficiente contexto para investigar: usuario o request id seudonimizado, ruta, resultado, latencia y regla activada. No registres el payload completo si puede contener contraseñas o PII. Cuando confirmes un incidente, revoca sesiones, rota secretos, preserva evidencia y agrega una prueba que evite la regresión.
