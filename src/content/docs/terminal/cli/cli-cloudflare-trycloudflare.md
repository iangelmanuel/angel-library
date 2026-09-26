---
title: "TryCloudflare: compartir localhost con un Quick Tunnel"
description: Exponer un servidor local en una URL pública https://*.trycloudflare.com con un solo comando de cloudflared — sin cuenta, sin DNS y sin abrir puertos. Instalación, uso, límites y cuándo pasar a un túnel con nombre.
tags: [cli, cloudflare, cloudflared, tunnel, localhost, trycloudflare, compartir, webhooks]
sidebar:
  order: 6
draft: false
scope: cloudflared tunnel --url
resourceCategory: Documentación oficial
official: true
website: https://try.cloudflare.com/
url: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/
github: https://github.com/cloudflare/cloudflared
technologies:
  - terminal/cli/cli-cloudflare-wrangler
  - terminal/terminal/terminal-puertos
warnings:
  - Cualquiera con la URL puede acceder a tu servidor local. No expongas paneles de administración, bases de datos ni apps con datos reales.
  - Es solo para pruebas y desarrollo; Cloudflare no da garantías de disponibilidad para Quick Tunnels.
updatedAt: 2026-09-26
---

**TryCloudflare** es la forma más rápida de enseñarle a alguien lo que corre en tu `localhost`. `cloudflared` abre una conexión **saliente** hacia la red de Cloudflare y te devuelve una URL aleatoria en `trycloudflare.com` que redirige el tráfico a tu máquina. No hace falta cuenta, dominio, registro ni pago, y no abres puertos en el router.

## Instalación de cloudflared

```powershell
# Windows
winget install --id Cloudflare.cloudflared
```

```bash
# macOS
brew install cloudflared

# Linux (Debian/Ubuntu, amd64)
curl -LO https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

También hay binarios sueltos y paquetes para otras arquitecturas en las [releases](https://github.com/cloudflare/cloudflared/releases) y un repositorio de paquetes en [pkg.cloudflare.com](https://pkg.cloudflare.com/). Se necesita la versión 2020.5.1 o posterior.

```bash
cloudflared --version
```

## Uso

Con tu app corriendo (por ejemplo `pnpm dev` en el puerto 4321):

```bash
cloudflared tunnel --url http://localhost:4321
```

En la salida aparece la URL pública:

```text
Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):
https://palabras-aleatorias-ejemplo.trycloudflare.com
```

Comparte ese enlace. El túnel vive mientras el proceso siga abierto; `Ctrl+C` lo cierra y la URL deja de funcionar. Cada ejecución genera una URL nueva.

### Casos típicos

- Enseñar un avance a un cliente o compañero sin desplegar.
- Probar la web en un móvil real fuera de tu red.
- Recibir **webhooks** (Stripe, GitHub, WhatsApp…) en tu máquina durante el desarrollo.
- Probar una integración OAuth que exige una URL `https`.

### Frameworks con servidor de desarrollo

Vite, Astro y similares pueden rechazar peticiones con un `Host` que no conocen. Si ves un error de host bloqueado, permite el dominio en el servidor de desarrollo; en Vite:

```ts
// vite.config.ts
export default {
  server: { allowedHosts: [".trycloudflare.com"] }
}
```

## Límites

| Límite | Detalle |
| --- | --- |
| Peticiones concurrentes | Máximo **200 en vuelo**; por encima, Cloudflare responde `429` |
| Server-Sent Events | **No soportados** en Quick Tunnels |
| `config.yaml` | Si existe `~/.cloudflared/config.yaml`, el Quick Tunnel no arranca; renómbralo mientras lo usas |
| URL | Aleatoria y efímera; no se puede elegir ni conservar |
| Uso | Pruebas y desarrollo, sin SLA |

## Quick Tunnel frente a túnel con nombre

| | Quick Tunnel | Túnel con nombre |
| --- | --- | --- |
| Cuenta de Cloudflare | No | Sí |
| Dominio | `*.trycloudflare.com` aleatorio | El tuyo, fijo |
| Control de acceso | Ninguno | Cloudflare Access (login, políticas) |
| Configuración | Un comando | Panel o archivo de configuración |
| Pensado para | Probar y compartir | Producción y servicios estables |

Para algo que deba seguir en pie o estar protegido, crea un túnel gestionado desde el panel de Cloudflare Zero Trust.

## Seguridad

- La URL es difícil de adivinar pero **pública**: no es un mecanismo de autenticación.
- Tu servidor de desarrollo suele mostrar errores detallados y código fuente; ciérralo al terminar.
- Revisa qué hay en la carpeta que sirves y no expongas `.env` ni rutas internas.

## Fuentes

- [TryCloudflare / Quick Tunnels](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/) — documentación oficial
- [try.cloudflare.com](https://try.cloudflare.com/)
- [Repositorio de cloudflared](https://github.com/cloudflare/cloudflared) · [Descargas](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/downloads/)
- [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/)
