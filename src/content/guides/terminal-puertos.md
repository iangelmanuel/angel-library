---
title: "Liberar un puerto ocupado"
description: Encontrar qué proceso está usando un puerto (típicamente un dev server que quedó colgado) y cerrarlo, en Windows, macOS y Linux.
category: terminal
stack: terminal
order: 9
tags: [terminal, puertos, red, procesos]
scope: puertos
related: [guides/terminal-procesos, guides/terminal-red-basica]
updatedAt: 2026-08-17
---

## El caso típico

Se inicia un servidor de desarrollo —por ejemplo, `npm run dev` en el puerto 3000— y falla con `EADDRINUSE` o “address already in use”: el puerto ya está ocupado por otro proceso, casi siempre una instancia anterior que no se cerró bien. El flujo es siempre el mismo: **encontrar el PID que usa el puerto y terminar ese proceso**.

## macOS / Linux

```bash
lsof -i :3000
```

```
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345  angel   23u  IPv4 ...      0t0  TCP *:3000 (LISTEN)
```

La columna `PID` (aquí `12345`) es lo que importa. Con eso:

```bash
kill -9 12345
```

En Linux, si `lsof` no está instalado, la alternativa es `netstat`:

```bash
netstat -tulpn | grep 3000
```

`-t` (TCP), `-u` (UDP), `-l` (solo sockets en escucha), `-p` (mostrar el proceso dueño), `-n` (puertos numéricos, no resueltos por nombre). La última columna (`PID/nombre`) trae el PID.

## Windows (PowerShell)

```powershell
netstat -ano | findstr :3000
```

```
  TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
```

La última columna es el PID. Con eso:

```powershell
Stop-Process -Id 12345 -Force
taskkill /PID 12345 /F
```

Cualquiera de los dos sirve — `Stop-Process` es nativo de PowerShell, `taskkill` funciona igual en `cmd.exe`.

Alternativa más "PowerShell-nativa", sin pasar por texto:

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

`Get-NetTCPConnection -LocalPort 3000` devuelve el objeto de la conexión; `.OwningProcess` es el PID directo, sin parsear texto a mano.

## Resumen del flujo completo (ejemplo: puerto 3000)

| Paso | Windows (PowerShell) | macOS / Linux |
|---|---|---|
| 1. Ver qué usa el puerto | `netstat -ano \| findstr :3000` | `lsof -i :3000` |
| 2. Anotar el PID | última columna | columna `PID` |
| 3. Matar el proceso | `Stop-Process -Id <pid> -Force` | `kill -9 <pid>` |

## Consideraciones

- `EADDRINUSE` casi siempre significa "quedó un proceso anterior colgado", no que el puerto esté reservado por el sistema — el 99% de las veces alcanza con matar ese PID.
- Si `netstat -ano | findstr :3000` no devuelve nada en Windows pero el error persiste, probar sin el filtro (`netstat -ano | findstr LISTENING`) — a veces el proceso escucha en una dirección distinta (`[::]:3000` en vez de `0.0.0.0:3000`) y el `findstr` literal no matchea.
- Antes de forzar (`-9` / `-Force`), vale la pena confirmar qué proceso es (`ps aux | grep <pid>` o revisar el nombre en `netstat`/`Get-Process`) para no matar algo que no era el dev server.
