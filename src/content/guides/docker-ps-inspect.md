---
title: "docker ps, inspect y stats"
description: Ver qué contenedores existen y su estado, inspeccionar su configuración completa, y monitorear uso de recursos en vivo.
category: devops
stack: docker-contenedores
order: 4
tags: [docker, ps, inspect, stats, contenedores]
scope: inspección de contenedores
related: [guides/docker-lifecycle]
updatedAt: 2026-08-17
---

## `docker ps`: qué está corriendo

```bash
docker ps          # solo contenedores corriendo
docker ps -a       # todos, incluidos los detenidos
```

```text
CONTAINER ID   IMAGE     COMMAND                  STATUS          PORTS                  NAMES
a1b2c3d4e5f6   nginx     "/docker-entrypoint.…"   Up 2 hours      0.0.0.0:8080->80/tcp   mi-web
```

Columnas clave: `STATUS` (corriendo hace cuánto, o `Exited (0)` si se detuvo), `PORTS` (mapeos activos), `NAMES` (el nombre para usar en otros comandos en vez del id).

## Filtrar y formatear

```bash
docker ps --filter "status=exited"
docker ps --format "table {{.Names}}\t{{.Status}}"
```

## `docker inspect`: toda la configuración, en JSON

```bash
docker inspect mi-web
```

Devuelve un JSON enorme con **todo**: variables de entorno, mounts, config de red, IP interna, políticas de reinicio, etc. Rara vez se lee entero — se suele filtrar con `--format`:

```bash
docker inspect --format '{{.NetworkSettings.IPAddress}}' mi-web
docker inspect --format '{{json .Config.Env}}' mi-web
```

Útil para responder preguntas puntuales como "¿qué variables de entorno tiene este contenedor en verdad?" o "¿cuál es su IP interna?" sin adivinar.

## `docker stats`: uso de recursos en vivo

```bash
docker stats
```

```text
CONTAINER   CPU %   MEM USAGE / LIMIT   MEM %   NET I/O
mi-web      0.12%   45MiB / 2GiB        2.2%    1.2kB / 850B
mi-db       1.05%   180MiB / 2GiB       8.8%    12kB / 8kB
```

Vista tipo `top`, en vivo, de CPU/memoria/red por contenedor — el primer lugar para mirar si algo "se está comiendo" recursos de la máquina sin saber cuál.

## `docker top`: procesos dentro de un contenedor

```bash
docker top mi-web
```

Lista los procesos corriendo **dentro** de ese contenedor específico (equivalente a `ps` pero desde afuera, sin necesitar `exec`).

## Consideraciones

- `docker ps -a` es el primer comando para correr cuando "un contenedor desapareció" — probablemente sigue existiendo, solo detenido.
- `docker inspect` es la fuente de verdad cuando algo de la config "no se está aplicando como se esperaba" (variable de entorno, mount, puerto) — mejor confirmar ahí que asumir.
