---
title: Warp — terminal por bloques y sesiones de proyecto
description: Aplicación de terminal que agrupa cada comando con su salida y permite guardar sesiones; explica sus ayudas visuales y de IA sin ocultar cómo funciona la terminal real.
type: guides
order: 1
tags: [warp, terminal, shell, workflows, ai]
website: https://www.warp.dev
related:
  - terminal/terminal/terminal-fundamentals-terminology
  - terminal/terminal/terminal-shell-scripting
updatedAt: 2026-08-25
---

**Warp** es una aplicación de terminal disponible para macOS, Windows y Linux. Organiza cada comando y su salida como un **Block**, añade edición moderna, búsqueda, sesiones guardadas, workflows y funciones de IA.

## Instalación

```bash
# macOS (Homebrew)
brew install --cask warp

# Windows (winget)
winget install Warp.Warp

# Linux — Debian/Ubuntu (repositorio oficial)
sudo apt-get install wget gpg
wget -qO- https://releases.warp.dev/linux/keys/warp.asc | gpg --dearmor > warpdotdev.gpg
sudo install -D -o root -g root -m 644 warpdotdev.gpg /etc/apt/keyrings/warpdotdev.gpg
sudo sh -c 'echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/warpdotdev.gpg] https://releases.warp.dev/linux/deb stable main" > /etc/apt/sources.list.d/warpdotdev.list'
sudo apt update && sudo apt install warp-terminal
```

Fedora/RHEL/CentOS usa el mismo paquete vía `.rpm` con un repositorio equivalente; Arch Linux tiene `.pkg.tar.zst` para instalar con `pacman -U`. Todos los métodos de paquete se actualizan solos — no hace falta reinstalar para tener la última versión.

## Warp no reemplaza el shell

La aplicación muestra y organiza la sesión; comandos como `cd`, `git`, `pnpm` o `docker` siguen siendo ejecutados por el shell y las herramientas instaladas en el sistema. Un comando válido en zsh puede necesitar cambios en PowerShell.

Warp admite shells como zsh, bash, fish y PowerShell. Confirma cuál está activo antes de copiar sintaxis de variables, pipes o rutas.

## Blocks

Un Block agrupa entrada, salida y código de salida. Permite copiar, buscar, compartir o volver a ejecutar una unidad sin seleccionar texto mezclado de toda la sesión.

Los bloques con salida roja o código distinto de cero señalan fallo, pero no explican la causa. Lee el primer error relevante y el comando exacto antes de reintentarlo.

## Workflows

Un workflow guarda un comando parametrizable que se repite. Es útil para recordar una operación, no para ocultar una secuencia crítica sin documentación.

```yaml
name: Buscar texto en el repositorio
command: rg "{{patron}}" {{ruta}}
arguments:
  - name: patron
    description: Texto o expresión regular
  - name: ruta
    default_value: src
```

Para procesos de proyecto, prefiere scripts versionados en `package.json`, `Makefile` o `scripts/`. Los workflows personales pueden llamar esos comandos sin duplicar su lógica.

## Launch Configurations

Una configuración de inicio conserva ventanas, tabs, paneles, directorios y comandos para reabrir un entorno de trabajo.

```yaml
---
name: Aplicación web
windows:
  - tabs:
      - title: Desarrollo
        layout:
          cwd: /ruta/absoluta/proyecto
          commands:
            - exec: pnpm dev
      - title: Git
        layout:
          cwd: /ruta/absoluta/proyecto
```

Las rutas deben corresponder a la máquina. Si el archivo se comparte, documenta cómo adaptarlas y evita comandos destructivos o que publiquen automáticamente.

## IA y datos

Las funciones conectadas pueden enviar prompts, contexto o salida a servicios remotos. No pegues tokens, `.env`, dumps, información de clientes ni logs completos sin revisar y anonimizar. Para comandos sensibles, solicita explicación y revisa cada argumento antes de ejecutar.

## Flujo recomendado

- usa Blocks para conservar contexto de una ejecución;
- convierte comandos repetidos y seguros en workflows;
- conserva lógica del proyecto en scripts versionados;
- usa launch configurations para sesiones, no para despliegues irreversibles;
- comprueba shell, directorio actual y entorno antes de ejecutar.

Fuentes: [instalación de Warp](https://docs.warp.dev/getting-started/quickstart/installation-and-setup), [Blocks](https://docs.warp.dev/terminal/blocks) y [Launch Configurations](https://docs.warp.dev/terminal/sessions/launch-configurations).
