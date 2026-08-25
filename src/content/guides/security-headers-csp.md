---
title: Headers de seguridad y Content Security Policy
description: Configurar CSP, HSTS, framing, MIME y referrer policy como defensa en profundidad sin romper la aplicación.
category: security
stack: security-aplicacion
order: 4
tags: [security, headers, csp, xss]
scope: navegador y HTTP
related:
  - guides/security-common-web-attacks
  - guides/http-browser-fundamentals
  - practices/web-security-checklist
updatedAt: 2026-08-18
---

## Baseline razonable

```http
Content-Security-Policy: default-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; script-src 'self' 'nonce-...'; upgrade-insecure-requests
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Adapta las fuentes de imágenes, APIs, tipografías y scripts al proyecto. No copies una CSP con `'unsafe-inline'` y docenas de dominios sin entenderla: puede dar sensación de seguridad sin bloquear el vector real.

## Desplegar CSP

1. Inventariar recursos y terceros.
2. Empezar con `Content-Security-Policy-Report-Only`.
3. Revisar reportes y eliminar dependencias inesperadas.
4. Usar nonces por respuesta o hashes para scripts permitidos.
5. Aplicar la política y monitorear violaciones.

CSP controla qué puede ejecutar/cargar el documento y mitiga XSS; el input todavía debe escapar o sanitizarse.

## Matices

- HSTS solo después de confirmar HTTPS en todos los subdominios incluidos.
- `frame-ancestors` en CSP reemplaza casos de `X-Frame-Options` y evita clickjacking.
- CORS controla lectura entre orígenes; no autentica ni impide enviar requests.
- Headers deben probarse en respuestas de error, redirects y rutas dinámicas, no solo en `/`.

## CSP por etapas

Empieza con una política mínima en una ruta representativa y usa `Report-Only` para conocer scripts, imágenes, fuentes, frames y conexiones reales. Corrige dependencias inesperadas antes de aplicar el bloqueo. Un nonce debe generarse por respuesta y llegar solo al script que autorizas; no reutilices un nonce fijo en el código fuente.

```http
Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self' 'nonce-{requestNonce}'; object-src 'none'; report-to csp-endpoint
```

Evita permitir `*`, `data:` o `'unsafe-inline'` sin una razón concreta. Si un proveedor necesita scripts, restringe el origen y revisa qué otros dominios carga. La política de seguridad de contenido (CSP) reduce el impacto de una inyección, pero la defensa primaria sigue siendo escapar, validar y sanitizar según el contexto.

## Cookies, CORS y framing

Define explícitamente qué orígenes pueden leer una API y nunca reflejes cualquier `Origin` junto con credenciales. Configura `Access-Control-Allow-Credentials` solo cuando sea necesario y limita métodos y headers. Para una aplicación que no debe ser embebida, `frame-ancestors 'none'` protege mejor que confiar únicamente en una cabecera antigua.

Prueba headers en respuestas 200, 3xx, 4xx, archivos estáticos, rutas de autenticación y errores del proveedor. Un proxy o CDN puede reemplazarlos; verifica la respuesta pública, no solo la configuración de la aplicación.
