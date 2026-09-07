---
title: Commits parciales y correcciones locales
description: Separar cambios con git add -p, corregir el último commit y preparar un historial limpio sin perder trabajo.
type: guides
order: 19
tags: [git, commits, staging, add-p, amend, fixup]
scope: git add -p / commit --amend / reset
related:
  - git/git/git-inspeccionar-cambios-historial
  - git/git/git-rebase-interactivo
  - git/git/git-deshacer-cambios
updatedAt: 2026-08-26
---

El staging no tiene que contener un archivo completo. Puedes seleccionar únicamente los bloques que pertenecen a un commit y dejar el resto para después. Esta práctica produce commits pequeños, fáciles de revisar y de revertir.

## Preparar por bloques

```bash
git add -p src/login.ts
```

Git muestra cada bloque y espera una respuesta:

| Tecla | Acción                            |
| ----- | --------------------------------- |
| `y`   | preparar este bloque              |
| `n`   | dejarlo fuera                     |
| `s`   | dividirlo en bloques más pequeños |
| `e`   | editar manualmente el parche      |
| `q`   | salir                             |

Después revisa el resultado:

```bash
git diff
git diff --staged
git commit -m "fix: validar el correo del formulario"
```

## Corregir el último commit

Si olvidaste un archivo o el mensaje tiene un error, corrige el staging y usa `--amend`:

```bash
git add src/login.test.ts
git commit --amend --no-edit
```

`--no-edit` conserva el mensaje. Si el commit ya fue publicado, modificarlo cambia su hash; coordina antes y, si corresponde, publica con `git push --force-with-lease`, nunca con un `--force` ciego.

## Crear commits de arreglo para rebase

Cuando trabajas en una rama compartida, un commit `fixup!` puede esperar hasta el final:

```bash
git add -p
git commit --fixup=<hash-del-commit-original>
git rebase -i --autosquash main
```

El rebase coloca el arreglo junto al commit original y marca la operación para combinarlo automáticamente. Haz esto solo en una rama cuya historia todavía pueda reescribirse.

## Si preparaste de más

```bash
git restore --staged src/archivo.ts
git reset HEAD src/archivo.ts       # alternativa equivalente
```

Ambos comandos quitan el archivo del staging, pero conservan sus cambios locales. No uses `git reset --hard` para “limpiar” sin comprobar antes el estado: descarta cambios y puede hacer más difícil recuperar trabajo.

## Regla práctica

Un commit debe responder a una sola idea: una corrección, una pieza de documentación o un refactor. Si necesitas escribir “y además” para describirlo, usa `git add -p` y sepáralo.
