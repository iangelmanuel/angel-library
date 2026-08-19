---
title: Colaboración con Git — commits, ramas y pull requests
description: Preparar cambios revisables mediante commits coherentes, ramas cortas, descripción de riesgos y una revisión enfocada en comportamiento.
category: git
stack: git
order: 3
tags: [git, collaboration, commits, branches, pull-request]
related:
  - guides/git-mental-model-terminology
  - guides/git-flujo-basico
updatedAt: 2026-08-19
---

Git conserva historia; una **pull request** —solicitud de cambios— agrega conversación, revisión y controles antes de integrar. El objetivo no es producir la mayor cantidad de commits, sino una unidad de cambio que otra persona pueda comprender y verificar.

## Commit coherente

Un commit debe compilar o dejar claro por qué es un paso intermedio. Separa refactor mecánico de cambio funcional cuando eso facilite la revisión.

```text
feat(search): add filtering by category

Validate the category on the server and preserve it in pagination links.
```

**Conventional Commits** es una convención opcional para estructurar mensajes; resulta útil si automatiza changelog o versiones. La explicación del porqué sigue siendo más importante que cumplir un prefijo.

## Antes de abrir la PR

- Revisa el diff completo y elimina logs o archivos accidentales.
- Ejecuta formato, tipos, pruebas y build aplicables.
- Divide cambios sin relación.
- Actualiza documentación y migraciones.
- Señala riesgos, decisiones y pasos de prueba.

```md
## Qué cambia
## Por qué
## Cómo se verificó
## Capturas o evidencia
## Riesgos, migración y rollback
```

## Revisar con intención

Empieza por contrato y comportamiento; después mira seguridad, datos, errores, pruebas y mantenibilidad. Distingue un bloqueo de una sugerencia. Una pregunta concreta —“¿qué ocurre si se reintenta?”— ayuda más que “esto está mal”.

## Ramas cortas e integración

Cuanto más vive una rama, más se desvía. Integra cambios pequeños detrás de una función desactivada si es necesario. Rebase o merge son políticas del equipo; evita reescribir historia ya compartida sin coordinación.

Después de integrar, monitorea el despliegue y conserva una ruta de reversión. La aprobación no elimina el riesgo operativo.
