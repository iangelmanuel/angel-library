---
title: Deshacer el último commit conservando los cambios
description: Vuelve un commit atrás dejando los cambios en staging, listos para corregir o rehacer el commit.
type: commands
order: 21
tags: [git, commits, recovery]
command: git reset --soft HEAD~1
whenToUse: Acabas de hacer un commit (todavía sin push) y quieres corregirlo, partirlo en varios o cambiar el mensaje sin perder nada.
warnings:
  - "Si ya hiciste push, no reescribas el historial compartido: usa git revert en su lugar."
  - "--soft conserva staging; --mixed (default) lo deja en el working tree; --hard lo borra todo."
updatedAt: 2026-08-06
---

## Variantes según lo que necesites

```bash
# Cambios conservados EN STAGING (listos para recommitear)
git reset --soft HEAD~1

# Cambios conservados en el working tree (sin staging)
git reset --mixed HEAD~1

# Solo cambiar el mensaje del último commit
git commit --amend -m "mensaje corregido"
```

## Escenario real

> Hice commit de más: metí archivos que no iban.

1. `git reset --soft HEAD~1` → los cambios vuelven a staging.
2. `git restore --staged archivo-que-no-iba.ts` → lo sacas del commit.
3. `git commit -m "mensaje"` → recommiteas limpio.

## Recuperación de emergencia

Si borraste algo que no debías, casi todo se recupera con el reflog:

```bash
git reflog            # encuentra el hash del estado anterior
git reset --hard <hash>
```

## Comandos relacionados

- `git revert <hash>` — deshace un commit creando uno nuevo (seguro si ya hiciste push).
- `git commit --amend` — modifica el último commit sin crear otro.
