---
title: GitHub CLI — repositorios
description: Crear, clonar, forkear y ver repos desde la terminal — sin abrir el navegador para lo que se hace todos los días.
type: guides
order: 2
tags: [git, github, gh, cli]
scope: gh repo
related: [git/git/git-remotos]
updatedAt: 2026-08-16
---

## Crear un repo nuevo

```bash
gh repo create mi-proyecto --public
gh repo create mi-proyecto --private
gh repo create mi-proyecto --public --clone   # lo crea Y lo clona local en un paso
```

También funciona desde un proyecto que ya existe local, para publicarlo por primera vez:

```bash
cd mi-proyecto-existente
gh repo create --source=. --public --push   # crea el repo en GitHub y pushea lo que ya tenías
```

## Clonar

```bash
gh repo clone usuario/repo
```

Equivalente a `git clone https://github.com/usuario/repo.git`, pero más corto y usando la autenticación ya configurada — no hace falta armar la URL completa a mano.

## Forkear

```bash
gh repo fork usuario/repo --clone
```

Crea un fork en tu cuenta y lo clona local en un solo comando — el flujo típico para contribuir a un proyecto de otra persona sin permisos de escritura directos.

## Ver info de un repo

```bash
gh repo view                      # el repo del directorio actual
gh repo view usuario/repo         # cualquier repo público
gh repo view --web                # abrirlo en el navegador
```

## Listar tus repos

```bash
gh repo list                      # los tuyos
gh repo list usuario-u-org        # los de otra cuenta/organización
```

## Releases

```bash
gh release create v1.2.0 --title "v1.2.0" --notes "Notas de la versión"
gh release list
gh release view v1.2.0
```

Complementa a los [tags](/git/git/git-tags): el tag marca el commit, el Release le agrega notas, y opcionalmente archivos binarios adjuntos, visibles en la pestaña "Releases" de GitHub.

## Resumen

| Comando                                      | Qué hace                            |
| -------------------------------------------- | ----------------------------------- |
| `gh repo create <nombre> --public/--private` | Crea un repo nuevo en GitHub        |
| `gh repo clone usuario/repo`                 | Clona un repo existente             |
| `gh repo fork usuario/repo --clone`          | Fork + clone en un paso             |
| `gh repo view --web`                         | Abre el repo actual en el navegador |
| `gh release create <tag>`                    | Crea un Release a partir de un tag  |
