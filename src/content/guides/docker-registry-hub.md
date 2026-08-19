---
title: "Docker Hub y registries"
description: Qué es un registry, cómo hacer pull/push de imágenes, y cómo usar un registry privado.
category: devops
stack: docker-imagenes
order: 6
tags: [docker, registry, docker-hub, imagenes]
scope: registries
related: [guides/docker-build-tags]
updatedAt: 2026-08-17
---

## Qué es un registry

Un **registry** es donde viven las imágenes publicadas — un servidor de almacenamiento para imágenes indexadas por nombre y etiqueta. **Docker Hub** (`hub.docker.com`) es el registry público predeterminado: cuando ejecutas `docker run postgres`, la imagen `postgres` se descarga desde allí.

## Pull: descargar una imagen

```bash
docker pull postgres:16
docker pull node:20-alpine
```

`docker run` hace un `pull` automático si la imagen no existe localmente — no hace falta correr `pull` a mano salvo que se quiera descargar por adelantado.

## Push: publicar una imagen propia

1. Crear cuenta en [Docker Hub](https://hub.docker.com) (gratis).
2. Login desde la CLI:

```bash
docker login
```

3. Nombrar la imagen con el formato `usuario/nombre:tag`:

```bash
docker build -t mi-usuario/mi-app:1.0 .
docker push mi-usuario/mi-app:1.0
```

Si la imagen ya se construyó con otro nombre, se puede re-taggear sin reconstruir:

```bash
docker tag mi-app:1.0 mi-usuario/mi-app:1.0
docker push mi-usuario/mi-app:1.0
```

## Imágenes oficiales vs de usuario

```text
postgres:16              ← imagen oficial (sin prefijo de usuario)
mi-usuario/mi-app:1.0    ← imagen de un usuario/organización
ghcr.io/org/app:1.0      ← imagen en otro registry (GitHub Container Registry)
```

Las imágenes **oficiales** (sin prefijo, como `postgres`, `node`, `nginx`) están mantenidas por Docker o el proyecto mismo, y son las que conviene usar como base — están más auditadas y actualizadas que alternativas de terceros.

## Registries privados / alternativos

No todo tiene que vivir en Docker Hub:

```bash
docker pull ghcr.io/org/app:1.0             # GitHub Container Registry
docker pull registry.gitlab.com/org/app     # GitLab Container Registry
```

Para usarlos, el nombre completo incluye el host del registry (`ghcr.io/...`) — sin eso, Docker asume Docker Hub por defecto.

## Consideraciones

- Docker Hub tiene un límite de `pull` gratuito para cuentas anónimas/gratuitas — si un CI empieza a fallar con `429 Too Many Requests`, suele ser ese límite; hacer `docker login` (aunque sea con cuenta gratuita) sube el límite.
- Nunca pushear una imagen con secretos incluidos (ver [.dockerignore](/guides/docker-dockerignore)) — una imagen pública en Docker Hub es descargable por cualquiera.
