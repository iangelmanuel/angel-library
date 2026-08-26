---
title: GitHub Actions — workflows reutilizables y acciones compuestas
description: Reducir duplicación con workflows llamados por otros workflows y acciones compuestas para pasos repetidos.
category: github-actions
stack: github-actions
order: 6
tags: [github-actions, reusable-workflows, composite-actions, automation]
scope: reutilización en Actions
related:
  - guides/github-actions-fundamentos
  - guides/github-actions-deployments
updatedAt: 2026-08-26
---

Cuando varios workflows repiten la misma preparación o despliegue, copia y pega suele producir pequeñas diferencias difíciles de mantener. GitHub Actions ofrece dos niveles de reutilización: un workflow completo invocable y una acción compuesta que agrupa steps.

## Workflow reutilizable

El workflow llamado declara `workflow_call` y sus entradas:

```yaml title=".github/workflows/reusable-check.yml"
name: Reusable check
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
      - run: npm ci
      - run: npm test
```

Otro workflow lo llama como un job, no como un step:

```yaml
jobs:
  verify:
    uses: ./.github/workflows/reusable-check.yml
    with:
      node-version: '22'
    permissions:
      contents: read
```

El contrato debe documentar entradas, secretos, permisos y outputs. El workflow llamador no puede asumir que el llamado tiene más permisos de los que recibió.

## Acción compuesta

Una acción compuesta suele vivir en una carpeta con `action.yml` y agrupa comandos repetidos:

```yaml title=".github/actions/setup-project/action.yml"
name: Setup project
description: Instala las dependencias del proyecto
runs:
  using: composite
  steps:
    - uses: actions/checkout@v4
    - shell: bash
      run: npm ci
```

Se usa desde un workflow con `uses: ./.github/actions/setup-project`. Es una buena opción para varios steps pequeños que siempre viajan juntos; para coordinar jobs, ambientes o artefactos, usa un workflow reutilizable.

## No abstraer demasiado

Una abstracción debe tener una interfaz estable y una razón de mantenimiento. Si oculta todos los comandos, diagnosticar un fallo se vuelve más difícil. Versiona cambios incompatibles, prueba el workflow reutilizable en un repositorio de ejemplo y deja visible qué job ejecuta cada responsabilidad.

Consulta la [documentación oficial sobre reutilizar workflows](https://docs.github.com/en/actions/reference/workflows-and-actions/reusing-workflow-configurations).
