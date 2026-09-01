---
title: Monorepo con npm — workspaces sin instalar nada extra
description: "Crear un monorepo con npm workspaces — el campo workspaces en package.json, --workspace para acotar comandos, y por qué el protocolo workspace: no es fiable en npm todavía."
type: guides
order: 3
tags: [monorepo, npm, workspaces]
scope: monorepo con npm workspaces
related:
  - general/monorepo/monorepo-que-es
  - general/monorepo/monorepo-pnpm
  - general/monorepo/monorepo-bun
  - general/monorepo/monorepo-ejemplo-frontend-backend
updatedAt: 2026-08-26
---

npm tiene workspaces integrados desde la versión 7 — no hace falta instalar nada aparte de npm mismo. Es la opción con menos fricción si el equipo ya usa npm y no hay una razón concreta para migrar a otro gestor.

## 1. Estructura del proyecto

```text
mi-monorepo/
├── apps/
│   └── web/
│       └── package.json
├── packages/
│   └── ui/
│       └── package.json
├── package.json
└── package-lock.json
```

## 2. El campo workspaces

A diferencia de pnpm (que usa un archivo `pnpm-workspace.yaml` aparte), npm declara los workspaces directamente en el `package.json` raíz:

```json title="package.json"
{
  "name": "mi-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

`"private": true` es igual de obligatorio que en pnpm: el paquete raíz no es un paquete publicable, es el contenedor del monorepo.

## 3. Crear un paquete y declarar una dependencia interna

```json title="packages/ui/package.json"
{
  "name": "@repo/ui",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts"
}
```

```json title="apps/web/package.json"
{
  "name": "web",
  "private": true,
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

```bash
npm install
```

## El aviso importante: el protocolo `workspace:` no es fiable en npm

Vas a ver documentación y ejemplos (incluida documentación oficial de npm) que sugieren `"@repo/ui": "workspace:*"`, calcando la sintaxis de pnpm. **No lo uses todavía**: en versiones actuales de npm (11.x) esa sintaxis lanza `EUNSUPPORTEDPROTOCOL` en la práctica, pese a estar mencionada en la documentación — es un desajuste real entre lo documentado y lo implementado, no un error de tipeo tuyo si te pasa.

La forma que sí funciona en npm es usar **el nombre del paquete con una versión normal, o `"*"`**:

```json
{
  "dependencies": {
    "@repo/ui": "*"
  }
}
```

npm resuelve esto revisando primero si algún workspace declarado tiene ese `name` — si lo encuentra, symlinkea el paquete local en vez de ir al registro, sin necesitar un protocolo especial. `"*"` es la opción más simple; una versión concreta (`"1.0.0"`) también funciona si quieres que la instalación falle cuando la versión local no coincide con lo esperado.

## 4. Instalar dependencias

```bash
# Agregar una dependencia externa a un workspace concreto
npm install zod --workspace=web

# Agregar una dependencia de desarrollo a la raíz
npm install -D typescript

# Instalar todo el árbol del monorepo de una
npm install
```

Sin `--workspace`, `npm install <paquete>` instala en la **raíz**, no en un workspace — el comportamiento inverso al de pnpm, que exige `-w` explícito para instalar en la raíz. Es la trampa más común migrando entre gestores: en npm hay que acordarse de apuntar el workspace, no de apuntar la raíz.

## 5. --workspace — ejecutar comandos en paquetes concretos

```bash
# Correr el script "dev" solo en el workspace "web"
npm run dev --workspace=web
# equivalente corto
npm run dev -w web

# Correr "build" en varios workspaces
npm run build --workspace=web --workspace=ui

# Correr un script en todos los workspaces que lo tengan
npm run test --workspaces --if-present
```

| Flag | Selecciona |
| --- | --- |
| `--workspace=web` / `-w web` | Solo el workspace `web` |
| `--workspace=web --workspace=ui` | Varios workspaces nombrados |
| `--workspaces` | Todos los workspaces |
| `--if-present` | No falla si algún workspace no tiene ese script definido |

`--if-present` importa en la práctica: sin él, `npm run test --workspaces` falla en cuanto un solo paquete no tiene script `test`, incluso si el resto sí lo tiene.

npm workspaces **no** resuelve el orden de build según el grafo de dependencias como sí lo hace `pnpm --filter web...`: si `ui` necesita compilarse antes que `web`, hay que ordenar los scripts a mano o usar una herramienta como Turborepo por encima.

## 6. Scripts recomendados en la raíz

```json title="package.json"
{
  "scripts": {
    "dev": "npm run dev --workspace=web",
    "build": "npm run build --workspaces --if-present",
    "test": "npm run test --workspaces --if-present"
  }
}
```

npm no tiene forma nativa de correr dos scripts de `dev` que no terminan al mismo tiempo — para eso hace falta `concurrently`. El [ejemplo completo de frontend + backend](/general/monorepo/monorepo-ejemplo-frontend-backend#npm--necesita-concurrently) muestra exactamente cómo, con un backend Express y un frontend Vite reales.

Fuentes: [npm Workspaces](https://docs.npmjs.com/cli/v11/using-npm/workspaces/) y el issue [workspace: protocol documented but throws EUNSUPPORTEDPROTOCOL](https://github.com/npm/cli/issues/8845).
