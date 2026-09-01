---
title: "Variables de entorno en Docker"
description: Pasar variables de entorno a un contenedor con -e y --env-file, y por qué nunca van hardcodeadas en la imagen.
type: guides
order: 5
tags: [docker, variables-entorno, env, contenedores]
scope: variables de entorno
related:
  [
    devops/docker-contenedores/docker-run-basico,
    devops/docker-imagenes/docker-dockerignore
  ]
updatedAt: 2026-08-17
---

## `-e`: una variable por flag

```bash
docker run -e NODE_ENV=production -e PORT=3000 mi-app
```

Cada `-e` agrega una variable de entorno visible dentro del contenedor, como si se hubiera exportado antes de arrancar el proceso.

## `--env-file`: muchas variables desde un archivo

```bash title=".env"
NODE_ENV=production
DATABASE_URL=postgres://user:pass@db:5432/miapp
API_KEY=abc123
```

```bash
docker run --env-file .env mi-app
```

Más práctico que encadenar `-e` cuando hay varias variables — y evita que terminen visibles en el historial de la shell (`.env` no queda en `history`, un `-e API_KEY=abc123` sí).

## Variables definidas en el Dockerfile con `ENV`

```dockerfile
ENV NODE_ENV=production
```

`ENV` en el Dockerfile fija un valor **por defecto**, horneado en la imagen — cualquier `-e`/`--env-file` en `docker run` lo sobrescribe en runtime. Útil para defaults razonables (`NODE_ENV=production`), nunca para secretos.

## Por qué los secretos no van en el Dockerfile

```dockerfile
# ❌ mal — el secreto queda grabado en la imagen, visible con `docker history` o `docker inspect`
ENV API_KEY=abc123secreto
```

Cualquier valor puesto con `ENV` (o `ARG`, o copiado con `COPY` un `.env`) queda **dentro de la imagen** — persiste aunque después se "borre" del Dockerfile y se reconstruya, porque las capas viejas siguen en el historial de la imagen, y cualquiera con acceso a la imagen (por ejemplo, si se pushea a un registry) puede extraerlo.

La forma correcta: secretos siempre entran en **runtime**, vía `-e`/`--env-file` (o el equivalente en Compose — ver [Variables con Compose](/devops/docker-compose/docker-compose-variables)), nunca horneados en la imagen.

## Ver las variables de un contenedor corriendo

```bash
docker exec mi-app env
```

o

```bash
docker inspect --format '{{json .Config.Env}}' mi-app
```

Útil para confirmar qué variables realmente tiene el contenedor, sin asumir.

## Consideraciones

- `.env` (el archivo, no la variable) va siempre en `.dockerignore` y en `.gitignore` — nunca debe copiarse a una imagen ni subirse al repo con valores reales.
- Para secretos de verdad sensibles en producción (no solo desarrollo), Docker tiene un mecanismo de `secrets` más robusto (pensado sobre todo para Swarm) — para desarrollo local, `--env-file` es suficiente y es lo que cubren estas guías.
