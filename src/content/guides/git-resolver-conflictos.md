---
title: Resolver conflictos de merge
description: Cómo se ven los marcadores de conflicto, el proceso paso a paso para resolverlos, y cómo abortar si algo sale mal.
category: git
stack: git
order: 9
tags: [git, merge, conflicts]
scope: conflictos de merge/rebase
related: [guides/git-merge-vs-rebase]
updatedAt: 2026-08-16
---

Un conflicto pasa cuando dos ramas modificaron **la misma línea** (o líneas muy cercanas) de un archivo de formas distintas, y Git no puede decidir solo cuál versión es la correcta. No es un error — es Git pidiendo ayuda para un caso que solo una persona puede resolver.

## Cómo se ve un conflicto

Al hacer `merge` (o `rebase`, `cherry-pick`), Git modifica el archivo en el lugar del conflicto con marcadores:

```text title="archivo.ts"
<<<<<<< HEAD
const saludo = "Hola";
=======
const saludo = "Hola, mundo";
>>>>>>> feature/saludo-completo
```

- Todo entre `<<<<<<< HEAD` y `=======` es tu versión (la rama en la que estás).
- Todo entre `=======` y `>>>>>>> <rama>` es la versión que se está trayendo.

## Resolver, paso a paso

1. `git status` — lista los archivos en conflicto (aparecen como "both modified").
2. Abrir cada archivo y decidir el resultado final: puede ser una de las dos versiones, o una combinación de ambas escrita a mano.
3. Borrar los tres marcadores (`<<<<<<<`, `=======`, `>>>>>>>`) — dejarlos rompe el código, no son sintaxis válida de nada.
4. `git add archivo.ts` — marca ese conflicto puntual como resuelto.
5. Repetir 2-4 para cada archivo listado en `git status`.
6. `git commit` (en un merge) o `git rebase --continue` (en un rebase) — sin argumentos, Git ya sabe que se trata de terminar el merge/rebase pendiente.

## Editores con ayuda visual

Escribir el diff a mano funciona, pero la mayoría de los editores (VS Code incluido) detectan los marcadores de conflicto y muestran botones tipo "Aceptar cambio actual" / "Aceptar cambio entrante" / "Aceptar ambos" — más rápido que editar el texto crudo para conflictos simples.

## Abortar si te confundiste

Si el conflicto se complicó más de lo que vale la pena, se puede volver atrás como si el merge/rebase nunca hubiera empezado:

```bash
git merge --abort      # durante un merge en conflicto
git rebase --abort     # durante un rebase en conflicto
git cherry-pick --abort  # durante un cherry-pick en conflicto
```

Cualquiera de los tres devuelve el repo exactamente a como estaba antes de intentar la operación — ningún cambio se pierde, porque nunca se llegó a confirmar nada.

## Ver ambas versiones completas mientras decidís

```bash
git diff              # muestra el conflicto en formato diff, con las tres secciones
git show :2:archivo.ts  # versión "nuestra" (HEAD) completa del archivo
git show :3:archivo.ts  # versión "de ellos" completa del archivo
```

## Resumen

| Paso | Comando |
| --- | --- |
| Ver qué está en conflicto | `git status` |
| Marcar un archivo como resuelto | `git add <archivo>` |
| Terminar el merge | `git commit` |
| Terminar el rebase | `git rebase --continue` |
| Cancelar todo, volver al estado anterior | `git merge --abort` / `git rebase --abort` |

## Consideraciones

- Un conflicto no significa que algo esté roto en el repo — es un estado esperado y temporal, se resuelve y se sigue.
- En un rebase con varios commits, un mismo archivo puede entrar en conflicto más de una vez (uno por cada commit que lo toque) — es normal repetir el ciclo resolver → `git add` → `git rebase --continue` varias veces seguidas.
- Antes de resolver "a lo rápido" eligiendo una versión entera sin leer la otra, vale la pena entender qué cambió cada lado — un conflicto mal resuelto no rompe Git, pero puede introducir un bug silencioso que Git no puede detectar por vos.
