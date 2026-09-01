---
title: "Ciclo de vida de un contenedor"
description: start, stop, restart, rm y los estados por los que pasa un contenedor — la diferencia entre detenido y borrado.
type: guides
order: 2
tags: [docker, lifecycle, contenedores]
scope: ciclo de vida
related: [devops/docker-contenedores/docker-run-basico, devops/docker-contenedores/docker-ps-inspect]
updatedAt: 2026-08-17
---

## Los estados

```text
docker run  →  Created  →  Running  →  Stopped  →  (docker rm)  →  no existe
                              │            ↑
                              └─ docker stop
                              │
                         docker start (si ya existe, detenido)
```

- **Running**: el proceso principal está corriendo.
- **Stopped (Exited)**: el contenedor existe (su filesystem y config siguen ahí), pero el proceso no está corriendo.
- **Borrado**: `docker rm` elimina el contenedor por completo — su capa de escritura (cualquier archivo que haya creado o modificado) se pierde para siempre, salvo lo que estuviera en un volumen (ver [Volúmenes](/devops/docker-redes-volumenes/docker-volumenes)).

## Comandos

```bash
docker stop mi-web       # detiene (SIGTERM, después SIGKILL si no responde a tiempo)
docker start mi-web      # vuelve a arrancar un contenedor detenido (mismo filesystem que tenía)
docker restart mi-web    # stop + start en un solo comando
docker rm mi-web         # borra el contenedor (debe estar detenido, o usar -f)
docker rm -f mi-web      # fuerza: detiene y borra en un solo paso
```

## `stop` vs `rm`: la diferencia que importa

- `docker stop` detiene el proceso, pero el contenedor **sigue existiendo** — `docker start mi-web` lo vuelve a levantar con el mismo filesystem, mismos archivos, como si solo se hubiera pausado.
- `docker rm` lo borra por completo — no hay vuelta atrás para nada que no estuviera en un volumen.

Confundir los dos es un error común: parar un contenedor de base de datos con `docker stop` es seguro (los datos siguen ahí si están en un volumen, y el contenedor en sí sigue existiendo); pero si en vez de eso se corre `docker rm` sin haber usado volúmenes, los datos se pierden.

## Detener todos los contenedores corriendo

```bash
docker stop $(docker ps -q)
```

`docker ps -q` lista solo los ids de los contenedores corriendo; se los pasa como argumento a `stop`.

## Limpiar contenedores detenidos

```bash
docker container prune
```

Borra **todos** los contenedores en estado `Stopped` (pide confirmación) — útil para limpiar después de muchas pruebas sueltas con `docker run` sin `--rm`.

## Consideraciones

- `docker stop` manda `SIGTERM` y espera unos segundos (10 por defecto) antes de forzar `SIGKILL` — una app que maneja `SIGTERM` para cerrar prolijamente (cerrar conexiones, terminar requests en curso) tiene esa ventana para hacerlo.
- Antes de `docker rm` en un contenedor con datos importantes que no estén en volumen, confirmar dos veces — es la forma más común de perder datos "por accidente" con Docker.
