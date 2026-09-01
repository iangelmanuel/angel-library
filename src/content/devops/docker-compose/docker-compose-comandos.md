---
title: "Comandos de Docker Compose"
description: up, down, build, logs y exec desde Compose — el día a día de trabajar con un docker-compose.yml.
type: guides
order: 2
tags: [docker, compose, comandos]
scope: comandos de Compose
related: [devops/docker-compose/docker-compose-basico]
updatedAt: 2026-08-17
---

## `up`: levantar todo

```bash
docker compose up          # primer plano, logs de todos los servicios mezclados
docker compose up -d       # detached, de fondo
docker compose up --build  # reconstruye las imágenes con "build:" antes de levantar
```

Crea (si no existen) y arranca todos los servicios definidos en `docker-compose.yml`, en el orden que respete `depends_on`.

## `down`: bajar todo

```bash
docker compose down            # detiene y borra los contenedores (los volúmenes quedan)
docker compose down -v         # además borra los volúmenes — ¡pierde los datos!
```

`down` es más agresivo que `stop`: no solo detiene, también **borra** los contenedores (aunque los recrea igual de rápido en el próximo `up`, porque la config vive en el YAML). El flag `-v` es el que hay que usar con cuidado — borra también los volúmenes nombrados, perdiendo los datos de la base de datos si no se quería eso.

## `stop` / `start`: sin borrar contenedores

```bash
docker compose stop     # detiene sin borrar
docker compose start    # vuelve a arrancar los mismos contenedores
```

## `logs`

```bash
docker compose logs             # todos los servicios
docker compose logs -f app      # solo el servicio "app", en vivo
docker compose logs --tail 50
```

## `exec`: entrar a un servicio corriendo

```bash
docker compose exec db psql -U user -d miapp
docker compose exec app sh
```

Igual que `docker exec`, pero referenciando el servicio por su nombre en el YAML en vez del nombre/id del contenedor.

## `build`: reconstruir sin levantar

```bash
docker compose build
docker compose build app   # solo un servicio
```

## `ps`: estado de los servicios del proyecto

```bash
docker compose ps
```

Como `docker ps`, pero filtrado solo a los contenedores de este `docker-compose.yml`.

## Ciclo típico de desarrollo

```bash
docker compose up -d       # levantar todo de fondo
docker compose logs -f app # seguir los logs de la app mientras se desarrolla
# ... editar código, si hay bind mount + hot reload se refleja solo ...
docker compose down        # al terminar la sesión de trabajo
```

## Consideraciones

- `docker compose down -v` es la forma más común de borrar datos de desarrollo "sin querer" — pensarlo dos veces antes de agregar `-v` por costumbre.
- Todos estos comandos asumen que se corren desde la carpeta donde está el `docker-compose.yml` (o se les pasa `-f ruta/al/archivo.yml`).
