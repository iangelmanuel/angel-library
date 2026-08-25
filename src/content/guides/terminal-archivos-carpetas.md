---
title: Gestión de archivos y carpetas
description: Crear, copiar, mover y borrar archivos y carpetas desde la terminal — con sus equivalentes en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 3
tags: [terminal, archivos, carpetas, cli]
scope: mkdir / cp / mv / rm
related: [guides/terminal-navegacion, guides/terminal-permisos]
updatedAt: 2026-08-17
---

Los comandos para crear, mover y borrar cosas son de los que más se escriben en una terminal — y también de los más peligrosos si se copia mal un flag entre sistemas.

## Crear carpetas

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Crear una carpeta | `New-Item -ItemType Directory nombre` (alias `mkdir`) | `mkdir nombre` |
| Crear carpetas anidadas directamente | `New-Item -ItemType Directory -Path a\b\c -Force` | `mkdir -p a/b/c` |

```powershell title="PowerShell"
mkdir proyectos
New-Item -ItemType Directory -Path src\components -Force
```

```bash title="macOS / Linux"
mkdir proyectos
mkdir -p src/components
```

## Crear un archivo vacío

macOS/Linux tienen `touch` dedicado a esto (y a actualizar la fecha de modificación). PowerShell no tiene un `touch` nativo — se usa `New-Item`.

```powershell title="PowerShell"
New-Item -ItemType File notas.md
```

```bash title="macOS / Linux"
touch notas.md
```

## Copiar

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Copiar un archivo | `Copy-Item origen.txt destino.txt` (alias `copy`) | `cp origen.txt destino.txt` |
| Copiar una carpeta completa | `Copy-Item carpeta destino -Recurse` | `cp -r carpeta destino` |

```powershell title="PowerShell"
Copy-Item config.json config.backup.json
Copy-Item src dist -Recurse
```

```bash title="macOS / Linux"
cp config.json config.backup.json
cp -r src dist
```

## Mover y renombrar

En ambos mundos, "mover" y "renombrar" son la misma operación — mover un archivo a un nombre distinto en el mismo directorio equivale a renombrarlo.

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Mover / renombrar | `Move-Item origen destino` (alias `move`, `ren`) | `mv origen destino` |

```powershell title="PowerShell"
Move-Item viejo-nombre.md nuevo-nombre.md   # renombrar
Move-Item archivo.txt ..\otra-carpeta\      # mover
```

```bash title="macOS / Linux"
mv viejo-nombre.md nuevo-nombre.md
mv archivo.txt ../otra-carpeta/
```

## Eliminar

| Acción | Windows (PowerShell) | macOS / Linux |
| --- | --- | --- |
| Eliminar un archivo | `Remove-Item archivo.txt` (alias `del`, `rm`) | `rm archivo.txt` |
| Eliminar una carpeta con contenido | `Remove-Item carpeta -Recurse` | `rm -r carpeta` |
| Eliminar sin confirmación (forzado) | `Remove-Item carpeta -Recurse -Force` | `rm -rf carpeta` |

```powershell title="PowerShell"
Remove-Item notas-viejas.md
Remove-Item carpeta-temporal -Recurse -Force
```

```bash title="macOS / Linux"
rm notas-viejas.md
rm -rf carpeta-temporal
```

> **Advertencia:** `rm -rf` (o `Remove-Item -Recurse -Force`) borra sin pasar por la papelera y sin pedir confirmación. No hay deshacer. Antes de correrlo, confirmar dos veces la ruta — especialmente si hay una variable de por medio (`rm -rf $VAR/` con `$VAR` vacío borra desde la raíz).

## Consideraciones

- `Remove-Item` en PowerShell, sin `-Force`, sí pide confirmación al borrar una carpeta con contenido usando `-Recurse` en algunas versiones — no depender de eso como red de seguridad, el comportamiento varía entre versiones de PowerShell.
- `cp` y `mv` en macOS/Linux no piden confirmación por defecto al sobrescribir un archivo existente; para pedirla hay que usar `cp -i` / `mv -i`.
- `touch` en macOS/Linux, si el archivo ya existe, no lo vacía — solo actualiza su fecha de modificación. `New-Item -ItemType File` en PowerShell falla si el archivo ya existe, salvo que se agregue `-Force` (que sí lo trunca).
- En PowerShell, `del` y `rd` son alias de `Remove-Item`, no comandos separados como en `cmd.exe` clásico.
