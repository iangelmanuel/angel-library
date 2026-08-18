---
title: "nvm: manejar versiones de Node"
description: Instalar y cambiar entre versiones de Node.js con nvm — y por qué en Windows es un proyecto distinto (nvm-windows).
category: terminal
stack: terminal
order: 12
tags: [terminal, nvm, node, herramientas]
scope: nvm
related: [guides/terminal-npm, guides/terminal-pnpm, guides/terminal-bun]
updatedAt: 2026-08-17
---

## Por qué nvm

Distintos proyectos pueden necesitar distintas versiones de Node — uno viejo que solo corre bien en Node 18, otro que ya usa features de Node 22. Instalar Node "a mano" deja una sola versión global; nvm (Node Version Manager) permite tener varias instaladas en paralelo y cambiar directamente a otra por proyecto, sin desinstalar/reinstalar nada.

## Dos proyectos distintos con el mismo nombre

Esto genera confusión seguido:

| | macOS / Linux | Windows |
|---|---|---|
| Proyecto | [nvm-sh/nvm](https://github.com/nvm-sh/nvm) | [coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) |
| Instalación | Script vía `curl` | Instalador `.exe` |
| Mantenido por | nvm-sh | Corey Butler |

No es el mismo software con dos instaladores — son dos implementaciones separadas, con comandos similares pero no idénticos, y **no son compatibles entre sí** (los archivos que usa uno no los entiende el otro).

## Instalación en macOS / Linux

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

El script clona el repo en `~/.nvm` y agrega las líneas necesarias a `.bashrc` / `.zshrc` (ver [bash y zsh](/guides/terminal-linux-cli)). Después de instalar, cerrar y volver a abrir la terminal (o `source ~/.zshrc`).

## Instalación en Windows (nvm-windows)

Descargar `nvm-setup.exe` desde las [releases de coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows/releases) y correr el instalador. No usa el mismo script de `curl` que macOS/Linux — es un instalador gráfico normal de Windows.

## Comandos básicos

| Comando | macOS / Linux (nvm) | Windows (nvm-windows) |
|---|---|---|
| Instalar una versión | `nvm install 22` | `nvm install 22.0.0` (versión completa suele requerirse) |
| Usar una versión | `nvm use 22` | `nvm use 22.0.0` |
| Listar instaladas | `nvm list` | `nvm list` |
| Listar disponibles | `nvm list-remote` | `nvm list available` |
| Versión por default | `nvm alias default 22` | Automático: `nvm use` sin argumento aplica la última usada; no hay `alias default` |

## Ejemplo típico

```bash
nvm install 22
nvm use 22
node --version
```

## Consideraciones

- En macOS/Linux, `nvm use` solo aplica a la terminal actual — si el proyecto necesita una versión fija siempre, un archivo `.nvmrc` con el número de versión permite correr `nvm use` sin argumentos dentro de esa carpeta.
- nvm-windows requiere ejecutar `nvm use` (o similar) como administrador en algunas configuraciones, porque cambia symlinks del sistema — algo que nvm en macOS/Linux no necesita.
- Instalar Node por fuera de nvm (con el instalador oficial, o con Chocolatey/Scoop) y usar nvm al mismo tiempo suele generar conflictos de `PATH` — conviene elegir uno de los dos caminos.
