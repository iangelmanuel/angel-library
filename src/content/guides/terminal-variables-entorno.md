---
title: "Variables de entorno en la terminal"
description: Definir, ver y persistir variables de entorno — y la diferencia entre variable de sesión y variable permanente — en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 10
tags: [terminal, variables de entorno, path]
scope: variables de entorno
related: [guides/terminal-historial-atajos]
updatedAt: 2026-08-17
---

## Definir una variable para la sesión actual

| Acción | Windows (PowerShell) | macOS / Linux (bash/zsh) |
|---|---|---|
| Definir | `$env:VAR = "valor"` | `export VAR=valor` |
| Ver una variable | `echo $env:VAR` | `echo $VAR` |

`cmd.exe` usa su propia sintaxis, distinta de PowerShell: `set VAR=valor` para definir, `echo %VAR%` para verla.

```powershell
$env:NODE_ENV = "development"
echo $env:NODE_ENV
```

```bash
export NODE_ENV=development
echo $NODE_ENV
```

Estas dos formas solo valen para **la sesión actual de la terminal** — la variable desaparece al cerrar esa ventana o pestaña.

## Sesión vs. persistente

Una variable de sesión (`export`/`$env:`) vive mientras esa terminal esté abierta. Para que sobreviva a cerrar la terminal (o el reinicio de la máquina), hay que persistirla:

### macOS / Linux

Agregar la línea a `.bashrc` (bash) o `.zshrc` (zsh), en el home del usuario:

```bash
echo 'export NODE_ENV=development' >> ~/.zshrc
source ~/.zshrc
```

`source` recarga el archivo en la sesión actual sin necesidad de abrir una terminal nueva. Las terminales nuevas ya la leen solas al arrancar.

### Windows

Desde PowerShell, sin tocar archivos de configuración:

```powershell
[Environment]::SetEnvironmentVariable("NODE_ENV", "development", "User")
```

El tercer argumento (`"User"`) la guarda a nivel de usuario (persiste entre sesiones y reinicios, no requiere admin). Usar `"Machine"` en su lugar la define a nivel de todo el sistema (requiere PowerShell como administrador).

También se puede hacer desde la UI: **Panel de control → Sistema → Configuración avanzada del sistema → Variables de entorno**, o buscando directamente "Editar las variables de entorno del sistema" en el menú de inicio.

Una variable definida así no aparece en una terminal ya abierta — hay que abrir una nueva (o reiniciar la que esté corriendo) para que la tome.

## Ver el `PATH` completo

| Windows (PowerShell) | macOS / Linux |
|---|---|
| `$env:Path` | `echo $PATH` |
| `$env:Path -split ';'` (una entrada por línea) | `echo $PATH \| tr ':' '\n'` (una entrada por línea) |

En Windows el `PATH` usa `;` como separador entre entradas; en macOS/Linux usa `:`.

## Consideraciones

- Una variable definida con `export` o `$env:` y nunca persistida es una causa común de “funciona en mi terminal, pero no en otra”. Si algo depende de esa variable, conviene documentar cómo configurarla o persistirla, en vez de dejarla únicamente en la sesión activa.
- En Windows, `[Environment]::SetEnvironmentVariable` con alcance `"User"` no requiere permisos de administrador; con `"Machine"` sí.
- `.env` files (leídos por herramientas como `dotenv`) son un mecanismo aparte, a nivel de proyecto, no de terminal — no los carga la shell automáticamente salvo que algo los procese explícitamente.
