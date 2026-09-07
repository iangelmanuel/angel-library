---
title: "Conectarse a Postgres en Docker"
description: Conectar desde psql, un cliente GUI o la connection string de la app — y cómo resetear los datos a propósito.
type: guides
order: 3
tags: [docker, postgres, psql, base-de-datos]
scope: conectar a Postgres
related:
  [
    devops/docker-bases-datos/docker-postgres-run,
    devops/docker-contenedores/docker-exec-logs
  ]
updatedAt: 2026-08-17
---

## Desde `psql`, dentro del propio contenedor

La forma más simple, sin instalar nada en la máquina host — usar el cliente `psql` que ya viene incluido en la imagen oficial:

```bash
docker exec -it mi-postgres psql -U user -d miapp
```

(mismo mecanismo explicado en [docker exec](/devops/docker-contenedores/docker-exec-logs) — entra a una sesión dentro del contenedor ya corriendo).

Con Compose:

```bash
docker compose exec db psql -U user -d miapp
```

Dentro de `psql`, algunos comandos útiles:

```sql
\dt          -- listar tablas
\d nombre    -- describir una tabla
\q           -- salir
```

## Desde un cliente GUI en la máquina (DBeaver, TablePlus, pgAdmin...)

Con el puerto publicado (`-p 5432:5432` en el `docker run`/Compose), cualquier cliente instalado en la máquina se conecta como si Postgres corriera nativo:

| Campo         | Valor                     |
| ------------- | ------------------------- |
| Host          | `localhost`               |
| Puerto        | `5432`                    |
| Usuario       | el de `POSTGRES_USER`     |
| Contraseña    | el de `POSTGRES_PASSWORD` |
| Base de datos | el de `POSTGRES_DB`       |

## Connection string, para la app

```text
postgres://user:secreto@localhost:5432/miapp
```

- Desde la máquina host (la app corriendo nativa, o un script): `localhost` (o `127.0.0.1`).
- Desde otro contenedor en la misma red de Docker/Compose: el **nombre del servicio** en vez de `localhost` — `postgres://user:secreto@db:5432/miapp` (ver [Redes](/devops/docker-redes-volumenes/docker-redes) y [Postgres con Compose](/devops/docker-bases-datos/docker-postgres-compose)).

Confundir estos dos casos es el error de conexión más común: `ECONNREFUSED` al conectar desde un contenedor usando `localhost` (dentro de ese contenedor, `localhost` es el contenedor mismo, no el host ni otro contenedor).

## Herramientas de ORM/migraciones

Frameworks como Prisma, Drizzle o TypeORM usan la misma connection string estándar de Postgres — basta con apuntar `DATABASE_URL` (o el nombre de variable que use cada uno) a la misma cadena de arriba, ajustando el host según si corren dentro o fuera de Docker.

## Resetear los datos a propósito

```bash
docker compose down -v    # borra también el volumen — pierde todos los datos
docker compose up -d db   # vuelve a crear todo desde cero, variables del .env aplicadas de nuevo
```

(ver el detalle completo de por qué esto pasa en [Persistencia de datos](/devops/docker-redes-volumenes/docker-persistencia-datos))

## Consideraciones

- Si `psql` no está instalado en la máquina host, no hace falta instalarlo solo para probar la conexión — `docker exec` con el `psql` que ya trae la imagen alcanza para el 90% de los casos.
- Un `ECONNREFUSED`/timeout al conectar desde la app justo después de levantar Compose suele ser que Postgres todavía no terminó de arrancar — ver `healthcheck` + `depends_on: condition: service_healthy` en [Compose multi-servicio](/devops/docker-compose/docker-compose-multi-servicio).
