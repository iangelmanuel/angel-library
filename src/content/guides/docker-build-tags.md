---
title: "docker build y tags"
description: Construir una imagen a partir de un Dockerfile, nombrarla y versionarla con tags — convenciones que evitan el infame "latest" roto.
category: devops
stack: docker-imagenes
order: 2
tags: [docker, build, tags, imagenes]
scope: docker build
related: [guides/docker-dockerfile-basico]
updatedAt: 2026-08-17
---

## `docker build`

```bash
docker build -t mi-app:1.0 .
```

- `-t mi-app:1.0` — nombre (`mi-app`) y tag (`1.0`) de la imagen resultante.
- `.` — el **contexto de build**: la carpeta que se envía al daemon para que `COPY`/`ADD` puedan usarla. Casi siempre el directorio actual del proyecto.

```bash
docker build -t mi-app:1.0 -f docker/Dockerfile.prod .
```

`-f` apunta a un Dockerfile con otro nombre o ubicación (útil cuando hay varios: uno para dev, otro para prod).

## Nombre y tag

```text
mi-app:1.0
└─┬─┘ └┬┘
  │    └─ tag (versión)
  └─ nombre (repositorio)
```

Sin tag explícito, Docker usa `latest` por defecto:

```bash
docker build -t mi-app .
# equivalente a
docker build -t mi-app:latest .
```

## Por qué `latest` no significa "la más nueva"

`latest` es **solo un tag más** — no se actualiza automáticamente ni Docker lo trata como especial. Si nadie hace `docker build -t mi-app:latest` de nuevo, `latest` sigue apuntando a lo que apuntaba antes, aunque existan tags más nuevos (`mi-app:2.0`). Confiar en `latest` en producción es una fuente común de bugs ("¿por qué el servidor corre código viejo si ya pusheé?").

## Convención recomendada para versionar

```bash
docker build -t mi-app:1.4.2 .
docker build -t mi-app:1.4 .      # opcional: tag de minor
docker build -t mi-app:latest .   # opcional: solo si de verdad se quiere mantener actualizado
```

Para proyectos personales, alcanza con:

- Un tag por versión de la app (`1.0`, `1.1`...) o por commit (`git-a1b2c3d`).
- En desarrollo local, `latest` está bien porque uno mismo controla cuándo reconstruir.

## Múltiples tags a la misma imagen

```bash
docker build -t mi-app:1.0 -t mi-app:latest .
```

Un solo build, dos referencias apuntando a la misma imagen — útil para taggear con la versión exacta y además actualizar `latest`.

## Ver y borrar imágenes locales

```bash
docker images                 # listar imágenes locales
docker rmi mi-app:1.0         # borrar una imagen (falla si hay contenedores usándola)
docker image prune            # borrar imágenes "dangling" (sin tag, huérfanas de un build viejo)
```

## Consideraciones

- Cambiar la etiqueta de una imagen (`docker tag mi-app:1.0 mi-app:latest`) no vuelve a construir nada: solo crea una referencia adicional que apunta a la misma imagen.
- Para publicar la imagen a un registry, el nombre necesita el prefijo del registry — ver [Docker Hub y registries](/guides/docker-registry-hub).
