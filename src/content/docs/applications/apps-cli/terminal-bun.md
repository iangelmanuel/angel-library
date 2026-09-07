---
title: "Bun: runtime, gestor de paquetes y bundler en uno"
description: Entorno para ejecutar JavaScript y TypeScript que también instala paquetes, ejecuta pruebas y empaqueta código; la guía muestra cómo evaluarlo sin reemplazar Node a ciegas.
type: guides
order: 5
tags: [terminal, bun, node, gestor-de-paquetes, runtime]
scope: bun
website: https://bun.sh
related:
  [
    terminal/terminal/terminal-npm,
    applications/apps-cli/terminal-pnpm,
    applications/apps-cli/terminal-nvm
  ]
updatedAt: 2026-08-28
---

## Qué es Bun

Un runtime de JavaScript/TypeScript (alternativa a Node) que además incluye gestor de paquetes, bundler y test runner en un solo binario. La instalación de dependencias es notablemente más rápida que npm o pnpm, y puede correr archivos `.ts` directo sin un paso de transpilación separado.

**Runtime** es el programa que ejecuta JavaScript fuera del navegador; **gestor de paquetes** resuelve dependencias; **bundler** combina módulos para producir artefactos; y **test runner** descubre y ejecuta pruebas. Bun ofrece las cuatro capacidades, aunque usar `bun install` no obliga a cambiar el runtime de producción.

Es compatible con el modelo de `package.json` del ecosistema npm y puede instalar muchos proyectos existentes. Compatibilidad no significa comportamiento idéntico a Node.js en cada API o módulo nativo, por lo que una migración del runtime necesita pruebas reales.

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

```text
npm install -g bun
```

```powershell
choco install bun
```

```powershell
scoop install bun
```

Abre una terminal nueva y verifica tanto la versión como la revisión exacta del binario:

```bash
bun --version
bun --revision
```

Si la instalación existe pero el comando no aparece, revisa que `~/.bun/bin` en macOS/Linux o `%USERPROFILE%\.bun\bin` en Windows esté incluido en `PATH`.

## Comandos básicos

| Comando                | Qué hace                                                |
| ---------------------- | ------------------------------------------------------- |
| `bun install`          | Instala las dependencias del `package.json`             |
| `bun add <paquete>`    | Agrega una dependencia                                  |
| `bun add -d <paquete>` | Agrega una devDependency                                |
| `bun run <script>`     | Corre un script del `package.json`                      |
| `bun <archivo>.ts`     | Ejecuta TypeScript directo, sin compilar aparte         |
| `bunx <paquete>`       | Ejecuta un paquete sin instalarlo — equivalente a `npx` |
| `bun test`             | Ejecuta pruebas con el test runner integrado            |
| `bun build <entrada>`  | Empaqueta uno o más puntos de entrada                   |
| `bun outdated`         | Muestra dependencias desactualizadas                    |
| `bun update`           | Actualiza dependencias                                  |
| `bun upgrade`          | Actualiza el propio binario de Bun                      |

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

## Adoptarlo de forma gradual

Para evaluar solo el gestor de paquetes en una rama:

```bash
bun install
bun run check
bun run test
bun run build
```

Revisa el nuevo `bun.lock`, ejecuta la suite y el build, y prueba cualquier dependencia nativa. Si el repositorio adopta Bun, elimina los lockfiles de otros gestores y declara la herramienta esperada:

```json title="package.json"
{
  "packageManager": "bun@1.3.3"
}
```

La versión es ilustrativa; fija la que realmente haya validado el equipo.

## Autenticación con registros

Bun no requiere una cuenta propia para instalar paquetes públicos. Puede consumir configuración compatible con npm para registros privados. Mantén el token fuera del repositorio:

```ini title=".npmrc"
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

La variable `NPM_TOKEN` debe proceder del entorno local seguro o del almacén de secretos de CI. `bunx` también ejecuta código descargado: revisa el paquete y fija una versión cuando el comando forme parte de un proceso sensible.

## Consideraciones

- Las versiones actuales generan `bun.lock` en texto; proyectos antiguos pueden conservar `bun.lockb`. No confirmes además `package-lock.json` o `pnpm-lock.yaml` si Bun quedó como gestor oficial.
- No todo el ecosistema de Node tiene 100% compatibilidad garantizada con el runtime de Bun (algunos módulos nativos o APIs muy específicas de Node pueden comportarse distinto) — para proyectos grandes en producción vale la pena verificar antes de migrar por completo.
- Al ser runtime + gestor + bundler + test runner en un solo binario, reduce la cantidad de herramientas separadas (`ts-node`, `webpack`/`esbuild`, `jest`) que un proyecto Node tradicional suele necesitar.
- No reemplaces Node por Bun solamente porque `bun install` funciona. Instalación, ejecución, pruebas y despliegue son fronteras diferentes y deben validarse por separado.
