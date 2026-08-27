---
title: Monorepo con pnpm — workspaces, filter y catalogs
description: Crear un monorepo con pnpm paso a paso — pnpm-workspace.yaml, el protocolo workspace:, --filter para ejecutar comandos en paquetes concretos, y catalogs para versiones compartidas.
category: general
stack: monorepo
order: 2
tags: [monorepo, pnpm, workspaces, catalogs]
scope: monorepo con pnpm workspaces
related:
  - guides/monorepo-que-es
  - guides/monorepo-npm
  - guides/monorepo-bun
  - guides/monorepo-ejemplo-frontend-backend
  - guides/typescript-path-aliases
updatedAt: 2026-08-26
---

pnpm es el gestor con el soporte de workspaces más maduro de los tres: fue el primero en implementar el protocolo `workspace:` de forma estricta, y es el único con **catalogs** — versiones compartidas declaradas una sola vez. Si estás empezando un monorepo hoy sin una razón para elegir otro gestor, pnpm es la elección por defecto más común.

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
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

`apps/` para lo desplegable (sitios, servicios); `packages/` para lo compartido (librerías internas, configuración). Es una convención, no una regla de pnpm — los nombres de carpeta son libres, lo que importa es qué declares en `pnpm-workspace.yaml`.

## 2. pnpm-workspace.yaml

Este archivo, en la raíz, es lo que convierte una carpeta común en un workspace de pnpm:

```yaml title="pnpm-workspace.yaml"
packages:
  - "apps/*"
  - "packages/*"
```

Cada entrada es un patrón glob. `apps/*` incluye toda carpeta directa dentro de `apps/` que tenga un `package.json`; una carpeta sin `package.json` se ignora sin error.

## 3. El package.json raíz

```json title="package.json"
{
  "name": "mi-monorepo",
  "private": true,
  "packageManager": "pnpm@11.19.0"
}
```

`"private": true` es obligatorio en la raíz: evita publicar por accidente el paquete raíz (que no es un paquete real, es el contenedor del monorepo) a npm. `packageManager` fija la versión exacta de pnpm que el proyecto espera — si alguien con otra versión corre un comando, herramientas como Corepack pueden avisar o forzar la versión declarada.

## 4. Crear un paquete y declarar una dependencia interna

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
pnpm install
```

Tras el install, `apps/web/node_modules/@repo/ui` es un symlink a `packages/ui` — no una copia. Cambiar un archivo en `packages/ui` se ve al instante en `apps/web`, sin build ni publish intermedio.

## 5. Instalar dependencias

```bash
# Agregar una dependencia externa a un paquete concreto
pnpm add zod --filter web

# Agregar una dependencia de desarrollo a la raíz (herramientas compartidas: eslint, typescript, etc.)
pnpm add -D -w typescript

# Instalar todo el árbol del monorepo de una
pnpm install
```

`-w` (`--workspace-root`) es explícito a propósito: instalar algo en la raíz sin el flag da un error, para que agregar una dependencia "a secas" sin pensar en qué paquete no sea el comportamiento por defecto.

## 6. --filter — ejecutar comandos en paquetes concretos

`--filter` es el corazón de trabajar en un monorepo con pnpm: casi todo comando puede acotarse a un paquete o a un subconjunto.

```bash
# Correr el script "dev" solo en el paquete "web"
pnpm --filter web dev

# Correr "build" en web Y en todo lo que web depende (para que ui esté compilado antes)
pnpm --filter web... build

# Correr "test" en todos los paquetes
pnpm -r test
```

| Sintaxis | Selecciona |
| --- | --- |
| `--filter web` | Solo el paquete `web` |
| `--filter web...` | `web` y todas sus dependencias (útil para build en orden) |
| `--filter ...web` | `web` y todo lo que depende de `web` |
| `-r` / `--recursive` | Todos los paquetes del workspace |

Esto resuelve el problema real de un monorepo sin necesitar Turborepo ni Nx para lo básico: `pnpm --filter web... build` construye `packages/ui` antes que `apps/web` automáticamente, porque pnpm conoce el grafo de dependencias declarado en cada `package.json`.

## 7. Catalogs — una versión, un solo lugar

Sin catalogs, actualizar React en un monorepo de diez paquetes significa editar diez `package.json`. Un **catalog** centraliza esa versión:

```yaml title="pnpm-workspace.yaml"
packages:
  - "apps/*"
  - "packages/*"

catalog:
  react: ^19.0.0
  react-dom: ^19.0.0
```

```json title="apps/web/package.json"
{
  "dependencies": {
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

`"react": "catalog:"` se resuelve contra la versión declarada en el catalog. Subir React de 19 a 20 es cambiar **una línea** en `pnpm-workspace.yaml` y correr `pnpm install` — cada `package.json` sigue diciendo `catalog:`, sin tocar diez archivos ni generar diez líneas de diff en un PR de actualización.

Para casos donde de verdad necesitas dos versiones convivientes (migrando de React 17 a 18 gradualmente, por ejemplo), existen **catalogs nombrados**:

```yaml title="pnpm-workspace.yaml"
catalogs:
  react17:
    react: ^17.0.2
  react18:
    react: ^18.2.0
```

```json
{
  "dependencies": { "react": "catalog:react18" }
}
```

## 8. Scripts recomendados en la raíz

```json title="package.json"
{
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "pnpm -r lint"
  }
}
```

Así `pnpm build` desde la raíz corre el build de todos los paquetes sin que cada persona del equipo tenga que recordar la sintaxis de `--filter` para las tareas del día a día.

Para un caso real con dos procesos de `dev` que no terminan (un backend y un frontend) corriendo a la vez con un solo comando, ver el [ejemplo completo de frontend + backend](/guides/monorepo-ejemplo-frontend-backend#pnpm).

Fuentes: [pnpm Workspaces](https://pnpm.io/workspaces), [pnpm --filter](https://pnpm.io/filtering) y [pnpm Catalogs](https://pnpm.io/catalogs).
