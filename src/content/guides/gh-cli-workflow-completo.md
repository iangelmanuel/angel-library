---
title: Flujo completo — desde una rama nueva hasta el merge
description: Todo lo de esta sección, encadenado en el orden real en que se usa — desde crear la rama hasta borrarla después de mergear el PR.
category: git
stack: github
order: 5
tags: [git, github, gh, cli, workflow]
scope: flujo git + gh
related:
  - guides/git-ramas
  - guides/gh-cli-pull-requests
  - guides/git-rebase-interactivo
updatedAt: 2026-08-16
---

Cada guía anterior de esta sección explica un comando o concepto aislado. Esta junta todo en el orden real en que se usan, de punta a punta, para una feature chica típica.

## 1. Partir de `main` actualizado

```bash
git switch main
git pull
```

Nunca crees una rama desde una copia antigua de `main`: evitarás conflictos innecesarios causados únicamente por trabajar sobre una base desactualizada.

## 2. Crear la rama de trabajo

```bash
git switch -c feature/recordar-sesion
```

Ver [Ramas](/guides/git-ramas) para más sobre convenciones de nombres.

## 3. Trabajar en ciclos cortos de commit

```bash
git add .
git commit -m "agregar checkbox de recordar sesión"
# ... seguir trabajando ...
git add .
git commit -m "persistir la preferencia en localStorage"
```

No hace falta que cada commit sea perfecto — eso se limpia en el paso 5, antes de abrir el PR.

## 4. Publicar la rama

```bash
git push -u origin feature/recordar-sesion
```

## 5. (Opcional) Limpiar el historial antes del PR

```bash
git rebase -i main
```

Combinar commits intermedios tipo "wip" o "fix typo" en algo legible — ver [Rebase interactivo](/guides/git-rebase-interactivo). Si el historial ya está limpio, se salta este paso.

```bash
git push --force-with-lease   # necesario después de reescribir con rebase
```

## 6. Abrir el Pull Request

```bash
gh pr create --fill
```

Ver [gh CLI — Pull Requests](/guides/gh-cli-pull-requests) para variantes (`--draft`, `--base`, etc.).

## 7. Seguir el estado de los checks

```bash
gh pr checks
```

## 8. Atender comentarios de revisión

```bash
# ... hacer los cambios pedidos ...
git add .
git commit -m "atender comentarios de revisión"
git push
```

El PR se actualiza solo con cada push a la misma rama — no hace falta ningún comando extra de `gh` para eso.

## 9. Mergear

```bash
gh pr merge --squash --delete-branch
```

`--delete-branch` borra la rama remota automáticamente después de mergear — un paso menos que acordarse de limpiar después.

## 10. Actualizar tu copia local

```bash
git switch main
git pull
git branch -d feature/recordar-sesion    # la rama local también, ya no hace falta
```

## Resumen del ciclo completo

```bash
git switch main && git pull
git switch -c feature/nombre
# ... commits ...
git push -u origin feature/nombre
gh pr create --fill
# ... revisión, ajustes ...
gh pr merge --squash --delete-branch
git switch main && git pull && git branch -d feature/nombre
```

## Consideraciones

- Este flujo asume un equipo chico/mediano con `main` protegida y merge vía PR — proyectos con reglas más estrictas (revisión obligatoria de N personas, checks de CI bloqueantes) siguen el mismo esqueleto, solo con más pasos de espera entre el 6 y el 9.
- Si en el paso 1 `git pull` trae conflictos incluso antes de empezar la rama nueva, eso es una señal de que tu `main` local estaba desactualizada hace rato — vale la pena resolver eso primero, antes de ramificar sobre una base rota.
