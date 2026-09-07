---
title: "Liberar un puerto ocupado"
description: Encontrar qué proceso está usando un puerto (típicamente un dev server que quedó colgado) y cerrarlo, en Windows, macOS y Linux.
type: guides
order: 9
tags: [terminal, puertos, red, procesos]
scope: puertos
related:
  [terminal/terminal/terminal-procesos, terminal/terminal/terminal-red-basica]
updatedAt: 2026-09-07
---

## El caso típico

`EADDRINUSE` significa que la dirección y el puerto solicitados ya están en uso. Identifica el proceso antes de cerrarlo: puede ser otro servicio válido. Si es tu servidor y conservas su terminal, usa `Ctrl+C`; también puedes elegir otro puerto para la nueva instancia.

## macOS / Linux

```bash
lsof -nP -iTCP:3000 -sTCP:LISTEN
```

```
COMMAND   PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
node    12345  angel   23u  IPv4 ...      0t0  TCP *:3000 (LISTEN)
```

La columna `PID` (aquí `12345`) es lo que importa. Con eso:

```bash
kill -TERM 12345
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

La última columna es el PID. Confirma su identidad con `Get-Process -Id 12345`. Si corresponde al servidor que quieres detener y no puedes usar su terminal:

```powershell
Stop-Process -Id 12345
```

En Windows, `Stop-Process` termina el proceso; no garantiza un cierre con limpieza de recursos. No ejecutes el PID de ejemplo: reemplázalo por el que acabas de identificar.

Alternativa más "PowerShell-nativa", sin pasar por texto:

```powershell
$listeners = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
$listeners | Select-Object LocalAddress, LocalPort, OwningProcess
# Inspecciona el OwningProcess concreto antes de terminarlo.
```

`Get-NetTCPConnection -LocalPort 3000` devuelve el objeto de la conexión; `.OwningProcess` es el PID directo, sin parsear texto a mano.

## Resumen del flujo completo (ejemplo: puerto 3000)

| Paso                     | Windows (PowerShell)            | macOS / Linux   |
| ------------------------ | ------------------------------- | --------------- |
| 1. Ver qué usa el puerto | `netstat -ano \| findstr :3000` | `lsof -i :3000` |
| 2. Anotar el PID         | última columna                  | columna `PID`   |
| 3. Cerrar tras verificar | `Stop-Process -Id <pid>` | `kill -TERM <pid>` |

## Consideraciones

- Filtrar texto por `:3000` puede incluir conexiones que no son el listener buscado o puertos como 30001. Prefiere el filtro exacto por puerto y estado de PowerShell.
- Distingue `127.0.0.1` (solo este equipo), `0.0.0.0` (interfaces IPv4) y `::` (IPv6, con posible comportamiento dual). Para revisar documentación personal localmente, escucha en localhost.
- Antes de forzar (`-9` / `-Force`), vale la pena confirmar qué proceso es (`ps aux | grep <pid>` o revisar el nombre en `netstat`/`Get-Process`) para no matar algo que no era el dev server.

## Comprobación

Repite la consulta del listener. Si ya no aparece, inicia tu servidor y comprueba la URL que anuncia. Si reaparece con otro PID, puede haber un supervisor reiniciándolo: detén el servicio desde su herramienta de gestión. Reserva `kill -KILL` para un proceso identificado que no responde al cierre normal.
