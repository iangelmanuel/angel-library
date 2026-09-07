---
title: "Postgres con Docker Compose"
description: El patrón recomendado para tener Postgres en un proyecto día a día — un docker-compose.yml con volumen, .env y healthcheck.
type: guides
order: 2
tags: [docker, postgres, compose, base-de-datos]
scope: Postgres con Compose
related:
  [
    devops/docker-bases-datos/docker-postgres-run,
    devops/docker-compose/docker-compose-variables
  ]
updatedAt: 2026-08-17
---

## Por qué Compose en vez del `docker run` largo

El comando de [Levantar Postgres con docker run](/devops/docker-bases-datos/docker-postgres-run) funciona, pero hay que recordarlo (o guardarlo en algún lado) cada vez. Con Compose, la definición vive versionada junto al proyecto — cualquiera que clona el repo levanta la misma base de datos con un solo comando.

## Setup completo

```yaml title="docker-compose.yml"
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    ports:
      - "5432:5432"
    volumes:
      - datos-postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  datos-postgres:
```

```bash title=".env"
POSTGRES_USER=user
POSTGRES_PASSWORD=secreto
POSTGRES_DB=miapp
```

```text title=".gitignore"
.env
```

(ver [Variables con Compose](/devops/docker-compose/docker-compose-variables) para por qué el `.env` va aparte y en `.gitignore`)

## Levantar

```bash
docker compose up -d db
```

Con `db` al final se levanta solo ese servicio — útil si el `docker-compose.yml` del proyecto tiene además la app y no se la quiere levantar todavía.

## `restart: unless-stopped`

```yaml
restart: unless-stopped
```

Hace que el contenedor se reinicie automáticamente si se cae o si la máquina/Docker Desktop se reinicia — cómodo para un servicio de base de datos que se espera tener corriendo de fondo todo el tiempo mientras se trabaja, sin tener que acordarse de levantarlo a mano después de cada reinicio.

## Cuando la app también está en el mismo Compose

```yaml
services:
  app:
    build: .
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
    depends_on:
      db:
        condition: service_healthy
  db:
    # ... igual que arriba
```

Notar `@db:5432` (no `@localhost:5432`) — desde adentro de otro contenedor en la misma red de Compose, el hostname es el nombre del servicio, no `localhost` (ver [Redes](/devops/docker-redes-volumenes/docker-redes)). `localhost:5432` sí es correcto al conectarse desde **afuera** de Docker (un cliente en tu máquina — ver la próxima guía).

## Consideraciones

- Si el proyecto ya tiene la app corriendo nativa (sin Docker) y solo se quiere Postgres en contenedor, mantener `db` en su propio `docker-compose.yml` separado es un patrón perfectamente válido — no hace falta meter todo el proyecto en Compose para aprovechar esto.
- `restart: unless-stopped` significa que un `docker stop db` manual sí lo deja detenido (no lo revive solo) — pero un reinicio de Docker Desktop o de la máquina sí lo vuelve a levantar.
