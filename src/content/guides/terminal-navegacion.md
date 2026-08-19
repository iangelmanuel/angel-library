---
title: Navegación de directorios
description: cd, pwd, ls y rutas relativas vs absolutas — moverse por el sistema de archivos desde la terminal en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 1
tags: [terminal, navegacion, cli]
scope: cd / ls / pwd
related: [guides/terminal-archivos-carpetas, guides/terminal-ver-contenido]
updatedAt: 2026-08-17
---

Moverse por carpetas desde la terminal es lo primero que se usa, y donde más difieren los shells. PowerShell entiende varios alias de Unix (`ls`, `pwd`, `cat`) por compatibilidad, pero no son el comando nativo — vale la pena saber cuál es cuál.

## Ver el directorio actual

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Directorio actual | `Get-Location` (alias `pwd`) | `pwd` |

```powershell title="PowerShell"
Get-Location
# o el alias, que imita al comando Unix
pwd
```

## Cambiar de directorio: `cd`

`cd` existe igual en los tres, pero el manejo de rutas con espacios y las comillas cambian un poco.

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Entrar a una carpeta | `cd nombre-carpeta` | `cd nombre-carpeta` |
| Subir un nivel | `cd ..` | `cd ..` |
| Ir al home del usuario | `cd ~` | `cd ~` |
| Ir a la raíz del disco actual | `cd \` | `cd /` |
| Volver al directorio anterior | `cd -` | `cd -` |

```powershell title="PowerShell"
cd C:\Users\angel\Proyectos\angel-library
cd ..\otro-proyecto
```

```bash title="macOS / Linux"
cd /home/angel/proyectos/angel-library
cd ../otro-proyecto
```

## Listar contenido

Aquí sí existen comandos nativos distintos: `ls` en macOS y Linux es un binario real; en PowerShell es un alias de `Get-ChildItem`, y en `cmd.exe` clásico se usa `dir`.

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Listar contenido | `Get-ChildItem` (alias `ls` o `dir`) | `ls` |
| Listar con detalle (tamaño, fecha, permisos) | `Get-ChildItem \| Format-Table` o `ls -Force` | `ls -la` |
| Incluir ocultos | `Get-ChildItem -Force` | `ls -a` |

```powershell title="PowerShell"
Get-ChildItem
Get-ChildItem -Force          # incluye archivos ocultos
```

```bash title="macOS / Linux"
ls -la                        # detalle + ocultos
```

## Rutas relativas vs absolutas

- **Absoluta**: arranca desde la raíz del sistema. En Windows incluye la letra de unidad (`C:\Users\angel\proyecto`); en macOS/Linux arranca con `/` (`/home/angel/proyecto`).
- **Relativa**: se resuelve desde el directorio actual (`./src`, `../otro-proyecto`, `archivo.txt`).

## Wildcards

Los comodines `*` y `?` funcionan en ambos mundos, aunque quién los expande cambia: en macOS/Linux los expande el shell (bash/zsh) antes de pasarlos al comando; en PowerShell los interpreta el propio cmdlet.

```powershell title="PowerShell"
Get-ChildItem *.md            # todos los .md del directorio actual
Get-ChildItem archivo?.txt    # archivo1.txt, archivo2.txt, etc.
```

```bash title="macOS / Linux"
ls *.md
ls archivo?.txt
```

## Atajos de ruta

| Atajo | Significa |
| --- | --- |
| `~` | Directorio home del usuario |
| `.` | Directorio actual |
| `..` | Directorio padre |
| `-` | Directorio anterior (el de antes del último `cd`) |

## Consideraciones

- En PowerShell, `ls` y `dir` son alias de `Get-ChildItem`, no comandos nativos — si un script necesita portabilidad real entre shells, mejor usar el cmdlet completo.
- `cd` sin argumentos en PowerShell no hace nada (ni error ni home); en macOS/Linux, `cd` solo te manda al home del usuario. Para ir al home en PowerShell hay que usar `cd ~` explícitamente.
- Las rutas de Windows usan `\` como separador, pero PowerShell también acepta `/` en la mayoría de los cmdlets — no así en `cmd.exe`.
- `cd -` (volver al directorio anterior) no existe en PowerShell nativo; en bash/zsh sí, por defecto.
