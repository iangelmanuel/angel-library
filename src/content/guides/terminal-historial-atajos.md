---
title: "Historial y atajos de productividad"
description: Ver y buscar el historial de comandos, atajos universales de la terminal, y cómo crear un alias, en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 10
tags: [terminal, historial, atajos, alias]
scope: historial y atajos
related: [guides/terminal-variables-entorno, guides/terminal-procesos]
updatedAt: 2026-08-17
---

## Ver el historial de comandos

| Acción | Windows (PowerShell) | macOS / Linux (bash/zsh) |
|---|---|---|
| Ver historial completo | `Get-History` | `history` |
| Repetir comando anterior | flecha arriba (↑) | flecha arriba (↑) |

```powershell
Get-History
```

```bash
history
```

## Buscar en el historial

```
Ctrl+R
```

Funciona igual en bash/zsh y en PowerShell: abre una búsqueda incremental hacia atrás en el historial — escribir parte de un comando anterior y `Ctrl+R` lo va encontrando. Presionar `Ctrl+R` de nuevo pasa al siguiente match más antiguo.

## Atajos universales

| Atajo | Qué hace |
|---|---|
| `Ctrl+C` | Cancela el comando/proceso en ejecución |
| `Ctrl+L` | Limpia la pantalla (equivalente a `clear`/`cls`, pero sin escribirlo) |
| `Tab` | Autocompletado de comandos, rutas y (en muchas shells) flags |
| `Ctrl+R` | Búsqueda incremental en el historial |

Para limpiar la pantalla también existe el comando explícito, que difiere por sistema:

| Windows (PowerShell / cmd) | macOS / Linux |
|---|---|
| `cls` | `clear` |

`Ctrl+L` es más rápido porque no depende de escribir y confirmar un comando — funciona en las tres shells.

## Crear un alias

### macOS / Linux (bash/zsh)

```bash
alias ll='ls -la'
```

Escrito así en la terminal, el alias solo dura la sesión actual. Para que persista, agregarlo a `~/.bashrc` (bash) o `~/.zshrc` (zsh):

```bash
echo "alias ll='ls -la'" >> ~/.zshrc
source ~/.zshrc
```

### Windows (PowerShell)

PowerShell tiene `Set-Alias`, pero solo mapea un nombre a un comando existente — no acepta argumentos como `ls -la`. Para eso hace falta una función:

```powershell
function ll { Get-ChildItem -Force }
```

Para que persista entre sesiones, agregarla al perfil de PowerShell (`$PROFILE`):

```powershell
notepad $PROFILE
```

Si el archivo no existe todavía, crearlo primero:

```powershell
if (-not (Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }
```

Con la función guardada en `$PROFILE`, cada terminal nueva de PowerShell la carga automáticamente.

## Consideraciones

- Un alias/función definido a mano en la terminal se pierde al cerrarla — igual que las variables de entorno de sesión (ver [Variables de entorno](/guides/terminal-variables-entorno)), hay que persistirlo en el archivo de configuración de la shell para que sobreviva.
- `Set-Alias` de PowerShell es más limitado que `alias` de bash: no soporta pasar flags fijos (`alias ll='ls -la'` no tiene equivalente directo con `Set-Alias`), por eso una función es casi siempre la opción correcta ahí.
- `$PROFILE` en PowerShell no existe por default — hay que crearlo la primera vez con `New-Item`, si no `notepad $PROFILE` abre un archivo nuevo vacío que después no se guarda en el lugar esperado si la carpeta tampoco existe.
