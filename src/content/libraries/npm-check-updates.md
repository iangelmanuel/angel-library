---
title: npm-check-updates
description: CLI para encontrar y aplicar versiones más nuevas de las dependencias de un proyecto, respetando (o no) el rango semver actual del package.json.
category: general
stack: packages
order: 2
tags: [npm, dependencies, cli, maintenance]
website: https://www.npmjs.com/package/npm-check-updates
github: https://github.com/raineorshine/npm-check-updates
install: npm install -g npm-check-updates
updatedAt: 2026-08-27
---

`npm-check-updates` (comando corto: `ncu`) revisa las dependencias del `package.json` contra la última versión publicada en npm y muestra o aplica las actualizaciones. A diferencia de `npm outdated` o `npm update`, no se limita al rango semver que ya declara cada dependencia (`^`, `~`) — puede saltar de major en major.

## Instalación

Como herramienta global (uso frecuente entre proyectos):

```bash
npm install -g npm-check-updates
```

Sin instalar, para uso puntual:

```bash
npx npm-check-updates
```

## Uso básico

Ejecutar `ncu` solo **muestra** qué cambiaría, sin tocar ningún archivo:

```bash
ncu
```

Aplicar los cambios al `package.json` (todavía no instala nada):

```bash
ncu -u
```

Después de `-u`, hay que instalar con el gestor del proyecto:

```bash
npm install
```

`ncu` solo reescribe `package.json`. `npm install` (o `pnpm install`/`bun install`) es el paso que realmente actualiza `node_modules` y el lockfile.

## Flags principales

| Flag | Qué hace |
| --- | --- |
| `-u`, `--upgrade` | Escribe las versiones nuevas en `package.json` (sin esto, `ncu` solo informa) |
| `-i`, `--interactive` | Elegir paquete por paquete con el teclado (flechas, espacio, `a` para todos, Enter para confirmar) |
| `-t`, `--target <valor>` | Estrategia de actualización: `latest` (default), `newest`, `greatest`, `minor`, `patch`, `semver`, o `@tag` |
| `-f`, `--filter <patrón>` | Solo revisa los paquetes que matchean el patrón |
| `-x`, `--reject <patrón>` | Excluye paquetes que matchean el patrón |
| `--peer` | Filtra las actualizaciones a versiones compatibles con las `peerDependencies` ya instaladas |
| `-g`, `--global` | Revisa paquetes globales en vez de las dependencias del proyecto |
| `--pre` | Incluye versiones prerelease (por defecto se ignoran) |

### `--target`, en detalle

- `latest` — respeta el dist-tag `latest` del paquete, sin prereleases. Es el default.
- `newest` — la publicación más reciente por fecha, incluye prereleases.
- `greatest` — el número de versión más alto publicado, sin importar el dist-tag.
- `minor` / `patch` — el mayor minor/patch posible sin subir de major.
- `semver` — la versión más alta que ya cabe dentro del rango declarado en `package.json`.
- `@beta`, `@next`, etc. — un dist-tag específico.

## Modo interactivo

```bash
ncu -i
```

Preselecciona patch y minor por defecto (agrupados con `--format group`); los majors quedan sin marcar salvo que se elija explícitamente. `--interactiveSelect <auto|none|patch|minor|all>` controla esa preselección.

## Modo doctor: probar cada actualización

```bash
ncu --doctor -u
```

`--doctor` corre los tests del proyecto antes de tocar nada, actualiza todas las dependencias y vuelve a correrlos; si algo rompe, revierte y prueba cada paquete por separado hasta aislar cuál actualización causó el fallo. Necesita `-u` porque el proceso sí modifica archivos durante la prueba — no tiene sentido en modo solo-lectura.

## Workspaces (monorepos)

```bash
ncu -u --workspaces
```

| Flag | Qué hace |
| --- | --- |
| `-w`, `--workspaces` | Corre sobre todos los workspaces declarados |
| `--workspace <nombre>` | Corre solo sobre un workspace puntual |
| `--root` | Incluye también el `package.json` raíz (`true` por defecto) |

## Archivo de configuración `.ncurc.json`

Para no repetir flags en cada ejecución, un `.ncurc.json` en la raíz del proyecto:

```json title=".ncurc.json"
{
  "upgrade": true,
  "reject": ["react", "react-dom"]
}
```

Las claves son los mismos nombres largos de los flags (`upgrade`, `filter`, `reject`, `target`, etc.). El orden de precedencia es: flags de línea de comandos → config local → config del proyecto → config en el home del usuario.

## CI: `--errorLevel`

| Nivel | Comportamiento |
| --- | --- |
| `1` (default) | Sale con código `0` salvo que ocurra un error real |
| `2` | Sale con código `0` solo si no hay ningún paquete para actualizar — falla el pipeline en cuanto algo queda desactualizado |

```bash
ncu --errorLevel 2
```

## Consideraciones

- `ncu` por sí solo nunca instala nada — sin `-u` es de solo lectura, y aun con `-u` falta correr `npm install`.
- Sin `--target minor`/`patch`, `ncu -u` puede saltar majors — revisar el changelog antes de instalar, sobre todo en dependencias con lógica crítica.
- `--peer` evita proponer una versión que rompa una `peerDependency` ya instalada (típico con librerías de UI o plugins de framework).
- En monorepos, correr sin `--workspaces` solo actualiza el `package.json` raíz.
