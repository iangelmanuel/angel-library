---
title: Coolify — tu propio Vercel/Heroku en un VPS
description: PaaS de código abierto y autoalojable para desplegar aplicaciones, bases de datos y servicios en servidores propios por SSH, con HTTPS automático, despliegues desde Git y backups.
tags: [coolify, paas, self-hosted, devops, docker, despliegue, vps]
sidebar:
  order: 2
draft: false
resourceCategory: Sitio oficial
official: true
website: https://coolify.io
github: https://github.com/coollabsio/coolify
technologies:
  - devops/docker-conceptos/docker-que-es
  - devops/docker-compose/docker-compose-basico
  - devops/ci-cd/cicd-deployment-strategies
  - applications/apps-devops/application-docker-desktop
note: "Licencia Apache-2.0. La versión autoalojada es gratis y sin funciones de pago; Coolify Cloud (el panel gestionado por ellos) cuesta 5 USD/mes con 2 servidores incluidos y 3 USD por servidor extra. En ambos casos los servidores donde corren tus apps los pones tú."
warnings:
  - "Crea la cuenta de administrador justo después de instalar: quien llegue primero a la página de registro en el puerto 8000 se convierte en admin, con acceso root al servidor."
  - "Guarda una copia de /data/coolify/source/.env: contiene APP_KEY, con la que se cifran los datos de Coolify, y sin ella no se puede restaurar."
  - "Coolify no actualiza ni asegura el sistema operativo del servidor. Firewall, parches y acceso SSH siguen siendo responsabilidad tuya."
updatedAt: 2026-10-12
---

**Coolify** es una plataforma de despliegue (un PaaS, _Platform as a Service_) que instalas en tu propio servidor. Hace lo que harías en Vercel, Netlify o Heroku —conectar un repositorio, hacer `git push` y obtener una URL con HTTPS— pero sobre una máquina que controlas y pagas tú, por ejemplo un VPS de 5 € en Hetzner o una Raspberry Pi en casa.

Es de **coollabs** (Andras Bacsai), licencia Apache-2.0, y con más de 62.000 estrellas es uno de los proyectos autoalojados más populares de GitHub.

## Qué problema resuelve

Los PaaS gestionados son cómodos pero caros a escala, y atan la app a su infraestructura. Un VPS es barato pero obliga a montar a mano Docker, un proxy inverso, certificados, despliegues y backups. Coolify cubre ese hueco: un panel web que configura todo eso por ti.

Dos decisiones de diseño importan:

- **Solo necesita SSH** hacia los servidores de destino. Un mismo panel puede gestionar varios servidores.
- **No te encierra.** La configuración vive en tus servidores, y si dejas de usar Coolify los contenedores que ya corren siguen funcionando: son contenedores Docker normales.

## Conceptos

| Concepto | Qué es |
| --- | --- |
| **Servidor** | Una máquina (física o VPS) a la que Coolify accede por SSH para desplegar. |
| **Proyecto** | Agrupación de nivel superior: por ejemplo, uno para proyectos personales y otro para trabajo. |
| **Entorno** | Dentro de un proyecto, separaciones como `development` y `production`. |
| **Recurso** | Lo que se despliega: una aplicación, una base de datos o un servicio. Cada uno tiene su dominio, backups y health checks. |
| **Servicio de un clic** | Recurso preconfigurado (más de 280 según el repositorio: Plausible, n8n, Supabase, Ghost…). |
| **Proxy inverso** | Recibe todas las peticiones y las reparte al contenedor correcto según el dominio. Por defecto **Traefik**; también **Caddy** o ninguno. |

Todo lo que despliega Coolify corre como **contenedor Docker** (ver [Qué es Docker](/devops/docker-conceptos/docker-que-es)).

### Build packs: cómo se construye tu app

| Build pack | Cuándo usarlo |
| --- | --- |
| **Nixpacks** | Detección automática para proyectos que siguen convenciones conocidas (Node, Python, Go, PHP…). |
| **Railpack** (beta) | El sistema de build automático más nuevo de Railway. |
| **Static** | El repositorio ya contiene el sitio construido; Coolify lo sirve. |
| **Dockerfile** | Una imagen propia definida en tu `Dockerfile`. |
| **Docker Compose** | Apps con varios servicios definidos en un `docker-compose.yml` (ver [Docker Compose](/devops/docker-compose/docker-compose-basico)). |

También puede desplegar imágenes ya construidas desde un registro.

## Requisitos

| Recurso | Mínimo recomendado |
| --- | --- |
| CPU | 2 núcleos |
| RAM | 2 GB |
| Disco | 10 GB libres (más espacio para imágenes, volúmenes y backups) |
| Arquitectura | amd64 o arm64 |
| Sistema | Linux: Debian, Ubuntu LTS (20.04, 22.04, 24.04), familia Red Hat, SUSE, Arch, Alpine, Raspberry Pi OS de 64 bits |

La documentación dice que puede arrancar con 1 núcleo y 512 MB, pero no lo recomienda. Ten en cuenta que, si construyes las imágenes en el mismo servidor, la compilación consume tanta memoria como la app; un build de Next.js en una máquina de 1 GB se queda sin RAM con facilidad. Coolify solo corre en Linux: en Windows o macOS hace falta una VM.

Se recomienda un servidor **limpio**, sin otras apps ocupando los puertos 80 y 443, y un Docker instalado por el método oficial (no por snap).

## Instalación

Como root o con un usuario con `sudo`:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

