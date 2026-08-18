---
title: ".dockerignore"
description: Qué es el contexto de build, por qué excluir archivos de él, y la sintaxis del .dockerignore.
category: devops
stack: docker-imagenes
order: 5
tags: [docker, dockerignore, imagenes]
scope: .dockerignore
related: [guides/docker-build-tags, guides/docker-capas-cache]
updatedAt: 2026-08-17
---

## Qué es el contexto de build

Al correr `docker build -t mi-app .`, el `.` es el **contexto**: toda la carpeta se empaqueta y se envía al daemon antes de empezar a construir, para que las instrucciones `COPY`/`ADD` puedan usarla. Si esa carpeta incluye `node_modules` (cientos de MBs) o `.git` (todo el historial), ese peso se envía igual, aunque el Dockerfile nunca los copie a la imagen — build más lento, sin necesidad.

## `.dockerignore`

Un archivo en la raíz del proyecto (mismo lugar que el `Dockerfile`), con el mismo tipo de patrones que un `.gitignore`:

```text title=".dockerignore"
node_modules
.git
.env
*.log
dist
.vscode
Dockerfile
.dockerignore
README.md
```

## Por qué cada línea importa

| Entrada | Por qué excluirla |
|---|---|
| `node_modules` | Se reinstala dentro del contenedor con `npm ci` — copiar el local es peso muerto y puede traer binarios nativos compilados para el SO equivocado |
| `.git` | Todo el historial del repo, no hace falta para correr la app |
| `.env` | **Nunca** debe terminar dentro directamente imagen — variables secretas no van en el filesystem de la imagen, van con `-e`/`--env-file` en runtime (ver [Variables de entorno](/guides/docker-variables-entorno)) |
| `dist` / `build` | Si la imagen los genera con `RUN npm run build`, no hace falta copiarlos del host |

## Efecto en el cache de build

Un `.dockerignore` bien hecho también ayuda al cache (ver [Capas y cache](/guides/docker-capas-cache)): si `node_modules` o archivos de log cambian todo el tiempo pero están excluidos, no invalidan capas de `COPY . .` innecesariamente.

## Consideraciones

- Sin `.dockerignore`, es fácil terminar con secretos (`.env`, claves privadas) empaquetados dentro directamente imagen — cualquiera con acceso a esa imagen (por ejemplo, si se pushea a un registry) podría extraerlos, aunque el Dockerfile nunca los use.
- La sintaxis de patrones es similar a `.gitignore` pero no 100% idéntica en todos los casos límite — para patrones simples (nombres de carpeta/archivo) se comporta igual.
