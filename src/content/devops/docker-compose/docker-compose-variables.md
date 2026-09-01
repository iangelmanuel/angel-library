---
title: "Variables de entorno con Compose"
description: Usar un archivo .env junto al docker-compose.yml e interpolar variables, para no hardcodear secretos en el YAML.
type: guides
order: 3
tags: [docker, compose, variables-entorno, env]
scope: variables con Compose
related:
  [
    devops/docker-contenedores/docker-variables-entorno,
    devops/docker-compose/docker-compose-basico
  ]
updatedAt: 2026-08-17
---

## El problema de hardcodear valores en el YAML

```yaml title="docker-compose.yml (❌ evitar)"
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secreto123 # hardcodeado — termina en el repo si se versiona el YAML
```

Si `docker-compose.yml` se versiona en git (lo normal — es la definición del stack, no un secreto en sí), cualquier valor hardcodeado ahí queda en el historial del repo.

## `.env` junto al `docker-compose.yml`

Compose lee automáticamente un archivo `.env` en la misma carpeta que el `docker-compose.yml`, sin configuración extra:

```bash title=".env"
POSTGRES_USER=user
POSTGRES_PASSWORD=secreto123
POSTGRES_DB=miapp
APP_PORT=3000
```

```yaml title="docker-compose.yml"
services:
  app:
    build: .
    ports:
      - "${APP_PORT}:3000"
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
```

`${VARIABLE}` interpola el valor del `.env` al momento de leer el YAML — el archivo versionado (`docker-compose.yml`) no tiene ningún secreto adentro, solo referencias.

## `.env` va en `.gitignore`

```text title=".gitignore"
.env
```

El patrón recomendado: versionar un `.env.example` con las claves (sin valores reales) como documentación de qué variables hacen falta, y que cada quien copie su propio `.env` local:

```bash title=".env.example"
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
APP_PORT=3000
```

```bash
cp .env.example .env
# completar valores reales en .env
```

## Valor por defecto si la variable no está definida

```yaml
ports:
  - "${APP_PORT:-3000}:3000"
```

`${VAR:-default}` usa `default` si `VAR` no está definida en el `.env` ni en el entorno de la shell — evita que Compose falle o quede con un valor vacío si alguien olvidó completar el `.env`.

## Consideraciones

- La interpolación de Compose (`${VAR}`) es distinta de `environment` con `--env-file` pasado a `docker run` — Compose interpola dentro del propio YAML; el `.env` de Compose sirve tanto para eso como para poblar `environment:` de cada servicio.
- Si una variable hace falta en runtime dentro del contenedor (no solo en el YAML), tiene que estar además en la sección `environment:` del servicio — el `.env` de Compose no se pasa automáticamente al contenedor sin declararla ahí.
