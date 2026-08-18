---
title: Tags — versionar releases
description: Marcar un commit puntual como una versión — tags anotados vs lightweight, versionado semántico y cómo publicarlos.
category: git
stack: git
order: 10
tags: [git, tags, releases, versioning]
scope: git tag
updatedAt: 2026-08-16
---

Un tag es un puntero fijo a un commit puntual — a diferencia directamente rama, no se mueve solo cuando agregas commits nuevos. Sirve para marcar releases: "esto es exactamente lo que se publicó como v1.2.0".

## Dos tipos de tag

```bash
git tag v1.2.0                              # lightweight: solo un nombre apuntando a un commit
git tag -a v1.2.0 -m "Release 1.2.0"        # anotado: guarda autor, fecha y mensaje, como un mini-commit
```

Los tags **anotados** son los recomendados para releases reales — quedan en el historial como un objeto propio (con quién y cuándo lo creó), no solo un alias. Los lightweight son más para marcas rápidas y personales ("aquí probé algo").

## Versionado semántico (SemVer)

La convención más usada para nombrar tags de releases es `MAJOR.MINOR.PATCH`:

```text
v1.2.3
 │ │ └─ PATCH: fixes que no rompen nada (compatible)
 │ └─── MINOR: funcionalidad nueva, compatible con lo anterior
 └───── MAJOR: cambios que rompen compatibilidad
```

Un `1.2.3` → `1.2.4` debería ser seguro de actualizar sin leer el changelog. Un `1.x.x` → `2.0.0` avisa que algo puede requerir cambios en quien lo consume.

## Tagear un commit que no es el actual

```bash
git tag -a v1.0.0 <hash-del-commit> -m "Release 1.0.0"
```

Útil cuando te olvidaste de tagear en el momento y el HEAD ya avanzó desde entonces.

## Publicar tags al remoto

Los tags **no** se pushean automáticamente con `git push` — necesitan su propio comando.

```bash
git push origin v1.2.0        # un tag puntual
git push origin --tags         # todos los tags que todavía no están en el remoto
```

## Listar y ver tags

```bash
git tag                        # listar todos
git tag -l "v1.2.*"            # filtrar por patrón
git show v1.2.0                # ver el commit y el mensaje del tag anotado
```

## Eliminar un tag

```bash
git tag -d v1.2.0                    # local
git push origin --delete v1.2.0      # también en el remoto
```

## Resumen

| Comando | Qué hace |
| --- | --- |
| `git tag -a v1.0.0 -m "..."` | Crear un tag anotado en el commit actual |
| `git push origin --tags` | Publicar todos los tags nuevos |
| `git tag -l "patrón"` | Listar tags que matchean un patrón |
| `git tag -d <tag>` | Eliminar un tag local |

## Consideraciones

- En GitHub, crear un **Release** desde un tag (vía web o `gh release create`, ver [gh CLI](/guides/gh-cli-repos)) le agrega notas de la versión y archivos adjuntos — el tag es la base, el Release es la envoltura con más contexto alrededor.
- A diferencia directamente rama, un tag no se supone que reciba commits nuevos — si necesitas seguir trabajando sobre lo que un tag marcó, crea una rama desde ese tag: `git switch -c hotfix/v1.2.1 v1.2.0`.
