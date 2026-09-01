---
title: Inspeccionar cambios e historial en Git
description: Leer el estado, los diffs y el historial con suficiente contexto para revisar cambios antes de confirmarlos o compartirlos.
type: guides
order: 8
tags: [git, diff, log, historial, debugging]
scope: git status / diff / log / show / blame
related:
  - git/git/git-flujo-basico
  - git/git/git-remotos
updatedAt: 2026-08-26
---

Antes de ejecutar otro comando, conviene poder responder tres preguntas: qué cambió, qué está preparado para el próximo commit y qué ocurrió antes. `git status`, `git diff` y `git log` cubren casi toda esa inspección sin modificar archivos.

## Estado resumido

```bash
git status
git status --short --branch
```

La segunda forma usa dos caracteres por archivo: el de la izquierda representa el staging y el de la derecha el working tree. Por ejemplo, `M ` significa “modificado y preparado”, mientras que ` M` significa “modificado pero todavía no preparado”.

## Comparar working tree y staging

```bash
git diff                       # cambios todavía fuera del staging
git diff --staged              # cambios que entrarán al próximo commit
git diff HEAD                  # todo lo diferente al último commit
git diff --stat                # resumen de archivos y líneas
git diff -- archivo.ts         # limitar la revisión a un archivo
```

Revisar `git diff --staged` justo antes de `git commit` evita incluir credenciales, archivos temporales o cambios que pertenecían a otra tarea.

## Leer el historial

```bash
git log --oneline --decorate --graph --all
git log -5 --stat
git log --since="2 weeks ago" -- src/
git log -S"nombreDeFuncion" --oneline -- src/
```

`-S` encuentra commits que agregaron o quitaron una cadena exacta. Para buscar una expresión regular usa `-G`. Son útiles cuando sabes qué texto cambió, pero no recuerdas en qué commit.

## Entrar al detalle de un commit

```bash
git show --stat <commit>
git show <commit> -- src/app.ts
git show HEAD~1..HEAD
```

`git show` no cambia tu rama: solo presenta el commit y su diff. Si necesitas entender quién modificó cada línea, `git blame -L 20,45 src/app.ts` muestra el commit responsable y permite saltar después a `git show`.

## Checklist de revisión

1. Ejecuta `git status --short --branch`.
2. Revisa `git diff` y después `git diff --staged`.
3. Confirma que los archivos nuevos y eliminados sean intencionales.
4. Usa `git diff --check` para detectar espacios al final y errores comunes.
5. Commitea solo cuando el diff represente una unidad entendible.

`diff` observa; no sustituye a las pruebas. Después de inspeccionar, ejecuta las comprobaciones del proyecto antes de hacer push.
