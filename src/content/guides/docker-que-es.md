---
title: "Qué es Docker"
description: El problema que resuelve Docker ("funciona en mi máquina"), qué es un contenedor a alto nivel y por qué se volvió el estándar.
category: devops
stack: docker-conceptos
order: 1
tags: [docker, conceptos]
scope: introducción a Docker
updatedAt: 2026-08-17
---

## El problema que resuelve

"En mi máquina funciona" — un proyecto corre bien en la laptop de quien lo escribió, pero falla en el servidor, o en la laptop de otro dev. Las causas típicas:

- Versión de Node/Python/lo que sea distinta.
- Una variable de entorno que solo existe en una máquina.
- Una librería del sistema operativo instalada a mano, hace meses, que nadie recuerda.
- Diferencias entre Windows/Mac/Linux (paths, line endings, binarios nativos).

Docker resuelve esto empaquetando la app **junto con todo lo que necesita para correr** — runtime, dependencias, config — en una unidad portable que se comporta igual en cualquier máquina que tenga Docker instalado.

## Qué es un contenedor (idea central)

Un **contenedor** es un proceso aislado que corre en tu sistema operativo, pero con su propio filesystem, sus propias variables de entorno y su propia vista de la red — como si fuera una máquina separada, aunque comparte el kernel del sistema operativo host (más detalle en [Contenedores vs máquinas virtuales](/guides/docker-contenedores-vs-vms)).

Ese contenedor se crea a partir de una **imagen**: una plantilla de solo lectura que define qué contiene (sistema base, dependencias, código y comando de arranque). Una imagen es a un contenedor lo que una clase es a una instancia: la imagen es el molde y el contenedor es el proceso que se ejecuta a partir de ese molde.

```text
imagen (plantilla, inmutable)  →  docker run  →  contenedor (proceso corriendo)
```

Ver [Arquitectura de Docker](/guides/docker-arquitectura) para cómo encajan estas piezas con el daemon y la CLI.

## Por qué importa en el día a día

- **Onboarding instantáneo**: alguien nuevo en el equipo clona el repo, corre `docker compose up` y tiene la base de datos, el backend y cualquier otro servicio corriendo — sin instalar Postgres, Redis, ni configurar nada a mano.
- **Mismo entorno en todos lados**: dev, CI y producción corren la misma imagen — se elimina una categoría entera de bugs de "funcionaba en mi máquina".
- **Aislamiento**: correr Postgres 14 para un proyecto y Postgres 16 para otro, en la misma máquina, sin que se pisen — cada uno en su contenedor.
- **Desechable**: si un contenedor queda en mal estado, se borra y se vuelve a crear en segundos, sin "reinstalar" nada.

## Qué NO es Docker

- No es una máquina virtual completa (más liviano, arranca en segundos — ver la comparación en la próxima guía).
- No reemplaza control de versiones, ni CI/CD — es una pieza del stack, no todo el stack.
- No hace que el código sea más rápido — el contenedor tiene aproximadamente el mismo rendimiento que el proceso corriendo nativo; la ganancia es en portabilidad y consistencia, no en performance.

## Consideraciones

- Docker es la herramienta más común, pero el estándar subyacente es OCI (Open Container Initiative) — otras herramientas (Podman, containerd) pueden correr las mismas imágenes.
- Esta guía es la puerta de entrada a la sección — las siguientes profundizan en arquitectura, instalación, imágenes, contenedores, redes/volúmenes y Compose.
