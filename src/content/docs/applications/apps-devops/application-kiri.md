---
title: "Kiri — runtime de contenedores ligero, alternativa a Docker Desktop"
description: "Runtime de contenedores escrito en Rust para macOS, Windows y Linux que habla la API de Docker Engine, así que el CLI docker, Compose y buildx funcionan sin cambios; trae ventana propia, dominios locales, Kubernetes de un nodo e interfaz en 38 idiomas."
tags: [kiri, contenedores, docker, docker-desktop, orbstack, rust, kubernetes, devops, desktop]
sidebar:
  order: 3
draft: false
runtime: macOS 14+, Windows 10/11 (WSL 2), Linux (.deb, .rpm)
resourceCategory: Sitio oficial
official: true
website: https://runkiri.com
github: https://github.com/libracoder/kiri
technologies:
  - applications/apps-devops/application-docker-desktop
  - devops/docker-conceptos/docker-que-es
  - devops/docker-conceptos/docker-arquitectura
  - devops/docker-conceptos/docker-contenedores-vs-vms
note: "Licencia Apache-2.0 y gratuito. Proyecto muy reciente: el repositorio se creó el 2 de noviembre de 2026 y la última versión es la v0.2.1. En Windows funciona a través de WSL 2."
warnings:
  - "Software en versión 0.x con dos semanas de vida. Sus cifras de rendimiento son del propio proyecto. No lo pongas como único entorno de contenedores de un equipo sin probarlo antes con tus proyectos."
  - "En Linux, pertenecer al grupo kiri equivale a tener root, igual que el grupo docker. Añade solo a usuarios de confianza."
  - "Para HTTPS en los dominios *.kiri.local crea su propia autoridad de certificación y te pide confiar en ella. Sus restricciones de nombre la limitan a *.kiri.local y *.kiri.localhost, pero sigue siendo una CA más en tu sistema: protege ~/.kiri/tls."
  - "Las apps y los DMG de macOS están firmados y notarizados. La documentación no dice si el instalador .msi de Windows está firmado: comprueba la firma antes de instalarlo."
updatedAt: 2026-11-16
---

