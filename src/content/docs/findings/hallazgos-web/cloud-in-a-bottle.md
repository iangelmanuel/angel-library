---
title: "Cloud in a Bottle — una nube personal sobre hardware propio"
description: "Plataforma de código abierto que instala aplicaciones web desde un repositorio Git en una máquina que tú controlas, resolviendo por dentro contenedores, subdominios, DNS, HTTPS y autenticación."
type: resources
sidebar:
  order: 4
tags:
  [self-hosting, infraestructura, contenedores, podman, python, dns, https, privacidad]
url: https://github.com/cloud-in-a-bottle/cloud-in-a-bottle
website: https://cloudinabottle.org
resourceCategory: developer-tools
personalNote: "Lo que me interesa no es el «self-hosting sin dolor», es dónde ponen la costura: un manifiesto en el repo y un router que hace de plano de control. Todo lo demás —proxy, certificados, sesión— deja de ser decisión de cada app."
updatedAt: 2026-09-07
---

> Creado por **[Imbue](https://github.com/cloud-in-a-bottle)** con licencia **AGPL-3.0** (avisan que podrían pasar a una licencia _fair source_, manteniendo libre el uso personal). Unas 881 estrellas. Manual completo en [cloudinabottle.org/docs](https://cloudinabottle.org/docs/).

**Cloud in a Bottle** es una plataforma para desplegar, usar y compartir aplicaciones web en hardware propio: un VPS, un servidor doméstico o una máquina que ya tienes encendida. Su propia descripción es _«un rincón de la nube que es genuinamente tuyo»_, donde las aplicaciones «se instalan tan fácil como en el teléfono» y los datos viven en una máquina que controlas.

El diagnóstico del que parte es correcto: hay muchísimo software web libre, pero casi nadie tiene una infraestructura donde ponerlo a correr sin un intermediario corporativo. El proyecto no escribe otra aplicación; escribe **el suelo** donde las aplicaciones se apoyan.

## Qué resuelve realmente

Autoalojar una sola aplicación es fácil. El problema aparece a partir de la segunda: cada una quiere su puerto, su proxy inverso, su certificado, su copia de seguridad y su propio sistema de usuarios. Cloud in a Bottle mueve todo eso **fuera de las aplicaciones** y lo pone en un plano de control común.

## Cómo funciona por dentro

El centro es un **router escrito en Python** que actúa como plano de control:

- **Instalación desde Git.** El router lee un manifiesto `cloudinabottle.toml` en el repositorio de la aplicación, construye la imagen con **Podman sin root** y gestiona el ciclo de vida del contenedor.
- **Red.** Cada aplicación escucha solo en `localhost`; el router hace de proxy del tráfico HTTP y WebSocket **según el subdominio**. La aplicación nunca queda expuesta directamente.
- **Autenticación.** Por defecto todas las rutas exigen la sesión del dueño de la instancia; el manifiesto puede declarar qué rutas son públicas. La sesión es del sistema, no de cada aplicación.
- **Almacenamiento por niveles.** Datos permanentes, archivos temporales y almacén de archivo —este último admite destinos compatibles con S3—, en lugar de dejar que cada contenedor invente su propia carpeta.
- **DNS y certificados.** En el despliegue público estándar, **Caddy** se encarga del HTTPS y **CoreDNS** resuelve el comodín de subdominios.

En el catálogo caben desde herramientas personales y aplicaciones generadas con IA hasta software libre conocido (Matrix, servidores de Minecraft, notas, gestión de proyectos): cualquier aplicación web con `Dockerfile` y manifiesto.

## Montarlo

La documentación cubre tres escenarios: instancia en la nube, servidor doméstico dedicado y máquina doméstica compartida. Para el primero, los requisitos son concretos:

- **Ubuntu 24.04 recién instalado**, con un sistema de archivos que admita _idmapped mounts_ (ext4, xfs o btrfs).
- Puertos `80/tcp`, `443/tcp` y `53/tcp+udp` accesibles desde internet, con IPv4 pública estática.
- Un **dominio propio con acceso al DNS**, delegado a la máquina: un registro `A` de `ns1.tudominio.com` hacia la IP y un registro `NS` que delegue `tudominio.com` en `ns1.tudominio.com`.

Comprobar la delegación antes de instalar:

```bash
dig +short NS tudominio.com
dig +short A ns1.tudominio.com
```

Y la instalación es un único script:

```bash
curl -fsSL https://raw.githubusercontent.com/cloud-in-a-bottle/cloud-in-a-bottle/main/scripts/provision.sh \
  | sudo bash -s -- --domain tudominio.com --acme-email tu@correo.com
```

El instalador registra una cuenta de **Let's Encrypt** con ese correo y emite los certificados mediante desafíos DNS-01. Al terminar imprime una URL desde la que se crea la cuenta de dueño. Hay además una opción gestionada: Imbue aprovisiona y configura el servidor por ti.

## Qué mirar de cerca

- **La letra pequeña del «un clic».** Instalar aplicaciones sí se acerca a eso; **montar la instancia no**. Delegar el DNS de un dominio entero a tu máquina y abrir el puerto 53 no es un paso trivial, y conviene entenderlo antes de empezar.
- **Raspberry Pi todavía no.** La optimización para Raspberry Pi aparece en la hoja de ruta, no en lo que ya funciona. Hoy el camino probado es Ubuntu 24.04 en un VPS o en una máquina dedicada.
- **Podman sin root.** Que los contenedores no corran como root es la decisión de seguridad más relevante del diseño, y explica el requisito de _idmapped mounts_.
- **La licencia.** AGPL-3.0 obliga a publicar los cambios si ofreces el servicio en red; el aviso de una posible migración a _fair source_ conviene tenerlo en cuenta si piensas construir algo encima.
- **El estado del proyecto.** La hoja de ruta da por estables el núcleo, el catálogo y la interfaz de servicios, y sitúa en desarrollo activo la documentación y la puesta en marcha autoalojada. Es utilizable, pero todavía se está puliendo.
