---
title: "Instalación de Docker"
description: Docker Desktop con WSL2 en Windows, instalación en Mac y Linux, y cómo verificar que todo funciona.
category: devops
stack: docker-conceptos
order: 4
tags: [docker, conceptos, instalacion, windows, wsl2]
scope: instalación de Docker
related: [guides/docker-arquitectura]
updatedAt: 2026-08-17
---

## Windows: Docker Desktop + WSL2

La forma recomendada en Windows es **Docker Desktop** usando **WSL2** (Windows Subsystem for Linux 2) como backend — WSL2 corre un kernel Linux real, que es lo que los contenedores Linux necesitan por debajo.

1. Verificar que WSL2 esté instalado:

```powershell
wsl --status
```

Si no está instalado:

```powershell
wsl --install
```

(requiere reiniciar la máquina).

2. Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/).
3. Al abrir Docker Desktop por primera vez, ir a **Settings → General** y confirmar que **"Use the WSL 2 based engine"** esté activado (es el default en instalaciones nuevas).
4. Si usás WSL2 con alguna distro (Ubuntu, etc.) para tu terminal de trabajo, en **Settings → Resources → WSL Integration** activar la integración con esa distro — así `docker` funciona también desde adentro de WSL, no solo desde PowerShell.

## Mac

Descargar [Docker Desktop para Mac](https://www.docker.com/products/docker-desktop/) (elegir chip Apple Silicon o Intel según corresponda). Docker Desktop maneja la VM liviana por debajo automáticamente, sin pasos extra.

## Linux

En Linux, Docker corre nativo (sin VM intermedia, porque el kernel ya es Linux). Instalación vía el script oficial o el gestor de paquetes de la distro — ver la [documentación oficial](https://docs.docker.com/engine/install/) para el comando exacto según la distro. Paso extra recomendado: agregar el usuario al grupo `docker` para no tener que usar `sudo` en cada comando:

```bash
sudo usermod -aG docker $USER
```

(requiere cerrar sesión y volver a entrar para que tome efecto).

## Verificar que todo funciona

```bash
docker --version
docker compose version
docker run hello-world
```

- `docker --version` confirma que la CLI está instalada.
- `docker compose version` confirma que el plugin de Compose está disponible (viene incluido en Docker Desktop — ver [Docker Compose básico](/guides/docker-compose-basico)).
- `docker run hello-world` descarga una imagen mínima y corre un contenedor que imprime un mensaje de confirmación — si esto funciona, el daemon está corriendo y todo el flujo (pull → crear contenedor → arrancar) funciona de punta a punta.

## Problemas comunes

| Síntoma | Causa típica |
|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop no está abierto, o el daemon no arrancó |
| WSL2 no instala / falla `wsl --install` | Virtualización desactivada en la BIOS/UEFI |
| Todo muy lento en Windows | Proyecto ubicado en `C:\...` en vez del filesystem de WSL2 (`\\wsl$\...`) — el filesystem cruzado Windows↔WSL2 es lento |

## Consideraciones

- Reiniciar Docker Desktop (ícono en la bandeja del sistema → Restart) resuelve una buena parte de los problemas raros del día a día antes de investigar más a fondo.
- Con WSL2 activo, para mejor rendimiento en Windows conviene tener el código del proyecto **dentro** del filesystem de WSL2, no en `C:\Users\...` montado desde WSL.
