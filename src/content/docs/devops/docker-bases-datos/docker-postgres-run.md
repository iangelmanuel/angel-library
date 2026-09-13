---
title: "Levantar Postgres con docker run"
description: El comando completo para tener Postgres corriendo en la máquina en un minuto, con las variables de entorno de la imagen oficial y volumen para que los datos persistan.
type: guides
sidebar:
  order: 1
tags: [docker, postgres, base-de-datos]
scope: Postgres con docker run
related:
  [
    devops/docker-redes-volumenes/docker-persistencia-datos,
    devops/docker-bases-datos/docker-postgres-compose,
    devops/docker-bases-datos/docker-postgres-conectar
  ]
updatedAt: 2026-09-07
---

## El comando completo

Requiere Docker Engine activo y el puerto 5432 disponible. El bloque multilínea usa Bash/zsh; en PowerShell escríbelo en una sola línea o utiliza su carácter de continuación. La contraseña mostrada es solo para un laboratorio local.

```bash
docker run -d \
  --name mi-postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=secreto \
  -e POSTGRES_DB=miapp \
  -p 127.0.0.1:5432:5432 \
  -v datos-postgres:/var/lib/postgresql/data \
  postgres:16
```

Esto levanta Postgres 16 en segundo plano, con un usuario, contraseña y base de datos ya creados, accesible en `localhost:5432`, y con los datos guardados en un volumen que sobrevive a `docker rm` (ver [Persistencia de datos](/devops/docker-redes-volumenes/docker-persistencia-datos) para el porqué del `-v`).

## Las variables de entorno de la imagen oficial

| Variable            | Para qué                                                                         |
| ------------------- | -------------------------------------------------------------------------------- |
| `POSTGRES_USER`     | Usuario que se crea (default: `postgres`)                                        |
| `POSTGRES_PASSWORD` | **Obligatoria** — la imagen no arranca sin ella                                  |
| `POSTGRES_DB`       | Base de datos que se crea al primer arranque (default: igual al `POSTGRES_USER`) |

Estas variables solo tienen efecto la **primera vez** que el contenedor arranca con un volumen vacío — si ya existe un volumen con datos, la imagen no vuelve a aplicar estas variables (no resetea usuario/contraseña en cada arranque).

## Por qué el volumen desde el primer comando

```bash
-v datos-postgres:/var/lib/postgresql/data
```

En la imagen `postgres:16`, monta `/var/lib/postgresql/data`. Sin un volumen nombrado, la imagen puede crear un volumen anónimo: eliminar el contenedor no siempre elimina ese volumen, pero un contenedor nuevo no lo reutiliza automáticamente. Un nombre estable facilita reconectar los datos; no es un backup. Revisa la ruta documentada antes de cambiar de versión principal.

## Verificar que está corriendo

```bash
docker ps
docker logs mi-postgres
```

En los logs, la línea `database system is ready to accept connections` confirma que Postgres terminó de arrancar y ya acepta conexiones.

## Elegir la versión

```bash
docker run ... postgres:16    # una versión mayor específica — recomendado
docker run ... postgres:16.4  # versión exacta — más reproducible aún
docker run ... postgres       # = postgres:latest, evitar en proyectos reales (ver Build y tags)
```

Fijar al menos la versión mayor (`postgres:16`) evita sorpresas si en algún momento se hace `docker pull postgres` de nuevo y trae una versión mayor distinta con cambios incompatibles.

## Consideraciones

- Para uso diario en un proyecto real, el patrón recomendado es declarar esto en un `docker-compose.yml` en vez de repetir el comando largo cada vez — ver [Postgres con Compose](/devops/docker-bases-datos/docker-postgres-compose).
- `-p 5432:5432` solo hace falta si quieres conectarte desde **afuera** de Docker (un cliente en tu máquina, o la app corriendo nativa) — si la app que consume esta base de datos también corre en un contenedor en la misma red, no hace falta publicar el puerto (ver [Redes](/devops/docker-redes-volumenes/docker-redes)).

## Comprobación de persistencia

Crea una tabla y una fila de prueba con [la guía de conexión](/devops/docker-bases-datos/docker-postgres-conectar), reinicia con `docker restart mi-postgres` y vuelve a consultarla. La fila debe seguir allí. Para una prueba de recreación, conserva y vuelve a montar el mismo volumen; no ejecutes `docker volume rm` sobre los datos que quieres conservar.

## Fuentes

- [Imagen oficial de PostgreSQL: variables y almacenamiento](https://github.com/docker-library/docs/tree/master/postgres)
