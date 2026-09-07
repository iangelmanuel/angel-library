---
title: GitHub Actions — matrices, dependencias y cache
description: Ejecutar una misma verificación en varias versiones, ordenar jobs con needs y acelerar instalaciones sin cachear resultados incorrectos.
type: guides
order: 2
tags: [github-actions, matrix, cache, ci, nodejs, pnpm]
scope: jobs paralelos y rendimiento
related:
  - git/github-actions/github-actions-fundamentos
  - git/github-actions/cicd-github-actions-node
updatedAt: 2026-08-26
---

Una matriz crea varias ejecuciones de un job a partir de combinaciones de datos. Es ideal para comprobar compatibilidad con varias versiones de Node.js o sistemas operativos sin duplicar todo el YAML.

## Matriz de versiones

```yaml
jobs:
  test:
    strategy:
      fail-fast: false
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
```

`fail-fast: false` permite ver todos los fallos de la matriz. Si el proyecto solo soporta una versión, una matriz añade coste sin aportar información.

`pnpm/action-setup` va antes que `actions/setup-node`: `cache: pnpm` necesita el binario `pnpm` ya disponible en el PATH para resolver dónde está el store que va a cachear. Invertido, `setup-node` no encuentra `pnpm` y el cache no se activa (sin fallar el job, así que el problema pasa desapercibido).

## Ordenar jobs con `needs`

```yaml
jobs:
  check:
    # lint y tests
    runs-on: ubuntu-latest
  build:
    needs: check
    runs-on: ubuntu-latest
```

Sin `needs`, los jobs independientes pueden comenzar en paralelo. Con `needs`, `build` espera a que `check` termine correctamente. Si necesitas ejecutar limpieza aunque falle una dependencia, expresa esa intención con `if: ${{ always() }}` y limita sus permisos.

## Cache de dependencias

Cachear el store del gestor de paquetes suele ser más seguro que cachear `node_modules` completo. La clave debe cambiar cuando cambia el lockfile:

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.local/share/pnpm/store
    key: pnpm-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
    restore-keys: pnpm-${{ runner.os }}-
```

Un cache es una optimización, no una fuente de verdad: `pnpm install --frozen-lockfile` debe seguir verificando las dependencias. Si la clave no incluye el lockfile, puedes reutilizar paquetes que ya no corresponden.

## Diagnóstico

- Mira primero el job y step exactos que fallaron.
- Imprime versiones (`node --version`, `pnpm --version`) cuando el entorno sea relevante.
- No ocultes fallos con `continue-on-error` salvo que el resultado sea informativo.
- Mantén la matriz pequeña: cada combinación consume tiempo y cuota.
