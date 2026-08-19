---
title: Node.js
description: Runtime de JavaScript para servidor, CLIs y automatización, basado en event loop e I/O no bloqueante.
category: backend
stack: node
tags: [node, javascript, backend, runtime]
website: https://nodejs.org
github: https://github.com/nodejs/node
related:
  - guides/node-events
  - guides/node-streams
  - guides/node-process
  - guides/node-commonjs-vs-esm
updatedAt: 2026-08-19
---

## Modelo mental

Node ejecuta JavaScript en un proceso con un event loop. I/O de red y filesystem se coordina de forma asíncrona; el código JavaScript pesado sigue ocupando el hilo principal si no se mueve a workers o procesos separados.

Un **runtime** o entorno de ejecución reúne el motor de JavaScript y APIs para interactuar con el sistema operativo. Node.js usa el motor V8 y ofrece módulos para procesos, archivos, red, criptografía y streams. No incluye el DOM del navegador.

## Para qué lo uso

- APIs, workers y backends orientados a I/O.
- Herramientas CLI y scripts de automatización.
- Build tooling del ecosistema frontend.
- Servicios que comparten tipos y lenguaje con el cliente.

## APIs fundamentales

| Área | Módulos/APIs |
| --- | --- |
| Proceso | `process`, señales, variables de entorno |
| Archivos | `node:fs/promises`, streams |
| Red | `node:http`, `fetch`, `URL` |
| Concurrencia | promesas, `worker_threads`, `child_process` |
| Módulos | ESM, `package.json`, exports |

**ESM** significa *ECMAScript Modules* y usa `import`/`export`. **CommonJS (CJS)** usa `require()` y `module.exports`. Ambos existen en el ecosistema, pero tienen reglas distintas de resolución y carga.

```js
// ESM
import { readFile } from 'node:fs/promises';

const text = await readFile(new URL('./data.txt', import.meta.url), 'utf8');
```

`node:` indica un módulo incorporado. `import.meta.url` representa la URL del módulo actual y evita asumir que el directorio de trabajo coincide con el directorio del archivo.

## Event loop, I/O y CPU

**I/O** significa entrada y salida: red, archivos o comunicación con otros procesos. Node puede esperar muchas operaciones de I/O sin dedicar un hilo de JavaScript a cada una.

Una tarea intensiva de **CPU** —por ejemplo, transformar una imagen o recorrer un JSON enorme— sigue bloqueando la ejecución de JavaScript en ese proceso. Para ese trabajo se usan `worker_threads`, procesos separados o un servicio especializado.

## Buffer y stream

Un `Buffer` representa bytes en memoria. Un **stream** procesa datos por partes sin necesitar cargar todo el contenido antes.

```js
import { createReadStream } from 'node:fs';
import { createServer } from 'node:http';

createServer((request, response) => {
  createReadStream('./large-video.mp4').pipe(response);
}).listen(3000);
```

La tubería limita memoria, pero debe manejar cancelación y errores. En código moderno, `stream.pipeline()` ayuda a propagar fallos y cerrar recursos.

## Variables de entorno y argumentos

`process.env` contiene cadenas o valores ausentes; no interpreta números ni valida configuración.

```ts
const rawPort = process.env.PORT ?? '3000';
const port = Number(rawPort);

if (!Number.isInteger(port) || port <= 0) {
  throw new Error('PORT debe ser un entero positivo');
}
```

`process.argv` contiene argumentos de la CLI. Para una herramienta pública conviene usar un parser que documente opciones, ayude con `--help` y reporte entradas inválidas.

## Cancelación y límites

Una promesa no se cancela automáticamente al desconectarse el cliente. `AbortController` comunica cancelación a APIs compatibles. Toda llamada remota necesita tiempo máximo, y toda entrada necesita límites de tamaño.

Los límites protegen memoria y disponibilidad: tamaño de body, concurrencia, duración de tarea y cantidad de resultados no deben quedar infinitos por defecto.

## Errores comunes

- Bloquear el event loop con CPU, JSON enorme o APIs síncronas en requests.
- Ignorar errores de promesas o eventos `error` en streams.
- Mantener conexiones y timers abiertos durante shutdown.
- Confiar en tipos TypeScript sin validar datos externos.

## Regla práctica

Diseña primero el ciclo de vida: inicio, request/job, cancelación y cierre. Un servicio sano no solo responde bien; también deja de aceptar trabajo, termina lo pendiente y cierra conexiones cuando recibe una señal de apagado.
