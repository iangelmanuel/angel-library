---
title: "Compose con varios servicios"
description: Un docker-compose.yml realista con app, base de datos y un servicio extra, comunicándose por red interna.
type: guides
order: 4
tags: [docker, compose, redes, multi-servicio]
scope: Compose multi-servicio
related:
  [
    devops/docker-compose/docker-compose-basico,
    devops/docker-redes-volumenes/docker-redes
  ]
updatedAt: 2026-08-17
---

## Ejemplo: app + Postgres + Redis

```yaml title="docker-compose.yml"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://user:${POSTGRES_PASSWORD}@db:5432/miapp
      REDIS_URL: redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: miapp
    volumes:
      - datos-postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user"]
      interval: 5s
      timeout: 3s
      retries: 5

  cache:
    image: redis:7-alpine

volumes:
  datos-postgres:
```

## Cómo se conectan entre sí

Cada servicio es alcanzable por los demás usando su **nombre de servicio** como hostname — `app` se conecta a Postgres con `db:5432` y a Redis con `cache:6379`, sin IPs ni configuración de red manual (mismo mecanismo que [Redes](/devops/docker-redes-volumenes/docker-redes), automático en Compose).

## `depends_on` con `condition: service_healthy`

```yaml
depends_on:
  db:
    condition: service_healthy
```

`depends_on` simple solo espera a que el contenedor **arranque**, no a que la app adentro esté lista para aceptar conexiones — Postgres puede tardar un par de segundos en estar listo después de arrancar el proceso. Con `condition: service_healthy` (y un `healthcheck` definido en `db`), Compose espera a que el healthcheck pase antes de arrancar `app` — evita el error clásico de "la app arrancó antes de que la base de datos estuviera lista y se cayó al conectar".

## `healthcheck`: cómo Docker sabe que un servicio está "listo"

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U user"]
  interval: 5s
  timeout: 3s
  retries: 5
```

Corre ese comando dentro del contenedor cada `interval` — si sale con código 0, el servicio se marca `healthy`. `pg_isready` es una utilidad que trae la imagen oficial de Postgres justamente para esto.

## Solo levantar un subconjunto de servicios

```bash
docker compose up -d db cache    # solo la base de datos y el cache, sin la app
```

Útil en desarrollo cuando la app corre nativo (fuera de Docker) pero se quieren sus dependencias (DB, cache) en contenedores.

## Consideraciones

- Sin `healthcheck` + `condition: service_healthy`, un `depends_on` simple entre `app` y `db` alcanza para la mayoría de proyectos personales pequeños — el healthcheck vale la pena cuando la app falla feo al arrancar antes de tiempo, no como default obligatorio desde el día uno.
- Este mismo patrón (`db` con volumen + healthcheck) es la base de la sección dedicada a [Postgres con Compose](/devops/docker-bases-datos/docker-postgres-compose).
