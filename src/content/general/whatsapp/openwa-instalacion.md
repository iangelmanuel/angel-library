---
title: "OpenWA — instalación y despliegue"
description: "Levantar el gateway con Docker o en local, elegir perfil de servicios, entender los puertos y preparar el despliegue de producción."
type: guides
order: 2
tags: [whatsapp, docker, self-hosted, devops, nodejs]
github: https://github.com/rmyndharis/OpenWA
related:
  - general/whatsapp/openwa-que-es
updatedAt: 2026-08-30
---

## Requisitos

| Requisito | Versión |
| --- | --- |
| Node.js | `>=22.13` (solo para instalación local) |
| Docker + Docker Compose | Recomendado para cualquier uso serio |
| Chromium | Lo instala la imagen; solo hace falta a mano en local con el motor `whatsapp-web.js` |

## Opción A: Docker

Es la vía recomendada. La configuración se genera sola en el primer arranque.

```bash
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA
docker compose -f docker-compose.dev.yml up -d
```

Al terminar, el panel queda en `http://localhost:2785`.

El compose de desarrollo usa SQLite y almacenamiento local, y la API sirve el panel ya empaquetado dentro de la misma imagen.

## Opción B: local

Útil para leer el código o contribuir, no para producción.

```bash
git clone https://github.com/rmyndharis/OpenWA.git
cd OpenWA
npm ci
npm run dev
```

`npm ci` instala exactamente las versiones del lockfile, incluido el panel. Usa `npm install` solo cuando quieras cambiar dependencias a propósito.

En modo desarrollo el panel corre aparte, en el servidor de Vite con recarga en caliente, así que son dos puertos distintos.

## Puertos

| Servicio | Puerto | Nota |
| --- | --- | --- |
| API y panel | `2785` | En Docker van juntos en el mismo puerto |
| Swagger | `2785/api/docs` | Se apaga con `NODE_ENV=production` salvo que pongas `ENABLE_SWAGGER=true` |
| Panel en desarrollo | `2886` | Solo con `npm run dev` |

## Producción

El `docker-compose.yml` principal trae perfiles para encender servicios opcionales:

```bash
docker compose up -d
```

```bash
docker compose --profile postgres up -d
```

```bash
docker compose --profile full up -d
```

| Perfil | Levanta |
| --- | --- |
| `postgres` | Base de datos PostgreSQL |
| `redis` | Caché Redis |
| `minio` | Almacenamiento compatible con S3 |
| `full` | Los tres anteriores |

El panel no necesita perfil: viaja dentro de la imagen de la API y se sirve donde corra `openwa-api`.

Las imágenes oficiales se publican en GHCR como manifiestos multiarquitectura para `linux/amd64` y `linux/arm64`.

### TLS y exposición pública

OpenWA no termina TLS por su cuenta. Para exponerlo hay que poner delante un proxy inverso propio: nginx, Caddy, un balanceador del proveedor o un Ingress de Kubernetes.

## Arquitectura enchufable

Casi todo se cambia por configuración, no tocando código:

| Pieza | Opciones |
| --- | --- |
| Motor de WhatsApp | `whatsapp-web.js` (por defecto) o `baileys`, con `ENGINE_TYPE` |
| Base de datos | SQLite o PostgreSQL |
| Caché | Desactivada o Redis |
| Almacenamiento | Local o S3/MinIO |

Un detalle que conviene saber: el contenido multimedia se devuelve **en línea** a quien consume la API y los webhooks. No se guarda automáticamente en el backend de almacenamiento —ese backend es para respaldo y migración—.

## Cómo se protege el contenedor

Dos decisiones del proyecto que vale la pena conocer antes de exponerlo:

**El socket de Docker no se monta directo.** La aplicación habla con un contenedor intermediario (`docker-socket-proxy`) que solo habilita las operaciones necesarias:

```text
openwa-api  ──TCP 2375──▶  docker-proxy  ──unix──▶  /var/run/docker.sock
```

El propio proyecto aclara que esto es una puerta de enlace operativa, no una frontera de privilegios fina: con `POST` habilitado, un contenedor de API comprometido equivale a root en el host. El modelo de amenazas completo está en su `SECURITY.md`.

**El proceso de Node no corre como root.** El arranque baja privilegios en cadena:

```text
dumb-init (PID 1)
  └─ docker-entrypoint.sh (root, solo para corregir permisos del volumen)
       └─ gosu openwa node dist/main
```

## Podman en vez de Docker

En modo rootless hace falta el socket activo y la variable `DOCKER_HOST`:

```bash
systemctl --user start podman.socket
systemctl --user enable podman.socket
export DOCKER_HOST=unix:///run/user/$(id -u)/podman/podman.sock
```

Conviene dejar el `export` en `~/.bashrc` para que sobreviva a la sesión.

## Siguiente paso

Con el servicio arriba, el flujo de crear sesión, escanear el QR y enviar mensajes está en [OpenWA — sesiones y mensajes](/general/whatsapp/openwa-sesiones-mensajes).
