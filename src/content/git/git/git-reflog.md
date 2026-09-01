---
title: Reflog — recuperar lo que parecía perdido
description: El historial de dónde estuvo HEAD, incluso para commits que ya no aparecen en ninguna rama — el salvavidas para casi cualquier "borré algo por error".
type: guides
order: 16
tags: [git, reflog, recovery, advanced]
scope: git reflog
related: [git/git/git-undo-commit-keep-changes]
updatedAt: 2026-08-16
---

Git casi nunca borra un commit inmediatamente después de dejar de referenciarlo — lo mantiene un tiempo (por defecto 90 días) aunque ninguna rama apunte a él, esperando que se ejecute la recolección de basura (*garbage collection*). El **reflog** es el registro de cada lugar donde estuvo `HEAD` — cada commit, cada `reset`, cada `checkout`, cada `rebase` — y es la puerta para recuperar casi cualquier cosa que "se perdió".

## Ver el reflog

```bash
git reflog
```

```text
a1b2c3d HEAD@{0}: commit: agregar validación
e4f5g6h HEAD@{1}: reset: moving to HEAD~1
h7i8j9k HEAD@{2}: commit: fix típo
k1l2m3n HEAD@{3}: checkout: moving from main to feature/login
```

Cada línea es un momento en el tiempo. `HEAD@{0}` es el más reciente, `HEAD@{1}` el anterior, y así.

## Escenario: `reset --hard` que borró más de lo que querías

```bash
git reflog                    # buscar el hash de ANTES del reset
git reset --hard <ese-hash>   # volver a ese punto exacto
```

El commit "borrado" nunca desapareció de verdad — solo dejó de tener una rama apuntándolo. El reflog todavía sabe que existió.

## Escenario: rama eliminada por error

```bash
git branch -D feature/importante   # ups
git reflog                          # buscar el último commit de esa rama, antes del borrado
git branch feature/importante <hash>  # recrearla apuntando ahí
```

## Escenario: rebase que salió mal

```bash
git reflog                          # buscar el estado justo antes de "rebase (start)"
git reset --hard <ese-hash>         # volver a como estaba antes de empezar el rebase
```

Más simple todavía si el rebase sigue en curso: `git rebase --abort` (ver [Rebase interactivo](/git/git/git-rebase-interactivo)).

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git reflog` | Lista cada lugar donde estuvo `HEAD`, más reciente primero |
| `git reset --hard <hash-del-reflog>` | Vuelve el repo exactamente a ese momento |
| `git branch <nombre> <hash>` | Recrea una rama borrada, apuntando a un commit del reflog |

## Consideraciones

- El reflog es **local** — vive en tu `.git/` y nunca se pushea ni se comparte. No sirve para recuperar algo que solo existió en la copia de otra persona.
- Tiene una expiración (`gc.reflogExpire`, 90 días por defecto para commits alcanzables, 30 para los que no lo son) — no es un backup permanente, es una red de seguridad para errores recientes.
- Antes de cualquier operación que te dé miedo (`reset --hard`, `rebase`, `filter-branch`), un vistazo rápido a `git reflog` no hace falta — pero saber que existe cambia cómo se siente el riesgo: casi nada en Git es realmente irreversible en el corto plazo.
