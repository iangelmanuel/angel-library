---
title: "Docker CLI: lo esencial desde la terminal"
description: Verificar que el CLI de Docker está instalado y andando, y los comandos del día a día — con enlace a la documentación completa de Docker.
type: guides
order: 19
tags: [terminal, docker, cli]
scope: docker
related: [devops/docker-conceptos/docker-instalacion, devops/docker-contenedores/docker-run-basico, devops/docker-compose/docker-compose-basico]
updatedAt: 2026-08-17
---

## Verificar la instalación

```bash
docker --version
docker compose version
docker run hello-world
```

Los dos primeros confirman que el CLI de Docker y el plugin de Compose están disponibles en el `PATH`. El tercero es la prueba real: descarga una imagen mínima, corre un contenedor, imprime un mensaje de confirmación y termina — si eso funciona, Docker está corriendo (no solo instalado).

La instalación completa — Docker Desktop, WSL2 en Windows, y los pasos previos — ya está cubierta en [Instalación de Docker](/devops/docker-conceptos/docker-instalacion). Esta guía asume que Docker ya está instalado y solo repasa el uso del CLI desde la terminal.

## Comandos del día a día

| Comando | Para qué se usa |
|---|---|
| `docker ps` | Ver contenedores corriendo |
| `docker run <imagen>` | Crear y arrancar un contenedor |
| `docker stop <contenedor>` | Detener un contenedor |
| `docker logs -f <contenedor>` | Ver logs en vivo |
| `docker exec -it <contenedor> bash` | Abrir una shell dentro de un contenedor corriendo |
| `docker compose up -d` | Levantar todos los servicios definidos en `compose.yaml`, en segundo plano |
| `docker compose down` | Bajar y eliminar los servicios levantados por Compose |

## Documentación completa

Esta guía es intencionalmente corta — el detalle de cada comando, conceptos (imágenes, contenedores, capas), redes y volúmenes, Compose multi-servicio, y una sección dedicada a levantar Postgres en un contenedor, ya están documentados en la categoría **DevOps** del sitio: [/categories/devops](/categories/devops).

Puntos de entrada directos si ya sabes qué buscas:

- [docker run: flags esenciales](/devops/docker-contenedores/docker-run-basico)
- [Docker Compose: lo básico](/devops/docker-compose/docker-compose-basico)

## Consideraciones

- `docker run hello-world` es la forma más rápida de confirmar que el daemon de Docker está corriendo, no solo que el CLI está instalado — un `docker --version` exitoso no garantiza que Docker Desktop esté levantado.
- Esta página es un puente pensado para quien ya vive en la terminal y solo necesita el recordatorio rápido de los comandos más usados — para entender qué es cada cosa (imagen vs. contenedor, volumen vs. bind mount, etc.), la categoría DevOps tiene el desarrollo completo.
