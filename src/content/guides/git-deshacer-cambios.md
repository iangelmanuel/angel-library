---
title: Deshacer cambios — reset, revert, checkout y restore
description: Cuatro formas de "deshacer" en Git, cada una para un escenario distinto — cuál no reescribe historial y cuál sí, y por qué eso importa.
category: git
stack: git
order: 6
tags: [git, reset, revert, undo]
scope: git reset / revert / restore
related: [commands/git-undo-commit-keep-changes]
updatedAt: 2026-08-16
---

"Deshacer" en Git no es un solo comando — depende de **qué** querés deshacer y **dónde** está ese cambio (working tree, staging, o ya commiteado). Usar el comando equivocado es la fuente más común de "perdí mi trabajo" que en realidad es recuperable.

## Sacar un archivo del staging (sin perder el cambio)

```bash
git restore --staged archivo.ts
```

El archivo sigue modificado en el working tree, solo deja de estar marcado para el próximo commit.

## Descartar cambios no commiteados (sí se pierden)

```bash
git restore archivo.ts      # un archivo vuelve a como estaba en el último commit
git restore .                # todos los archivos modificados
```

Esto **sí borra el trabajo** hecho sobre esos archivos desde el último commit — no hay red de seguridad para cambios que nunca se commitearon.

## `reset` — mover el puntero de la rama

`reset` mueve dónde apunta la rama actual, con tres modos según qué hacer con los cambios de los commits que quedan "atrás":

```bash
git reset --soft HEAD~1    # deshace el commit, deja los cambios en STAGING
git reset --mixed HEAD~1   # deshace el commit, deja los cambios en el working tree (default)
git reset --hard HEAD~1    # deshace el commit Y BORRA los cambios por completo
```

`--hard` es el único de los tres que pierde trabajo de verdad — los otros dos solo mueven dónde "viven" los cambios, no los eliminan.

## `revert` — deshacer sin reescribir historial

`reset` mueve el puntero hacia atrás, como si el commit nunca hubiera existido. `revert` hace lo opuesto: crea un commit **nuevo** que aplica el cambio inverso, dejando el commit original intacto en el historial.

```bash
git revert <hash-del-commit>
```

Esta es la diferencia que importa en equipo: si ya hiciste `push` de un commit y otras personas lo bajaron, `reset` + `push --force` les rompe el historial local. `revert` es seguro en cualquier momento porque no borra nada, solo agrega.

## Regla práctica: ¿ya hiciste push?

```text
No hiciste push todavía  →  reset (soft/mixed/hard), lo que necesites
Ya hiciste push           →  revert, siempre
```

## `checkout` para archivos (el comando viejo, todavía válido)

Antes de que `restore`/`switch` separaran las responsabilidades (Git 2.23), todo pasaba por `checkout`. Sigue funcionando y se ve seguido en proyectos/tutoriales viejos:

```bash
git checkout -- archivo.ts   # equivalente a restore (descarta cambios locales)
git checkout main             # equivalente a switch (cambiar de rama)
```

## Resumen

| Comando | Qué deshace | ¿Reescribe historial? |
| --- | --- | --- |
| `git restore --staged <archivo>` | Saca del staging (no toca el working tree) | No |
| `git restore <archivo>` | Descarta cambios locales no commiteados | No aplica (nunca se commitearon) |
| `git reset --soft/--mixed HEAD~1` | Deshace el último commit, conserva los cambios | Sí (local) |
| `git reset --hard HEAD~1` | Deshace el último commit y borra los cambios | Sí (local), y se pierde el trabajo |
| `git revert <hash>` | Aplica el cambio inverso en un commit nuevo | No — es seguro después de un push |

## Consideraciones

- `reset --hard` no es "peligroso" en el sentido de romper el repo: el commit sigue existiendo un tiempo en el [reflog](/guides/git-reflog), recuperable con `git reset --hard <hash-anterior>`. Pero no confíes en eso como plan A — el reflog tiene una expiración.
- Un `reset --hard` o `push --force` sobre una rama que otros ya bajaron les genera conflictos raros en su copia local — coordinar antes es más barato que arreglarlo después.
