---
title: Ramas — crear, cambiar, eliminar y renombrar
description: Una rama es solo un puntero a un commit. Crear, moverse entre ramas, publicarlas y limpiarlas cuando ya no hacen falta.
category: git
stack: git
order: 3
tags: [git, branches, basics]
scope: git branch / switch / checkout
updatedAt: 2026-08-16
---

Una rama no es una copia de archivos: es un puntero liviano a un commit puntual. Crear una rama es instantáneo porque no copia nada — solo agrega un nombre nuevo apuntando al commit donde estás parado.

## Crear y cambiar de rama

Desde Git 2.23, `switch` es el comando dedicado a cambiar de rama (antes todo pasaba por el más sobrecargado `checkout`, que sigue funcionando pero también hace otras cosas — ver la [guía de deshacer cambios](/guides/git-deshacer-cambios)).

```bash
git switch -c feature/login   # crea la rama Y se cambia a ella
git switch main                # volver a main
git switch -                   # volver a la rama anterior (como "cd -")

# Equivalente viejo, sigue siendo válido
git checkout -b feature/login
```

## Listar ramas

```bash
git branch              # ramas locales
git branch -r           # ramas remotas (las que existen en origin)
git branch -a           # todas
git branch -vv          # con el último commit y qué rama remota trackea cada una
```

## Renombrar una rama

```bash
git branch -m nombre-viejo nombre-nuevo   # desde otra rama
git branch -m nombre-nuevo                # estando parado en la rama a renombrar
```

Si la rama ya se publicó (existe en el remoto), renombrarla local no alcanza — hay que empujar la nueva y borrar la vieja del remoto (ver [Remotos](/guides/git-remotos)).

## Eliminar una rama

```bash
git branch -d feature/login    # solo si ya está mergeada (Git protege de perder trabajo)
git branch -D feature/login    # forzar, incluso sin mergear (perdés los commits que no estén en otra rama)
```

`-D` no es "más peligroso" que `-d` en el sentido de romper el repo — pero sí puede tirar commits que no existen en ningún otro lado, así que antes de forzar conviene confirmar con `git log feature/login` que no hay nada valioso ahí.

## Publicar una rama nueva

La primera vez que empujás una rama que no existe en el remoto, hace falta decirle a qué rama remota debe quedar asociada:

```bash
git push -u origin feature/login
```

`-u` (`--set-upstream`) configura el tracking: de ahí en adelante, `git push`/`git pull` sin argumentos saben a qué rama remota corresponde esta rama local.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git switch -c <rama>` | Crear una rama y cambiarse a ella |
| `git switch <rama>` | Cambiar de rama |
| `git branch` / `-a` | Listar ramas locales / todas |
| `git branch -d <rama>` | Eliminar rama (solo si ya está mergeada) |
| `git push -u origin <rama>` | Publicar una rama nueva y configurar el tracking |

## Consideraciones

- Antes de cambiar de rama, `git status` debe estar limpio (o los cambios ser compatibles con la rama destino) — si hay cambios sin commitear que chocan con archivos distintos en la otra rama, Git bloquea el `switch`. Ver [Stash](/guides/git-stash) para guardar cambios temporalmente sin commitear.
- El nombre de rama no tiene reglas mágicas, pero una convención típica ayuda a navegar proyectos grandes: `feature/algo`, `fix/algo`, `chore/algo`.
- `main` (o la rama principal del repo) casi nunca se edita directo en equipo — el flujo normal es rama nueva → cambios → Pull Request → merge (ver la [guía de gh CLI](/guides/gh-cli-pull-requests)).
