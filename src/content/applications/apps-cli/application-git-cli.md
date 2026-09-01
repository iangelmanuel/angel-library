---
title: Git — instalación y flujo esencial desde la terminal
description: Instalar Git y aprender el flujo mínimo para registrar cambios, separar trabajo en ramas y sincronizar un proyecto local con un repositorio remoto.
type: guides
order: 1
tags: [git, cli, control-de-versiones, repositorios]
scope: git
website: https://git-scm.com
related:
  - git/git/git-mental-model-terminology
  - git/git/git-configuracion-inicial
  - git/git/git-flujo-basico
  - git/git/git-remotos
  - applications/apps-cli/gh-cli-instalacion-auth
updatedAt: 2026-08-28
---

**Git** es un sistema de control de versiones distribuido. Registra cambios como commits, permite crear ramas y conserva el historial completo del proyecto en cada clon. Es una herramienta local: puedes usar Git sin tener cuenta en GitHub, GitLab o Bitbucket.

GitHub es una plataforma que aloja repositorios Git. Por eso `git commit` funciona sin conexión, mientras que `git push` necesita un servidor remoto y un método de autenticación. Tampoco debe confundirse `git` con `gh`: Git administra el historial; GitHub CLI administra recursos de GitHub, como Pull Requests e Issues.

## Instalación

### Windows

El instalador oficial de [Git for Windows](https://git-scm.com/download/win) incluye Git, Git Bash y un administrador de credenciales. También puede instalarse desde una terminal:

```powershell
winget install --id Git.Git -e
```

Si ya utilizas Chocolatey:

```powershell
choco install git -y
```

Git Bash proporciona Bash y varias utilidades de Unix en Windows, pero Git también funciona desde PowerShell, Windows Terminal y la terminal integrada del editor.

### macOS

Al ejecutar Git por primera vez, macOS puede ofrecer instalar las **Command Line Tools** de Xcode:

```bash
git --version
```

Homebrew permite instalar una versión independiente que suele actualizarse con mayor rapidez:

```bash
brew install git
```

### Linux

Usa el gestor de paquetes de la distribución:

```bash
# Debian y Ubuntu
sudo apt update
sudo apt install git

# Fedora
sudo dnf install git

# Arch Linux
sudo pacman -S git
```

## Verificar la instalación

```bash
git --version
git --help
```

El primer comando confirma que el ejecutable está disponible en `PATH`. El segundo abre la ayuda general; `git help <comando>` o `git <comando> --help` muestra la referencia de una operación concreta.

## Configuración inicial

Todo commit almacena el nombre y correo de su autor. Estos valores no autentican una cuenta: forman parte de los metadatos del historial.

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
git config --global init.defaultBranch main
```

Comprueba qué configuración se aplica y desde qué archivo proviene:

```bash
git config --list --show-origin
```

La opción `--global` afecta al usuario de la máquina. Una configuración ejecutada sin `--global` dentro de un repositorio es local y puede reemplazarla, algo útil al separar identidades personal y laboral. La [configuración inicial de Git](/git/git/git-configuracion-inicial) explica editores, aliases y capas con más detalle.

## Dos formas de comenzar

Inicializa una carpeta que todavía no tiene historial:

```bash
mkdir mi-proyecto
cd mi-proyecto
git init
```

O descarga un repositorio que ya existe:

```bash
git clone https://github.com/organizacion/proyecto.git
cd proyecto
```

`git init` crea el directorio interno `.git`; no publica nada. `git clone` copia archivos, ramas, objetos y configuración del remoto `origin`.

## Flujo mínimo de trabajo

```bash
git status
git add src/app.ts
git diff --staged
git commit -m "feat: agrega validación de acceso"
```

1. `status` muestra el estado del directorio de trabajo y del área de preparación.
2. `add` selecciona el contenido que entrará en el próximo commit.
3. `diff --staged` permite revisarlo antes de guardar.
4. `commit` crea una instantánea con un mensaje que explica el cambio.

`git add` no sube archivos a internet. Solo copia su versión actual al **staging area**, también llamada índice. Si editas el archivo otra vez después de agregarlo, debes ejecutar `git add` nuevamente para incluir esa nueva versión.

## Ramas y sincronización

```bash
git switch -c feat/perfil
# realizar cambios y commits
git push -u origin feat/perfil
```

Una rama es un nombre móvil que apunta a un commit. `switch -c` crea una rama y cambia hacia ella. El primer `push -u` publica la rama y configura su rama ascendente; después suelen bastar `git push` y `git pull`.

```bash
git fetch origin
git pull --ff-only
git push
```

`fetch` descarga referencias sin modificar tus archivos. `pull` integra cambios remotos en la rama actual; `--ff-only` evita crear un merge automático inesperado. `push` envía commits locales que todavía no existen en el remoto.

## ¿Git necesita autenticación?

Las operaciones locales no. La autenticación aparece al leer o escribir un remoto privado, o al publicar cambios.

| Protocolo | Cómo se autentica | Cuándo conviene |
| --- | --- | --- |
| HTTPS | Administrador de credenciales, token o sesión configurada por `gh auth setup-git` | Inicio rápido y equipos con políticas HTTPS |
| SSH | Par de claves pública/privada registrado en la plataforma | Uso frecuente y varias operaciones sin pedir credenciales |

Nunca coloques un token dentro de la URL del remoto ni lo guardes en el repositorio. En GitHub, la contraseña de la cuenta no reemplaza un token para operaciones Git por HTTPS. La [guía de perfil y claves SSH](/git/github-profile/github-perfil-claves-ssh) y la [instalación de GitHub CLI](/applications/apps-cli/gh-cli-instalacion-auth) cubren ambos caminos.

## Comandos para recordar

| Comando | Resultado |
| --- | --- |
| `git init` | Convierte la carpeta actual en un repositorio |
| `git clone <url>` | Crea una copia local de un repositorio remoto |
| `git status` | Explica qué cambió y qué está preparado |
| `git add <ruta>` | Prepara contenido para el próximo commit |
| `git diff` | Compara cambios todavía no preparados |
| `git diff --staged` | Compara lo preparado contra el último commit |
| `git commit -m "mensaje"` | Guarda un commit local |
| `git switch -c <rama>` | Crea una rama y cambia hacia ella |
| `git log --oneline --graph --all` | Muestra un historial compacto con ramas |
| `git fetch` | Actualiza referencias remotas sin integrar cambios |
| `git pull --ff-only` | Actualiza la rama solo si admite avance rápido |
| `git push` | Publica commits en el remoto configurado |

## Errores habituales

- **`git: command not found`**: Git no está instalado o la terminal todavía no recibió el nuevo `PATH`; abre una sesión nueva.
- **Autor incorrecto**: revisa `git config user.email` dentro del repositorio, porque un valor local puede reemplazar al global.
- **`nothing to commit`**: no hay cambios nuevos preparados; consulta `git status` antes de repetir comandos.
- **`non-fast-forward` al hacer push**: el remoto contiene commits que tu rama no tiene. Ejecuta `git fetch`, inspecciona la diferencia e integra conscientemente antes de volver a publicar.
- **Archivos sensibles preparados**: quítalos del índice antes del commit y corrige `.gitignore`; añadirlos a `.gitignore después de confirmarlos no borra el historial.

Esta página sirve como instalación y recordatorio inicial. La categoría [Git & GitHub](/categories/git) desarrolla el modelo mental, conflictos, remotos, rebase, recuperación y colaboración.
