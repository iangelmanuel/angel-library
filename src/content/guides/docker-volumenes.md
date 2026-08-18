---
title: "Volúmenes: nombrados, bind mounts y tmpfs"
description: Las tres formas de dar almacenamiento a un contenedor y cuándo usar cada una.
category: devops
stack: docker-redes-volumenes
order: 1
tags: [docker, volumenes, persistencia]
scope: volúmenes
related: [guides/docker-persistencia-datos, guides/docker-postgres-run]
updatedAt: 2026-08-17
---

## Por qué hace falta esto

El filesystem de un contenedor vive en su capa de escritura (ver [Arquitectura](/guides/docker-arquitectura)) — se pierde para siempre si el contenedor se borra. Para datos que necesitan sobrevivir (una base de datos, uploads de usuarios), Docker ofrece tres mecanismos de almacenamiento por fuera de esa capa.

## Las tres opciones

```text
Volumen nombrado          Bind mount                tmpfs
┌────────────┐            ┌────────────┐            ┌────────────┐
│ Contenedor │            │ Contenedor │            │ Contenedor │
└─────┬──────┘            └─────┬──────┘            └─────┬──────┘
      │                         │                          │
┌─────▼──────┐            ┌─────▼──────┐            ┌─────▼──────┐
│ Área que    │            │ Carpeta    │            │ Memoria RAM │
│ Docker      │            │ EXACTA del │            │ (no persiste│
│ administra  │            │ host que   │            │ ni en disco)│
└────────────┘            │ elegís vos │            └────────────┘
                            └────────────┘
```

| | Volumen nombrado | Bind mount | tmpfs |
|---|---|---|---|
| Dónde vive | Área gestionada por Docker (`/var/lib/docker/volumes/...`) | Carpeta específica del host, la que elijas | RAM |
| Persiste tras `docker rm` | Sí | Sí (es una carpeta real del host) | No |
| Uso típico | Datos de una app (base de datos) | Código fuente en desarrollo (hot reload) | Datos temporales sensibles, cache |
| Sintaxis | `-v mis-datos:/data` | `-v /ruta/host:/data` | `--tmpfs /data` |

## Volumen nombrado: el default para datos de app

```bash
docker run -v mis-datos:/var/lib/postgresql/data postgres:16
```

Docker crea (si no existe) un volumen llamado `mis-datos` y lo monta en `/var/lib/postgresql/data` dentro del contenedor. Es la opción recomendada para datos que la app gestiona (bases de datos, uploads) — Docker se encarga de dónde vive físicamente, y sobrevive a `docker rm` del contenedor.

```bash
docker volume ls              # listar volúmenes
docker volume inspect mis-datos
docker volume rm mis-datos    # borrar (falla si algún contenedor lo usa)
```

## Bind mount: para desarrollo con hot reload

```bash
docker run -v $(pwd):/app mi-app-dev
```

Monta la carpeta **exacta** del proyecto (en el host) dentro del contenedor — cualquier cambio de archivo en el editor se refleja instantáneamente adentro, sin reconstruir la imagen. El caso de uso típico es desarrollo local: código fuente montado, para que un `nodemon`/`vite`/similar corriendo dentro del contenedor detecte los cambios igual que si corriera nativo.

```bash
# Windows/Mac: %cd% o $(pwd) según la shell
docker run -v ${PWD}:/app -p 3000:3000 mi-app-dev
```

## `tmpfs`: memoria, no disco

```bash
docker run --tmpfs /app/cache mi-app
```

Los datos viven solo en RAM, nunca tocan disco, y se pierden al detener el contenedor — para cache temporal o datos sensibles que no deberían persistir en ningún lado.

## Consideraciones

- Con un volumen nombrado, si el contenedor se borra pero el volumen no, un contenedor **nuevo** montado sobre ese mismo volumen ve los mismos datos — ver [Persistencia de datos](/guides/docker-persistencia-datos) para el detalle completo de este flujo.
- Bind mounts son cómodos en desarrollo pero no se recomiendan igual en producción (dependen de una carpeta específica del host, que puede no existir de la misma forma en el servidor).
