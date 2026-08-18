---
title: "npm: el gestor de paquetes de Node"
description: Los comandos de npm del día a día — install, run, uninstall, update, npx, ci — y cuándo usar cada uno.
category: terminal
stack: terminal
order: 14
tags: [terminal, npm, node, gestor-de-paquetes]
scope: npm
related: [guides/terminal-pnpm, guides/terminal-nvm, guides/terminal-bun]
updatedAt: 2026-08-17
---

## `npm`: viene con Node

Al instalar Node.js, npm queda instalado junto — no hace falta un paso aparte. Esta guía cubre el comando `npm` en sí; para el archivo `package.json` que administra, ver la guía dedicada de `package.json`.

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `npm install` | Instala todas las dependencias listadas en `package.json` (alias: `npm i`) |
| `npm install <paquete>` | Agrega un paquete como dependencia normal |
| `npm install -D <paquete>` | Agrega un paquete como devDependency (solo necesario en desarrollo, no en producción) |
| `npm install -g <paquete>` | Instala un paquete de forma global, disponible como comando en cualquier carpeta |
| `npm uninstall <paquete>` | Quita un paquete |
| `npm update` | Actualiza dependencias a la última versión permitida por el rango del `package.json` |
| `npm run <script>` | Corre un script definido en `"scripts"` |
| `npx <paquete>` | Ejecuta un paquete sin instalarlo globalmente |
| `npm ci` | Instalación limpia y reproducible desde el lockfile |

## `-D` vs `-g`

```bash
npm install zod              # dependencia normal, se usa en runtime
npm install -D vitest        # devDependency, solo en desarrollo/testing
npm install -g typescript    # global, comando "tsc" disponible en cualquier carpeta
```

Una devDependency igual se instala en el `node_modules` del proyecto — la diferencia es semántica (para separar "esto lo necesito para desarrollar" de "esto lo necesita la app en producción") y afecta a `npm install --production`, que salta las devDependencies.

## `npx`: ejecutar sin instalar globalmente

```bash
npx create-astro@latest
```

Descarga (o usa, si ya está en caché) el paquete, lo ejecuta una vez, y no lo deja instalado de forma permanente. Útil para generadores de proyecto y herramientas que se corren una sola vez.

## `npm ci`: instalación reproducible

```bash
npm ci
```

A diferencia de `npm install`, `npm ci`:

- Requiere que exista `package-lock.json`.
- Instala **exactamente** las versiones del lockfile, sin recalcular nada.
- Borra `node_modules` antes de instalar, en vez de reconciliar.
- Falla si `package.json` y `package-lock.json` están desincronizados.

Por eso es el comando que se usa en integración continua (CI): instalaciones deterministas, más rápidas, sin sorpresas de versión.

## Consideraciones

- `npm update` respeta el rango de versión declarado (`^`, `~`) — no salta a una versión mayor que rompa el rango.
- Un paquete instalado con `-g` queda fuera del `package.json` del proyecto — otra persona que clone el repo no lo tiene automáticamente. Para herramientas de proyecto, mejor `-D` + `npx`/scripts que depender de instalaciones globales.
- Para un gestor más rápido y con `node_modules` estricto, ver [pnpm](/guides/terminal-pnpm).
