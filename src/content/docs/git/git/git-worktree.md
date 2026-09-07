---
title: Git worktree — varias ramas en carpetas separadas
description: Trabajar con más de una rama al mismo tiempo sin clonar el repositorio varias veces ni guardar cambios a medias.
type: guides
order: 20
tags: [git, worktree, branches, productividad]
scope: git worktree
related:
  - git/git/git-ramas
  - git/git/git-stash
updatedAt: 2026-08-26
---

`git worktree` crea otra carpeta de trabajo conectada al mismo repositorio. Cada carpeta puede estar en una rama diferente, mientras el historial y los objetos Git se comparten. Es útil para corregir una incidencia urgente sin interrumpir una feature en progreso.

## Crear un worktree desde una rama nueva

Desde la carpeta principal del proyecto:

```bash
git worktree add ../mi-proyecto-hotfix -b hotfix/login main
```

Git crea la rama `hotfix/login`, cambia la carpeta nueva a esa rama y deja intacta la carpeta actual. Trabaja allí con normalidad:

```bash
cd ../mi-proyecto-hotfix
git status
```

Si la rama ya existe, omite `-b`:

```bash
git worktree add ../mi-proyecto-review feature/nueva-ui
```

## Listar y retirar worktrees

```bash
git worktree list
git worktree remove ../mi-proyecto-hotfix
git worktree prune
```

`remove` elimina la carpeta de trabajo y sus cambios no confirmados. Antes de usarlo, ejecuta `git status` y guarda o descarta conscientemente lo que quede allí. `prune` limpia registros de carpetas que ya fueron borradas por fuera de Git.

## Caso de uso: revisar un Pull Request

```bash
git fetch origin pull/42/head:review/pr-42
git worktree add ../review-pr-42 review/pr-42
```

Ahora puedes ejecutar pruebas en `../review-pr-42` mientras tu rama original conserva su estado. Al terminar, retira el worktree y borra la rama local si ya no la necesitas:

```bash
git worktree remove ../review-pr-42
git branch -D review/pr-42
```

## Restricciones importantes

- Una misma rama no puede estar activa en dos worktrees a la vez.
- Cada carpeta tiene su propio working tree y staging, pero comparten el repositorio Git.
- Los worktrees no reemplazan un remoto: para compartir commits todavía necesitas `git push`.
- Usa rutas vecinas claras y no guardes secretos específicos de un entorno dentro de una carpeta que vayas a compartir.

Para tareas puntuales, una rama nueva suele ser suficiente. `worktree` brilla cuando alternas con frecuencia entre una feature, un hotfix y una revisión.
