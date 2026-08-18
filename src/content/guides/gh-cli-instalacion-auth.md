---
title: GitHub CLI — instalación y autenticación
description: Instalar gh y conectarlo con tu cuenta de GitHub — la base para todo lo demás (repos, PRs, issues) sin salir de la terminal.
category: git
stack: github
order: 16
tags: [git, github, gh, cli]
scope: gh auth
updatedAt: 2026-08-16
---

`gh` es la CLI oficial de GitHub — hace desde la terminal casi todo lo que hoy hacés clickeando en la web: crear repos, abrir Pull Requests, revisar issues, disparar workflows de Actions. No reemplaza a `git` (sigue siendo el que maneja commits, ramas, push/pull); `gh` cubre la parte de GitHub *como plataforma*, no la de Git como sistema de control de versiones.

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

Un flujo interactivo pregunta: GitHub.com o GitHub Enterprise, HTTPS o SSH, y cómo autenticar (navegador, o pegando un token generado a mano). La opción de navegador es la más simple para empezar — abre GitHub, confirmás, y listo.

## Ver el estado de la sesión

```bash
gh auth status
```

Muestra qué cuenta está activa y con qué protocolo (HTTPS/SSH) — útil para confirmar que quedó todo bien configurado, o para detectar que estás logueado con una cuenta distinta a la esperada (común si manejás una cuenta personal y una de trabajo).

## Cerrar sesión / cambiar de cuenta

```bash
gh auth logout
gh auth switch    # si tenés más de una cuenta autenticada
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
