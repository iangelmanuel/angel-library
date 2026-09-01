---
title: "Capas y cache de build"
description: Cómo se forma una imagen en capas, cómo Docker reutiliza capas sin cambios entre builds, y cómo ordenar el Dockerfile para aprovechar eso.
type: guides
order: 3
tags: [docker, cache, capas, imagenes, performance]
scope: cache de build
related: [devops/docker-imagenes/docker-dockerfile-basico]
updatedAt: 2026-08-17
---

## Cada instrucción es una capa

```dockerfile title="Dockerfile"
FROM node:20-alpine     ← capa 1 (imagen base)
WORKDIR /app             ← capa 2
COPY package.json .      ← capa 3
RUN npm ci                ← capa 4
COPY . .                  ← capa 5
CMD ["node", "server.js"] ← metadata, no genera capa de filesystem
```

Cada `RUN`, `COPY` y `ADD` agrega una capa de solo lectura al filesystem de la imagen, apilada sobre la anterior. La imagen final es la suma de todas las capas.

## El cache: por qué el segundo build es rápido

Docker cachea cada capa. Al reconstruir, compara cada instrucción con la ejecución anterior:

- Si la instrucción **y** lo que depende de ella (archivos copiados, instrucción anterior) no cambiaron → reusa la capa cacheada, sin volver a ejecutarla.
- Apenas una capa cambia, **todas las capas siguientes se invalidan** y se vuelven a ejecutar, aunque su contenido no haya cambiado.

Esto hace que el **orden** de las instrucciones importe muchísimo para la velocidad de build.

## El patrón: dependencias antes que código

```dockerfile title="Dockerfile — orden que aprovecha el cache"
FROM node:20-alpine
WORKDIR /app

# 1. Copiar solo el manifiesto de dependencias
COPY package.json package-lock.json ./
RUN npm ci

# 2. Recién ahora copiar el resto del código
COPY . .

CMD ["node", "server.js"]
```

Por qué funciona: el código de la aplicación cambia constantemente, pero las dependencias (`package.json`) cambian rara vez. Si `COPY . .` (todo el código) fuera **antes** de `npm ci`, cualquier cambio en una línea de código invalidaría también la capa de `npm ci`, reinstalando todas las dependencias en cada build aunque no haya cambiado ninguna.

Con el orden correcto: cambiar código → solo se reconstruyen las capas desde `COPY . .` en adelante; `npm ci` sigue cacheado.

## Comparación

```text
❌ Orden ingenuo                    ✅ Orden que aprovecha cache
COPY . .                            COPY package.json ./
RUN npm ci  ← se re-ejecuta         RUN npm ci  ← cacheado
                                     COPY . .
```

## Forzar un build sin cache

```bash
docker build --no-cache -t mi-app .
```

Útil para descartar que un problema sea "cache viejo" al debuggear, o para asegurar que una imagen se reconstruya 100% desde cero (por ejemplo, para traer parches de seguridad del sistema base).

## Consideraciones

- El mismo principio aplica a cualquier lenguaje: copiar primero el manifiesto de dependencias (`requirements.txt`, `go.mod`, `Cargo.toml`) e instalar, después copiar el resto del código.
- `.dockerignore` también afecta el cache — archivos que cambian todo el tiempo pero no deberían entrar a la imagen (como `node_modules` local o `.git`) invalidan cache innecesariamente si no están ignorados. Ver [.dockerignore](/devops/docker-imagenes/docker-dockerignore).
