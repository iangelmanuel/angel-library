---
title: "curl: requests HTTP desde la terminal"
description: Los flags de curl que se usan todos los días — GET, POST con JSON, headers, guardar en archivo, seguir redirects.
category: terminal
stack: terminal
order: 17
tags: [terminal, curl, http, herramientas]
scope: curl
related: [guides/terminal-ssh]
updatedAt: 2026-08-17
---

## `curl`: viene preinstalado

`curl` viene preinstalado en macOS, en la gran mayoría de distros Linux, y en Windows 10/11 modernos (tanto PowerShell como `cmd` ya lo traen de fábrica) — no requiere instalación en ninguno de los tres.

## GET simple

```bash
curl https://api.ejemplo.com
```

Imprime el body de la respuesta en la terminal.

## Ver headers

| Flag | Qué hace |
|---|---|
| `-i` | Incluye los headers de respuesta junto con el body |
| `-I` | Solo headers (hace un `HEAD` en vez de `GET`, no trae body) |

```bash
curl -i https://api.ejemplo.com
curl -I https://api.ejemplo.com
```

## POST con JSON

```bash
curl -X POST https://api.ejemplo.com/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana"}'
```

| Flag | Qué hace |
|---|---|
| `-X POST` | Método HTTP (default es `GET`) |
| `-H "<header>"` | Agrega un header |
| `-d '<body>'` | Body del request (con `-X POST` implícito si no se especifica método) |

## Guardar la respuesta en un archivo

```bash
curl -o archivo.json https://api.ejemplo.com/datos
```

## Seguir redirects

```bash
curl -L https://ejemplo.com
```

Sin `-L`, curl no sigue un `3xx` automáticamente — devuelve la respuesta de redirect tal cual, sin ir al destino final.

## Header de autorización

```bash
curl https://api.ejemplo.com/privado \
  -H "Authorization: Bearer TOKEN"
```

## Comillas en PowerShell

En bash/zsh, las comillas simples `'...'` son literales y las dobles `"..."` interpolan variables — el ejemplo de POST con `-d '{"nombre":"Ana"}'` funciona tal cual.

En **PowerShell**, las comillas simples también son literales, pero el JSON con comillas dobles anidadas dentro de comillas simples puede dar problemas según la versión y el `curl` que se esté invocando (el `curl` real vs el alias de PowerShell hacia `Invoke-WebRequest`, ver más abajo). Si `-d '{"nombre":"Ana"}'` falla, escapar las comillas internas suele resolverlo:

```powershell
curl -X POST https://api.ejemplo.com/usuarios `
  -H "Content-Type: application/json" `
  -d '{\"nombre\":\"Ana\"}'
```

## Consideraciones

- En PowerShell, `curl` es por default un **alias** de `Invoke-WebRequest`, que no acepta exactamente los mismos flags que el curl real. Para forzar el curl real (el que viene con Windows), usar `curl.exe` en vez de `curl`.
- `-L` es fácil de olvidar y genera confusión cuando una API "no responde nada" — en realidad respondió un redirect que curl no siguió.
