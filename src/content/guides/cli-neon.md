---
title: "Neon CLI: Postgres serverless con branching"
description: Instalar neonctl, autenticarse y los comandos esenciales para crear proyectos, ramas de base de datos y obtener el connection string.
category: terminal
stack: cli
order: 9
tags: [cli, neon, postgres, base-de-datos]
scope: neon
related: [guides/cli-turso]
updatedAt: 2026-08-17
---

El CLI de [Neon](https://neon.com) (Postgres serverless) gestiona proyectos, bases de datos y ramas desde la terminal. El binario se invoca como `neon` — `neonctl` sigue funcionando como alias por compatibilidad con guías y scripts más viejos.

## Instalación

Igual en Windows, macOS y Linux — vía npm (requiere Node.js 20.19 o superior):

```bash
npm install -g neon@latest
```

También hay binarios standalone y Homebrew (`brew install neonctl`) para quien prefiera no depender de Node, y `npx neon <comando>` para usarlo sin instalación global.

## Autenticarse

```bash
neon auth
```

Abre el navegador y vincula el CLI con la cuenta de Neon. Como alternativa (necesaria si el proyecto está gestionado por la integración de Vercel, que no tiene cuenta propia en Neon), se puede autenticar con una API key:

```bash
export NEON_API_KEY=<api-key>
# o pasarla en cada comando:
neon projects list --api-key <api-key>
```

## Comandos esenciales

| Comando | Qué hace |
|---|---|
| `neon projects create` | Crea un proyecto nuevo (una instancia de Postgres) |
| `neon projects list` | Lista los proyectos de la cuenta |
| `neon branches create` | Crea una rama de la base de datos |
| `neon connection-string` | Devuelve el string de conexión a Postgres |

## Branching: la feature distintiva de Neon

Una **rama** en Neon es una copia aislada y editable de la base de datos — igual que una rama de Git, pero de datos. Se puede crear una rama por feature branch del repo, correr migraciones o pruebas destructivas ahí sin tocar producción, y borrarla cuando el PR se mergea. El storage es copy-on-write, así que crear una rama no duplica todos los datos.

```bash
neon branches create --name feature/checkout-nuevo
neon connection-string --branch feature/checkout-nuevo
```

## Consideraciones

- Todos los comandos soportan `--output json`, útil para scripting y CI (por ejemplo, crear una rama por PR y guardar el connection string como variable de entorno del pipeline).
- Si el proyecto llegó a Neon vía la integración de Vercel, la autenticación por navegador (`neon auth`) puede no aplicar — usar `NEON_API_KEY` directamente.
- `neonctl` sigue documentado en guías viejas y funciona igual que `neon` — son el mismo binario.
