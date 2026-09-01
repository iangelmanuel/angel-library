---
title: "pnpm: gestor de paquetes rápido y estricto"
description: Gestor de paquetes para proyectos JavaScript que ahorra espacio y detecta dependencias mal declaradas; compara su funcionamiento con npm y reúne el flujo básico.
type: guides
order: 4
tags: [terminal, pnpm, node, gestor-de-paquetes]
scope: pnpm
website: https://pnpm.io
related: [terminal/terminal/terminal-npm, applications/apps-cli/terminal-nvm, applications/apps-cli/terminal-bun]
updatedAt: 2026-08-28
---

## Qué diferencia a pnpm de npm

- **pnpm** significa *performant npm*: usa el mismo ecosistema de `package.json` y el registro npm, pero cambia cómo instala y enlaza las dependencias.
- **Store global compartido**: cada versión de cada paquete se guarda una sola vez en un store centralizado (`~/.local/share/pnpm/store` en Linux, ubicaciones equivalentes en macOS/Windows), y los `node_modules` de cada proyecto usan symlinks/hardlinks hacia ese store en vez de copiar los archivos. Con varios proyectos que comparten dependencias, esto ahorra espacio en disco de forma notable.
- **`node_modules` estricto por default**: npm "aplana" el árbol de dependencias, así que un paquete puede terminar importando otro paquete que nunca declaró en su propio `package.json` (una "phantom dependency") solo porque quedó disponible por casualidad. pnpm arma una estructura no plana donde solo las dependencias declaradas explícitamente son accesibles — si falta declarar algo, el import falla en vez de funcionar "de casualidad".

## Instalación

### Instalador recomendado con Node disponible

```text
npx get-pnpm
```

La instalación de pnpm 11 mediante npm necesita Node.js 22 o posterior. En Windows, la documentación oficial recomienda este camino sobre el script standalone cuando Microsoft Defender bloquea o ralentiza el ejecutable descargado.

### Vía gestores del sistema

```bash
# macOS
brew install pnpm

# Windows
winget install -e --id pnpm.pnpm

# Windows con Chocolatey
choco install pnpm
```

### Script standalone sin Node.js

macOS / Linux:

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

Windows (PowerShell):

```powershell
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression
```

Abre una terminal nueva y verifica:

```bash
pnpm --version
pnpm store path
```

### Corepack y versión por proyecto

Algunas versiones de Node incluyen **Corepack**, un puente que descarga y activa el gestor declarado por cada proyecto. Si `corepack --version` existe:

```bash
corepack enable pnpm
corepack use pnpm@11.19.0
```

`corepack use` añade o actualiza el campo `packageManager` en `package.json`. La versión es un ejemplo: fija la que el repositorio haya validado.

```json title="package.json"
{
  "packageManager": "pnpm@11.19.0"
}
```

Corepack no debe asumirse universalmente: puede no venir instalado o estar deshabilitado en versiones y distribuciones nuevas de Node. En ese caso, usa el instalador oficial y conserva igualmente `packageManager` como contrato del repositorio.

## Comandos básicos

| Comando | Qué hace |
|---|---|
| `pnpm install` | Instala las dependencias del `package.json` (alias: `pnpm i`) |
| `pnpm add <paquete>` | Agrega una dependencia |
| `pnpm add -D <paquete>` | Agrega una devDependency |
| `pnpm remove <paquete>` | Quita una dependencia |
| `pnpm run <script>` | Corre un script del `package.json` (alias: `pnpm <script>` si no colisiona con un comando de pnpm) |
| `pnpm dlx <paquete>` | Ejecuta un paquete sin instalarlo — equivalente a `npx` |
| `pnpm exec <binario>` | Ejecuta un binario instalado en el proyecto |
| `pnpm outdated` | Muestra dependencias que tienen versiones más recientes |
| `pnpm update` | Actualiza dependencias dentro de los rangos permitidos |
| `pnpm why <paquete>` | Explica por qué existe un paquete en el árbol |
| `pnpm store prune` | Elimina del store paquetes que ningún proyecto referencia |

## Ejemplo

```bash
pnpm add zod
pnpm add -D vitest
pnpm dlx create-astro@latest
```

`pnpm dlx` descarga código temporal y lo ejecuta. Verifica el nombre, propietario y versión del paquete antes de usarlo; para herramientas recurrentes del proyecto, una `devDependency` fijada es más reproducible.

## Instalación reproducible

Confirma `package.json`, `pnpm-lock.yaml` y, si existe, `pnpm-workspace.yaml`. En integración continua usa:

```bash
pnpm install --frozen-lockfile
```

El flag obliga a que el manifiesto y el lockfile coincidan. Si alguien cambió dependencias sin regenerar el lockfile, la instalación falla en vez de resolver versiones diferentes silenciosamente.

## Autenticación con registros privados

pnpm no necesita una cuenta para instalar paquetes públicos. La autenticación pertenece al registro npm compatible que utilices. Los tokens suelen configurarse mediante `.npmrc` y variables de entorno:

```ini title=".npmrc"
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

Confirma únicamente la referencia `${NPM_TOKEN}`; nunca el valor real. En CI, define `NPM_TOKEN` en el almacén de secretos. Para publicar paquetes, activa autenticación de dos factores y usa tokens granulares o de automatización con el alcance mínimo permitido por el registro.

## Consideraciones

- El lockfile es `pnpm-lock.yaml`, distinto del `package-lock.json` de npm — no son intercambiables entre gestores en el mismo proyecto.
- Un `node_modules` estricto a veces rompe herramientas viejas que asumían acceso a dependencias no declaradas (phantom dependencies) — la solución correcta es declarar la dependencia que falta, no aflojar la configuración.
- `pnpm dlx` es el equivalente directo de `npx`; ver [npm](/terminal/terminal/terminal-npm) para el comando original.
- No confirmes lockfiles de varios gestores. Elige uno por repositorio y decláralo en `packageManager` para que personas y CI usen la misma herramienta.
- En agosto de 2026 conviven pnpm 11 y pnpm 12; la versión `latest` del registro puede no apuntar inmediatamente a la línea más nueva. No migres un proyecto solo por disponibilidad: revisa compatibilidad, diferencias y lockfile en una rama separada.
