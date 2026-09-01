---
title: "Por qué se pierden los datos y cómo evitarlo"
description: El error clásico de arrancar de nuevo un contenedor y encontrar la base de datos vacía — y el patrón correcto para que no pase.
type: guides
order: 3
tags: [docker, persistencia, volumenes, contenedores]
scope: persistencia de datos
problem: "Corrí docker rm en mi contenedor de Postgres y perdí toda la base de datos — ¿cómo evito que vuelva a pasar?"
related: [devops/docker-redes-volumenes/docker-volumenes, devops/docker-bases-datos/docker-postgres-run]
updatedAt: 2026-08-17
---

## El escenario típico

```bash
docker run -d --name mi-db -e POSTGRES_PASSWORD=secreto postgres:16
# ... trabajas, creas tablas, cargas datos ...
docker rm -f mi-db
docker run -d --name mi-db -e POSTGRES_PASSWORD=secreto postgres:16
# la base de datos está vacía otra vez
```

Sin un volumen, todo lo que Postgres escribe vive en la capa de escritura del contenedor (ver [Arquitectura](/devops/docker-conceptos/docker-arquitectura)) — al borrar el contenedor, esa capa desaparece con él. El segundo `docker run` crea un contenedor **nuevo**, sin ninguna relación con los datos del anterior, aunque use el mismo nombre e imagen.

## La solución: volumen nombrado

```bash
docker run -d --name mi-db \
  -e POSTGRES_PASSWORD=secreto \
  -v datos-postgres:/var/lib/postgresql/data \
  postgres:16
```

Ahora los datos viven en el volumen `datos-postgres`, que existe **independiente** del contenedor. Aunque se borre el contenedor con `docker rm -f mi-db`, el volumen sigue existiendo:

```bash
docker rm -f mi-db
docker run -d --name mi-db \
  -e POSTGRES_PASSWORD=secreto \
  -v datos-postgres:/var/lib/postgresql/data \
  postgres:16
# los datos siguen ahí — el nuevo contenedor se monta sobre el mismo volumen
```

## La regla mental

```text
Contenedor  = el proceso, desechable, se recrea en segundos
Volumen     = los datos, persistente, sobrevive al contenedor
```

Un contenedor de base de datos se puede borrar y recrear libremente (por ejemplo, para actualizar a una versión nueva de la imagen) sin miedo a perder nada, **siempre que los datos estén en un volumen**. El contenedor en sí no debería tratarse como "donde viven los datos" — es solo el proceso que los sirve.

## Cómo saber si un contenedor tiene sus datos en volumen

```bash
docker inspect --format '{{json .Mounts}}' mi-db
```

Si la lista está vacía, ese contenedor **no** tiene ningún volumen — cualquier dato ahí es efímero.

## Resetear datos a propósito

A veces sí se quiere empezar de cero (por ejemplo, para probar un schema desde cero):

```bash
docker rm -f mi-db
docker volume rm datos-postgres
docker run -d --name mi-db -e POSTGRES_PASSWORD=secreto -v datos-postgres:/var/lib/postgresql/data postgres:16
```

Borrar el volumen explícitamente (`docker volume rm`) es lo que de verdad resetea los datos — borrar solo el contenedor, no.

## Consideraciones

- Este es el error de Docker más común al empezar — perder datos "sin querer" casi siempre es este mismo patrón: correr algo sin `-v` pensando que persistía solo.
- Ver [Levantar Postgres con docker run](/devops/docker-bases-datos/docker-postgres-run) para el comando completo recomendado, con volumen incluido desde el principio.
