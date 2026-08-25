---
title: .gitignore — qué no versionar
description: Patrones para ignorar archivos, un .gitignore global para tu editor/SO, y qué hacer si algo que debía ignorarse ya quedó trackeado.
category: git
stack: git
order: 6
tags: [git, gitignore, config]
scope: .gitignore
updatedAt: 2026-08-16
---

`.gitignore` es un archivo de texto con patrones — cualquier archivo que matchee queda invisible para `git status`/`git add .`. No afecta archivos que **ya** están trackeados (eso tiene su propia solución, más abajo).

## Sintaxis básica

```text title=".gitignore"
node_modules/       # carpeta entera, en cualquier nivel
*.log                # cualquier archivo .log
.env                 # archivo puntual
.env.*                # .env.local, .env.production, etc.
!.env.example         # excepción: SÍ versionar este, aunque matchee un patrón anterior
dist/
/config.local.json    # el / al inicio ancla al root del repo (no cualquier config.local.json)
```

El orden importa cuando hay excepciones (`!patrón`): Git procesa el archivo de arriba hacia abajo, así que la excepción debe ir después del patrón que ignora.

## Qué va en `.gitignore` casi siempre

- Dependencias instaladas: `node_modules/`, `vendor/`
- Builds/output: `dist/`, `build/`, `.next/`, `.astro/`
- Secretos y config local: `.env`, `.env.local`
- Archivos del editor/SO: `.DS_Store`, `.vscode/` (a veces sí se versiona, según el equipo), `Thumbs.db`
- Logs y cachés: `*.log`, `.cache/`

## `.gitignore` global (para lo que no depende del proyecto)

Archivos del editor o del sistema operativo no son parte de ningún proyecto puntual — no tiene sentido repetirlos en el `.gitignore` de cada repo. Un `.gitignore` global los cubre una sola vez, para todos tus repos.

```bash
git config --global core.excludesfile ~/.gitignore_global
```

```text title="~/.gitignore_global"
.DS_Store
.vscode/
*.swp
```

## Si un archivo ya está trackeado

Agregarlo a `.gitignore` **no lo saca** del repo si Git ya lo estaba siguiendo desde antes — el patrón solo previene que se vuelva a agregar algo nuevo. Hay que destrackearlo explícitamente:

```bash
git rm --cached archivo-secreto.env   # lo saca del tracking, pero lo deja en el disco
git commit -m "dejar de trackear archivo-secreto.env"
```

Para una carpeta entera:

```bash
git rm -r --cached node_modules/
```

## Comprobar por qué un archivo se está ignorando (o no)

```bash
git check-ignore -v archivo.log
```

Muestra qué línea de qué `.gitignore` es la responsable — útil cuando un patrón "debería" estar ignorando algo y no está pasando.

## Resumen

| Comando / patrón | Qué hace |
| --- | --- |
| `carpeta/` | Ignora una carpeta completa |
| `*.ext` | Ignora por extensión |
| `!patrón` | Excepción a un patrón anterior |
| `git rm --cached <archivo>` | Destrackea un archivo que ya estaba en el repo |
| `git check-ignore -v <archivo>` | Diagnostica por qué (o por qué no) se ignora algo |

## Errores comunes

- Meter una contraseña o token en un `.env` sin `.gitignore` desde el primer commit — una vez pusheado a un remoto, está en el historial para siempre (o hasta reescribirlo, ver [reflog](/guides/git-reflog) para casos de recuperación, no de borrado de secretos: para eso hace falta reescribir historial con herramientas dedicadas).
- Pensar que agregar algo a `.gitignore` lo saca del repo — no, si ya estaba trackeado necesita `git rm --cached`.
- Patrones sin `/` al inicio matchean en cualquier profundidad de carpetas, no solo en la raíz — puede ignorar de más sin querer.
