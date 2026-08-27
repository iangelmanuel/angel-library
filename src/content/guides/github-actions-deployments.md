---
title: GitHub Actions — artefactos, ambientes y despliegues
description: Pasar un build verificable entre jobs y desplegar con ambientes protegidos, aprobaciones y secretos separados.
category: git
stack: github-actions
order: 5
tags: [github-actions, artifacts, environments, deployment, releases]
scope: entrega continua con Actions
related:
  - guides/github-actions-secretos-permisos
  - guides/cicd-pipeline-fundamentals
  - guides/github-actions-workflows-reutilizables
updatedAt: 2026-08-26
---

Un job de Actions es efímero: los archivos generados no aparecen automáticamente en el siguiente job. Usa artefactos para transportar un build entre jobs o conservar evidencia de una ejecución.

## Publicar y descargar un artefacto

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install --frozen-lockfile && pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: site-dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: site-dist
          path: dist/
      - run: ./scripts/deploy.sh dist
```

Construir una vez y promover el mismo artefacto evita que staging y producción reciban resultados distintos por instalar dependencias o compilar en momentos diferentes.

## Ambientes protegidos

Asocia el job de despliegue a un environment de GitHub:

```yaml
jobs:
  deploy:
    environment:
      name: production
      url: https://ejemplo.com
    runs-on: ubuntu-latest
    steps:
      - run: ./scripts/deploy.sh
```

En la configuración del environment puedes separar secretos, exigir revisores y establecer reglas de protección. Un workflow que llega a `production` debería tener un motivo claro para ejecutar y una ruta de rollback conocida.

## Condiciones de despliegue

```yaml
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

Haz que CI corra en Pull Requests, pero reserva el despliegue de producción para la rama principal o para una release. Si el despliegue falla, conserva logs y artefactos suficientes para diagnosticarlo y documenta cómo repetir o revertir la operación.

## Checklist antes de automatizar producción

- El build y las pruebas pasan antes del job de despliegue.
- El job usa solo los permisos y secretos necesarios.
- El ambiente requiere aprobación cuando el riesgo lo justifica.
- El artefacto está identificado y tiene retención razonable.
- Existe una estrategia de rollback y una forma de verificar salud.
- El workflow no imprime tokens, URLs privadas ni datos de usuarios.
