---
title: "Chocolatey: gestor de paquetes para Windows"
description: Gestor de paquetes para instalar, actualizar y desinstalar programas de Windows mediante comandos, evitando buscar cada instalador manualmente.
type: guides
order: 2
tags: [terminal, chocolatey, windows, gestor-de-paquetes]
scope: choco
website: https://chocolatey.org
related: [terminal/terminal/terminal-scoop, applications/apps-cli/terminal-nvm]
updatedAt: 2026-08-28
---

## Qué es Chocolatey

Un gestor de paquetes para Windows — el equivalente a `apt` en Debian/Ubuntu o `brew` en macOS. Instala, actualiza y desinstala software desde la terminal en vez de buscar instaladores `.exe` a mano por internet.

Un paquete de Chocolatey contiene metadatos y scripts que descargan o instalan el software real. Por eso conviene revisar el mantenedor, la fecha, los archivos y el script del paquete antes de ejecutarlo con permisos administrativos, especialmente si no es un paquete conocido.

## Instalación

Requiere PowerShell **como administrador**:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

Este es el comando oficial publicado en [chocolatey.org/install](https://chocolatey.org/install). `Set-ExecutionPolicy Bypass -Scope Process` levanta la política de ejecución solo para ese proceso de PowerShell (no cambia la configuración global de la máquina), lo necesario para poder correr el script de instalación.

El comando descarga y ejecuta código remoto. Antes de pegar una variante encontrada en un tutorial, compárala con la documentación oficial y, si el entorno es sensible, inspecciona `https://community.chocolatey.org/install.ps1`.

Verificar que quedó instalado:

```powershell
choco --version
choco source list
```

`source list` permite comprobar desde qué repositorios se resolverán paquetes. La fuente comunitaria es apropiada para uso individual; una organización puede exigir un repositorio interno aprobado.

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `choco install <paquete>` | Instala un paquete |
| `choco upgrade <paquete>` | Actualiza un paquete a su última versión |
| `choco upgrade all` | Actualiza todo lo instalado con Chocolatey |
| `choco uninstall <paquete>` | Desinstala un paquete |
| `choco list` | Lista los paquetes instalados localmente en Chocolatey 2.x |
| `choco outdated` | Muestra paquetes con actualizaciones disponibles |
| `choco search <paquete>` | Busca un paquete en el repositorio |
| `choco info <paquete>` | Muestra versión, descripción y metadatos |
| `choco pin add -n=<paquete>` | Evita que un paquete se actualice automáticamente |

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

`-y` acepta las confirmaciones automáticamente. Es cómodo en un script controlado, pero elimina la oportunidad de revisar cada pregunta; evita añadirlo por costumbre a comandos copiados de fuentes desconocidas.

Un ejemplo de mantenimiento deliberado:

```powershell
choco outdated
choco upgrade git
choco upgrade chocolatey
```

Actualizar paquetes concretos reduce la superficie de cambio frente a `choco upgrade all`, especialmente en una máquina de trabajo donde varias herramientas pueden introducir cambios incompatibles a la vez.

## Autenticación

Instalar paquetes públicos desde la comunidad no requiere una cuenta. Repositorios privados, Chocolatey for Business o feeds corporativos pueden solicitar una clave o credenciales. No las escribas en scripts versionados ni directamente en una URL; usa la configuración segura definida por la organización.

## Consideraciones

- Requiere terminal como administrador tanto para instalar Chocolatey como, en general, para instalar paquetes con él — instala en rutas de sistema (`Program Files`).
- Después de instalar un paquete que agrega un binario nuevo al `PATH`, a veces hace falta abrir una terminal nueva para que el cambio se refleje.
- Para herramientas de desarrollo sin necesitar permisos de administrador, ver [Scoop](/terminal/terminal/terminal-scoop) — filosofía distinta, mismo objetivo.
- Chocolatey puede detectar software instalado por fuera, pero no siempre conoce cómo fue configurado. Antes de adoptar un paquete sobre una instalación existente, revisa sus parámetros y realiza una copia de la configuración importante.
- No ejecutes simultáneamente Chocolatey, Winget y un instalador manual para administrar la misma aplicación; pueden competir por versiones, rutas y desinstaladores.