El script instala Docker si hace falta, levanta Coolify y muestra los siguientes pasos. Después:

1. Abre `http://<ip-del-servidor>:8000`.
2. Crea **de inmediato** la cuenta de administrador.
3. Haz copia de `/data/coolify/source/.env`.

Para no exponer nunca la página de registro, puedes crear el admin durante la instalación:

```bash
env ROOT_USERNAME=admin \
ROOT_USER_EMAIL=tu@correo.com \
ROOT_USER_PASSWORD='UnaClaveLarga123!' \
bash -c 'curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash'
```

Con un usuario no root, antepón `sudo -E`. Hay también una instalación manual paso a paso para servidores con Docker ya configurado o sin root.

Ejecutar un script remoto con `| bash` implica confiar en él; si prefieres revisarlo, descárgalo primero y léelo.

## Desplegar desde Git

1. Conecta tu proveedor Git: GitHub (mediante una GitHub App), GitLab, Bitbucket o Gitea. Los repositorios públicos se pueden usar directamente por URL.
2. Crea un recurso de tipo aplicación en un proyecto y entorno, elige el repositorio, la rama y el build pack.
3. Define variables de entorno y secretos en el panel.
4. Escribe el dominio con `https://` (por ejemplo `https://app.midominio.com`) y apunta su registro DNS A a la IP del servidor.
5. Despliega. A partir de ahí, cada `git push` a la rama dispara un despliegue.

Incluye **previews por pull request**, webhooks, rollback a despliegues anteriores, logs en vivo y terminal dentro del contenedor desde el navegador.

## SSL

Cuando un dominio empieza por `https://`, el proxy pide un certificado a **Let's Encrypt**, lo instala y lo renueva antes de que caduque. Para que funcione, el DNS debe apuntar ya al servidor y los puertos 80 y 443 deben estar abiertos.

## Bases de datos y backups

Coolify despliega bases de datos gestionadas con almacenamiento persistente. Las copias programadas están soportadas para **PostgreSQL, MySQL, MariaDB, MongoDB, ClickHouse y SQLite**; Redis, Dragonfly y KeyDB no, y necesitan su propia estrategia de persistencia.

- Se programan con una expresión cron o una frecuencia (diaria, semanal…).
- Se guardan en `/data/coolify/backups` con retención por número, antigüedad o tamaño.
- Pueden subirse a cualquier almacenamiento **compatible con S3** (AWS S3, Cloudflare R2, Backblaze B2, MinIO…), y borrar la copia local tras subirla.

La propia documentación lo advierte: un backup «correcto» solo significa que se generó un archivo. Restaura periódicamente una copia en una base de prueba para saber que sirve. Un backup que vive en el mismo servidor que la base de datos no te protege si pierdes el servidor: súbelo a S3.

## Coolify Cloud frente a autoalojado

| | Autoalojado | Coolify Cloud |
| --- | --- | --- |
| Precio | Gratis | 5 USD/mes (2 servidores), 3 USD por servidor extra |
| Dónde corre el panel | En tu servidor | En la infraestructura de Coolify |
| Dónde corren tus apps | En tus servidores | En tus servidores |
| Mantenimiento del panel | Tú (actualizaciones, backups de Coolify) | El equipo de Coolify |
| Extras | — | Alertas por correo y soporte por email limitado |

La configuración recomendada en ambos casos es separar el panel de las cargas: un servidor para Coolify y uno o más para las apps. Si el panel comparte máquina con las apps, un build pesado puede dejar sin recursos al propio Coolify.

## Cuándo conviene y cuándo no

**Conviene** si tienes varios proyectos pequeños o medianos, quieres costes predecibles, te sientes cómodo administrando un Linux y valoras no depender de un proveedor.

**No conviene** si necesitas red de borde global, escalado automático a cero o funciones serverless como las de Vercel; si nadie en el equipo puede responder cuando el servidor cae a las tres de la mañana; o si la app tiene requisitos de alta disponibilidad que un solo VPS no cubre. Las funciones de equipos, según su documentación, aún no están del todo pulidas para producción.

## Alternativas

- **[Openship](/findings/hallazgos-web/openship)** — otra opción autoalojada para desplegar en servidores propios.
- **Dokploy**, **CapRover** y **Dokku** — otros PaaS autoalojados; Dokku es el más minimalista (sin panel web por defecto, despliegue con `git push`).
- **Vercel, Netlify, Railway, Render** — PaaS gestionados: más caros, sin servidor que mantener.

## Seguridad

- Crea el admin antes que nadie o usa las variables `ROOT_*`.
- Expón el panel tras un dominio con HTTPS y limita el puerto 8000 por firewall cuando ya no lo necesites.
- Mantén el sistema operativo actualizado y el SSH con claves, no contraseñas.
- Trata el acceso al panel como acceso root a todos los servidores conectados: lo es.
- Prueba los cambios avanzados (proxy, red, overrides de Compose) en un servidor que no sea de producción.

## Fuentes

- [coolify.io](https://coolify.io) y [precios](https://coolify.io/pricing)
- [Documentación: instalación](https://coolify.io/docs/get-started/installation), [conceptos](https://coolify.io/docs/get-started/concepts), [build packs](https://coolify.io/docs/applications/build-packs/overview), [proxies](https://coolify.io/docs/knowledge-base/server/proxies) y [backups](https://coolify.io/docs/databases/backups)
- [github.com/coollabsio/coolify](https://github.com/coollabsio/coolify)
