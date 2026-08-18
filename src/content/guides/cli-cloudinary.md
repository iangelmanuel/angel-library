---
title: "Cloudinary CLI: subir y transformar assets"
description: Instalar cloudinary-cli, configurar las credenciales por variable de entorno y los comandos para subir archivos, buscar recursos y generar URLs con transformaciones.
category: terminal
stack: cli
order: 12
tags: [cli, cloudinary, imagenes, video]
scope: cld
updatedAt: 2026-08-17
---

`cloudinary-cli` es el CLI oficial de [Cloudinary](https://cloudinary.com) (gestión de imágenes y video en la nube). Se invoca como `cld` y cubre lo básico del día a día — subir assets, buscarlos y generar URLs con transformaciones — sin entrar a la consola web.

## Instalación

Igual en Windows, macOS y Linux — vía pip:

```bash
pip install cloudinary-cli
```

Para entornos aislados también hay `pipx install cloudinary-cli` o `uv tool install cloudinary-cli`.

## Configurar credenciales

El patrón típico de Cloudinary es una única variable de entorno con todo el string de conexión, `CLOUDINARY_URL`:

```bash
# macOS / Linux
export CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Windows (cmd)
set CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Windows (PowerShell)
$env:CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>"
```

Las credenciales están en **Settings → API Keys** del [Cloudinary Console](https://console.cloudinary.com/app/settings/api-keys). También existe `cld login`, que autentica vía navegador (OAuth) sin tener que manejar el string a mano.

Confirmar que quedó bien configurado:

```bash
cld config
```

## Comandos esenciales

| Comando | Qué hace |
|---|---|
| `cld uploader upload <archivo>` | Sube un archivo (imagen, video, etc.) a Cloudinary |
| `cld upload_dir <carpeta>` | Sube una carpeta completa, manteniendo su estructura |
| `cld search "<expresión>"` | Busca recursos con sintaxis tipo Lucene |
| `cld url <public_id>` | Genera la URL de un recurso, con transformaciones opcionales |
| `cld admin` | Operaciones de la Admin API (listar, borrar recursos, etc.) |

```bash
cld uploader upload ./foto.jpg
cld url foto --transformation w_400,h_400,c_fill
```

## Consideraciones

- El CLI cubre bien las operaciones de subida, búsqueda y generación de URLs, pero para transformaciones complejas o configuración fina conviene revisar la [documentación de transformaciones](https://cloudinary.com/documentation/transformation_reference) — `cld url` acepta la misma sintaxis de parámetros que la API.
- `CLOUDINARY_URL` queda en el entorno de la shell — para no dejarlo pisado en el historial, conviene setearlo desde un `.env` cargado por la propia terminal en vez de escribirlo a mano en cada sesión.
- `cld login` es la alternativa más cómoda a copiar el string de conexión a mano, especialmente si se maneja más de una cuenta.
