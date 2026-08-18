---
title: "Redes en Docker"
description: La red bridge por defecto, crear redes propias, y cómo los contenedores se encuentran entre sí por nombre.
category: devops
stack: docker-redes-volumenes
order: 2
tags: [docker, redes, networking]
scope: redes
related: [guides/docker-compose-multi-servicio]
updatedAt: 2026-08-17
---

## La red bridge por defecto

Sin configurar nada, todo contenedor corre conectado a una red **bridge** por defecto — tiene salida a internet, y su propia IP interna, pero para que dos contenedores se hablen entre sí por **nombre** (no por IP) necesitan estar en una red **custom**, no en la bridge default.

```bash
docker network ls
```

```text
NETWORK ID     NAME      DRIVER    SCOPE
a1b2c3d4e5f6   bridge    bridge    local
b2c3d4e5f6a1   host      host      local
c3d4e5f6a1b2   none      null      local
```

## Por qué una red custom

```bash
docker network create mi-red

docker run -d --name db --network mi-red postgres:16
docker run -d --name app --network mi-red -e DATABASE_URL=postgres://user:pass@db:5432/miapp mi-app
```

Con ambos contenedores en `mi-red`, el contenedor `app` puede resolver `db` por **nombre** (Docker corre un DNS interno para la red) — no hace falta saber la IP del contenedor de la base de datos, ni que sea estable entre reinicios.

```text
app  ──DATABASE_URL=postgres://...@db:5432/...──▶  db
              (Docker resuelve "db" al IP interno del contenedor)
```

Esto es exactamente lo que `docker compose` hace automáticamente por debajo (ver [Docker Compose básico](/guides/docker-compose-basico)) — cada servicio de un `docker-compose.yml` queda accesible por su nombre de servicio desde los demás, sin crear la red a mano.

## Publicar un puerto vs conectar contenedores entre sí

Dos cosas distintas que se confunden seguido:

- **`-p 8080:80`**: expone el contenedor **al host** (a tu máquina, al navegador) — necesario para acceder desde afuera de Docker.
- **Red compartida**: conecta contenedores **entre sí** — no hace falta `-p` para que `app` hable con `db`, solo estar en la misma red.

Un contenedor de base de datos para uso interno de la app normalmente **no** necesita `-p` — solo la app necesita alcanzarlo, y eso ya lo resuelve la red compartida. `-p` en la base de datos solo hace falta si además quieres conectarte a ella desde afuera de Docker (por ejemplo, con un cliente en tu máquina — ver [Conectar a Postgres](/guides/docker-postgres-conectar)).

## Inspeccionar una red

```bash
docker network inspect mi-red
```

Muestra qué contenedores están conectados y sus IPs internas — útil para debug cuando "el contenedor no encuentra al otro".

## Consideraciones

- Contenedores en redes **distintas** no se ven entre sí por nombre, aunque estén en la misma máquina — un error común es asumir que "todo lo que corre con Docker" está en la misma red por defecto.
- Borrar una red (`docker network rm mi-red`) requiere que ningún contenedor siga conectado a ella.
