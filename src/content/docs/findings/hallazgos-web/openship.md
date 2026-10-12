---
title: "OpenShip: un PaaS autoalojado con CI/CD, correo y backups"
description: "Plataforma open source para desplegar cualquier stack en tu propio servidor: detecta el proyecto, construye, enruta, emite el certificado y redespliega en cada push. Se maneja desde app de escritorio, panel web o CLI."
tags: [paas, despliegue, autoalojado, docker, ci-cd, devops, vps, typescript]
sidebar:
  order: 7
draft: false
resourceCategory: developer-tools
official: true
website: https://openship.io
github: https://github.com/oblien/openship
technologies:
  - devops/docker-conceptos/docker-que-es
  - devops/docker-compose/docker-compose-basico
note: "El código propio es Apache-2.0 y autoalojarlo es gratis. El motor de correo incluido (iRedMail) es GPL y viene en varias distribuciones aunque no actives el correo."
warnings:
  - "En modo Compose el contenedor de la API monta el socket de Docker del host: tiene privilegios equivalentes a root en esa máquina. Instálalo solo en un servidor de confianza."
  - "Montar tu propio servidor de correo es fácil de arrancar y difícil de mantener: reputación de IP, listas negras y DKIM/SPF/DMARC bien configurados deciden si tus correos llegan."
  - "Push-to-deploy y dominios públicos necesitan una instancia siempre encendida y accesible desde internet; la app de escritorio no puede recibir webhooks."
updatedAt: 2026-10-12
---

