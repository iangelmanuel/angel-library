---
title: El flujo básico — init, add, status, commit, log
description: El ciclo que se repite todo el tiempo — tres zonas (working tree, staging, historial) y los comandos que mueven cambios entre ellas.
category: git
stack: git
order: 2
tags: [git, basics, commits]
scope: git add / commit / status / log
updatedAt: 2026-08-16
---

Git piensa en tres zonas. Entender esto es entender el 80% de Git:

```text
working tree  →  staging (index)  →  historial (commits)
  (editas)        (git add)          (git commit)
```

El **working tree** son los archivos tal cual los ves en el editor. El **staging** (o "index") es una zona intermedia: ahí pones exactamente lo que va a entrar en el próximo commit, ni más ni menos. El **historial** son los commits ya hechos, permanentes (hasta que alguien reescriba el historial a propósito).

## Iniciar un repo

```bash
git init
```

Crea una carpeta oculta `.git/` — ahí vive todo el historial. Borrar esa carpeta es "dejar de ser un repo de Git" sin tocar ningún archivo real.

## Ver el estado

```bash
git status
```

El comando que más se corre en Git. Dice qué archivos cambiaron, cuáles están en staging y cuáles no, y sugiere el siguiente comando en cada caso — vale la pena correrlo seguido mientras se aprende.

## Mandar cambios a staging

```bash
git add archivo.ts        # un archivo puntual
git add carpeta/          # todo dentro directamente carpeta
git add .                 # todo lo que cambió desde el directorio actual
git add -p                # elegir interactivamente qué partes de cada archivo (por "hunk")
```

`git add -p` es muy útil cuando cambiaste varias cosas no relacionadas en el mismo archivo y quieres separarlas en commits distintos — muestra cada bloque de cambios y pregunta sí o no uno por uno.

## Commitear

```bash
git commit -m "mensaje corto y claro"
git commit                # abre el editor configurado para un mensaje más largo
git commit -am "mensaje"  # add + commit en un paso, SOLO para archivos ya trackeados (no nuevos)
```

`-am` es un atajo cómodo, pero solo agrega cambios a archivos que Git *ya* conoce — un archivo nuevo (`untracked`) necesita `git add` explícito una vez, sí o sí.

## Ver el historial

```bash
git log                              # historial completo, formato largo
git log --oneline                    # una línea por commit
git log --oneline --graph --all      # con la forma del árbol de ramas
git log -p archivo.ts                # historial de un archivo, con el diff de cada cambio
git log --author="nombre"            # filtrar por quién commiteó
```

## Ver diferencias

```bash
git diff                # working tree vs staging (lo que NO está agregado todavía)
git diff --staged       # staging vs último commit (lo que SÍ vas a commitear)
git diff HEAD~1 HEAD    # entre dos commits puntuales
```

La distinción entre `git diff` y `git diff --staged` es la que más confunde al principio: el primero muestra lo que falta agregar, el segundo lo que ya está listo para el próximo commit.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git init` | Convierte la carpeta actual en un repo Git |
| `git status` | Estado actual: qué cambió, qué está en staging |
| `git add <archivo\|.>` | Working tree → staging |
| `git commit -m "..."` | Staging → historial (crea un commit) |
| `git log --oneline --graph` | Ver el historial de forma compacta |
| `git diff` / `git diff --staged` | Ver cambios sin agregar / ya agregados |

## Errores comunes

- Confundir `git diff` con `git diff --staged` y no ver el cambio que se espera — cada uno mira una comparación distinta.
- `git commit -am` esperando que agregue archivos nuevos — no lo hace, solo actualiza los que ya estaban trackeados.
- Mensajes de commit como "fix" o "cambios" — un mensaje útil dice **qué** cambió y por qué, no que hubo un cambio (eso ya lo dice el diff).
