---
title: "Brave — navegador Chromium con privacidad integrada"
description: "Navegador multiplataforma compatible con extensiones de Chromium que bloquea anuncios, rastreadores y cookies de terceros desde su capa Shields."
type: guides
order: 1
tags: [brave, navegador, chromium, privacidad, seguridad, extensiones]
website: https://brave.com/es/
github: https://github.com/brave/brave-browser
related:
  - languages/javascript/http-browser-fundamentals
updatedAt: 2026-09-04
---

> Desarrollado por **Brave Software** sobre Chromium. El código del cliente se publica principalmente bajo MPL 2.0.

**Brave** es un navegador para Windows, macOS, Linux, Android e iOS que parte de Chromium y cambia su configuración y varios de sus servicios para reducir el rastreo. Mantiene la compatibilidad práctica con sitios y extensiones de Chrome, pero incorpora su protección en el propio navegador.

La idea central no es “anonimato total”. Brave reduce datos enviados a terceros y bloquea mecanismos comunes de seguimiento; el proveedor de internet, la red de trabajo, los sitios donde inicias sesión y una extensión con permisos amplios todavía pueden observar actividad.

## Instalación

La vía más directa es la [descarga oficial](https://brave.com/download/), que detecta el sistema operativo y ofrece el instalador estable.

### Windows

```bash
winget install --id Brave.Brave -e
```

También se puede descargar el instalador desde la página oficial. Al iniciar por primera vez, Brave ofrece importar marcadores, contraseñas, historial y extensiones desde el navegador anterior.

### macOS

```bash
brew install --cask brave-browser
```

### Linux

Brave mantiene repositorios propios para Debian, Ubuntu, Mint, Fedora, Rocky y openSUSE. Su instalador oficial abreviado es:

```bash
curl -fsS https://dl.brave.com/install.sh | sh
```

Antes de ejecutar cualquier script descargado conviene revisar su contenido y firma. La [guía oficial para Linux](https://brave.com/linux/) también documenta los pasos manuales y las claves de firma. Brave recomienda sus paquetes nativos por encima de Snap o Flatpak porque estos pueden comportarse distinto en actualizaciones y sandboxing.

## Shields: la protección principal

**Shields** es el panel del icono de león situado junto a la barra de direcciones. Actúa por sitio y permite ver o ajustar lo que Brave está bloqueando.

| Protección              | Comportamiento práctico                                        |
| ----------------------- | -------------------------------------------------------------- |
| Anuncios y rastreadores | Bloquea solicitudes conocidas antes de que carguen             |
| Cookies                 | Permite normalmente las propias y bloquea cookies de terceros  |
| Fingerprinting          | Modifica o limita señales usadas para reconocer el dispositivo |
| HTTPS                   | Intenta usar conexiones seguras cuando el sitio las ofrece     |
| Scripts                 | Se pueden bloquear, pero hacerlo rompe muchas aplicaciones web |

La configuración por defecto busca equilibrio entre privacidad y compatibilidad. El modo agresivo bloquea más, pero puede impedir inicios de sesión, reproductores, mapas o pagos. Si un sitio falla, baja Shields solo para ese dominio y vuelve a cargar; no desactives la protección global como primera solución.

## Compatibilidad con Chrome

Al usar Chromium, Brave comparte el motor Blink, las DevTools y el sistema de extensiones. Las extensiones de Chrome Web Store se instalan con **Añadir a Brave**.

Esto facilita cambiar desde Chrome o Edge, pero una extensión conserva los permisos que aceptes. Un bloqueador, gestor de pestañas o asistente puede leer las páginas visitadas si su permiso lo permite. Shields no convierte una extensión invasiva en privada: instala pocas, revisa su editor y elimina las que ya no uses.

## Perfiles y sincronización

Los **perfiles** separan historial, cookies, extensiones y sesiones; son útiles para no mezclar cuentas personales y de trabajo. **Brave Sync** puede sincronizar marcadores, contraseñas y otros datos entre equipos mediante cifrado del lado del cliente, sin depender de una cuenta de Google.

La frase de sincronización es la llave del grupo de dispositivos. Si se pierde el acceso a todos ellos, Brave no puede recuperar los datos cifrados. No la publiques ni la guardes en una nota sin protección.

## Funciones opcionales

Brave incluye Search, Wallet, Rewards, Talk, News, Leo y un servicio de VPN, pero no todas son necesarias para usar el navegador. Algunas son gratuitas, otras de pago y algunas procesan datos mediante servicios de red.

Si buscas un navegador sencillo, desactiva u oculta lo que no uses desde Ajustes. La protección de Shields no requiere participar en Rewards ni utilizar criptomonedas.

## Para desarrollo web

Brave sirve como navegador principal de desarrollo porque sus DevTools son las de Chromium. Aun así, probar solo en Brave no garantiza compatibilidad completa:

- prueba también en Firefox y Safari/WebKit cuando el proyecto lo requiera;
- recuerda que Shields puede bloquear analytics, widgets o scripts que sí cargarán para otros usuarios;
- usa una ventana o perfil limpio para diferenciar un fallo del sitio de una extensión;
- no confundas un recurso bloqueado por privacidad con un error de CORS o del servidor.

## Brave, incógnito y Tor no son lo mismo

| Modo                    | Qué cambia                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| Ventana normal          | Conserva historial y cookies; aplica Shields                                                             |
| Ventana privada         | Elimina datos locales de esa sesión al cerrarla, pero no oculta la IP                                    |
| Ventana privada con Tor | Enruta tráfico por Tor, con más latencia y limitaciones; no sustituye al Tor Browser para amenazas altas |

## Cuándo encaja

- Quieres la compatibilidad de Chromium con protección integrada y pocos ajustes iniciales.
- Necesitas extensiones de Chrome sin usar una cuenta de Google para sincronizar.
- Prefieres controles de privacidad visibles por cada sitio.

Puede no encajar si buscas un motor distinto de Chromium, una superficie mínima sin servicios adicionales o anonimato frente a un adversario fuerte. En esos casos compara Firefox endurecido, Safari o Tor Browser según el objetivo.

## Enlaces oficiales

- [Página y descarga de Brave](https://brave.com/es/)
- [Código fuente de Brave Browser](https://github.com/brave/brave-browser)
- [Instalación oficial en Linux](https://brave.com/linux/)
- [Protecciones de privacidad](https://brave.com/privacy-features/)
