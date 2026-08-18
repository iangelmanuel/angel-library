---
title: "SSH: llaves, conexión y configuración"
description: Generar un par de llaves SSH, copiarlas a un servidor, conectarse y guardar hosts en ~/.ssh/config.
category: terminal
stack: terminal
order: 20
tags: [terminal, ssh, herramientas, seguridad]
scope: ssh
related: [guides/terminal-linux-cli, guides/terminal-wsl]
updatedAt: 2026-08-17
---

## Generar un par de llaves

```bash
ssh-keygen -t ed25519 -C "email@ejemplo.com"
```

`-t ed25519` elige el algoritmo (ed25519 es el recomendado hoy, más rápido y seguro que RSA); `-C` es un comentario, normalmente el email, para identificar la llave después. El comando pide una ruta (Enter para la default) y opcionalmente una passphrase.

Por default, las llaves quedan en `~/.ssh/`:

- `~/.ssh/id_ed25519` — llave **privada**, nunca se comparte.
- `~/.ssh/id_ed25519.pub` — llave **pública**, esta es la que se copia a servidores.

Este comando funciona igual en Windows (PowerShell, con OpenSSH ya incluido en Windows 10/11), macOS y Linux.

## Copiar la llave pública a un servidor

### macOS / Linux

```bash
ssh-copy-id usuario@servidor
```

Agrega la llave pública al `~/.ssh/authorized_keys` del servidor remoto automáticamente.

### Windows (PowerShell)

`ssh-copy-id` no viene incluido nativamente. El equivalente manual:

```powershell
Get-Content ~/.ssh/id_ed25519.pub | ssh usuario@servidor "cat >> ~/.ssh/authorized_keys"
```

Lee el contenido de la llave pública local y lo agrega, vía `ssh`, al archivo `authorized_keys` del servidor.

## Conectarse

```bash
ssh usuario@host
```

Si la llave pública ya está en `authorized_keys` del servidor, no pide contraseña.

## `~/.ssh/config`: alias de hosts

En vez de recordar usuario, host y llave de cada servidor, un archivo `~/.ssh/config` permite darles un alias:

```
Host miservidor
    HostName 203.0.113.10
    User deploy
    IdentityFile ~/.ssh/id_ed25519
```

Con esto, conectarse es simplemente:

```bash
ssh miservidor
```

Este archivo funciona igual en Windows, macOS y Linux.

## Permisos de la llave privada

### macOS / Linux

SSH exige permisos restrictivos en la llave privada — si están demasiado abiertos, se niega a usarla:

```bash
chmod 600 ~/.ssh/id_ed25519
```

### Windows

El OpenSSH de Windows también valida permisos del archivo de llave privada. Si `ssh` falla con un error de permisos, el ajuste vía `icacls` (quitar herencia y dejar acceso solo al usuario actual):

```powershell
icacls "$env:USERPROFILE\.ssh\id_ed25519" /inheritance:r
icacls "$env:USERPROFILE\.ssh\id_ed25519" /grant:r "$($env:USERNAME):(R)"
```

## Consideraciones

- La llave **privada** nunca se comparte ni se sube a ningún repositorio — solo la `.pub` se copia a servidores o se pega en GitHub/GitLab.
- `~/.ssh/config` es útil incluso con un solo servidor: evita escribir `usuario@ip-larga-dificil-de-recordar` cada vez.
- Si SSH ignora una llave sin dar error claro, los permisos del archivo (Unix) o la ACL (Windows) son el primer sospechoso.
