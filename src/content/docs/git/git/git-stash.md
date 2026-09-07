---
title: Stash — guardar cambios sin commitear
description: Guardar el trabajo en curso en una pila temporal para cambiar de rama limpio, y recuperarlo después exactamente como estaba.
type: guides
order: 10
tags: [git, stash, branches]
scope: git stash
updatedAt: 2026-08-16
---

`git stash` guarda todos los cambios sin commitear (working tree + staging) en una pila aparte, y deja el working tree limpio — como si nunca hubieras tocado nada. Sirve para el caso típico: estás en medio de algo, necesitas cambiar de rama urgente (un bug en producción, revisar un PR), y no quieres ni perder el trabajo ni hacer un commit a medio terminar solo para poder moverte.

## Guardar y recuperar

```bash
git stash                       # guarda todo, working tree queda limpio
git stash push -m "wip: login"  # con un mensaje descriptivo (recomendado si vas a acumular varios)
git stash pop                   # aplica el más reciente Y lo saca de la pila
git stash apply                 # aplica el más reciente pero lo DEJA en la pila (por si algo sale mal)
```

`pop` es el que se usa con más frecuencia. `apply` sirve cuando quieres aplicar el mismo stash en más de una rama o probar algo sin retirarlo todavía de la pila.

## Ver qué hay guardado

```bash
git stash list                  # todos los stashes, más reciente primero
git stash show -p stash@{0}     # el diff completo de uno puntual
```

Cada stash queda identificado como `stash@{0}`, `stash@{1}`, etc. — `0` siempre es el más reciente.

## Guardar solo una parte

```bash
git stash push -p               # elegir interactivamente qué hunks guardar (como git add -p)
git stash push archivo.ts       # solo un archivo puntual
```

## Incluir archivos nuevos (untracked)

Por default, `git stash` **no** toca archivos que todavía no fueron agregados nunca (`untracked`) — quedan tal cual en el working tree.

```bash
git stash -u     # incluye también los untracked
git stash -a     # incluye untracked Y los ignorados por .gitignore (raro, pero existe)
```

## Descartar un stash

```bash
git stash drop stash@{0}   # borra uno puntual
git stash clear             # borra todos
```

## Resumen

| Comando           | Qué hace                                             |
| ----------------- | ---------------------------------------------------- |
| `git stash`       | Guarda cambios sin commitear, limpia el working tree |
| `git stash pop`   | Aplica el stash más reciente y lo saca de la pila    |
| `git stash apply` | Aplica el más reciente, pero lo deja guardado        |
| `git stash list`  | Ver todos los stashes guardados                      |
| `git stash -u`    | Incluir también archivos nuevos (untracked)          |

## Consideraciones

- Un stash **no es un commit** y no se pushea — vive solo local, en tu copia del repo. Si necesitas compartir trabajo en progreso con alguien más, un commit (aunque sea con mensaje "wip") en una rama propia es mejor opción.
- `pop` puede generar conflictos si la rama cambió de forma incompatible con lo guardado — en ese caso, el stash **no se saca de la pila** hasta que resuelvas el conflicto y hagas `git stash drop` a mano.
- Varios stashes acumulados sin mensaje son difíciles de distinguir después — `git stash push -m "..."` cuesta poco y ahorra confusión.
