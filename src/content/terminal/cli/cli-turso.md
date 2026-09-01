---
title: "Turso CLI: base de datos SQLite distribuida"
description: Instalar el CLI de Turso, autenticarse y los comandos esenciales para crear bases de datos, entrar al shell y generar tokens de conexión.
type: guides
order: 8
tags: [cli, turso, base-de-datos, sqlite]
scope: turso
related: [terminal/cli/cli-neon]
updatedAt: 2026-08-17
---

`turso` es el CLI oficial de [Turso](https://turso.tech), una base de datos SQLite distribuida (libSQL) pensada para vivir en el edge. Desde la terminal se crean bases de datos, se administran tokens de acceso y se entra a un shell SQL interactivo — sin salir de la consola.

## Instalación

```bash
# macOS (Homebrew)
brew install tursodatabase/tap/turso

# Linux — script de instalación oficial
curl -sSfL https://get.tur.so/install.sh | bash

# Windows — no hay build nativo: se usa vía WSL con el mismo script
curl -sSfL https://get.tur.so/install.sh | bash
```

Turso no publica un binario nativo para Windows — en Windows corre dentro de WSL, usando el mismo instalador que Linux.

## Autenticarse

```bash
turso auth login
```

Abre el navegador para autenticar contra la cuenta de Turso (vía GitHub). El token de sesión que guarda localmente expira a los 7 días, así que hay que volver a loguearse pasado ese tiempo.

En entornos sin navegador (WSL headless, contenedores, CI) existe el modo headless:

```bash
turso auth login --headless
```

## Comandos esenciales

| Comando | Qué hace |
|---|---|
| `turso db create <nombre>` | Crea una base de datos nueva (sin nombre, genera uno) |
| `turso db list` | Lista las bases de datos de la cuenta u organización actual |
| `turso db shell <nombre>` | Abre un shell SQL interactivo contra la base indicada |
| `turso db show <nombre>` | Muestra nombre, ID, versión, grupo, tamaño y ubicación |
| `turso db show <nombre> --url` | Muestra la URL de conexión (`libsql://...`) |
| `turso db tokens create <nombre>` | Genera un token de acceso para conectarse a esa base |
| `turso db destroy <nombre>` | Elimina la base de datos |

## Flujo típico: crear una base y conectarse desde la app

```bash
turso db create mi-app-db

turso db show mi-app-db --url
# libsql://mi-app-db-usuario.turso.io

turso db tokens create mi-app-db --expiration 7d
# eyJhbGciOiJFZERTQSIs...
```

Con esos dos valores (`TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`) cualquier cliente libSQL (`@libsql/client` en Node, por ejemplo) puede conectarse a la base sin pasar por el CLI.

`tokens create` acepta flags útiles: `--read-only` para un token de solo lectura, y `-e/--expiration` para controlar cuánto dura (`never`, o un valor como `7d`).

## Consideraciones

- El token que genera `turso auth login` es de **sesión del CLI** y expira a los 7 días — no confundirlo con los tokens que genera `turso db tokens create`, que son para que la *aplicación* se conecte a una base puntual y pueden no expirar nunca (`--expiration never`).
- Al no haber build nativo de Windows, cualquier flujo en Windows pasa por WSL — vale la pena instalar Turso ahí desde el arranque si el resto del proyecto ya vive en WSL.
- `turso db shell <nombre>` sirve tanto para exploración interactiva como para correr una query puntual: `turso db shell <nombre> "select * from users limit 5"`.
