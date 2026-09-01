---
title: GitHub Actions — fundamentos de workflows
description: Entender eventos, workflows, jobs, steps, runners y acciones antes de diseñar una automatización confiable.
type: guides
order: 1
tags: [github-actions, workflows, ci, runners, yaml]
scope: fundamentos de GitHub Actions
related:
  - git/github-actions/cicd-github-actions-node
  - git/github-actions/github-actions-matrices-cache
  - git/github-actions/github-actions-secretos-permisos
updatedAt: 2026-08-26
---

GitHub Actions ejecuta procesos automatizados a partir de eventos del repositorio. Un workflow es un archivo YAML versionado en `.github/workflows/`; contiene uno o más jobs, y cada job contiene steps que ejecutan comandos o reutilizan actions.

## La anatomía mínima

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Descargar el repositorio
        uses: actions/checkout@v4
      - name: Ejecutar una comprobación
        run: echo "Aquí van lint, tests y build"
```

- `on` define el evento que dispara el workflow: `push`, `pull_request`, `workflow_dispatch`, `schedule` y muchos más.
- `jobs` divide el trabajo en unidades que pueden ejecutarse en paralelo o depender de otras.
- `runs-on` selecciona el runner, la máquina temporal donde corre el job.
- `steps` ejecuta shell con `run` o una acción empaquetada con `uses`.
- `permissions` limita lo que el token automático puede hacer.

## Variables y expresiones

```yaml
env:
  NODE_VERSION: 22

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Rama: ${{ github.ref_name }}"
      - run: echo "Node: $NODE_VERSION"
```

`${{ ... }}` es una expresión de Actions; `$NAME` es expansión del shell. No confundas ambos contextos. Usa `github`, `runner`, `env`, `vars`, `secrets` y `needs` solo donde tengan sentido.

## Eventos manuales y filtros

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: Ambiente de despliegue
        required: true
        default: staging
  push:
    paths:
      - "src/**"
      - "package.json"
```

Los filtros reducen ejecuciones innecesarias, pero revisa que no excluyan cambios que sí afectan el resultado. Para cada workflow define qué evidencia produce y qué ocurre cuando falla.

## Errores comunes

- Guardar el archivo fuera de `.github/workflows/`.
- Usar `pull_request_target` sin entender que ejecuta con el contexto del repositorio base.
- Dar permisos de escritura a todo el workflow por comodidad.
- Depender de un runner o una acción sin fijar una versión revisable.
- Crear un workflow monolítico que mezcla lint, pruebas y despliegue sin dependencias claras.

La [documentación oficial de workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows) detalla la sintaxis y los eventos disponibles.
