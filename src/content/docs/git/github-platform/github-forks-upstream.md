---
title: GitHub — forks, upstream y contribuciones
description: Trabajar en un repositorio donde no tienes permisos de escritura usando un fork, dos remotos y una Pull Request.
type: guides
order: 3
tags: [github, fork, upstream, pull-request, open-source]
scope: colaboración entre repositorios
related:
  - git/github-platform/github-clone-pull-push
  - git/repository-management/git-colaboracion-pull-requests
  - git/repository-management/repository-issues-planning
updatedAt: 2026-08-26
---

Una rama vive dentro de un repositorio; un **fork** es otro repositorio conectado al original. El fork te da un espacio donde puedes publicar cambios sin permiso de escritura en el proyecto original, llamado `upstream`.

## Configurar el flujo

1. En GitHub, crea un fork del repositorio original.
2. Clona tu fork, que será `origin`.
3. Añade el repositorio original como `upstream`.

```bash
git clone https://github.com/TU-USUARIO/proyecto.git
cd proyecto
git remote add upstream https://github.com/ORGANIZACION/proyecto.git
git remote -v
```

Una convención clara es: `origin` = tu fork, `upstream` = proyecto original. No los intercambies: el push normal debe ir a tu fork.

## Mantener tu fork actualizado

```bash
git switch main
git fetch upstream
git switch main
git merge --ff-only upstream/main
git push origin main
```

Si el equipo trabaja con rebase y tu `main` local no se comparte, también puedes usar `git rebase upstream/main`. No reescribas una rama en la que otra persona esté trabajando.

## Proponer un cambio

```bash
git switch -c fix/documentacion
# editar archivos, probar y confirmar
git add README.md
git commit -m "docs: aclarar instalación"
git push -u origin fix/documentacion
```

Después abre una Pull Request desde `TU-USUARIO:fix/documentacion` hacia `ORGANIZACION:main`. Describe el problema, la solución, cómo verificaste el cambio y cualquier limitación. Si el repositorio lo permite, activa “Allow edits and access to secrets by maintainers” solo cuando entiendas sus implicaciones, especialmente si la rama contiene workflows.

## Sincronizar durante la revisión

```bash
git fetch upstream
git switch fix/documentacion
git rebase upstream/main
git push --force-with-lease origin fix/documentacion
```

Si el rebase no es necesario, puedes integrar `upstream/main` con merge. Elige una estrategia compatible con las reglas del proyecto y explica los conflictos en la PR.

Un fork no es una copia abandonada: conserva su relación con el original y puede sincronizarse desde GitHub o desde Git. Consulta la [guía oficial de forks](https://docs.github.com/en/pull-requests/how-tos/work-with-forks).
