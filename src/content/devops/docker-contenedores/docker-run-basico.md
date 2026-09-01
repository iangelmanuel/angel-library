---
title: "docker run: flags esenciales"
description: Los flags de docker run que se usan todos los días — -d, -p, --name, --rm, -e, -v — y qué hace cada uno.
type: guides
order: 1
tags: [docker, run, contenedores]
scope: docker run
related:
  [
    devops/docker-contenedores/docker-lifecycle,
    devops/docker-redes-volumenes/docker-volumenes
  ]
updatedAt: 2026-08-17
---

## `docker run`: crear y arrancar un contenedor

```bash
docker run nginx
```

Esto crea un contenedor nuevo a partir de la imagen `nginx` y lo arranca en primer plano — la terminal queda "pegada" mostrando los logs, y `Ctrl+C` lo detiene.

## Flags del día a día

| Flag                     | Qué hace                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `-d`                     | Detached — corre en segundo plano, devuelve el control a la terminal                             |
| `-p <host>:<contenedor>` | Publica un puerto: mapea un puerto de la máquina host a un puerto del contenedor                 |
| `--name <nombre>`        | Nombre fijo para el contenedor (si no, Docker genera uno random tipo `festive_curie`)            |
| `--rm`                   | Borra el contenedor automáticamente al detenerse (útil para pruebas rápidas descartables)        |
| `-e VAR=valor`           | Variable de entorno                                                                              |
| `-v <origen>:<destino>`  | Monta un volumen o bind mount (ver [Volúmenes](/devops/docker-redes-volumenes/docker-volumenes)) |
| `-it`                    | Interactivo + tty — necesario para una sesión de shell interactiva dentro del contenedor         |

## Ejemplo combinado

```bash
docker run -d \
  --name mi-web \
  -p 8080:80 \
  -e NODE_ENV=production \
  nginx
```

- `-d`: corre de fondo.
- `--name mi-web`: para referenciarlo después (`docker logs mi-web`, `docker stop mi-web`) en vez de un id random.
- `-p 8080:80`: el puerto 80 del contenedor (donde escucha nginx) queda accesible en `localhost:8080` de la máquina host.
- `-e NODE_ENV=production`: variable de entorno visible dentro del contenedor.

## `-p host:contenedor`: el orden importa

```bash
docker run -p 8080:80 nginx
#             │    └─ puerto DENTRO del contenedor (el que la app "escucha")
#             └─ puerto en TU máquina (por el que accedes desde el navegador)
```

Confundir el orden es un error común — `localhost:8080` es lo que escribes en el navegador; `80` es el puerto que la app dentro del contenedor ya tiene fijo (no se puede cambiar sin tocar la config de la app).

## Correr un shell interactivo dentro de un contenedor

```bash
docker run -it ubuntu bash
```

Arranca un contenedor Ubuntu y entra directo a una sesión de `bash` dentro — útil para explorar una imagen o probar comandos antes de escribir un Dockerfile.

## `--rm`: para pruebas descartables

```bash
docker run --rm -it node:20-alpine node
```

Corre un REPL de Node dentro de un contenedor efímero — al salir (`Ctrl+D`), el contenedor se borra solo, sin dejar contenedores "muertos" acumulados que después haya que limpiar a mano.

## Consideraciones

- Sin `-d`, el contenedor queda "atado" a la terminal — cerrarla lo detiene. Para dejarlo corriendo de fondo indefinidamente, siempre `-d`.
- Sin `--name`, cada `docker run` genera un nombre random nuevo — cómodo para pruebas rápidas, pero para servicios que se van a referenciar seguido conviene nombrarlos.
