---
title: "Docker Compose: estructura básica"
description: Qué problema resuelve Compose frente a encadenar comandos docker run, y la anatomía de un docker-compose.yml.
type: guides
order: 1
tags: [docker, compose, yaml]
scope: docker-compose.yml
related:
  [
    devops/docker-redes-volumenes/docker-redes,
    devops/docker-compose/docker-compose-comandos
  ]
updatedAt: 2026-08-17
---

## El problema que resuelve

Levantar una app con base de datos a mano implica varios comandos `docker run` largos, en orden, con una red creada aparte:

```bash
docker network create mi-red
docker run -d --name db --network mi-red -e POSTGRES_PASSWORD=secreto -v datos:/var/lib/postgresql/data postgres:16
docker run -d --name app --network mi-red -p 3000:3000 -e DATABASE_URL=postgres://... mi-app
```

Compose reemplaza todo eso por **un archivo declarativo** y **un comando**: `docker compose up`.

## `docker compose` vs `docker-compose`

```bash
docker compose up     # v2 — plugin integrado, sin guion, el estándar actual
docker-compose up     # v1 — binario standalone, legacy, todavía se ve en tutoriales viejos
```

Docker Desktop incluye el plugin v2 (`docker compose`, sin guion) desde hace tiempo — es la forma recomendada para cualquier setup nuevo. `docker-compose` (con guion, binario separado) sigue funcionando en muchos sistemas por compatibilidad, pero está en modo legacy.

## Anatomía de un `docker-compose.yml`

```yaml title="docker-compose.yml"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:secreto@db:5432/miapp
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secreto
      POSTGRES_DB: miapp
    volumes:
      - datos-postgres:/var/lib/postgresql/data

volumes:
  datos-postgres:
```

- **`services`**: cada servicio es, en esencia, un `docker run` declarado como YAML — `app` y `db` son dos contenedores.
- **`build: .`**: en vez de `image`, construye desde un Dockerfile en esa ruta (equivalente a `docker build`).
- **`image: postgres:16`**: usa una imagen ya publicada, sin construir nada.
- **`ports`**: igual que `-p` en `docker run`.
- **`environment`**: igual que `-e`.
- **`depends_on`**: arranca `db` antes que `app` (pero **no** espera a que Postgres esté realmente listo para aceptar conexiones — solo a que el contenedor arranque; para eso existe `healthcheck`, más avanzado).
- **`volumes` (top-level)**: declara el volumen nombrado `datos-postgres`, usado por el servicio `db`.

## Lo más importante: red automática

Sin configurar nada, Compose crea una red propia para el proyecto y conecta todos los servicios ahí — `app` puede conectarse a `db` usando `db` como hostname (el nombre del servicio), exactamente como se explica en [Redes](/devops/docker-redes-volumenes/docker-redes), pero sin tener que crear la red a mano.

## Consideraciones

- El archivo se llama `docker-compose.yml` (o `compose.yml`, ambos reconocidos) — Compose lo busca automáticamente en el directorio actual.
- Ver [Comandos de Compose](/devops/docker-compose/docker-compose-comandos) para el día a día (`up`, `down`, `logs`, `exec`) y [Variables con Compose](/devops/docker-compose/docker-compose-variables) para no hardcodear secretos en este archivo.
