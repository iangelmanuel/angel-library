---
title: GitHub CLI — instalación y autenticación
description: Instalar gh y conectarlo con tu cuenta de GitHub — la base para todo lo demás (repos, PRs, issues) sin salir de la terminal.
category: git
stack: github
order: 1
tags: [git, github, gh, cli]
scope: gh auth
updatedAt: 2026-08-16
---

`gh` es la CLI oficial de GitHub — hace desde la terminal casi todo lo que hoy haces clickeando en la web: crear repos, abrir Pull Requests, revisar issues, disparar workflows de Actions. No reemplaza a `git` (sigue siendo el que maneja commits, ramas, push/pull); `gh` cubre la parte de GitHub *como plataforma*, no la de Git como sistema de control de versiones.

## Instalación

```bash
# Windows (winget)
winget install --id GitHub.cli

# Windows (Scoop)
scoop install gh

# macOS
brew install gh

# Linux (ver https://github.com/cli/cli#installation según distro)
```

## Autenticarse

```bash
gh auth login
```

Un flujo interactivo pregunta: GitHub.com o GitHub Enterprise, HTTPS o SSH y cómo autenticar (navegador o un token generado manualmente). La opción de navegador es la más simple para empezar — abre GitHub, confirmas y termina el proceso.

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

## Resumen

| Comando | Qué hace |
| --- | --- |
| `gh auth login` | Autentica la CLI con tu cuenta de GitHub |
| `gh auth status` | Muestra la cuenta activa y el método de autenticación |
| `gh auth logout` | Cierra la sesión actual |
| `gh auth switch` | Cambia entre cuentas ya autenticadas |

## Consideraciones

- `gh auth login` con HTTPS también configura el credential helper de Git — después de eso, `git push`/`git pull` por HTTPS dejan de pedir usuario/contraseña en cada operación, `gh` se encarga de eso también.
- El token que genera queda guardado localmente (no es tu contraseña de GitHub) — se puede revocar en cualquier momento desde la configuración de GitHub sin afectar tu cuenta.
