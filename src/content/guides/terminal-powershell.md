---
title: "PowerShell como terminal día a día"
description: Perfil de usuario, política de ejecución, alias y la diferencia entre PowerShell 5.1 y 7+ para el uso interactivo diario.
category: terminal
stack: terminal
order: 18
tags: [terminal, powershell, windows]
scope: PowerShell
related: [guides/terminal-wsl, guides/terminal-linux-cli]
updatedAt: 2026-08-17
---

## PowerShell como terminal, no como lenguaje

Esta guía cubre el uso interactivo diario de PowerShell como shell — perfil, alias, política de ejecución — no la sintaxis del lenguaje de scripting en sí.

## El perfil de usuario (`$PROFILE`)

Un script que PowerShell corre automáticamente cada vez que abre una sesión — el lugar para definir alias y funciones que persistan entre sesiones.

```powershell
$PROFILE
```

Muestra la ruta (normalmente algo como `C:\Users\<usuario>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1` en PowerShell 7+, o `WindowsPowerShell` en vez de `PowerShell` en la 5.1).

Si no existe todavía:

```powershell
if (-not (Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}
```

Abrirlo para editar:

```powershell
notepad $PROFILE
```

Cualquier alias o función que se agregue ahí queda disponible en toda sesión nueva.

## Política de ejecución

Windows bloquea por default correr scripts `.ps1` descargados de internet — una medida de seguridad, no un bug.

```powershell
Get-ExecutionPolicy
```

Valores comunes: `Restricted` (bloquea todo), `RemoteSigned` (permite scripts locales, exige firma para los descargados), `Unrestricted`.

Para permitir scripts locales sin firmar (el ajuste típico directamente máquina de desarrollo):

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```

`-Scope CurrentUser` limita el cambio al usuario actual, sin tocar la política a nivel de máquina (que requeriría permisos de administrador).

## Crear un alias

```powershell
Set-Alias ll Get-ChildItem
```

Para que persista entre sesiones, esta línea tiene que vivir en `$PROFILE`, no solo tipeada en la sesión actual (que se pierde al cerrar la terminal).

## PowerShell 5.1 vs PowerShell 7+

| | PowerShell 5.1 | PowerShell 7+ |
|---|---|---|
| Viene con Windows | Sí, preinstalado | No, se instala aparte |
| Plataformas | Solo Windows | Windows, macOS, Linux |
| Ejecutable | `powershell` | `pwsh` |
| Desarrollo activo | Congelado (solo parches de seguridad) | Sí, versión activa |

Instalar PowerShell 7+ en Windows:

```powershell
winget install --id Microsoft.PowerShell --source winget
```

Con ambas instaladas, `powershell` sigue abriendo la 5.1 y `pwsh` abre la 7+ — coexisten sin conflicto.

## Consideraciones

- Un script `.ps1` que "no corre" sin ningún mensaje de error visible suele ser la política de ejecución bloqueándolo — `Get-ExecutionPolicy` es el primer chequeo.
- Para trabajo multiplataforma (el mismo perfil o scripts corriendo en Windows, macOS y Linux), PowerShell 7+ es la opción — la 5.1 no sale de Windows.
- El perfil (`$PROFILE`) es exclusivo de PowerShell — no tiene relación con `.bashrc`/`.zshrc` de shells tipo Linux, ver [bash y zsh](/guides/terminal-linux-cli).
