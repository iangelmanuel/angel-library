---
title: Firmar commits — el distintivo Verified
description: Por qué el autor de un commit no prueba nada, cómo firmar con la clave SSH que ya tienes, verificar en local y activar el modo vigilante en GitHub.
category: git
stack: github-profile
order: 4
tags: [github, git, firma, seguridad, ssh, gpg]
scope: firma y verificación de commits
related:
  - guides/github-perfil-claves-ssh
  - guides/git-configuracion-inicial
  - guides/repository-rules-security
updatedAt: 2026-08-26
---

El autor de un commit es simplemente texto que Git copia de tu configuración. Nada lo comprueba:

```bash
git config user.name "Linus Torvalds"
git config user.email "torvalds@linux-foundation.org"
git commit -m "un commit que no escribió Linus"
```

Ese commit queda en el historial con su nombre. Si lo subes a un repositorio donde ese correo está verificado, incluso aparecería en el gráfico de contribuciones de otra persona.

**Firmar un commit** resuelve exactamente eso: añade una firma criptográfica que demuestra que salió de una máquina con tu clave privada. GitHub la comprueba y muestra el distintivo **Verified**.

## Firmar con la clave SSH que ya tienes

Desde Git 2.34 puedes firmar con SSH, sin instalar GPG ni gestionar un segundo par de claves. Comprueba la versión primero:

```bash
git --version
```

Configura los tres ajustes:

```bash
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
```

| Ajuste | Qué hace |
| --- | --- |
| `gpg.format ssh` | Usa SSH en vez de GPG como formato de firma |
| `user.signingkey` | Ruta a la clave **pública** con la que firmar |
| `commit.gpgsign true` | Firma todos los commits sin tener que pasar `-S` cada vez |

El nombre `commit.gpgsign` es histórico: se llama así también cuando el formato es SSH.

Para firmar además las etiquetas:

```bash
git config --global tag.gpgsign true
```

En Windows, la ruta se escribe con el formato que entiende Git:

```bash
git config --global user.signingkey "C:/Users/TU-USUARIO/.ssh/id_ed25519.pub"
```

## Registrar la clave como clave de firma

Este es el paso que casi todo el mundo se salta. En GitHub, una clave SSH de **autenticación** y una de **firma** son entradas distintas, aunque el archivo sea el mismo.

Ve a **Settings → SSH and GPG keys → New SSH key** y añade otra vez el contenido de `id_ed25519.pub`, esta vez con el tipo **Signing Key**.

```bash
gh ssh-key add ~/.ssh/id_ed25519.pub --type signing --title "Firma — portátil trabajo"
```

Sin este registro los commits salen firmados desde tu equipo, pero GitHub los muestra como **Unverified**: tiene la firma y no tiene con qué comprobarla.

## Verificar en local

Para que `git` valide firmas en tu propia máquina necesita saber qué claves considera de confianza. Ese es el archivo `allowed_signers`:

```bash
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
echo "tu@correo.com namespaces=\"git\" $(cat ~/.ssh/id_ed25519.pub)" >> ~/.ssh/allowed_signers
```

En PowerShell:

```powershell
git config --global gpg.ssh.allowedSignersFile "$env:USERPROFILE/.ssh/allowed_signers"
"tu@correo.com namespaces=`"git`" $(Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub)" |
  Add-Content $env:USERPROFILE\.ssh\allowed_signers
```

El correo debe coincidir con el de `user.email`. Ahora puedes comprobar el historial:

```bash
git log --show-signature -1
git log --format="%h %G? %an %s" -5
```

`%G?` devuelve una letra por commit:

| Letra | Significado |
| --- | --- |
| `G` | Firma válida |
| `B` | Firma incorrecta |
| `U` | Válida, pero la clave no es de confianza |
| `N` | Sin firma |

Sin `allowedSignersFile` verás `N` incluso en commits que sí están firmados: Git no tiene contra qué contrastarlos.

## Los tres estados en GitHub

| Estado | Qué significa |
| --- | --- |
| **Verified** | Firma válida y el correo del commit pertenece a la cuenta |
| **Partially verified** | Firma válida, pero algún dato no coincide del todo |
| **Unverified** | Hay firma y no se puede validar: clave no registrada, o registrada solo como autenticación |

Los commits creados desde la interfaz web de GitHub —editar un archivo, aplicar una sugerencia, hacer merge desde el botón— los firma GitHub con su propia clave y aparecen como verificados sin que hagas nada.

## Modo vigilante

Por defecto un commit sin firma no muestra ningún distintivo, así que un observador no distingue entre *no firmado* y *falsificado*.

En **Settings → SSH and GPG keys** puedes activar **Flag unsigned commits as unverified**: a partir de ahí todo commit tuyo sin firmar se marca explícitamente como **Unverified**.

Actívalo cuando ya firmes de forma consistente en todos tus equipos. Si lo activas antes, el trabajo desde la máquina que aún no configuraste queda marcado en rojo, y el ruido acaba haciendo que ignores el distintivo — justo lo contrario de para lo que sirve.

## Exigir firmas en un repositorio

En la configuración de ramas protegidas o en un ruleset se puede activar **Require signed commits**: los commits sin firma válida son rechazados en el push.

Es una medida razonable en un repositorio con varias personas, pero avisa antes. Quien no tenga la firma configurada verá su push rechazado sin entender por qué, y lo primero que intentará es forzarlo.

## Si prefieres GPG

GPG sigue siendo válido y es lo que necesitas si ya tienes una identidad publicada con esa clave:

```bash
gpg --full-generate-key
gpg --list-secret-keys --keyid-format=long
gpg --armor --export TU_KEY_ID
```

Copia el bloque exportado en **Settings → SSH and GPG keys → New GPG key** y apunta Git a esa clave:

```bash
git config --global gpg.format openpgp
git config --global user.signingkey TU_KEY_ID
git config --global commit.gpgsign true
```

La diferencia práctica: GPG añade gestión de claves, caducidad y revocación —útil en cadenas de confianza— a cambio de bastante más configuración. Para firmar tus propios commits, SSH cubre lo mismo con la clave que ya usas.

## Diagnóstico

| Síntoma | Causa |
| --- | --- |
| `error: gpg failed to sign the data` | La ruta de `user.signingkey` es incorrecta o apunta a la clave privada en vez de al `.pub` |
| GitHub muestra **Unverified** | La clave no está añadida con el tipo *Signing Key* |
| `git log` muestra `N` en commits firmados | Falta `gpg.ssh.allowedSignersFile` |
| Firma bien en un equipo y en otro no | Cada máquina necesita su propia clave registrada como clave de firma |

Firmar demuestra **de dónde salió el commit, no que el código sea correcto**. Un commit firmado con malware sigue siendo malware, solo que ahora se sabe con certeza quién lo introdujo.
