---
title: "Dockerfile básico"
description: Las instrucciones esenciales de un Dockerfile — FROM, RUN, COPY, WORKDIR, CMD, ENTRYPOINT, EXPOSE — y cómo se leen de arriba a abajo.
category: devops
stack: docker-imagenes
order: 1
tags: [docker, dockerfile, imagenes]
scope: Dockerfile
related: [guides/docker-capas-cache, guides/docker-build-tags]
updatedAt: 2026-08-17
---

## Qué es

Un `Dockerfile` es una receta de texto plano: una lista de instrucciones que Docker ejecuta en orden para construir una imagen. Cada instrucción agrega una capa (ver [Capas y cache](/guides/docker-capas-cache)).

## Ejemplo completo (Node)

```dockerfile title="Dockerfile"
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

## Instrucciones una por una

| Instrucción | Para qué |
|---|---|
| `FROM` | Imagen base sobre la que se construye — siempre la primera instrucción |
| `WORKDIR` | Directorio de trabajo dentro del contenedor (lo crea si no existe, y las instrucciones siguientes corren ahí) |
| `COPY` | Copia archivos del host a la imagen |
| `RUN` | Ejecuta un comando **durante el build** (instalar dependencias, compilar) |
| `EXPOSE` | Documenta qué puerto usa la app — no publica el puerto por sí solo, eso lo hace `docker run -p` |
| `CMD` | Comando por defecto al arrancar el contenedor — se puede sobrescribir al hacer `docker run <imagen> <otro-comando>` |
| `ENTRYPOINT` | Comando fijo que siempre corre — lo que venga después en `docker run` se le pasa como argumento, no lo reemplaza |
| `ENV` | Variable de entorno disponible en build y en runtime |
| `ARG` | Variable disponible solo **durante el build** (no queda en la imagen final) |

## `CMD` vs `ENTRYPOINT`

```dockerfile
# Con CMD: docker run mi-imagen otro-comando  →  corre "otro-comando"
CMD ["node", "server.js"]

# Con ENTRYPOINT: docker run mi-imagen --puerto 4000  →  corre "node server.js --puerto 4000"
ENTRYPOINT ["node", "server.js"]
```

- `CMD` solo: da un default, fácil de reemplazar entero.
- `ENTRYPOINT` solo: fija el proceso principal, cualquier argumento extra en `docker run` se agrega a continuación.
- Los dos juntos: `ENTRYPOINT` fija el binario, `CMD` da los argumentos por defecto (reemplazables).

## `FROM node:20-alpine`: eligiendo la imagen base

- `node:20` — imagen basada en Debian, más grande (~1 GB), más compatible con dependencias nativas.
- `node:20-alpine` — basada en Alpine Linux, mucho más chica (~150 MB), buena opción por defecto salvo que alguna dependencia nativa dé problemas de compatibilidad con `musl` (la libc de Alpine, distinta a `glibc`).
- `node:20-slim` — punto medio: Debian recortado, más chica que la completa sin los problemas de compatibilidad de Alpine.

## Forma de array vs forma de string

```dockerfile
CMD ["node", "server.js"]   # forma exec — recomendada, corre directo, sin shell intermedio
CMD node server.js          # forma shell — corre vía /bin/sh -c, permite variables ($VAR) pero agrega un proceso shell de más
```

La forma array (`exec form`) es la recomendada por defecto: el proceso corre directo como PID 1, sin un shell intermedio, lo que hace que señales como `SIGTERM` (usadas por `docker stop`) le lleguen correctamente a la app.

## Consideraciones

- El orden de las instrucciones importa para el cache de build — ver [Capas y cache](/guides/docker-capas-cache) antes de escribir un Dockerfile "de verdad".
- Un Dockerfile completo de producción normalmente usa multi-stage build (compilar en una etapa, correr en otra más liviana) — ver [Multi-stage builds](/guides/docker-multi-stage).
