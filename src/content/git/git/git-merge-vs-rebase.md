---
title: Merge vs Rebase
description: Dos formas de integrar los cambios de una rama en otra — qué hace cada una con el historial y cuándo conviene elegirla.
type: guides
order: 11
tags: [git, merge, rebase, branches]
scope: git merge / git rebase
related: [git/git/git-rebase-interactivo, git/git/git-resolver-conflictos]
updatedAt: 2026-08-16
---

Ambos comandos resuelven el mismo problema — traer a tu rama los cambios que pasaron en otra — pero dejan el historial con una forma completamente distinta.

## `merge` — combina, conserva ambas historias

```bash
git switch main
git merge feature/login
```

Crea un **commit de merge** nuevo, con dos padres: el último commit de `main` y el último de `feature/login`. El historial conserva la forma real de lo ocurrido: se ve claramente dónde se separó la rama y dónde volvió a unirse.

```text
main:     A---B-------M
                     /
feature:      C---D-'
```

## `rebase` — reescribe, historial lineal

```bash
git switch feature/login
git rebase main
```

En vez de crear un commit de merge, `rebase` **reescribe** los commits de `feature/login` como si hubieran empezado desde el estado actual de `main` — mismos cambios, hashes de commit nuevos, historial resultante en línea recta.

```text
Antes:
main:     A---B
feature:       \
                C---D

Después de "git rebase main" en feature:
main:     A---B
                \
feature:         C'---D'
```

## Fast-forward: cuando ni hace falta elegir

Si `main` no tuvo ningún commit nuevo desde que se creó `feature/login`, un merge normal no necesita crear un commit de merge — simplemente mueve el puntero de `main` hacia adelante. Esto se llama **fast-forward** y pasa automáticamente con `git merge` cuando aplica.

```bash
git merge --no-ff feature/login   # fuerza un commit de merge aunque sea fast-forward posible
```

Muchos equipos usan `--no-ff` a propósito, para que quede registro explícito de que existió esa rama, incluso cuando técnicamente no hacía falta.

## Cuándo usar cada uno

- **`merge`** cuando el historial real (dónde se ramificó, cuándo se juntó) importa para el proyecto, o cuando la rama ya se compartió con otras personas (rebasear algo público reescribe hashes que otros ya tienen, y les rompe el historial local).
- **`rebase`** para limpiar tu propia rama de trabajo _antes_ de abrir un Pull Request — un historial lineal, sin commits de merge intermedios, es más fácil de leer en la revisión.

## La regla de oro

```text
Nunca rebasees una rama que otras personas ya bajaron.
```

Rebase cambia los hashes de cada commit reescrito. Si alguien más tiene esos commits (los bajó con `pull`), su copia local queda con un historial que ya no coincide con el tuyo — la próxima sincronización se vuelve un lío de commits duplicados o conflictos innecesarios. Rebasear tu propia rama de feature, todavía no compartida, es seguro siempre.

## Resumen

|                             | `merge`                     | `rebase`                       |
| --------------------------- | --------------------------- | ------------------------------ |
| Historial resultante        | Con ramificaciones visibles | Lineal                         |
| Crea commit nuevo           | Sí (el de merge)            | No — reescribe los existentes  |
| Hashes de commits           | Se conservan                | Cambian (son commits nuevos)   |
| Seguro en ramas compartidas | Sí                          | No                             |
| Uso típico                  | Integrar a `main`           | Limpiar tu rama antes de un PR |
