---
title: GitHub CLI — Pull Requests
description: Crear, revisar, mergear y navegar Pull Requests sin salir de la terminal — el flujo que más tiempo ahorra de toda la CLI.
type: guides
order: 3
tags: [git, github, gh, cli, pull-requests]
scope: gh pr
related: [git/git/git-ramas, git/github/gh-cli-workflow-completo]
updatedAt: 2026-08-16
---

Esta es, en la práctica, la parte de `gh` que más se usa día a día — todo el ciclo de un Pull Request sin cambiar de ventana al navegador.

## Crear un PR

```bash
gh pr create
```

Modo interactivo: pregunta título, descripción, rama base — y ofrece completar la descripción con el resumen de los commits. Para saltear las preguntas:

```bash
gh pr create --title "Agregar login" --body "Implementa el formulario de login con validación." --base main
gh pr create --fill    # usa el mensaje del último commit como título/descripción, sin preguntar nada
gh pr create --draft   # como borrador, sin pedir review todavía
```

Requiere haber ejecutado `git push` para la rama antes; si falta, `gh pr create` lo detecta y ofrece publicarla por ti.

## Listar y ver PRs

```bash
gh pr list                     # PRs abiertos del repo actual
gh pr list --state all         # incluye cerrados y mergeados
gh pr view 42                  # ver un PR puntual por número
gh pr view                     # el PR asociado a la rama actual, si existe
gh pr view --web                # abrirlo en el navegador
```

## Revisar un PR de otra persona

```bash
gh pr checkout 42     # trae la rama de ese PR y te cambia a ella local, lista para probar
gh pr diff 42          # ver el diff completo sin cambiar de rama
```

`gh pr checkout` es el comando que más simplifica revisar código ajeno — sin esto, habrea que agregar el fork como remoto a mano y hacer fetch/checkout manualmente.

## Comentar y aprobar

```bash
gh pr review 42 --approve
gh pr review 42 --request-changes --body "Falta manejar el error 404"
gh pr comment 42 --body "¿Probaste esto en mobile?"
```

## Mergear

```bash
gh pr merge 42                    # pregunta el método (merge/squash/rebase)
gh pr merge 42 --squash            # combina todos los commits del PR en uno
gh pr merge 42 --squash --delete-branch  # y borra la rama después de mergear
```

`--squash` es la opción más común en equipos que quieren un commit por PR en `main`, sin importar cuántos commits intermedios tuvo la rama mientras se trabajaba.

## Estado de los checks (CI)

```bash
gh pr checks 42
```

Muestra el resultado de cada check configurado (tests, lint, build) — útil para ver de un vistazo si un PR está listo para mergear sin entrar a la web.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `gh pr create --fill` | Crea un PR usando el mensaje del último commit |
| `gh pr list` | Lista PRs abiertos |
| `gh pr checkout <número>` | Trae la rama de ese PR para probarla local |
| `gh pr review <número> --approve` | Aprueba el PR |
| `gh pr merge <número> --squash` | Mergea combinando todos los commits en uno |
| `gh pr checks <número>` | Ver el estado de CI de ese PR |

## Consideraciones

- `gh pr create` sin `--base` usa la rama por defecto del repo (normalmente `main`) — si el PR necesita apuntar a otra rama, especificarlo explícito evita abrirlo contra la equivocada.
- Después de `gh pr checkout`, volver a tu rama de trabajo es un `git switch -` normal — no hay nada especial que "deshacer" del checkout de un PR ajeno.
