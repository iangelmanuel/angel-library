---
title: "Scoop: gestor de paquetes para Windows sin admin"
description: Instalar y manejar herramientas de línea de comandos en Windows con Scoop — sin permisos de administrador, en el perfil de usuario.
category: terminal
stack: terminal
order: 25
tags: [terminal, scoop, windows, gestor-de-paquetes]
scope: scoop
related: [guides/terminal-chocolatey]
updatedAt: 2026-08-17
---

## Qué es Scoop

Un gestor de paquetes para Windows orientado a herramientas de línea de comandos y dev tools. La diferencia principal con Chocolatey es dónde y cómo instala:

| | Chocolatey | Scoop |
|---|---|---|
| Requiere administrador | Sí (para instalar Chocolatey y, en general, para paquetes) | No |
| Dónde instala | Rutas de sistema (`Program Files`) | Perfil del usuario (`~\scoop`) |
| Enfoque | Software en general (apps de escritorio, runtimes, CLIs) | Principalmente CLIs y dev tools |

Ninguno es estrictamente "mejor" — Scoop conviene para herramientas de desarrollo que no necesitan quedar instaladas a nivel de todo el sistema, y evita tener que abrir la terminal como administrador cada vez. Chocolatey tiene un catálogo más amplio, incluyendo software de escritorio típico.

## Instalación

Desde PowerShell (no requiere administrador):

```powershell
irm get.scoop.sh | iex
```

Este es el comando oficial publicado en [scoop.sh](https://scoop.sh). `irm` (`Invoke-RestMethod`) descarga el script de instalación e `iex` (`Invoke-Expression`) lo ejecuta.

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `scoop install <paquete>` | Instala un paquete |
| `scoop update <paquete>` | Actualiza un paquete específico |
| `scoop update *` | Actualiza todos los paquetes instalados |
| `scoop uninstall <paquete>` | Desinstala un paquete |
| `scoop list` | Lista lo que ya está instalado |
| `scoop search <paquete>` | Busca un paquete |

## Buckets

Scoop organiza los paquetes en "buckets" (repositorios). El bucket `main` viene incluido; herramientas menos comunes suelen vivir en buckets adicionales que hay que agregar antes de poder instalarlas:

```powershell
scoop bucket add extras
```

`extras` es el bucket oficial más usado después de `main`, con GUIs y herramientas que no encajan en el criterio de `main` (solo CLIs).

## Ejemplo

```powershell
scoop install git
scoop bucket add extras
scoop install vscode
```

## Consideraciones

- Al no requerir administrador, Scoop es cómodo en máquinas con permisos restringidos o cuando se quiere evitar tocar rutas de sistema.
- Un paquete que Scoop no encuentra en `main` casi siempre está en `extras` o algún otro bucket de la comunidad — agregar el bucket correcto antes de asumir que el paquete no existe.
- Para software que sí necesita instalarse a nivel de sistema (o que no está disponible en los buckets de Scoop), [Chocolatey](/guides/terminal-chocolatey) suele tener más cobertura.
