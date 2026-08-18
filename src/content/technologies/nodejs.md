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
updatedAt: 2026-08-18
---

## Modelo mental

Node ejecuta JavaScript en un proceso con un event loop. I/O de red y filesystem se coordina de forma asíncrona; el código JavaScript pesado sigue ocupando el hilo principal si no se mueve a workers o procesos separados.

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

## Errores comunes

- Bloquear el event loop con CPU, JSON enorme o APIs síncronas en requests.
- Ignorar errores de promesas o eventos `error` en streams.
- Mantener conexiones y timers abiertos durante shutdown.
- Confiar en tipos TypeScript sin validar datos externos.

## Regla práctica

Diseña primero el ciclo de vida: inicio, request/job, cancelación y cierre. Un servicio sano no solo responde bien; también deja de aceptar trabajo, termina lo pendiente y cierra conexiones cuando recibe una señal de apagado.
