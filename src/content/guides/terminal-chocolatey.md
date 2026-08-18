---
title: "Chocolatey: gestor de paquetes para Windows"
description: Instalar y manejar software en Windows desde la terminal con Chocolatey — install, upgrade, uninstall, search.
category: terminal
stack: terminal
order: 11
tags: [terminal, chocolatey, windows, gestor-de-paquetes]
scope: choco
related: [guides/terminal-scoop, guides/terminal-nvm]
updatedAt: 2026-08-17
---

## Qué es Chocolatey

Un gestor de paquetes para Windows — el equivalente a `apt` en Debian/Ubuntu o `brew` en macOS. Instala, actualiza y desinstala software desde la terminal en vez de buscar instaladores `.exe` a mano por internet.

## Instalación

Requiere PowerShell **como administrador**:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Este es el comando oficial publicado en [chocolatey.org/install](https://chocolatey.org/install). `Set-ExecutionPolicy Bypass -Scope Process` levanta la política de ejecución solo para ese proceso de PowerShell (no cambia la configuración global de la máquina), lo necesario para poder correr el script de instalación.

Verificar que quedó instalado:

```powershell
choco --version
```

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `choco install <paquete>` | Instala un paquete |
| `choco upgrade <paquete>` | Actualiza un paquete a su última versión |
| `choco upgrade all` | Actualiza todo lo instalado con Chocolatey |
| `choco uninstall <paquete>` | Desinstala un paquete |
| `choco list --local-only` | Lista lo que ya está instalado |
| `choco search <paquete>` | Busca un paquete en el repositorio |

## Ejemplos

```powershell
choco install git
choco install nodejs
choco install vscode
```

Cada `choco install` pide confirmación (`y`/`n`) salvo que se pase `-y`:

```powershell
choco install git -y
```

## Consideraciones

- Requiere terminal como administrador tanto para instalar Chocolatey como, en general, para instalar paquetes con él — instala en rutas de sistema (`Program Files`).
- Después de instalar un paquete que agrega un binario nuevo al `PATH`, a veces hace falta abrir una terminal nueva para que el cambio se refleje.
- Para herramientas de desarrollo sin necesitar permisos de administrador, ver [Scoop](/guides/terminal-scoop) — filosofía distinta, mismo objetivo.
