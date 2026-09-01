---
title: "Arquitectura de Docker"
description: Docker Engine, el daemon, la CLI y Docker Desktop — cómo encajan las piezas y qué pasa realmente al correr un comando.
type: guides
order: 3
tags: [docker, conceptos, arquitectura]
scope: arquitectura de Docker
related: [devops/docker-conceptos/docker-que-es, devops/docker-conceptos/docker-instalacion]
updatedAt: 2026-08-17
---

## Las piezas

```text
┌──────────────┐        REST API        ┌──────────────────┐
│  docker CLI  │ ─────────────────────▶ │  Docker daemon    │
│  (cliente)   │                        │  (dockerd)        │
└──────────────┘                        │                    │
                                          │  - construye imágenes
                                          │  - corre contenedores
                                          │  - maneja redes/volúmenes
                                          └────────┬───────────┘
                                                   │
                                          ┌────────▼───────────┐
                                          │  Imágenes locales   │
                                          │  Contenedores       │
                                          │  Redes, volúmenes   │
                                          └────────────────────┘
```

- **`docker` (CLI)**: el comando que escribes en la terminal. No hace el trabajo pesado — solo traduce el comando en llamadas a una API y se las manda al daemon.
- **`dockerd` (daemon)**: el proceso de fondo que realmente construye imágenes, crea y corre contenedores, y gestiona redes y volúmenes. Corre todo el tiempo en segundo plano.
- **Docker Desktop**: la app con interfaz gráfica (Windows/Mac) que instala y gestiona el daemon, más una VM liviana por debajo (necesaria porque los contenedores Linux necesitan un kernel Linux) — ver [Instalación](/devops/docker-conceptos/docker-instalacion).
- **Registry**: donde viven las imágenes publicadas (Docker Hub por defecto) — el daemon las descarga (`pull`) o las sube (`push`) ahí. Ver [Docker Hub y registries](/devops/docker-imagenes/docker-registry-hub).

## Qué pasa al correr `docker run`

1. La CLI manda la petición al daemon.
2. El daemon revisa si tiene la imagen localmente; si no, la descarga del registry (`pull` implícito).
3. El daemon crea un contenedor nuevo a partir de esa imagen (filesystem propio, capa de escritura encima).
4. El daemon arranca el proceso principal del contenedor (definido por `CMD`/`ENTRYPOINT` en la imagen — ver [Dockerfile básico](/devops/docker-imagenes/docker-dockerfile-basico)).
5. El contenedor queda corriendo (o termina, si el proceso principal termina).

```bash
docker run hello-world
```

Ese comando solo, sin nada más, dispara los 4 pasos de arriba — es el "hola mundo" recomendado para verificar que la instalación funciona.

## Imagen → contenedor, en más detalle

- Una **imagen** es de solo lectura, construida en capas apiladas (cada instrucción del Dockerfile agrega una capa — ver [Capas y cache](/devops/docker-imagenes/docker-capas-cache)).
- Un **contenedor** agrega una capa de escritura fina encima de esa imagen — cualquier archivo que el contenedor cree o modifique vive en esa capa.
- Esa capa de escritura se pierde si el contenedor se borra (`docker rm`) — por eso los datos que necesitan sobrevivir van en **volúmenes**, no en el filesystem del contenedor (ver [Volúmenes](/devops/docker-redes-volumenes/docker-volumenes)).
- De la misma imagen se pueden crear **muchos contenedores** independientes — cada uno con su propia capa de escritura, sin pisarse entre sí.

## Consideraciones

- Verifica que el daemon esté en ejecución con `docker info`. Si no responde, la CLI devuelve un error de conexión; en Windows y macOS, asegúrate de que Docker Desktop esté abierto.
- Existen alternativas al daemon monolítico clásico (Docker en modo "rootless", containerd standalone) — para uso diario en desarrollo, el setup por defecto de Docker Desktop es suficiente y es el que cubren estas guías.
