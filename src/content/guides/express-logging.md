---
title: Logging de requests
description: morgan para logs automáticos de cada request, y un logger propio cuando hace falta más control o structured logging.
category: backend
stack: express
order: 6
tags: [express, logging, morgan]
scope: logging middleware
updatedAt: 2026-08-16
---

Saber qué requests llegaron, con qué status respondieron y cuánto tardaron es la base para depurar cualquier problema en producción — sin logs, un bug reportado como "la API no anda" no tiene ningún rastro de qué pasó.

## `morgan`: logging automático

```bash
npm install morgan
```

```ts title="app.ts"
import express from 'express';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev')); // formato compacto y coloreado, pensado para desarrollo
```

```text
GET /usuarios 200 12.345 ms - 348
POST /usuarios 201 45.102 ms - 89
GET /usuarios/xyz 404 3.210 ms - 28
```

## Formatos predefinidos

```ts
app.use(morgan('tiny'));    // el más compacto
app.use(morgan('dev'));     // compacto + colores, para desarrollo
app.use(morgan('combined')); // formato estilo Apache, más completo, para producción
```

## Formato custom

```ts
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length]'),
);
```

## Loguear a un archivo en vez de la consola

```ts
import { createWriteStream } from 'node:fs';
import path from 'node:path';

const accessLogStream = createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });

app.use(morgan('combined', { stream: accessLogStream }));
```

`{ flags: 'a' }` (append) es importante — sin eso, el stream sobrescribiría el archivo en cada reinicio del servidor en vez de agregar al final.

## Cuando morgan no alcanza: structured logging

Para producción real, sobre todo con múltiples servicios, un logger que emite **JSON** estructurado (en vez de texto plano) es más fácil de indexar y buscar en herramientas como Datadog, CloudWatch o similares.

```bash
npm install pino pino-http
```

```ts
import pinoHttp from 'pino-http';

app.use(pinoHttp());
```

```json
{"level":30,"time":1723800000,"req":{"method":"GET","url":"/usuarios"},"res":{"statusCode":200},"responseTime":12}
```

`pino` es uno de los loggers más rápidos del ecosistema Node (diseñado para agregar el mínimo overhead posible) y emite JSON por defecto — el formato que la mayoría de las plataformas de observabilidad esperan.

## Loguear dentro de la lógica de negocio, no solo requests

`morgan`/`pino-http` loguean automáticamente cada request — pero eventos de negocio (un pago procesado, un usuario eliminado) necesitan su propio log explícito, en el lugar donde pasan:

```ts
import { logger } from './lib/logger'; // instancia de pino, configurada una vez

async function eliminarUsuario(id: string) {
  await prisma.user.delete({ where: { id } });
  logger.info({ userId: id }, 'Usuario eliminado');
}
```

## Herramientas por entorno

| Herramienta | Para qué |
| --- | --- |
| `morgan('dev')` | Log de cada request, formato legible, desarrollo |
| `morgan('combined')` | Formato más completo, estilo Apache, producción |
| `pino` + `pino-http` | JSON estructurado, alto rendimiento, para observabilidad real |
| Logs propios en la lógica de negocio | Eventos que importan más allá de "llegó una request" |

## Datos que no deben registrarse

- Loguear el body completo de cada request (incluyendo passwords, tokens, datos de tarjetas) es un riesgo de seguridad — cualquier logging automático debería excluir explícitamente campos sensibles.
- `console.log` a secas funciona para desarrollo local, pero no estructura nada ni tiene niveles (info/warn/error) — no reemplaza un logger real en producción.
