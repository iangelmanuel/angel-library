---
title: "docker exec y docker logs"
description: Entrar a un contenedor corriendo para inspeccionarlo, y ver su output con docker logs — las dos herramientas de debug más usadas.
category: devops
stack: docker-contenedores
order: 3
tags: [docker, exec, logs, debug, contenedores]
scope: exec y logs
related: [guides/docker-ps-inspect]
updatedAt: 2026-08-17
---

## `docker logs`: ver el output de un contenedor

```bash
docker logs mi-web
docker logs -f mi-web       # -f = follow, sigue mostrando en vivo (como tail -f)
docker logs --tail 50 mi-web
docker logs --since 10m mi-web
```

Muestra lo que el proceso principal del contenedor escribió a `stdout`/`stderr` — es la primera herramienta para debuggear "¿por qué mi contenedor no arranca / se cae?".

## `docker exec`: correr un comando dentro de un contenedor ya corriendo

```bash
docker exec -it mi-web bash
```

Abre una sesión interactiva de `bash` **dentro** de un contenedor que ya está corriendo — a diferencia de `docker run -it` (que crea uno nuevo), `exec` entra al que ya existe.

```bash
docker exec mi-web ls /app          # correr un comando puntual, sin sesión interactiva
docker exec -it mi-db psql -U postgres  # entrar directo al cliente de Postgres dentro del contenedor
```

## `docker exec -it` vs `docker run -it`

```text
docker run -it <imagen> bash    →  crea un contenedor NUEVO y entra
docker exec -it <contenedor> bash →  entra a un contenedor que YA está corriendo
```

Confundir los dos es común al empezar: si el contenedor de la base de datos ya está corriendo (por ejemplo, vía Compose) y se quiere entrar a inspeccionarlo, es `exec`, no `run` — `run` crearía un contenedor Postgres nuevo y vacío, separado del que ya tiene los datos.

## Cuando `bash` no está disponible

Algunas imágenes minimalistas (Alpine) no traen `bash`, solo `sh`:

```bash
docker exec -it mi-contenedor sh
```

## Combinación típica de debug

```bash
docker ps                    # ver qué está corriendo y su nombre/id
docker logs -f mi-app        # ver si tira errores
docker exec -it mi-app sh    # entrar a inspeccionar archivos, variables de entorno, etc.
```

## Consideraciones

- `docker exec` no funciona en un contenedor detenido — hace falta que esté `Running` (ver [Ciclo de vida](/guides/docker-lifecycle)).
- Cualquier cambio hecho a mano dentro directamente sesión `exec` (instalar algo, editar un archivo) se pierde si el contenedor se borra, y no se refleja en la imagen — para cambios permanentes, van en el Dockerfile.
