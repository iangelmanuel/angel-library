---
title: "pnpm: gestor de paquetes rápido y estricto"
description: Qué diferencia a pnpm de npm — store compartido, node_modules estricto — y sus comandos básicos.
category: terminal
stack: terminal
order: 16
tags: [terminal, pnpm, node, gestor-de-paquetes]
scope: pnpm
related: [guides/terminal-npm, guides/terminal-nvm, guides/terminal-bun]
updatedAt: 2026-08-17
---

## Qué diferencia a pnpm de npm

- **Store global compartido**: cada versión de cada paquete se guarda una sola vez en un store centralizado (`~/.local/share/pnpm/store` en Linux, ubicaciones equivalentes en macOS/Windows), y los `node_modules` de cada proyecto usan symlinks/hardlinks hacia ese store en vez de copiar los archivos. Con varios proyectos que comparten dependencias, esto ahorra espacio en disco de forma notable.
- **`node_modules` estricto por default**: npm "aplana" el árbol de dependencias, así que un paquete puede terminar importando otro paquete que nunca declaró en su propio `package.json` (una "phantom dependency") solo porque quedó disponible por casualidad. pnpm arma una estructura no plana donde solo las dependencias declaradas explícitamente son accesibles — si falta declarar algo, el import falla en vez de funcionar "de casualidad".

## Instalación

### Vía npm

```bash
npm install -g pnpm
```

### Vía Corepack (viene con Node)

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

### Script standalone

macOS / Linux:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Windows (PowerShell):

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `pnpm install` | Instala las dependencias del `package.json` (alias: `pnpm i`) |
| `pnpm add <paquete>` | Agrega una dependencia |
| `pnpm add -D <paquete>` | Agrega una devDependency |
| `pnpm remove <paquete>` | Quita una dependencia |
| `pnpm run <script>` | Corre un script del `package.json` (alias: `pnpm <script>` si no colisiona con un comando de pnpm) |
| `pnpm dlx <paquete>` | Ejecuta un paquete sin instalarlo — equivalente a `npx` |

## Ejemplo

```bash
pnpm add zod
pnpm add -D vitest
pnpm dlx create-astro@latest
```

## Consideraciones

- El lockfile es `pnpm-lock.yaml`, distinto del `package-lock.json` de npm — no son intercambiables entre gestores en el mismo proyecto.
- Un `node_modules` estricto a veces rompe herramientas viejas que asumían acceso a dependencias no declaradas (phantom dependencies) — la solución correcta es declarar la dependencia que falta, no aflojar la configuración.
- `pnpm dlx` es el equivalente directo de `npx`; ver [npm](/guides/terminal-npm) para el comando original.
