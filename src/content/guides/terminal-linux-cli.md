---
title: "bash y zsh: shells tipo Linux"
description: Diferencia entre bash y zsh, sus archivos de configuración, y los gestores de paquetes del sistema por distro.
category: terminal
stack: terminal
order: 19
tags: [terminal, bash, zsh, linux, gestor-de-paquetes]
scope: bash / zsh
related: [guides/terminal-wsl, guides/terminal-powershell, guides/terminal-nvm]
updatedAt: 2026-08-17
---

## bash vs zsh

Ambos son shells — el programa que interpreta lo que se tipea en la terminal. zsh es más nuevo, con mejor autocompletado y más opciones de personalización (frameworks como Oh My Zsh son solo para zsh); bash es el más extendido históricamente y el default de la mayoría de distros Linux. macOS usa zsh como shell default desde Catalina (2019); antes usaba bash.

Ver el shell actual:

```bash
echo $SHELL
```

## Archivos de configuración

Cada shell corre distintos archivos según cómo se abrió la sesión:

| Archivo | Shell | Cuándo se ejecuta |
|---|---|---|
| `~/.bashrc` | bash | Cada terminal nueva interactiva (no de login) |
| `~/.bash_profile` | bash | Solo en shells de "login" (ej. al conectarse por SSH) |
| `~/.zshrc` | zsh | Cada terminal nueva interactiva |
| `~/.zprofile` | zsh | Solo en shells de "login" |

En la práctica, la mayoría de terminales gráficas (VS Code, iTerm, GNOME Terminal) abren shells interactivos no-login, así que `.bashrc`/`.zshrc` es donde va casi todo: alias, `PATH`, variables de entorno, prompts. `.bash_profile`/`.zprofile` suele limitarse a cargar el otro archivo:

```bash
# .bash_profile
[ -f ~/.bashrc ] && source ~/.bashrc
```

## Gestores de paquetes del sistema por distro

| Distro | Gestor | Instalar | Actualizar índice | Actualizar paquetes | Quitar |
|---|---|---|---|---|---|
| Debian / Ubuntu | `apt` | `sudo apt install <paquete>` | `sudo apt update` | `sudo apt upgrade` | `sudo apt remove <paquete>` |
| Fedora / RHEL | `dnf` | `sudo dnf install <paquete>` | (implícito en install) | `sudo dnf upgrade` | `sudo dnf remove <paquete>` |
| Arch | `pacman` | `sudo pacman -S <paquete>` | `sudo pacman -Sy` | `sudo pacman -Syu` | `sudo pacman -R <paquete>` |

## Ejemplo típico

```bash
sudo apt update && sudo apt upgrade
```

Primero refresca el índice de paquetes disponibles (`update`), después instala las versiones más nuevas de lo ya instalado (`upgrade`). Encadenar los dos con `&&` es el flujo estándar en Debian/Ubuntu — correr solo `upgrade` sin `update` antes deja actualizar contra un índice viejo.

## Consideraciones

- `apt` distingue `update` (refrescar índice) de `upgrade` (aplicar actualizaciones) — son pasos separados a propósito. `dnf` y `pacman` no separan tanto ese paso.
- Cambiar de shell default (`chsh -s $(which zsh)`) no borra la configuración de bash — ambos archivos pueden coexistir, cada shell lee solo los suyos.
- Estos gestores administran software del **sistema operativo** — no reemplazan a `npm`/`pnpm`/`bun` para dependencias de un proyecto Node.
