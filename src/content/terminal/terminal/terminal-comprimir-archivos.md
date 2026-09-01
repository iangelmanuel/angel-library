---
title: Comprimir y descomprimir archivos
description: zip, tar y Compress-Archive — crear y extraer archivos comprimidos desde la terminal en Windows, macOS y Linux.
type: guides
order: 6
tags: [terminal, compresion, zip, tar, cli]
scope: zip / tar / Compress-Archive
related:
  [
    terminal/terminal/terminal-navegacion,
    terminal/terminal/terminal-archivos-carpetas
  ]
updatedAt: 2026-08-17
---

Comprimir archivos desde la terminal evita depender de un explorador de archivos gráfico, y es imprescindible para automatizar backups o preparar artefactos de deploy.

## Comprimir en `.zip`

PowerShell tiene un cmdlet nativo desde Windows 10/PowerShell 5.1, sin instalar nada. En macOS/Linux, `zip` es un paquete aparte en varias distros mínimas de Linux (en macOS viene preinstalado).

```powershell title="PowerShell"
Compress-Archive -Path carpeta -DestinationPath carpeta.zip
Compress-Archive -Path archivo1.txt, archivo2.txt -DestinationPath varios.zip
```

```bash title="macOS / Linux"
zip -r carpeta.zip carpeta
zip varios.zip archivo1.txt archivo2.txt
```

> En Linux, si `zip` no está instalado (`zip: command not found`), se instala aparte: `sudo apt install zip unzip` (Debian/Ubuntu), `sudo dnf install zip unzip` (Fedora), etc. En macOS viene de fábrica.

## Descomprimir un `.zip`

```powershell title="PowerShell"
Expand-Archive -Path carpeta.zip -DestinationPath destino
```

```bash title="macOS / Linux"
unzip carpeta.zip -d destino
```

## Comprimir en `.tar.gz`

`tar` es el formato más común para distribuir código fuente y backups en el mundo Unix — junta varios archivos en un solo `.tar` y opcionalmente lo comprime con gzip (`.tar.gz` / `.tgz`).

### Windows

`tar` viene incluido de forma nativa desde Windows 10 (build 17063+) y Windows 11 — es un `bsdtar` empaquetado, así que la sintaxis es la misma que en macOS/Linux.

```powershell title="PowerShell"
tar -czvf carpeta.tar.gz carpeta
tar -xzvf carpeta.tar.gz
```

### macOS / Linux

```bash title="macOS / Linux"
tar -czvf carpeta.tar.gz carpeta      # crear
tar -xzvf carpeta.tar.gz              # extraer
tar -xzvf carpeta.tar.gz -C destino/  # extraer en una carpeta específica
```

Flags usados: `-c` crear, `-x` extraer, `-z` comprimir/descomprimir con gzip, `-v` modo verboso (lista archivos), `-f` indica que el siguiente argumento es el nombre del archivo.

## Resumen

| Formato                | Windows (PowerShell) | macOS / Linux |
| ---------------------- | -------------------- | ------------- |
| Comprimir a `.zip`     | `Compress-Archive`   | `zip -r`      |
| Descomprimir `.zip`    | `Expand-Archive`     | `unzip`       |
| Comprimir a `.tar.gz`  | `tar -czvf`          | `tar -czvf`   |
| Descomprimir `.tar.gz` | `tar -xzvf`          | `tar -xzvf`   |

## Consideraciones

- `Compress-Archive` solo genera `.zip` — no crea `.tar.gz` ni otros formatos. Para `.tar.gz` en Windows hay que usar el `tar` incluido.
- `tar` en Windows (el `bsdtar` nativo) no soporta todos los flags avanzados de GNU tar en Linux; para casos simples (crear/extraer con gzip) la sintaxis es intercambiable.
- Al descomprimir un `.zip` de origen desconocido, tanto `Expand-Archive` como `unzip` pueden sobrescribir archivos existentes sin avisar — conviene extraer primero en una carpeta vacía.
- `Compress-Archive` falla si el archivo de destino ya existe, salvo que se agregue `-Force`; `zip`, en cambio, actualiza el `.zip` existente por defecto.
