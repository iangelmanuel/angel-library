---
title: Pipeline Node.js con GitHub Actions
description: Workflow con permisos mínimos, caché de pnpm y comprobaciones secuenciales para un proyecto Node.js.
type: guides
sidebar:
  order: 3
tags: [github-actions, nodejs, pnpm, ci]
scope: automatización de CI
related:
  - devops/ci-cd/cicd-pipeline-fundamentals
  - security/security-infra/security-secrets-supply-chain
  - git/github-actions/github-actions-fundamentos
updatedAt: 2026-09-07
---

## Antes de empezar

Versiona `pnpm-lock.yaml` y declara `packageManager` en `package.json` (por ejemplo `pnpm@11.25.0`). Este ejemplo requiere scripts `check` y `build`; añade `test` solo si tu proyecto tiene pruebas. Los pasos dentro de un job se ejecutan secuencialmente y un fallo bloquea los siguientes.

```yaml title=".github/workflows/ci.yml"
name: ci

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      # Añade aquí `pnpm test` si existe ese script.
      - run: pnpm build
```

## Endurecer el workflow

- Fija las actions a un SHA para repositorios de alto riesgo y revisa actualizaciones.
- No ejecutes código de PRs no confiables con secretos de producción.
- Limita `permissions` por job; evita `write-all`.
- Define `timeout-minutes` y concurrency para controlar consumo.
- Usa environments con aprobación para producción.
- Prefiere OIDC para credenciales cloud de corta duración.

## Qué cachear

Guarda en caché el store del package manager, no `node_modules` a ciegas. La clave debe cambiar con sistema, versión del runtime y lockfile. El cache acelera; nunca debe ser requisito para que el build funcione.

Separa E2E si necesita servicios o navegador, pero mantén un check obligatorio del flujo crítico antes de publicar.

## Comprobación

Abre una rama de prueba con un error de tipos: el job debe fallar en `check` y no ejecutar el build. Corrígelo y comprueba un run sin caché. Este workflow valida, pero no publica ni sube artefactos; añade un paso de upload si necesitas conservar `dist/`.

## Fuentes

- [GitHub: compilar y probar Node.js](https://docs.github.com/en/actions/tutorials/build-and-test-code/nodejs)
