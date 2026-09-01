---
title: Workflow colaborativo — ramas, commits y pull requests
description: Organizar cambios pequeños, actualizar una rama, revisar una PR y mantener un historial recuperable sin imponer un modelo único.
type: guides
order: 7
tags: [git, workflow, branches, pull-request, collaboration]
related:
  - git/repository-management/git-colaboracion-pull-requests
  - git/git/git-merge-vs-rebase
  - git/git/git-resolver-conflictos
updatedAt: 2026-08-25
---

Un workflow define cómo un cambio pasa de idea a historial compartido. Git permite muchos modelos; el objetivo es reducir integración tardía, conservar revisión entendible y poder recuperar.

## Flujo recomendado para equipos pequeños

```text
actualizar rama base
  → crear rama corta
  → commits coherentes
  → push + pull request
  → CI + revisión
  → actualizar si cambió la base
  → merge
  → eliminar rama
```

```bash
git switch main
git pull --ff-only
git switch -c feat/search-filters
```

`--ff-only` evita crear un merge accidental durante pull. Si la rama local diverge, Git se detiene para que la persona elija conscientemente merge o rebase.

## Commits revisables

Un commit coherente compila o al menos representa un paso explicable. Separa refactor mecánico de cambio funcional cuando eso facilite revisión.

```bash
git add -p
git diff --cached
git commit -m "feat(search): add filter by tag"
```

`git add -p` selecciona hunks, no archivos completos. Revisa el staged diff: es exactamente lo que entrará al commit.

## Actualizar la rama

```bash
git fetch origin
git rebase origin/main
```

Rebase reescribe commits de una rama privada para colocarlos sobre la base nueva. No reescribas commits que otras personas ya usan sin acuerdo. Un merge conserva la historia tal como ocurrió y es apropiado cuando esa historia compartida importa.

## Pull request útil

Incluye problema, solución, decisiones, capturas o evidencia, pruebas y riesgos. Una PR pequeña no se mide solo por líneas: debe representar una unidad que pueda revisarse y desplegarse con seguridad.

El autor revisa primero su propio diff. La persona revisora comenta impacto y comportamiento, distingue bloqueo de sugerencia y evita convertir preferencias no acordadas en requisitos.

## Estrategias de merge

| Estrategia | Resultado |
| --- | --- |
| merge commit | conserva rama y contexto de integración |
| squash | un commit final por PR |
| rebase merge | conserva commits lineales |

Elige una convención de equipo y documenta cómo revertir. Squash simplifica historial, pero elimina commits intermedios del branch en la rama base.

## Emergencias

No “arregles” una rama compartida con force push improvisado. Usa `reflog` para recuperar localmente, `revert` para deshacer cambios publicados y `--force-with-lease` solo cuando la reescritura fue acordada y se verificó el estado remoto.
