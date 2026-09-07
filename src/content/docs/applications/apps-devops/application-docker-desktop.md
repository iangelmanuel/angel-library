---
title: Docker Desktop — motor de contenedores con interfaz
description: Aplicación que permite ejecutar y administrar contenedores desde una interfaz gráfica; explica qué componentes instala, cómo observarlos y cuándo conviene usar comandos.
type: guides
order: 1
tags: [docker, contenedores, devops, desktop]
website: https://www.docker.com/products/docker-desktop
related:
  - devops/docker-conceptos/docker-que-es
  - devops/docker-conceptos/docker-instalacion
  - devops/docker-conceptos/docker-arquitectura
updatedAt: 2026-08-26
---

**Docker Desktop** es la aplicación de escritorio que empaqueta el motor de Docker, una máquina virtual ligera (en Windows y macOS) y una interfaz gráfica para gestionar contenedores, imágenes, volúmenes y redes sin escribir cada comando.

## Instalación

```powershell
# Windows — instalador con flags (silencioso, por usuario)
"Docker Desktop Installer.exe" install --user --quiet --accept-license
```

```bash
# macOS (Homebrew)
brew install --cask docker-desktop
```

En Windows, `install --user` (sin `--quiet`) deja ver el asistente pero instala solo para tu cuenta; `install` a secas instala para todos los usuarios y pide permisos de administrador. El propio instalador de Docker no aparece en la documentación oficial de Microsoft para `winget`, pero el paquete existe en el repositorio comunitario (`winget install Docker.DockerDesktop`) si prefieres esa vía.

En Linux, Docker Desktop es una aplicación aparte del **Docker Engine** que ya se documenta en [Instalación de Docker](/devops/docker-conceptos/docker-instalacion) — ahí la terminal es la única interfaz, sin la capa gráfica de este artículo.

## Qué corre debajo

Docker en su origen es tecnología de Linux: usa `namespaces` y `cgroups` del kernel para aislar procesos. Windows y macOS no tienen ese kernel, así que Docker Desktop levanta una **máquina virtual ligera** (WSL2 en Windows, una VM basada en Apple Virtualization Framework en macOS) donde corre el motor real. La interfaz que ves es un cliente que habla con ese motor.

Esto tiene una consecuencia práctica: en Windows, los contenedores corren dentro de la distro de WSL2 que Docker Desktop gestiona, no directamente sobre el sistema de archivos de Windows. Montar un volumen desde `C:\` funciona, pero cruza esa frontera de virtualización — de ahí que copiar archivos grandes a un volumen montado sea más lento que dentro de un volumen nombrado.

## La interfaz

| Sección                        | Para qué sirve                                                                                                        |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Containers**                 | Ver contenedores corriendo o detenidos, sus puertos, logs y estado; iniciar, detener o eliminar sin recordar el ID    |
| **Images**                     | Imágenes descargadas o construidas localmente, su tamaño y capas                                                      |
| **Volumes**                    | Volúmenes con nombre y cuánto espacio ocupan — el lugar donde vive la persistencia de una base de datos en contenedor |
| **Builds**                     | Historial de `docker build`, con el cache de cada capa                                                                |
| **Dashboard** de un contenedor | Botón directo a sus logs, una terminal dentro del contenedor y sus variables de entorno, sin `docker exec` manual     |

La pestaña **Containers** con clic en un contenedor abre sus logs en vivo — el equivalente visual de `docker logs -f <id>`, útil cuando estás probando algo y no quieres tener una terminal aparte solo para eso.

## Ejemplo: levantar Postgres y verlo en la interfaz

```bash
docker run -d --name pg-dev -e POSTGRES_PASSWORD=devpass -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16
```

Tras ejecutar esto, `pg-dev` aparece en **Containers** con su puerto mapeado y el volumen `pgdata` en **Volumes**. Puedes abrir una terminal integrada dentro del contenedor sin memorizar `docker exec -it pg-dev bash`.

## Recursos y límites

**Settings → Resources** controla cuánta CPU, memoria y disco tiene la VM. Es el ajuste que más gente ignora hasta que el sistema se pone lento: Docker Desktop reserva esos recursos para la VM aunque los contenedores estén inactivos. Bajar el límite de memoria en un equipo con poca RAM libera al resto del sistema.

**Settings → Docker Engine** expone el `daemon.json` en formato JSON editable desde la interfaz — el mismo archivo que en Linux se edita a mano.

## Terminal vs. interfaz

La interfaz no reemplaza `docker compose up`, `docker build` con flags de cache o un pipeline de CI: ahí la terminal (o el propio CI) sigue siendo la herramienta. Docker Desktop es fuerte para **inspeccionar y depurar** — ver qué está corriendo, revisar logs de un vistazo, confirmar que un volumen tiene los datos esperados — no para reemplazar los comandos que ya documenta esta biblioteca en [Docker](/categories/devops).

## Cuenta y licencia

Docker Desktop pide iniciar sesión con una cuenta de Docker Hub. Es gratuito para uso personal, código abierto no comercial, estudiantes y pequeñas empresas; una empresa que supere **cualquiera** de estos dos umbrales — 250 empleados o 10 millones de dólares de ingresos anuales — necesita una suscripción paga (Pro, Team o Business) para uso comercial, aunque sea solo uno de los dos. Confirma la [política de licenciamiento](https://www.docker.com/pricing/faq/) vigente antes de instalarlo en un entorno corporativo: los umbrales los fija Docker y pueden cambiar.

Fuentes: [instalación en Windows](https://docs.docker.com/desktop/setup/install/windows-install/), [instalación en Mac](https://docs.docker.com/desktop/setup/install/mac-install/) y [Docker Desktop overview](https://docs.docker.com/desktop/).
