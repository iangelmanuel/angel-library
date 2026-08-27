---
title: GitHub Actions — secretos, permisos y seguridad
description: Proteger GITHUB_TOKEN, secretos y workflows frente a permisos excesivos, dependencias no confiables y ejecuciones desde Pull Requests.
category: git
stack: github-actions
order: 4
tags: [github-actions, security, secrets, permissions, github-token]
scope: seguridad de workflows
related:
  - guides/github-actions-fundamentos
  - guides/repository-rules-security
  - guides/github-actions-deployments
updatedAt: 2026-08-26
---

Un workflow puede leer código, publicar paquetes o desplegar infraestructura. Trátalo como código con privilegios: cada permiso adicional aumenta el impacto de una acción vulnerable o de un script ejecutado con entradas no confiables.

## Permisos mínimos

```yaml
permissions:
  contents: read

jobs:
  release:
    permissions:
      contents: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/release.sh
```

Declara permisos a nivel global y eleva solo el job que realmente lo necesita. `contents: read` suele ser suficiente para CI. Si un job publica una release, limita `contents: write` a ese job y evita que las tareas de tests compartan ese token.

## Secretos y variables

```yaml
env:
  API_URL: ${{ vars.API_URL }}

steps:
  - run: ./deploy.sh
    env:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

Las variables no sensibles pueden vivir en `vars`; los secretos deben vivir en `secrets`. Nunca escribas el secreto en logs ni lo pases como parte de una URL que pueda quedar registrada. GitHub intenta enmascarar valores, pero no debes depender solo de ese filtro.

## Pull Requests desde forks

En un `pull_request`, los secretos del repositorio base no se entregan normalmente a código de un fork. Eso es una barrera importante. No cambies a `pull_request_target` para “hacer que funcione” sin revisar el riesgo: si ejecutas código de la PR con un contexto privilegiado, ese código podría leer o modificar recursos del repositorio.

Mantén separados los jobs de validación de código no confiable y los jobs de publicación. Para comentarios, etiquetas o despliegues condicionados usa una revisión explícita y condiciones claras como `github.event.pull_request.head.repo.full_name == github.repository` cuando corresponda.

## Dependencias de terceros

- Revisa la acción y sus permisos antes de usarla.
- Fija acciones a una versión o SHA revisable; actualízalas deliberadamente.
- Evita interpolar directamente texto controlado por Issues o Pull Requests en comandos shell.
- No guardes tokens en archivos generados que se suban como artefactos.

La [referencia de seguridad de GitHub Actions](https://docs.github.com/en/actions/reference/security) reúne las recomendaciones sobre secretos, permisos y OpenID Connect.
