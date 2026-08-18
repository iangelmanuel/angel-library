---
title: "Multi-stage builds"
description: Separar la etapa de build de la etapa de runtime en un mismo Dockerfile, para que la imagen final no cargue herramientas de compilación que no necesita.
category: devops
stack: docker-imagenes
order: 4
tags: [docker, multi-stage, imagenes, performance]
scope: multi-stage builds
related: [guides/docker-dockerfile-basico]
updatedAt: 2026-08-17
---

## El problema

Compilar una app (TypeScript → JS, un frontend con Vite, un binario de Go) necesita herramientas — compilador, `devDependencies`, a veces el código fuente completo. Pero para **correr** la app compilada, nada de eso hace falta. Si todo va en un solo `FROM`, la imagen final carga con herramientas de build que solo sirvieron una vez y después son peso muerto.

## La solución: varias etapas, una sola imagen final

```dockerfile title="Dockerfile"
# Etapa 1: build — tiene TypeScript, devDependencies, todo el código fuente
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Etapa 2: runtime — solo lo necesario para correr
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist

CMD ["node", "dist/server.js"]
```

- `AS build` nombra la primera etapa.
- `COPY --from=build /app/dist ./dist` copia **solo el resultado compilado** desde la etapa `build` hacia la etapa final — el compilador, el código TypeScript fuente y las `devDependencies` de la etapa `build` nunca llegan a la imagen final.

## Por qué importa

| | Sin multi-stage | Con multi-stage |
|---|---|---|
| Tamaño de imagen | Grande (incluye devDependencies, source, herramientas de build) | Chica (solo runtime + artefactos) |
| Superficie de ataque | Mayor (más paquetes = más CVEs potenciales) | Menor |
| Velocidad de deploy/pull | Más lenta (imagen más pesada) | Más rápida |

## Ejemplo con más de dos etapas

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
CMD ["node", "dist/server.js"]
```

Cada etapa puede referenciar otra etapa anterior como base (`FROM deps AS build`) — reutiliza su cache igual que cualquier otra imagen.

## Consideraciones

- Solo la **última** etapa del Dockerfile termina siendo la imagen final que `docker build` produce — las etapas intermedias existen solo durante el build (aunque quedan cacheadas para builds futuros).
- Se puede construir una etapa específica sin llegar al final, útil para debug: `docker build --target build -t mi-app-build .`.