> Publicado por **[oblien](https://github.com/oblien)** con licencia **Apache-2.0**. Unas 14.700 estrellas. Documentación en [openship.io/docs](https://openship.io/docs).

[OpenShip](https://github.com/oblien/openship) es una **plataforma de despliegue autoalojada con CI/CD integrado**. Le señalas un repositorio y se encarga del resto: detecta el stack, construye la aplicación, la ejecuta, le pone dominio con HTTPS y la vuelve a desplegar cada vez que haces push.

## Qué es un PaaS y por qué autoalojarlo

Un **PaaS** (_Platform as a Service_) es la capa que hay entre tu código y el servidor: tú subes el código y la plataforma resuelve la construcción, el proceso, el proxy, los certificados y los logs. Heroku, Vercel o Render son PaaS gestionados: cómodos, pero pagas por uso y tus apps viven en su infraestructura.

Un PaaS **autoalojado** te da la misma experiencia sobre un VPS de 5 € al mes, un servidor dedicado o una máquina de casa. A cambio, el mantenimiento del servidor pasa a ser tuyo.

## Cómo funciona

Para cada despliegue, OpenShip recorre el mismo flujo:

1. **Detecta.** Lee `package.json`, la configuración del framework, los lockfiles y cualquier `docker-compose.yml` u `openship.json` para deducir el stack, el gestor de paquetes, los comandos de build y arranque, y el puerto. No exige archivos de configuración; `openship.json` sirve para sobrescribir lo que deduce.
2. **Construye.** En el servidor destino o en local, como imagen de Docker o como _release_ sin contenedor. La configuración resuelta se congela en una instantánea, así que un redespliegue o un _rollback_ repite exactamente lo que se publicó.
3. **Ejecuta.** Como contenedor publicado solo en _loopback_ (nunca en un puerto público) o como proceso supervisado del host.
4. **Enruta y protege.** Un edge de **OpenResty** (nginx con Lua) crea el _virtual host_ del dominio y emite un certificado de Let's Encrypt. Como esto ocurre después de que la app arranque, un fallo de DNS o de certificado aparece como «acción requerida» y no tumba el despliegue.
5. **Redespliega en push.** Un webhook de GitHub relanza el flujo en cada push a la rama seguida. En un monorepo solo reconstruye los servicios que cambiaron.

## Características

| Área                | Qué ofrece según el README                                          |
| ------------------- | ------------------------------------------------------------------- |
| CI/CD               | Push-to-deploy, entornos de preview, staging/producción, rollbacks  |
| Stacks              | Node, Python, Go, Rust, PHP, Ruby, Java, .NET, Docker y monorepos   |
| Backend             | Postgres, MySQL, MongoDB, Redis, workers, WebSockets, almacenamiento |
| Dominios            | Let's Encrypt automático, comodines, renovación                     |
| CDN                 | Caché en el edge, HTTP/3, Brotli, purgado                           |
| Correo              | Servidor SMTP propio con DKIM, SPF y DMARC                          |
| Backups             | Programados, de bases de datos y volúmenes, restauración en un clic |
| Monitorización      | Logs de build en vivo, métricas de contenedores, geografía de visitas |
| Docker Compose      | Despliega archivos compose existentes tal cual                      |

Además expone una **API REST**, un **SDK de JavaScript/TypeScript** (`npm install openship`) y un endpoint **MCP** para agentes de IA, en el que solo se publican las rutas que lo permiten explícitamente.

## Tres formas de ejecutarlo

Lo primero es decidir dónde vive el **plano de control** (el panel que orquesta), que no tiene por qué ser donde corren tus apps:

| Si eres…                                   | Ejecuta OpenShip como       | Tus apps corren en                       |
| ------------------------------------------ | --------------------------- | ---------------------------------------- |
| Una persona, una máquina, sin ops          | App de escritorio           | Un servidor conectado por SSH, u OpenShip Cloud |
| Un equipo, o quieres push-to-deploy        | Servidor autoalojado        | Ese mismo servidor, u otro por SSH       |
| Alguien que no quiere mantener nada        | OpenShip Cloud              | Sandboxes gestionados                    |

**La app de escritorio** (macOS, Windows y Linux, en las [releases](https://github.com/oblien/openship/releases/latest)) ejecuta el plano de control solo mientras está abierta y gestiona tus servidores por SSH, sin exponer nada públicamente.

**El servidor autoalojado** se instala con la CLI, que incluye la API y el panel:

```bash
curl -fsSL https://get.openship.io | sh
openship
```

El segundo comando abre un asistente que crea el administrador, configura el dominio e instala OpenShip como servicio de arranque. También se puede instalar con `npm i -g openship` (necesita Node 22 o superior). Para servidores sin interfaz:

```bash
openship up
openship up --public-url https://openship.example.com
```

`openship up` elige el modo según la máquina:

- **Linux con Docker → modo Compose.** Levanta Postgres, Redis, la API, el panel y el edge de OpenResty en los puertos 80 y 443. Es el modo que **aloja tus apps en la misma máquina**.
- **El resto (macOS, Windows o Linux sin Docker) → modo _bare_.** Un único proceso con base de datos embebida que despliega hacia otros servidores por SSH.

Desplegar un proyecto desde su carpeta:

```bash
cd tu-proyecto
openship init
openship deploy
```

Si prefieres no usar la CLI, el repositorio trae `docker/docker-compose.yml`, que descarga las imágenes publicadas en `ghcr.io/oblien/*`. Solo funciona en Linux (usa red del host) y hay operaciones del host, como el correo, que necesitan pasos manuales.

## Comparativa

Si vienes de otros PaaS autoalojados, [Coolify](/applications/apps-devops/application-coolify) es la referencia más conocida del sector.

| Aspecto              | OpenShip                          | Coolify                     | Dokploy                   | CapRover                  | Vercel                       |
| -------------------- | --------------------------------- | --------------------------- | ------------------------- | ------------------------- | ---------------------------- |
| Modelo               | Autoalojado (y nube opcional)     | Autoalojado (y nube opcional) | Autoalojado (y nube opcional) | Autoalojado            | Gestionado                   |
| Interfaces           | Escritorio, web, CLI, SDK, MCP    | Web y API                   | Web, CLI y API            | Web y CLI                 | Web, CLI y API               |
| Proxy                | OpenResty                         | Traefik o Caddy             | Traefik                   | nginx                     | Su propia red edge           |
| Servidor de correo   | Incluido                          | No                          | No                        | No                        | No                           |
| Detección sin config | Sí                                | Sí (Nixpacks y otros)       | Sí (Nixpacks y otros)     | Necesita `captain-definition` o Dockerfile | Sí, centrado en frontend |
| Punto fuerte         | Todo en uno, app de escritorio    | Madurez y catálogo de servicios | Simplicidad, Docker Swarm | Veterano y estable        | DX y funciones serverless    |

**Cuándo elegir OpenShip.** Si quieres una sola herramienta que cubra también correo, CDN y backups, o te atrae gestionar varios VPS desde una app de escritorio sin dejar un panel expuesto. Si necesitas algo probado durante años por mucha gente, Coolify o CapRover tienen más recorrido. Si tu proyecto es sobre todo frontend y prefieres no administrar servidores, Vercel sigue siendo más cómodo.

## Límites

- El propio README avisa de que la documentación todavía se está completando. Funciones como clústeres multinodo, balanceo de carga visual o redes privadas aparecen como «próximamente».
- Lo que añadas al servidor (base de datos, correo, backups) depende de ese servidor: un PaaS no sustituye a una copia fuera de la máquina.
- Las licencias de terceros cambian el panorama: revisa el [inventario de licencias](https://github.com/oblien/openship/blob/main/docs/licensing.md) si piensas redistribuirlo.

## Fuentes

- [Repositorio y README de OpenShip](https://github.com/oblien/openship)
- [Sitio oficial](https://openship.io)
- [Documentación](https://openship.io/docs)
- [Política de seguridad](https://github.com/oblien/openship/blob/main/SECURITY.md)
