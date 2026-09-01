---
title: package.json
description: dependencies vs devDependencies, scripts, main/exports y versionado semver — los campos que se tocan todo el tiempo.
type: guides
order: 2
tags: [node, npm, package.json]
scope: package.json
updatedAt: 2026-08-16
---

`package.json` es el manifiesto de un proyecto Node — qué dependencias necesita, cómo se corre, y cómo otros paquetes deben importarlo si este paquete se publica.

## Dependencias: tres tipos

```json title="package.json"
{
  "dependencies": {
    "express": "^4.19.0"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "typescript": "^5.5.0"
  },
  "peerDependencies": {
    "react": ">=18"
  }
}
```

- **`dependencies`**: lo que el código necesita para *correr* en producción (Express, un ORM, una librería de utilidades).
- **`devDependencies`**: lo que solo hace falta durante *desarrollo* (test runner, linter, tipos de TypeScript) — `npm install --production` (o el equivalente en CI) no las instala.
- **`peerDependencies`**: para paquetes que tú **publicas** — declara qué versión de otra librería espera tu paquete que el proyecto consumidor ya tenga (típico en librerías de componentes React, que esperan que React ya esté instalado y no lo incluyen como dependencia propia).

## Versionado semver y los prefijos

```text
^4.19.0   →  acepta 4.x.x, cualquier x ≥ 19.0 (no salta a 5.0.0)
~4.19.0   →  acepta 4.19.x nada más (más estricto)
4.19.0    →  exacto, sin actualizarse solo nunca
*         →  cualquier versión (evitar, casi siempre)
```

`^` es el default de `npm install <paquete>` y el más común — deja recibir parches y funcionalidad nueva compatible (minor/patch), pero no un breaking change (major).

## Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "test": "vitest run",
    "lint": "eslint ."
  }
}
```

```bash
npm run dev
npm test         # "test" y "start" son los únicos dos que no necesitan "run"
```

Un script puede llamar a otro con `npm run`:

```json
{
  "scripts": {
    "prebuild": "npm run lint",
    "build": "astro build"
  }
}
```

npm corre automáticamente cualquier script `pre<nombre>` antes del script `<nombre>` correspondiente — no hace falta encadenarlo a mano.

## `main`, `exports` y `type`

```json
{
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

- **`main`**: el archivo de entrada cuando alguien hace `import algo from 'tu-paquete'` (relevante solo si publicas el paquete en npm).
- **`exports`**: versión más moderna y más estricta que `main` — declara explícitamente qué subrutas del paquete son públicas (`tu-paquete/utils`); cualquier archivo interno no listado ahí queda inaccesible desde afuera, a diferencia de lo que pasaba antes con `main` solo.
- **`type`**: `"module"` hace que Node trate los `.js` del proyecto como ES Modules por defecto (`import`/`export`) en vez de CommonJS — ver [CommonJS vs ES Modules](/backend/node/node-commonjs-vs-esm).

## `engines`

```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

Documenta (no fuerza, salvo que algo como Corepack lo chequee) qué versión de Node espera el proyecto — útil para que alguien que clona el repo sepa qué runtime necesita antes de que algo falle de forma confusa.

## Campos de consulta

| Campo | Para qué |
| --- | --- |
| `dependencies` | Lo que el código necesita en producción |
| `devDependencies` | Solo para desarrollo (tests, build tools) |
| `scripts` | Comandos (`npm run <nombre>`) |
| `main` / `exports` | Qué archivo(s) expone el paquete al importarlo |
| `type: "module"` | CommonJS vs ES Modules por defecto |
| `engines.node` | Versión de Node esperada (documental) |

## Lockfile y consistencia

- El `package-lock.json` (o `pnpm-lock.yaml`) fija las versiones **exactas** instaladas, incluyendo subdependencias — siempre se versiona junto al `package.json`, nunca se ignora en `.gitignore`.
- Cambiar `dependencies` a mano en el archivo sin correr `npm install` después deja el `package.json` y el lockfile desincronizados — mejor usar `npm install <paquete>` que edite ambos.
