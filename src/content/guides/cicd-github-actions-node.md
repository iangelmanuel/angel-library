---
title: Pipeline Node.js con GitHub Actions
description: Workflow práctico con permisos mínimos, cache de pnpm, checks paralelos, build y artefacto verificable.
category: devops
stack: ci-cd
order: 2
tags: [github-actions, nodejs, pnpm, ci]
scope: automatización de CI
related:
  - guides/cicd-pipeline-fundamentals
  - guides/security-secrets-supply-chain
updatedAt: 2026-08-18
---

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
      - run: pnpm test
      - run: pnpm build
```

## Endurecer el workflow

- Pinneá actions a SHA para repositorios de alto riesgo y revisa actualizaciones.
- No ejecutes código de PRs no confiables con secretos de producción.
- Limita `permissions` por job; evita `write-all`.
- Define `timeout-minutes` y concurrency para controlar consumo.
- Usa environments con aprobación para producción.
- Prefiere OIDC para credenciales cloud de corta duración.

## Qué cachear

Guarda en caché el store del package manager, no `node_modules` a ciegas. La clave debe cambiar con sistema, versión del runtime y lockfile. El cache acelera; nunca debe ser requisito para que el build funcione.

Separa E2E si necesita servicios o navegador, pero mantén un check obligatorio del flujo crítico antes de publicar.

