---
title: "Diagnóstico de red básico"
description: "ping, ver la IP local y resolver DNS desde la terminal, en Windows, macOS y Linux."
type: guides
order: 11
tags: [terminal, red, dns, ping]
scope: red
related: [terminal/terminal/terminal-puertos]
updatedAt: 2026-08-17
---

## `ping`: comprobar si un host responde

```bash
ping google.com
```

El comando en sí es igual en los tres sistemas, pero el comportamiento por defecto difiere:

|                            | Windows                                   | macOS / Linux                                  |
| -------------------------- | ----------------------------------------- | ---------------------------------------------- |
| Comportamiento por defecto | Manda 4 paquetes y se detiene solo        | Manda paquetes sin parar hasta cortarlo a mano |
| Cómo cortarlo              | No hace falta (ya termina solo)           | `Ctrl+C`                                       |
| Cantidad fija de paquetes  | `ping -n 4 google.com` (ya es el default) | `ping -c 4 google.com`                         |

En Windows, olvidarse de esto no rompe nada (el comando termina solo). En macOS/Linux, lanzar `ping` sin `-c` y no saber que hay que cortarlo con `Ctrl+C` es el error de principiante clásico — se queda pingueando indefinidamente.

## Ver la IP local

| Sistema              | Comando    |
| -------------------- | ---------- |
| Windows (PowerShell) | `ipconfig` |
| macOS                | `ifconfig` |
| Linux (moderno)      | `ip addr`  |

```powershell
ipconfig
```

```bash
ifconfig      # macOS
ip addr       # Linux (comando moderno, reemplaza a ifconfig)
```

En Linux, `ifconfig` puede no estar instalado por default en distros recientes (viene del paquete `net-tools`, deprecado) — `ip addr` (o `ip a` abreviado) es el comando actual, parte de `iproute2`.

La IP a buscar en la salida suele estar bajo la interfaz activa (`Wi-Fi`/`en0`/`wlan0` según el sistema), como `IPv4 Address` (Windows) o `inet` (macOS/Linux).

## Resolución DNS

```bash
nslookup google.com
```

`nslookup` funciona igual en los tres sistemas, viene preinstalado en todos y alcanza para el 90% de los casos: confirmar a qué IP resuelve un dominio.

En macOS/Linux hay una alternativa más completa, `dig`, que da más detalle (TTL, tipo de registro, servidor que respondió):

```bash
dig google.com
```

`dig` no viene preinstalado en Windows por defecto — ahí `nslookup` es la opción directa sin instalar nada extra.

## Consideraciones

- El comportamiento predeterminado de `ping` cambia según el sistema: Windows termina solo, mientras que macOS y Linux continúan hasta recibir `Ctrl+C`. Es una diferencia importante al copiar comandos de una guía escrita para otro entorno.
- `ifconfig` está deprecado en Linux desde hace años; si no está disponible, `ip addr` es el reemplazo directo y viene preinstalado en la mayoría de las distros modernas.
- `nslookup` alcanza para verificar que un dominio resuelve; `dig` es la herramienta para diagnosticar problemas de DNS más a fondo (registros MX, TTL, propagación).
