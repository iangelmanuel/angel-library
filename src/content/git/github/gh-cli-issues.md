---
title: GitHub CLI — Issues
description: Crear, listar, comentar y cerrar issues desde la terminal, y cómo conectarlos automáticamente a un Pull Request.
type: guides
order: 4
tags: [git, github, gh, cli, issues]
scope: gh issue
updatedAt: 2026-08-16
---

## Crear un issue

```bash
gh issue create
gh issue create --title "Bug: el login falla en Safari" --body "Descripción del problema..."
```

Modo interactivo (sin flags) pregunta título y cuerpo, y ofrece asignarle labels/assignees desde el mismo prompt.

## Listar

```bash
gh issue list                       # abiertos del repo actual
gh issue list --state all           # incluye cerrados
gh issue list --assignee @me        # solo los tuyos
gh issue list --label bug           # filtrar por label
```

## Ver un issue puntual

```bash
gh issue view 15
gh issue view 15 --web    # abrirlo en el navegador
```

## Comentar

```bash
gh issue comment 15 --body "Puedo reproducirlo también en Firefox"
```

## Cerrar / reabrir

```bash
gh issue close 15
gh issue close 15 --comment "Resuelto en v1.2.1"
gh issue reopen 15
```

## Conectar un issue con el commit/PR que lo resuelve

GitHub cierra issues automáticamente si el mensaje de un commit (mergeado a la rama principal) o la descripción de un PR incluye una palabra clave seguida del número:

```text
Fixes #15
Closes #15
Resolves #15
```

```bash
git commit -m "arreglar validación de email

Fixes #15"
```

Al mergear el PR que contiene ese commit, el issue #15 se cierra solo — sin tener que acordarse de cerrarlo a mano.

## Resumen

| Comando                           | Qué hace                                   |
| --------------------------------- | ------------------------------------------ |
| `gh issue create`                 | Crea un issue (interactivo o con flags)    |
| `gh issue list --assignee @me`    | Lista tus issues asignados                 |
| `gh issue close <número>`         | Cierra un issue                            |
| `Fixes #<número>` en un commit/PR | Cierra el issue automáticamente al mergear |

## Consideraciones

- `--assignee @me` es un atajo que evita tener que escribir tu propio usuario de GitHub — funciona en cualquier comando de `gh` que acepte filtrar por asignado.
- El cierre automático con `Fixes #N` solo pasa al mergear a la rama por defecto del repo — un commit con esa palabra en una rama de feature todavía sin mergear no cierra nada todavía.
