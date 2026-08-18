---
title: Seguridad en Express — Helmet y buenas prácticas
description: Headers de seguridad con helmet, límites de tamaño de body, y una mención a rate limiting contra fuerza bruta.
category: backend
stack: express
order: 6
tags: [express, security, helmet]
scope: helmet / seguridad básica
related: [guides/express-cors]
updatedAt: 2026-08-16
---

Express no configura ningún header de seguridad por defecto — `helmet` es el paquete estándar que agrupa un conjunto de headers HTTP recomendados en uno solo.

## Instalación

```bash
npm install helmet
```

```ts title="app.ts"
import express from 'express';
import helmet from 'helmet';

const app = express();

app.use(helmet()); // aplica un set de headers seguros por defecto, sin configuración extra
```

## Qué headers agrega (los más relevantes)

```text
Content-Security-Policy    → limita de dónde puede cargar recursos la página (scripts, estilos, imágenes)
Strict-Transport-Security  → fuerza HTTPS en visitas futuras
X-Content-Type-Options     → evita que el navegador "adivine" el tipo de un archivo (MIME sniffing)
X-Frame-Options             → evita que el sitio se cargue dentro de un <iframe> ajeno (clickjacking)
```

`helmet()` sin argumentos ya aplica un preset razonable — no hace falta configurar cada header a mano para empezar.

## Configurar un header puntual

```ts
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.ejemplo.com'],
      },
    },
  }),
);
```

## Límite de tamaño del body

Sin límite, un cliente (malicioso o con un bug) puede mandar un body gigante y agotar la memoria del servidor antes de que la request llegue a validarse.

```ts
app.use(express.json({ limit: '1mb' }));
```

## Rate limiting: mención

Helmet no protege contra fuerza bruta (miles de intentos de login por segundo desde la misma IP) — eso es un problema distinto, resuelto con **rate limiting**:

```bash
npm install express-rate-limit
```

```ts
import rateLimit from 'express-rate-limit';

const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,                    // máximo 5 intentos por IP en esa ventana
  message: { error: 'Demasiados intentos, probá de nuevo más tarde' },
});

app.post('/login', limiterLogin, handlerDeLogin);
```

Aplicar el rate limit **solo** a rutas sensibles (login, registro, recuperar contraseña) en vez de a toda la API es lo típico — un límite global muy estricto afecta uso legítimo normal.

## Resumen

| Herramienta | Protege contra |
| --- | --- |
| `helmet()` | Headers de seguridad HTTP faltantes por defecto |
| `express.json({ limit })` | Bodies gigantes agotando memoria |
| `express-rate-limit` | Fuerza bruta / abuso por volumen de requests |
| CORS (ver guía aparte) | Que el navegador exponga la respuesta a orígenes no autorizados |

## Consideraciones

- `helmet()` es un buen default, no una configuración final — un `Content-Security-Policy` real necesita ajustarse a qué scripts/estilos externos usa realmente el proyecto (un CSP muy estricto por defecto puede romper cosas que sí necesitás cargar).
- Rate limiting en memoria (como el ejemplo de arriba) se resetea si el proceso se reinicia y no se comparte entre múltiples instancias del servidor — para producción con más de un proceso, hace falta un store compartido (Redis) para que el límite sea real entre todas las instancias.
