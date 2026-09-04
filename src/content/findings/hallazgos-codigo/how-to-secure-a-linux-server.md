---
title: "How To Secure A Linux Server — guía de endurecimiento paso a paso"
description: "Guía comunitaria para endurecer un servidor Linux explicando el porqué de cada medida; sirve como recorrido ordenado por SSH, red, cortafuegos y auditoría."
type: resources
order: 6
tags: [seguridad, linux, servidor, ssh, firewall, hardening, debian, github]
url: https://github.com/imthenachoman/How-To-Secure-A-Linux-Server
resourceCategory: learning
personalNote: "El propio autor avisa de que no lo copies a ciegas. Léelo entero antes de tocar nada: hay pasos donde el orden importa y otros que pueden dejarte fuera del servidor."
related:
  - security/security-infra/security-secrets-supply-chain
  - security/security-testing/web-security-checklist
updatedAt: 2026-09-01
---

> Mantenida por **[imthenachoman](https://github.com/imthenachoman)**, licencia CC BY-SA 4.0. Unas 31.100 estrellas.

Una guía viva para endurecer un servidor Linux que, además de decir qué comando ejecutar, explica **por qué importa cada medida**. Ese enfoque es lo que la separa de las listas de comandos que circulan por ahí: se lee como material de estudio, no como receta.

## Cómo está organizada

| Sección               | Qué cubre                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------- |
| **The SSH Server**    | Autenticación por clave, configuración segura del demonio, 2FA/MFA                                          |
| **The Basics**        | Restricción de `sudo`/`su`, política de contraseñas, actualizaciones automáticas, endurecimiento de `/proc` |
| **The Network**       | Cortafuegos UFW, detección de intrusos con PSAD, Fail2ban, CrowdSec                                         |
| **The Auditing**      | AIDE, ClamAV, Rkhunter, Lynis, OSSEC y logwatch                                                             |
| **The Miscellaneous** | Configuración de correo y separación de logs                                                                |

El repositorio incluye además documentos aparte para el endurecimiento del kernel vía `sysctl` y para nginx.

## Las medidas centrales

- **SSH**: desactivar el acceso de root, usar claves **Ed25519** y añadir un segundo factor con Google Authenticator.
- **Control de acceso**: limitar `sudo` y `su` a grupos concretos y acotar los intentos de contraseña.
- **Cortafuegos**: UFW denegando por defecto tanto entrada como salida, con SSH permitido y limitado por tasa.
- **Prevención de intrusiones**: Fail2ban o CrowdSec vigilando los logs para banear IP sospechosas de forma automática.
- **Contraseñas**: mínimo 10 caracteres con mayúsculas, minúsculas, dígitos y símbolos.
- **Actualizaciones**: parches de seguridad desatendidos con `unattended-upgrades`.
- **Aislamiento de procesos**: montar `/proc` con `hidepid=2` para que un usuario no vea los procesos de los demás.
- **Hora sincronizada**: un cliente NTP, porque media criptografía depende de que el reloj no mienta.

## Antes de seguirla

Está escrita y probada **sobre Debian**, con comandos `apt`. El autor la declara agnóstica de distribución, pero en otras familias tendrás que traducir la gestión de paquetes.

Sus propios avisos, que conviene tomarse en serio:

- No copies y pegues sin entender lo que pegas.
- Léela entera antes de empezar: hay secciones cuyo orden importa.
- Algunas configuraciones pueden romperse en ciertos sistemas con systemd.
- Las actualizaciones automáticas y desatendidas pueden tumbarte el sistema si no las ajustas con cuidado.

A eso añado uno práctico: ten una segunda sesión SSH abierta —o acceso por consola del proveedor— mientras tocas `sshd` y el cortafuegos. La forma más común de perder un servidor no es un ataque, es un `ufw enable` sin la regla de SSH puesta antes.
