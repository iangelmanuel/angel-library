---
title: Cherry-pick — traer un commit puntual
description: Aplicar un commit específico de otra rama sin traer el resto de su historial — para fixes urgentes y backports.
category: git
stack: git
order: 15
tags: [git, cherry-pick, advanced]
scope: git cherry-pick
updatedAt: 2026-08-16
---

`cherry-pick` toma un commit puntual de cualquier rama y lo aplica sobre la rama actual, como un commit nuevo (con hash distinto). A diferencia de `merge`, no trae el resto de los commits de esa rama — solo el que elegiste.

## Caso de uso típico

Un fix urgente se hizo en `feature/nueva-ui` (todavía no lista para mergear entera), pero ese fix puntual también hace falta ya en `main` — sin esperar a que el resto de la feature esté terminada.

```bash
git switch main
git cherry-pick <hash-del-commit>
```

## Encontrar el hash a traer

```bash
git log feature/nueva-ui --oneline    # buscar el commit en el historial de esa rama
```

## Traer varios commits

```bash
git cherry-pick hash1 hash2 hash3        # commits puntuales, en ese orden
git cherry-pick hash1^..hash3            # un rango: de hash1 hasta hash3 inclusive
```

## Si hay conflicto

Igual que en un merge o rebase — Git para, deja los marcadores de conflicto en los archivos afectados (ver [Resolver conflictos](/guides/git-resolver-conflictos)):

```bash
# resolver los archivos en conflicto, después:
git add archivo-resuelto.ts
git cherry-pick --continue

# o cancelar todo:
git cherry-pick --abort
```

## Sin crear un commit todavía

```bash
git cherry-pick -n <hash>    # aplica los cambios al working tree/staging, sin commitear
```

Útil cuando quieres combinar el cherry-pick con otros cambios antes de commitear todo junto.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git cherry-pick <hash>` | Aplica ese commit puntual sobre la rama actual |
| `git cherry-pick hash1 hash2` | Aplica varios commits, en orden |
| `git cherry-pick -n <hash>` | Aplica los cambios sin crear el commit todavía |
| `git cherry-pick --continue` / `--abort` | Seguir tras resolver un conflicto / cancelar todo |

## Consideraciones

- El commit resultante tiene un **hash distinto** al original — es un commit nuevo, aunque el contenido sea el mismo. Git no los relaciona automáticamente; si más adelante fusionas las dos ramas completas, puede aparecer como un cambio "duplicado" que hay que revisar con cuidado.
- Para un solo fix puntual que necesita estar en dos ramas, cherry-pick es más simple que un merge parcial. Para traer varios commits relacionados, evaluar si conviene directamente mergear o rebasear la rama entera en su lugar.
