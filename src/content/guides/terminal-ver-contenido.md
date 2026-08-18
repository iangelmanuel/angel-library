---
title: Ver y buscar contenido de archivos
description: cat, head/tail, grep y find — leer, paginar y buscar dentro de archivos desde la terminal en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 3
tags: [terminal, busqueda, archivos, cli]
scope: cat / grep / find
related: [guides/terminal-navegacion, guides/terminal-archivos-carpetas]
updatedAt: 2026-08-17
---

Leer un archivo sin abrir un editor, o buscar en qué archivo está una función, son de las tareas más frecuentes en una terminal. Acá es donde más se nota la diferencia entre el mundo Unix (con `grep`, `head`, `tail` como herramientas separadas y componibles) y PowerShell (que resuelve casi todo con parámetros de `Get-Content`).

## Mostrar contenido completo

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Mostrar un archivo | `Get-Content archivo.txt` (alias `cat`, `type`) | `cat archivo.txt` |

```powershell title="PowerShell"
Get-Content package.json
```

```bash title="macOS / Linux"
cat package.json
```

## Paginar un archivo largo

macOS/Linux tienen `less` (navegable, con búsqueda) y `more` (más simple, solo avanza). PowerShell no tiene un paginador nativo equivalente — la forma habitual es tubear a `more`, que sí existe en Windows.

```powershell title="PowerShell"
Get-Content archivo-largo.log | more
```

```bash title="macOS / Linux"
less archivo-largo.log
# o, más simple:
more archivo-largo.log
```

## Primeras y últimas líneas

Windows no tiene `head`/`tail` como comandos nativos separados — el equivalente son los parámetros `-Head` y `-Tail` de `Get-Content`.

```powershell title="PowerShell"
Get-Content archivo.log -Head 20     # primeras 20 líneas
Get-Content archivo.log -Tail 20     # últimas 20 líneas
Get-Content archivo.log -Wait -Tail 10   # seguir el archivo en vivo (como tail -f)
```

```bash title="macOS / Linux"
head -n 20 archivo.log
tail -n 20 archivo.log
tail -f archivo.log       # seguir el archivo en vivo
```

## Buscar texto dentro de archivos

`grep` es el estándar en macOS/Linux. En PowerShell el equivalente nativo es `Select-String`; en `cmd.exe` clásico existe `findstr`, más limitado pero disponible sin PowerShell.

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Buscar texto en un archivo | `Select-String "texto" archivo.txt` | `grep "texto" archivo.txt` |
| Buscar recursivo en una carpeta | `Select-String "texto" -Path * -Recurse` | `grep -r "texto" .` |
| Buscar ignorando mayúsculas | `Select-String "texto" archivo.txt -CaseSensitive:$false` (por defecto ya ignora) | `grep -i "texto" archivo.txt` |

```powershell title="PowerShell"
Select-String "TODO" -Path *.ts -Recurse
```

```bash title="macOS / Linux"
grep -rn "TODO" --include="*.ts" .
```

> En `cmd.exe` (sin PowerShell), el equivalente básico es `findstr /s /i "texto" *.txt`.

## Buscar archivos por nombre

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Buscar por nombre, recursivo | `Get-ChildItem -Recurse -Filter "*.md"` | `find . -name "*.md"` |
| Buscar ejecutable en el PATH | `Get-Command nombre` o `where.exe nombre` | `which nombre` |

```powershell title="PowerShell"
Get-ChildItem -Path . -Recurse -Filter "*.config.js"
where.exe node
```

```bash title="macOS / Linux"
find . -name "*.config.js"
which node
```

## Consideraciones

- `Get-Content` carga el archivo completo en memoria por defecto (salvo que uses `-Head`/`-Tail`/`-Wait`), lo que puede ser lento con archivos muy grandes — `cat` en macOS/Linux tiene el mismo problema si no se combina con `head`/`tail`.
- `Select-String` devuelve objetos (con `.Line`, `.LineNumber`, `.Path`), no texto plano — se puede filtrar y formatear con el pipeline de PowerShell en vez de con `awk`/`sed` como en Unix.
- `findstr` (el de `cmd.exe`) no soporta regex extendida como `grep -E`; para eso conviene usar `Select-String` en PowerShell, que sí soporta regex de .NET.
- `find` en macOS/Linux busca por defecto también carpetas, no solo archivos — para limitar a archivos hay que agregar `-type f`.