> Desarrollado por **[libracoder](https://github.com/libracoder)** (las contribuciones se firman con un CLA a favor de Canestack Labs). Licencia **Apache-2.0**; el nombre y el logo de Kiri quedan fuera de la licencia. Unas 9.000 estrellas en dos semanas.

## En pocas palabras

**Kiri** es un sustituto de [Docker Desktop](/applications/apps-devops/application-docker-desktop) y de OrbStack. Ejecuta tus imágenes de Docker dentro de una máquina virtual Linux pequeña (en macOS y Windows) o directamente sobre el kernel (en Linux), y expone la **API de Docker Engine**: la interfaz HTTP que usa el CLI `docker` para hablar con el motor. Como habla esa misma API, `docker`, Compose y buildx funcionan contra Kiri sin tocar nada.

El nombre viene de la palabra igbo _ntakịrị_, «pequeño».

## Qué problema resuelve

Docker Desktop es pesado en memoria, tarda en arrancar y su licencia exige pago a empresas grandes. Kiri apunta a lo mismo (contenedores con interfaz gráfica en el portátil) con un demonio que, según el README, se queda en unos 15 MB y una VM que se duerme tras 60 segundos sin uso.

## Cómo funciona

```text
docker CLI ─┐
compose ────┼─ Docker Engine API ─► kiri daemon ── vsock ──► guest agent (PID 1)
buildx ─────┤                         owns the VM           clone3 → container
kiri UI ────┘
```

- El **demonio** `kiri` está escrito en Rust y gestiona la VM.
- La VM usa un kernel Linux propio de unos 10 MB. Su primer proceso (PID 1) es un agente en Rust de unos 900 KB que crea cada contenedor con una sola llamada `clone3` dentro de _namespaces_ y un _cgroup_. No hay runc, ni shim, ni dockerd.
- En **Linux** no hay VM: el agente corre sobre el kernel del anfitrión.
- En **Windows**, Kiri corre dentro de una distro de WSL 2 y `kiri-win.exe` expone la API en la tubería con nombre `npipe:////./pipe/kiri`, sin cambiar la red de WSL ni de Windows.
- La **ventana** usa la webview del sistema (WebKit en macOS, WebView2 en Windows, GTK en Linux), no Tauri ni Electron.

## Instalación

Descarga el instalador de [runkiri.com/releases](https://runkiri.com/releases/): `.dmg` para macOS 14+ (Apple silicon o Intel), `.msi` para Windows 10 y 11 (x86-64 o Arm) y `.deb` o `.rpm` para Linux. La primera vez que lo abres crea un contexto de Docker llamado `kiri`. Las actualizaciones se instalan solas tras comprobar la firma y el SHA-256 de cada versión.

## Uso

```bash
docker --context kiri run --rm alpine echo hello
docker --context kiri compose up -d
kiri k8s start
kiri machine create dev --distro ubuntu && kiri machine shell dev
kiri import
```

`kiri k8s start` levanta un Kubernetes de un nodo (k3s) como contexto `kiri` de kubectl. `kiri import` trae imágenes, volúmenes y contenedores desde Docker Desktop u OrbStack. Los comandos de Docker también existen como `kiri run`, `kiri ps` o `kiri compose up`, siempre contra Kiri.

## Características

| Área             | Qué incluye                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Compatibilidad   | CLI `docker`, Compose, buildx, `docker login`; imágenes amd64 con Rosetta en Apple silicon    |
| Dominios locales | `http://<nombre>.kiri.local` y `<servicio>.<proyecto>.kiri.local` para Compose, con HTTPS     |
| Ventana          | Contenedores, imágenes, volúmenes y redes; proyectos de Compose agrupados; logs y terminal    |
| Kubernetes       | Clúster k3s de un nodo con `kiri k8s start`                                                   |
| Máquinas Linux   | `kiri machine create` con tu usuario, sudo y, en Mac, `/Users` en la misma ruta               |
| USB (beta)       | Pasar un dispositivo USB (adaptador serie, placa de desarrollo) a un contenedor               |
| Idiomas          | 38 idiomas, español incluido; sigue el idioma del sistema y se cambia en Ajustes → Apariencia |

Las cifras de rendimiento son del propio proyecto: un contenedor `alpine` arranca y termina en unos 2,5 ms por la API frente a 213 ms en Docker Desktop y 380 ms en OrbStack (mediana de 30 ejecuciones, metodología en `bench/results.json`). Puedes repetirlas con `kiri bench`.

## Cuándo conviene y cuándo no

Conviene si Docker Desktop te come memoria o batería en el portátil, si quieres dominios locales con HTTPS sin montar un proxy, o si te interesa un runtime pequeño y legible para estudiar cómo se crea un contenedor.

No conviene, de momento, como base de un equipo entero ni en máquinas donde la estabilidad pesa más que la velocidad: es una v0.2 con dos semanas de vida. Tampoco si dependes de `docker build --add-host name:host-gateway` con BuildKit, que hoy falla (el README propone usar la IP directamente o `DOCKER_BUILDKIT=0`).

## Alternativas

| Herramienta                                                       | Licencia                                   | Plataformas           | Diferencia principal                                              |
| ----------------------------------------------------------------- | ------------------------------------------ | --------------------- | ----------------------------------------------------------------- |
| Kiri                                                              | Apache-2.0                                 | macOS, Windows, Linux | Runtime propio en Rust, sin dockerd ni runc; muy reciente         |
| [Docker Desktop](/applications/apps-devops/application-docker-desktop) | Gratis para uso personal y empresas pequeñas | macOS, Windows, Linux | El estándar, con el motor de Docker completo y soporte comercial  |
| OrbStack                                                          | Comercial, gratis para uso personal        | macOS                 | Solo Mac; Kiri lo incluye en su comparativa de rendimiento       |

## Límites y precauciones

- En macOS, un dispositivo USB conectado desaparece de los contenedores mientras el Mac duerme y se vuelve a conectar al despertar.
- Por defecto, `-p 8080:80` publica en todas las interfaces, igual que Docker. Usa `-p 127.0.0.1:8080:80` para dejar un puerto solo en tu equipo.
- El instalador de macOS incluye el CLI de Docker, Compose y buildx; la variante «Lite» los descarga en el primer arranque, comprobando su SHA-256.

## Fuentes

- [Repositorio y README de Kiri](https://github.com/libracoder/kiri)
- [Lista de funciones y problemas conocidos](https://github.com/libracoder/kiri/blob/main/docs/features.md)
- [Sitio oficial y descargas](https://runkiri.com/releases/)
