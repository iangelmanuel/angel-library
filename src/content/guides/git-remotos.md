---
title: Remotos — push, pull, fetch y tracking
description: Cómo tu repo local se conecta con GitHub — origin, la diferencia real entre fetch y pull, y qué es una rama "tracking".
category: git
stack: git
order: 4
tags: [git, remote, push, pull]
scope: git remote / push / pull / fetch
updatedAt: 2026-08-16
---

Un "remoto" es simplemente una URL con nombre — una referencia a otra copia del repo (casi siempre en GitHub). El nombre por defecto del remoto principal es `origin`, por convención, no porque sea especial para Git.

## Conectar un remoto

```bash
git remote add origin https://github.com/usuario/repo.git
git remote -v                        # ver los remotos configurados (fetch y push por separado)
git remote set-url origin <nueva-url>  # cambiar la URL (por ejemplo, de HTTPS a SSH)
```

## Clonar un repo existente

```bash
git clone https://github.com/usuario/repo.git
git clone https://github.com/usuario/repo.git mi-carpeta   # con nombre de carpeta custom
```

`clone` hace tres cosas en un paso: descarga todo el historial, crea el remoto `origin` apuntando a esa URL, y deja parado en la rama por defecto — es lo mismo que `init` + `remote add` + `fetch` + `switch`, junto.

## `fetch` vs `pull`

Esta es la distinción que más confunde al principio:

```bash
git fetch origin    # descarga los commits nuevos del remoto, pero NO toca tu working tree
git pull origin main # fetch + merge (o rebase) automático sobre la rama actual
```

`fetch` es siempre seguro: solo actualiza tu conocimiento de "qué hay en el remoto" (`origin/main`), sin mezclar nada con tu trabajo. `pull` da un paso más: intenta integrar esos cambios nuevos a tu rama actual ahí mismo. Si preferís revisar qué llegó antes de mezclarlo, `git fetch` + `git log origin/main` + `git merge origin/main` (a mano) da el mismo resultado que `pull`, pero con un chequeo en el medio.

## `pull` con rebase en vez de merge

Por defecto, `git pull` mergea. Muchos equipos prefieren que rebasee en su lugar, para mantener el historial lineal (ver [Merge vs rebase](/guides/git-merge-vs-rebase)):

```bash
git pull --rebase
git config --global pull.rebase true   # que sea el default siempre
```

## Empujar cambios

```bash
git push                    # a la rama tracking configurada
git push origin main        # explícito: remoto + rama
git push -u origin feature/x  # primera vez que se publica esa rama (configura el tracking)
```

## Ver a qué rama remota está trackeando cada rama local

```bash
git branch -vv
```

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git remote add origin <url>` | Conecta el repo local con uno remoto |
| `git clone <url>` | Descarga un repo remoto entero, ya conectado |
| `git fetch` | Descarga cambios del remoto sin tocar tu working tree |
| `git pull` | `fetch` + integra los cambios en tu rama actual |
| `git push` | Sube tus commits locales al remoto |

## Consideraciones

- `git push` falla ("rejected") si el remoto tiene commits que vos no tenés local — significa que alguien más pusheó primero. La solución normal es `git pull` (integrar lo del remoto) y recién ahí volver a pushear, no forzar.
- `git push --force` reescribe el historial remoto — puede borrar commits de otras personas si no coordinás. `git push --force-with-lease` es la versión más segura: falla si el remoto tiene commits que vos no viste, en vez de pisarlos a ciegas.
- HTTPS pide usuario/contraseña (o un token) en cada operación salvo que uses un credential helper; SSH usa una clave configurada una vez. Para uso diario, SSH evita reautenticarse todo el tiempo.
