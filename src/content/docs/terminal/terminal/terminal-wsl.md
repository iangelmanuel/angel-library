---
title: "WSL: Linux dentro de Windows"
description: Instalar y manejar WSL — distros, comandos de gestión, acceso a filesystem cruzado y por qué el rendimiento importa según dónde vive el proyecto.
type: guides
order: 24
tags: [terminal, wsl, windows, linux]
scope: wsl
related:
  [terminal/terminal/terminal-linux-cli, terminal/terminal/terminal-powershell]
updatedAt: 2026-08-17
---

## Qué es WSL

Windows Subsystem for Linux — un kernel Linux real corriendo dentro de Windows (WSL2, la versión actual, usa una VM liviana por debajo), que permite usar distros Linux completas (Ubuntu, Debian, etc.) desde Windows sin dual-boot ni una VM tradicional pesada.

Esta es la guía de referencia general de WSL. Para el uso puntual de WSL como base de Docker Desktop en Windows, ver la mención específica en la guía de instalación de Docker.

## Instalación

Desde PowerShell **como administrador**:

```powershell
wsl --install
```

Instala WSL2 y, por default, Ubuntu como distro inicial. Requiere reiniciar la máquina al terminar.

## Listar distros disponibles

```powershell
wsl --list --online
```

Muestra las distros que se pueden instalar (Ubuntu, Debian, openSUSE, Kali, etc.).

## Instalar una distro específica

```powershell
wsl --install -d Ubuntu
```

Se puede tener más de una distribución instalada al mismo tiempo, cada una con su propio sistema de archivos y paquetes independientes.

## Comandos de gestión

| Comando                      | Qué hace                                                                                        |
| ---------------------------- | ----------------------------------------------------------------------------------------------- |
| `wsl --list --verbose`       | Lista las distros instaladas, con versión de WSL (1 o 2) y estado (Running/Stopped)             |
| `wsl --set-default <distro>` | Cambia cuál distro abre `wsl` sin argumentos                                                    |
| `wsl --shutdown`             | Apaga por completo la VM de WSL2 (todas las distros) — útil si quedó consumiendo memoria de más |
| `wsl -d <distro>`            | Abre una sesión en una distro específica                                                        |

## Acceso a filesystem cruzado

### Desde WSL, al filesystem de Windows

```bash
cd /mnt/c/Users/usuario/Documents
```

Cada unidad de Windows (`C:`, `D:`, etc.) queda montada bajo `/mnt/`.

### Desde Windows, al filesystem de WSL

En el Explorador de archivos:

```
\\wsl$\Ubuntu\home\usuario
```

También accesible tipeando esa misma ruta en la barra de direcciones del Explorador.

## Rendimiento: dónde vive el proyecto importa

Un proyecto ubicado dentro del filesystem de WSL (`~/proyectos/...`, es decir el filesystem nativo de Linux) es notablemente más rápido para operaciones de I/O (instalar dependencias, compilar, `git status` en repos grandes) que el mismo proyecto ubicado en `/mnt/c/...`.

La razón: acceder a `/mnt/c/` desde WSL cruza la frontera entre el filesystem Linux (ext4) y el filesystem Windows (NTFS) en cada operación, lo cual tiene overhead. Trabajar directo en `/mnt/c/` desde herramientas Linux es notablemente más lento que trabajar en el filesystem nativo de WSL.

**Regla práctica**: si el trabajo diario es principalmente desde herramientas Linux dentro de WSL, el proyecto debería vivir en `~/` dentro de WSL, no en `/mnt/c/Users/...`.

## Consideraciones

- `wsl --shutdown` es el reset más simple cuando WSL queda en un estado raro (red no funciona, distro colgada) — no borra nada, solo reinicia la VM.
- Cada distro tiene su propio gestor de paquetes del sistema según cuál sea (ver [bash y zsh y gestores por distro](/terminal/terminal/terminal-linux-cli)).
- VS Code tiene una extensión (Remote - WSL) que permite abrir y editar directo el filesystem de WSL desde el editor en Windows, sin pasar por `\\wsl$\` manualmente.
