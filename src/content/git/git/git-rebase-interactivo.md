---
title: Rebase interactivo — limpiar el historial
description: Combinar commits en uno solo, reordenarlos, editarlos o eliminarlos antes de abrir un Pull Request.
type: guides
order: 14
tags: [git, rebase, advanced]
scope: git rebase -i
related: [git/git/git-merge-vs-rebase]
updatedAt: 2026-08-16
---

El rebase interactivo abre una lista editable de los últimos N commits, y por cada uno decides qué hacer: dejarlo tal cual, combinarlo con el anterior, reescribir su mensaje, o borrarlo. Es la herramienta típica para llegar a un Pull Request con un historial legible, en vez de veinte commits tipo "wip", "fix typo", "arreglo de verdad".

## Arrancar un rebase interactivo

```bash
git rebase -i HEAD~5     # los últimos 5 commits
git rebase -i main        # todos los commits desde donde tu rama se separó de main
```

Se abre el editor configurado (ver [Configuración inicial](/git/git/git-configuracion-inicial)) con algo así:

```text
pick a1b2c3d agregar formulario de login
pick e4f5g6h fix typo
pick h7i8j9k agregar validación
pick k1l2m3n wip

# Comandos:
# p, pick = usar el commit tal cual
# r, reword = usar el commit, pero editar el mensaje
# e, edit = usar el commit, pero parar para modificarlo
# s, squash = combinar con el commit anterior, fusionando los mensajes
# f, fixup = como squash, pero descarta el mensaje de este commit
# d, drop = eliminar el commit
```

## Combinar commits (squash/fixup)

Cambiar `pick` por `squash` (o `fixup`) en un commit lo fusiona con el que está **arriba** de él en la lista:

```text
pick a1b2c3d agregar formulario de login
fixup e4f5g6h fix typo
pick h7i8j9k agregar validación
fixup k1l2m3n wip
```

Resultado: dos commits limpios en vez de cuatro. `fixup` descarta el mensaje del commit fusionado (asume que era algo menor, tipo "fix typo"); `squash` te deja editar un mensaje combinado de ambos.

## Reordenar commits

Simplemente cambia el orden de las líneas — Git los aplica en el orden en que aparecen en el archivo, de arriba hacia abajo.

## Editar un commit puntual

```text
pick a1b2c3d agregar formulario de login
edit e4f5g6h fix typo
pick h7i8j9k agregar validación
```

El rebase se detiene justo después de aplicar ese commit, dejándote en un estado donde puedes modificar archivos y hacer `git commit --amend`, y después seguir:

```bash
# ... hacer los cambios ...
git add .
git commit --amend --no-edit
git rebase --continue
```

## Si algo sale mal

```bash
git rebase --abort      # cancela todo, vuelve al estado de antes de empezar
git rebase --continue   # después de resolver un conflicto puntual, sigue con el resto
git rebase --skip       # salta el commit actual por completo (raro, úsalo con cuidado)
```

## Resumen

| Acción en el editor | Efecto |
| --- | --- |
| `pick` | Deja el commit igual |
| `reword` | Deja el commit, pide editar el mensaje |
| `edit` | Pausa el rebase en ese commit para modificarlo |
| `squash` | Fusiona con el anterior, combina mensajes |
| `fixup` | Fusiona con el anterior, descarta el mensaje |
| `drop` | Elimina el commit |

## Consideraciones

- Misma regla que el rebase normal: **nunca** rebasees (interactivo o no) una rama que otras personas ya bajaron — reescribe hashes y les rompe la sincronización.
- Si te perdiste en medio de un rebase interactivo complicado, `git rebase --abort` siempre vuelve al punto de partida sin pérdidas — no hay problema en cancelar y volver a intentar con calma.
- Es la herramienta correcta para limpiar tu propia rama de feature antes de un PR; no es para "arreglar" el historial de `main` después de que otros ya bajaron esos commits.
