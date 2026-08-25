---
title: Rulesets, automatización y seguridad del repositorio
description: Proteger ramas, exigir comprobaciones, limitar permisos y mantener dependencias y secretos bajo control.
category: git
stack: repository-management
order: 6
tags: [github, rulesets, branch-protection, actions, security]
related:
  - guides/repository-management-fundamentals
  - guides/repository-files-community
  - guides/cicd-github-actions-node
updatedAt: 2026-08-25
---

Una política escrita ayuda, pero un control automatizado evita que el resultado dependa de memoria. GitHub ofrece reglas de rama y **rulesets** para controlar cómo se actualizan ramas y tags.

## Base recomendada para `main`

- exigir Pull Request antes del merge;
- exigir al menos una aprobación cuando haya equipo;
- invalidar aprobaciones si cambia código relevante;
- exigir checks de tipos, pruebas y build;
- bloquear force push y eliminación;
- exigir resolución de conversaciones;
- restringir excepciones y registrar quién puede omitir reglas.

Un proyecto personal también se beneficia de checks obligatorios: la misma persona puede olvidar ejecutar una prueba o publicar desde una rama desactualizada.

## CI mínima

```yaml title=".github/workflows/quality.yml"
name: Quality

on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm check
      - run: pnpm test
      - run: pnpm build
```

Fija versiones mayores o SHAs según el modelo de riesgo y revisa los permisos de cada Action. Un workflow ejecuta código con acceso al runner; no se debe tratar una dependencia de CI como decoración.

## Principio de mínimo privilegio

Declara `permissions` explícitos. No entregues escritura a contenidos, paquetes o Pull Requests si el job solo necesita leer. Los workflows que se ejecutan desde forks y los eventos `pull_request_target` requieren atención especial porque pueden combinar código no confiable con secretos del repositorio.

## Secretos

- nunca guardes tokens en archivos, logs, artefactos o ejemplos;
- usa secretos de entorno y protección para producción;
- prefiere credenciales de corta duración mediante OIDC cuando el proveedor lo admita;
- rota cualquier secreto expuesto, aunque se elimine en el commit siguiente;
- activa detección de secretos y alertas de dependencias cuando estén disponibles.

**OIDC** significa *OpenID Connect*. En CI permite obtener credenciales temporales del proveedor de nube sin almacenar una clave permanente en GitHub.

## Dependencias

Versiona el lockfile, revisa actualizaciones automáticas y agrupa cambios solo cuando compartan riesgo. Una alerta no se resuelve actualizando a ciegas: confirma si la ruta vulnerable es alcanzable, prueba compatibilidad y registra cualquier excepción con responsable y fecha.

## Releases y tags

Protege tags de release, genera artefactos desde un commit identificable y conserva checksums cuando distribuyas binarios. Una release debe indicar cambios, migraciones, incompatibilidades y ruta de reversión. No reconstruyas silenciosamente el mismo tag con contenido diferente.

Fuentes oficiales: [Rulesets de GitHub](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [ramas protegidas](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches) y [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners).

