---
title: GitHub CLI — instalación y autenticación
description: Instalar la herramienta oficial de GitHub para usar repositorios, propuestas de cambio e incidencias desde la terminal; también aclara en qué se diferencia de Git.
type: guides
order: 6
tags: [git, github, gh, cli]
scope: gh auth
website: https://cli.github.com
related:
  - git/github/gh-cli-workflow-completo
  - git/github/gh-cli-repos
  - git/github/gh-cli-pull-requests
  - git/github/gh-cli-issues
updatedAt: 2026-08-28
---

`gh` es la CLI oficial de GitHub — hace desde la terminal casi todo lo que hoy haces clickeando en la web: crear repos, abrir Pull Requests, revisar issues, disparar workflows de Actions. No reemplaza a `git` (sigue siendo el que maneja commits, ramas, push/pull); `gh` cubre la parte de GitHub *como plataforma*, no la de Git como sistema de control de versiones.

## Instalación

```bash
# Windows (winget)
winget install --id GitHub.cli -e

# Windows (Scoop)
scoop install gh

# macOS
brew install gh

# Linux (ver https://github.com/cli/cli#installation según distro)
```

En Linux, usa el repositorio oficial indicado para la distribución en lugar de copiar un paquete de una fuente desconocida. Luego verifica:

```bash
gh --version
gh help
```

## Autenticarse

```bash
gh auth login
```

Un flujo interactivo pregunta: GitHub.com o GitHub Enterprise, HTTPS o SSH y cómo autenticar. La opción de navegador es la más simple para empezar: muestra un código de un solo uso, abre GitHub y almacena el token resultante en el administrador de credenciales del sistema cuando está disponible.

```bash
gh auth login --web --git-protocol https
gh auth setup-git
```

`setup-git` configura Git para utilizar GitHub CLI como administrador de credenciales en los hosts autenticados. El protocolo HTTPS usa credenciales; SSH usa claves. Elegir uno no cambia el contenido del repositorio, solo cómo te identificas ante el remoto.

## Ver el estado de la sesión

```bash
gh auth status
```

Muestra qué cuenta está activa y con qué protocolo (HTTPS/SSH) — útil para confirmar la configuración o detectar que iniciaste sesión con una cuenta distinta a la esperada (común si manejas una cuenta personal y otra de trabajo).

## Cerrar sesión / cambiar de cuenta

```bash
gh auth logout
gh auth switch    # si tienes más de una cuenta autenticada
```

## Autenticación no interactiva

En CI, contenedores o scripts, `gh` reconoce `GH_TOKEN` y `GITHUB_TOKEN`. No ejecutes `gh auth login` si el proceso no puede completar preguntas o abrir un navegador:

```bash
GH_TOKEN="$GH_TOKEN" gh repo view organizacion/proyecto
```

En GitHub Actions, asigna el token del job y limita sus permisos en el workflow. Para un token personal, concede solamente los repositorios y operaciones necesarios. No lo pases como argumento visible ni lo confirmes en `.env`.

## Repaso de uso

Dentro de un repositorio clonado, `gh` suele inferir `owner/repo` desde el remoto `origin`:

```bash
gh repo view --web
gh issue list
gh issue create
gh pr create --fill
gh pr status
gh pr checks
gh workflow list
gh run list
```

`--web` abre el recurso en el navegador. `--fill` reutiliza commits y metadatos para proponer el título y cuerpo de una Pull Request, pero debes revisarlos antes de publicarla.

También puedes crear y clonar repositorios:

```bash
gh repo create mi-proyecto --private --source=. --remote=origin --push
gh repo clone organizacion/proyecto
```

La primera orden crea un repositorio privado desde la carpeta actual y publica la rama. No la ejecutes hasta revisar que `.gitignore` excluya secretos, builds y archivos locales.

## Resumen

| Comando | Qué hace |
| --- | --- |
| `gh auth login` | Autentica la CLI con tu cuenta de GitHub |
| `gh auth status` | Muestra la cuenta activa y el método de autenticación |
| `gh auth logout` | Cierra la sesión actual |
| `gh auth switch` | Cambia entre cuentas ya autenticadas |
| `gh auth setup-git` | Conecta la autenticación HTTPS de Git con `gh` |
| `gh repo view` / `clone` / `create` | Consulta, clona o crea repositorios |
| `gh issue list` / `create` | Consulta o crea Issues |
| `gh pr create` / `status` / `checks` | Trabaja con Pull Requests |
| `gh run list` / `watch` | Consulta o sigue ejecuciones de Actions |

## Consideraciones

- `gh auth login` con HTTPS también configura el credential helper de Git — después de eso, `git push`/`git pull` por HTTPS dejan de pedir usuario/contraseña en cada operación, `gh` se encarga de eso también.
- El token que genera queda guardado localmente (no es tu contraseña de GitHub) — se puede revocar en cualquier momento desde la configuración de GitHub sin afectar tu cuenta.
- Si el almacén seguro no está disponible, `gh` puede recurrir a un archivo de texto. `gh auth status` informa dónde vive la credencial; protege los permisos de ese archivo.
- `gh` no reemplaza `git add`, `commit`, `fetch`, `merge` ni `push`. Su foco es la API y la experiencia de GitHub.
- Continúa con el [flujo completo de GitHub CLI](/git/github/gh-cli-workflow-completo) para repositorios, Issues, Pull Requests y Actions con más detalle.
