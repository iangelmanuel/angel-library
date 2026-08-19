---
title: Configuración inicial de Git
description: Lo primero que hay que configurar antes de usar Git en serio — identidad, editor, rama por defecto y aliases que ahorran tipeo.
category: git
stack: git
order: 1
tags: [git, config, setup]
scope: git config
updatedAt: 2026-08-16
---

Git guarda su configuración en capas: `--system` (toda la máquina, rara vez se toca), `--global` (tu usuario, la que más se usa) y `--local` (solo ese repo, pisa a las anteriores). Sin argumento, `git config` lee y escribe en `--local` si estás dentro de un repo.

## Identidad

Git firma cada commit con un nombre y un email — sin esto, ni siquiera te deja commitear.

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

Si un repositorio concreto necesita otro correo —por ejemplo, uno de trabajo separado del personal—, ejecuta el mismo comando sin `--global` dentro de ese repositorio. El valor local reemplaza al global solo allí.

## Rama por defecto

Desde Git 2.28, el nombre de la rama inicial es configurable. La mayoría de los proyectos hoy usa `main` en vez del viejo `master`.

```bash
git config --global init.defaultBranch main
```

## Editor por defecto

Este es el editor que Git abre para mensajes de commit largos, rebases interactivos y otras operaciones. Sin configuración, suele abrir Vim; si no se conoce su interfaz, puede ser difícil salir (`Esc` y después `:wq`).

```bash
git config --global core.editor "code --wait"    # VS Code
git config --global core.editor "nano"           # nano, más simple para empezar
```

## Ver la configuración actual

```bash
git config --list                # todo, con la capa que gana en cada clave
git config --list --show-origin  # igual, mostrando de qué archivo salió cada valor
git config user.email            # una clave puntual
```

## Aliases básicos

Un alias es un atajo dentro de Git mismo — `git st` en vez de `git status`. Se guardan en la sección `[alias]` de `~/.gitconfig`.

```bash
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.last "log -1 HEAD"
git config --global alias.lg "log --oneline --graph --decorate --all"
```

`lg` en particular es el más útil de esta lista: un historial compacto con la forma del árbol de ramas, en una sola línea por commit.

## Resumen

| Comando | Qué configura |
| --- | --- |
| `git config --global user.name/email` | Identidad para firmar commits |
| `git config --global init.defaultBranch main` | Nombre de la rama inicial en repos nuevos |
| `git config --global core.editor "..."` | Editor para mensajes largos y rebases |
| `git config --global alias.x "..."` | Atajos custom (`git x` en vez del comando completo) |
| `git config --list` | Ver toda la configuración activa |

## Consideraciones

- Todo esto queda en `~/.gitconfig` (texto plano) — se puede editar directo con un editor de texto en vez de correr comandos uno por uno.
- `--global` afecta a todos los repos de tu usuario en esa máquina; una config de trabajo vs personal se resuelve con `--local` en cada repo, o con `includeIf` en `.gitconfig` para aplicar configs distintas según la carpeta.
- Sin `user.name`/`user.email` configurados, el primer intento de commit falla con un mensaje que te pide configurarlos — no es un error real, es el chequeo esperado.
