---
title: Claves SSH — autenticarte sin escribir credenciales
description: Generar una clave ed25519, registrarla en GitHub, cargarla en el agente en Windows, macOS y Linux, y migrar un remoto de HTTPS a SSH.
type: guides
order: 3
tags: [github, ssh, autenticacion, claves, seguridad]
scope: autenticación con claves SSH
related:
  - git/git/git-remotos
  - applications/apps-cli/gh-cli-instalacion-auth
  - terminal/terminal/terminal-ssh
updatedAt: 2026-08-26
---

Al clonar por HTTPS, cada `push` necesita credenciales. GitHub no acepta contraseñas de cuenta desde 2021, así que la alternativa es un token personal que caduca y hay que renovar. Con SSH configuras una clave una vez y dejas de pensar en el tema.

Una clave SSH son **dos archivos**: la privada (`id_ed25519`), que no sale nunca de tu equipo, y la pública (`id_ed25519.pub`), que es la que subes a GitHub. Quien tenga la privada puede actuar en tu nombre; quien tenga la pública, no puede hacer nada con ella.

## 1. Generar la clave

```bash
ssh-keygen -t ed25519 -C "tu@correo.com"
```

`ed25519` es el algoritmo recomendado: claves cortas, rápidas y seguras. Usa `-t rsa -b 4096` solo si tienes que trabajar contra un servidor antiguo que no soporte ed25519.

El comando hace tres preguntas:

| Pregunta | Qué responder |
| --- | --- |
| Ruta del archivo | Enter para aceptar `~/.ssh/id_ed25519`. Cambia el nombre solo si ya tienes otra clave y quieres conservarla |
| Passphrase | Escribe una. Es lo que protege la clave si alguien copia el archivo |
| Confirmación | La misma passphrase |

El comentario `-C` es solo una etiqueta dentro del archivo público; sirve para reconocer la clave más adelante y no se usa para autenticar.

**Sobre la passphrase:** dejarla vacía es cómodo hasta que pierdes el portátil. Con el agente configurado (paso siguiente) la escribes una vez por sesión, así que el ahorro de omitirla es mínimo comparado con lo que protege.

## 2. Cargar la clave en el agente

El `ssh-agent` mantiene la clave desbloqueada en memoria para no pedir la passphrase en cada operación.

**Windows (PowerShell como administrador la primera vez):**

```powershell
Get-Service ssh-agent | Set-Service -StartupType Automatic
Start-Service ssh-agent
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

En Windows el agente es un servicio del sistema y viene desactivado por defecto. Sin `-StartupType Automatic` tendrías que arrancarlo a mano en cada reinicio.

**macOS:**

```bash
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_ed25519
```

`--apple-use-keychain` guarda la passphrase en el Llavero para que sobreviva al reinicio. Para que se cargue sola, añade en `~/.ssh/config`:

```text title="~/.ssh/config"
Host github.com
  AddKeysToAgent yes
  UseKeychain yes
  IdentityFile ~/.ssh/id_ed25519
```

**Linux:**

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

Comprueba en cualquier sistema qué claves están cargadas:

```bash
ssh-add -l
```

## 3. Registrarla en GitHub

Copia el contenido del archivo **público**:

```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub | Set-Clipboard
```

```bash
pbcopy < ~/.ssh/id_ed25519.pub   # macOS
xclip -sel clip < ~/.ssh/id_ed25519.pub   # Linux
```

En GitHub: **Settings → SSH and GPG keys → New SSH key**. Pon un título que identifique el equipo (`Portátil trabajo`, no `clave 1`) y deja el tipo en **Authentication Key**.

> Asegúrate de copiar el archivo terminado en `.pub`. Si pegas el otro, acabas de publicar tu clave privada: bórrala del equipo, revoca lo que hayas subido y genera un par nuevo.

Con GitHub CLI el registro es un comando:

```bash
gh ssh-key add ~/.ssh/id_ed25519.pub --title "Portátil trabajo"
```

## 4. Comprobar que funciona

```bash
ssh -T git@github.com
```

La primera vez pregunta si confías en la huella del servidor; responde `yes`. La respuesta correcta es:

```text
Hi TU-USUARIO! You've successfully authenticated, but GitHub does not provide shell access.
```

El aviso sobre el acceso a shell **no es un error**: GitHub solo usa SSH para Git, no da terminal. Si el saludo lleva tu usuario, está listo.

## 5. Pasar un repositorio de HTTPS a SSH

Configurar la clave no cambia los repositorios que ya clonaste: el remoto sigue apuntando a HTTPS.

```bash
git remote -v
git remote set-url origin git@github.com:usuario/repositorio.git
git remote -v
```

La diferencia está en el formato de la URL:

| Protocolo | URL |
| --- | --- |
| HTTPS | `https://github.com/usuario/repositorio.git` |
| SSH | `git@github.com:usuario/repositorio.git` |

Fíjate en los dos puntos de la URL SSH, donde HTTPS lleva una barra. Es el error de tipeo más frecuente al escribirla a mano.

## Cuando la red bloquea el puerto 22

Algunas redes corporativas y públicas cierran el puerto SSH. GitHub ofrece el mismo servicio por el 443:

```text title="~/.ssh/config"
Host github.com
  Hostname ssh.github.com
  Port 443
  User git
```

Compruébalo con `ssh -T -p 443 git@ssh.github.com` antes de dejarlo fijo en la configuración.

## Diagnóstico

Cuando algo falla, `-v` muestra qué clave se está ofreciendo y por qué se rechaza:

```bash
ssh -vT git@github.com
```

| Síntoma | Causa habitual |
| --- | --- |
| `Permission denied (publickey)` | La clave no está cargada en el agente, o la pública no está registrada en GitHub |
| Sigue pidiendo usuario y contraseña | El remoto continúa en HTTPS: revisa `git remote -v` |
| Funciona en una terminal y en otra no | Cada terminal ve un agente distinto; frecuente al mezclar Git Bash y PowerShell en Windows |
| `Bad owner or permissions on ~/.ssh/config` | Permisos demasiado abiertos: `chmod 600 ~/.ssh/config` y `chmod 700 ~/.ssh` |

Una clave por equipo, nunca la misma copiada entre máquinas: así, cuando pierdes uno, revocas esa clave desde GitHub y el resto sigue funcionando.
