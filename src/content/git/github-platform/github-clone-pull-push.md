---
title: GitHub — clone, pull, fetch y push
description: Entender cómo traer, revisar y publicar cambios en un repositorio de GitHub sin confundir una copia local con la historia remota.
type: guides
order: 2
tags: [github, clone, pull, fetch, push, remotos]
scope: sincronización con GitHub
related:
  - git/git/git-remotos
  - git/github-platform/github-repositorio-local-remoto
updatedAt: 2026-08-26
---

La sincronización con GitHub tiene cuatro operaciones distintas. `clone` crea la copia inicial, `fetch` descarga referencias sin mezclar, `pull` descarga e integra y `push` publica commits que todavía solo existen localmente.

## Copiar un repositorio: `clone`

```bash
git clone https://github.com/USUARIO/PROYECTO.git
git clone --branch develop --single-branch <url> proyecto-develop
```

La primera forma crea una carpeta con el nombre del repositorio. La segunda descarga una rama concreta y puede ser útil para proyectos grandes, aunque no tendrás todas las ramas locales disponibles.

## Revisar antes de integrar: `fetch`

```bash
git fetch origin
git log --oneline --decorate HEAD..origin/main
git diff HEAD..origin/main
```

`fetch` actualiza referencias como `origin/main`, pero no cambia tu rama, archivos ni staging. Es el paso más seguro cuando quieres saber qué llegó antes de decidir cómo integrarlo.

## Traer cambios: `pull`

```bash
git switch main
git pull --ff-only origin main
```

`pull` combina `fetch` con una integración. `--ff-only` permite avanzar solo si no hay divergencia y falla en vez de crear un merge automático inesperado. Si tu equipo prefiere rebase:

```bash
git pull --rebase origin main
```

Antes de hacer pull, guarda o confirma tus cambios locales. Un working tree sucio puede impedir la operación o provocar conflictos difíciles de leer.

## Publicar cambios: `push`

```bash
git push
git push -u origin feature/perfil
git push origin main
```

La primera publicación de una rama usa `-u`; después `git push` sabe qué remoto y rama seguir. Si Git rechaza el push porque alguien publicó primero, actualiza tu rama, resuelve conflictos y vuelve a probar:

```bash
git fetch origin
git rebase origin/feature/perfil
git push
```

No uses `git push --force` sobre ramas compartidas. Si reescribiste una rama propia, `--force-with-lease` comprueba que el remoto siga en el estado que viste antes de reemplazarlo.

## Tabla mental

| Necesidad | Comando | ¿Modifica tu rama? |
| --- | --- | --- |
| obtener una copia inicial | `git clone` | crea una nueva carpeta |
| mirar lo nuevo del remoto | `git fetch` | no |
| traer e integrar lo nuevo | `git pull` | sí |
| publicar commits locales | `git push` | cambia el remoto |

La [documentación de GitHub sobre obtener cambios](https://docs.github.com/en/get-started/using-git/getting-changes-from-a-remote-repository) resume este mismo flujo.
