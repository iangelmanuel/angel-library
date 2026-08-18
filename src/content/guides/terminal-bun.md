---
title: "Bun: runtime, gestor de paquetes y bundler en uno"
description: Instalar Bun y sus comandos básicos — install, add, run, correr TypeScript directo, bunx.
category: terminal
stack: terminal
order: 15
tags: [terminal, bun, node, gestor-de-paquetes, runtime]
scope: bun
related: [guides/terminal-npm, guides/terminal-pnpm, guides/terminal-nvm]
updatedAt: 2026-08-17
---

## Qué es Bun

Un runtime de JavaScript/TypeScript (alternativa a Node) que además incluye gestor de paquetes, bundler y test runner en un solo binario. La instalación de dependencias es notablemente más rápida que npm o pnpm, y puede correr archivos `.ts` directo sin un paso de transpilación separado.

Es compatible con proyectos npm/pnpm existentes: lee `package.json` normalmente.

## Instalación

### macOS / Linux

```bash
curl -fsSL https://bun.sh/install | bash
```

### Windows (PowerShell)

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

También disponible vía npm, Chocolatey o Scoop:

```bash
npm install -g bun
```

```powershell
choco install bun
```

```powershell
scoop install bun
```

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `bun install` | Instala las dependencias del `package.json` |
| `bun add <paquete>` | Agrega una dependencia |
| `bun add -d <paquete>` | Agrega una devDependency |
| `bun run <script>` | Corre un script del `package.json` |
| `bun <archivo>.ts` | Ejecuta TypeScript directo, sin compilar aparte |
| `bunx <paquete>` | Ejecuta un paquete sin instalarlo — equivalente a `npx` |

## Ejemplo: correr TypeScript sin transpilar

```bash
bun script.ts
```

Con Node, esto normalmente requiere `ts-node`, `tsx`, o compilar a `.js` primero. Bun lo interpreta directo.

## Ejemplo: instalar y correr

```bash
bun install
bun add zod
bunx create-astro@latest
```

## Consideraciones

- Bun genera su propio lockfile (`bun.lock` o `bun.lockb` según la versión) — al mezclar Bun con npm/pnpm en el mismo repo pueden convivir lockfiles de más de un gestor, lo cual conviene evitar.
- No todo el ecosistema de Node tiene 100% compatibilidad garantizada con el runtime de Bun (algunos módulos nativos o APIs muy específicas de Node pueden comportarse distinto) — para proyectos grandes en producción vale la pena verificar antes de migrar por completo.
- Al ser runtime + gestor + bundler + test runner en un solo binario, reduce la cantidad de herramientas separadas (`ts-node`, `webpack`/`esbuild`, `jest`) que un proyecto Node tradicional suele necesitar.
