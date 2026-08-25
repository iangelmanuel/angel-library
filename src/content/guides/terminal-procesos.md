---
title: "Ver y matar procesos"
description: Listar procesos corriendo y matarlos por PID o por nombre, en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 8
tags: [terminal, procesos, kill]
scope: procesos
related: [guides/terminal-puertos, guides/terminal-historial-atajos]
updatedAt: 2026-08-17
---

## Listar procesos corriendo

| Acción | Windows (PowerShell) | macOS / Linux |
|---|---|---|
| Listar todos los procesos | `Get-Process` | `ps aux` |
| Filtrar por nombre | `Get-Process node` | `ps aux \| grep node` |

`cmd.exe` (no PowerShell) tiene su propio equivalente: `tasklist`, y `tasklist \| findstr node` para filtrar.

```powershell
Get-Process node
```

```bash
ps aux | grep node
```

`ps aux` muestra usuario, PID, uso de CPU/memoria y el comando completo de cada proceso — el PID es la columna que importa para lo que sigue.

## Matar un proceso por PID

### Windows (PowerShell)

```powershell
Stop-Process -Id 1234
Stop-Process -Id 1234 -Force
```

Sin `-Force`, PowerShell le pide al proceso que cierre de forma ordenada (si el proceso lo soporta). Con `-Force` lo termina sí o sí, equivalente a un `kill -9`.

`cmd.exe` usa `taskkill /PID 1234 /F` (el `/F` es obligatorio para forzar; sin él, `taskkill` sin más suele fallar si el proceso no coopera).

### macOS / Linux

```bash
kill 1234
kill -9 1234
```

`kill 1234` manda `SIGTERM` — un pedido de cierre ordenado que el proceso puede interceptar y manejar. `kill -9` manda `SIGKILL`, que el sistema operativo ejecuta directo sin darle chance al proceso de reaccionar. Usar `-9` como último recurso, cuando el proceso no responde a un `kill` normal.

## Matar un proceso por nombre

| Acción | Windows (PowerShell) | macOS / Linux |
|---|---|---|
| Matar todos los procesos con ese nombre | `Stop-Process -Name node -Force` | `pkill node` |
| Forzar | (ya incluido arriba con `-Force`) | `pkill -9 node` |

```bash
pkill node
```

`pkill` mata **todos** los procesos que matcheen el nombre — si tienes tres instancias de `node` corriendo, las tres mueren. Cuando se necesita matar una sola, conviene ir por PID.

## Consideraciones

- `kill` (sin `-9`) le da al proceso la chance de limpiar recursos (cerrar archivos, conexiones de base de datos) antes de morir. `-9`/`-Force` lo corta en seco — último recurso, no el default.
- `pkill`/`Stop-Process -Name` matchean por substring o patrón según el sistema — un nombre muy genérico puede matar más procesos de los que se esperaba. Conviene verificar con `ps aux | grep <nombre>` o `Get-Process <nombre>` antes de tirar el kill.
- En Windows, algunos procesos de servidores de desarrollo (Node, Vite, etc.) pueden quedar activos tras una interrupción incompleta. `Stop-Process -Name node -Force` detiene todos los procesos de Node, así que úsalo solo después de confirmar que no necesitas conservar ninguno.
