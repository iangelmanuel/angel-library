---
title: Monorepo con Bun — workspaces, filter y self-contained
description: Crear un monorepo con Bun workspaces — el campo workspaces con globs y negación, el protocolo workspace:, --filter para instalar o correr scripts en paquetes concretos, y self-contained para empaquetadores como Electron.
type: guides
order: 4
tags: [monorepo, bun, workspaces]
scope: monorepo con Bun workspaces
related:
  - general/monorepo/monorepo-que-es
  - general/monorepo/monorepo-pnpm
  - general/monorepo/monorepo-npm
  - general/monorepo/monorepo-ejemplo-frontend-backend
updatedAt: 2026-08-26
---

Bun implementa workspaces con una sintaxis muy cercana a la de npm (mismo campo `workspaces` en el `package.json` raíz) pero con el protocolo `workspace:` de pnpm ya funcionando de forma fiable, y con la instalación más rápida de los tres gestores gracias a su instalador nativo.

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
└── bun.lock
```

## 2. El campo workspaces

```json title="package.json"
{
  "name": "mi-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
```

Bun soporta glob completo, incluida **negación** — útil para excluir carpetas de test o plantillas que viven dentro de un directorio que de otro modo entraría por el patrón:

```json title="package.json"
{
  "workspaces": ["packages/**", "!packages/**/test/**", "!packages/**/template/**"]
}
```

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
    "@repo/ui": "workspace:*"
  }
}
```

```bash
bun install
```

A diferencia de npm, en Bun **sí** puedes usar `workspace:*` con confianza — funciona igual que en pnpm: fuerza la resolución contra el paquete local y falla si no existe, en vez de buscarlo en el registro. Al publicar, Bun reemplaza `workspace:*` por la versión real (`workspace:^` → `^1.0.1`, etc.), igual que pnpm.

## 4. Instalar dependencias

```bash
# Agregar una dependencia externa a un paquete concreto
cd apps/web && bun add zod

# Agregar una dependencia de desarrollo a la raíz
bun add -d typescript

# Instalar todo el árbol del monorepo de una
bun install
```

Bun no tiene un flag equivalente a `pnpm add --filter` o `npm install --workspace` para instalar en un paquete específico desde la raíz — la forma directa es entrar a la carpeta del paquete y correr `bun add` ahí, o usar `--filter` en el propio `bun install` para acotar qué paquetes se instalan (ver abajo), que es un mecanismo distinto: filtra qué se instala, no dónde se agrega una dependencia nueva.

## 5. --filter — instalar o correr scripts en paquetes concretos

```bash
# Instalar solo los paquetes que empiezan con "pkg-", excluyendo "pkg-c"
bun install --filter "pkg-*" --filter "!pkg-c"

# Correr el script "dev" solo en el paquete "web"
bun run --filter web dev

# Correr un script en todos los workspaces
bun run --filter '*' build
```

El `--filter` de Bun acepta el mismo estilo de glob con negación que el campo `workspaces` — `--filter "!pkg-c"` excluye un paquete de una selección más amplia, en vez de tener que nombrar cada paquete que sí quieres incluir.

## 6. Self-contained workspaces — cuando un empaquetador necesita todo junto

Herramientas como los empaquetadores de Electron esperan un `node_modules` con **todas** las dependencias resueltas dentro de la carpeta de la app — no un symlink que apunte fuera. El hoisting normal de un monorepo rompe ese supuesto.

`selfContained` resuelve esto para paquetes concretos, sin desactivar el hoisting para todo el monorepo:

```json title="package.json"
{
  "workspaces": {
    "packages": ["apps/*", "packages/*"],
    "selfContained": ["apps/desktop"]
  }
}
```

Con esto, `apps/desktop` recibe un `node_modules` completo y autocontenido, mientras el resto del monorepo sigue usando symlinks compartidos normalmente. Es un caso puntual — la mayoría de monorepos nunca necesitan tocar esta opción, solo aplica cuando empaquetas una app para distribución con una herramienta que no entiende symlinks.

## 7. Scripts recomendados en la raíz

```json title="package.json"
{
  "scripts": {
    "dev": "bun run --filter web dev",
    "build": "bun run --filter '*' build",
    "test": "bun run --filter '*' test"
  }
}
```

Para un caso real con backend y frontend corriendo a la vez con un solo comando, ver el [ejemplo completo de frontend + backend](/general/monorepo/monorepo-ejemplo-frontend-backend#bun).

Fuentes: [Bun Workspaces](https://bun.sh/docs/install/workspaces) y [Bun --filter](https://bun.sh/docs/pm/filter).
