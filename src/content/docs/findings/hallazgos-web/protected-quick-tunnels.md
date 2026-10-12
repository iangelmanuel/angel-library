---
title: "Protected Quick Tunnels: compartir localhost solo con quien tú elijas"
description: "Cloudflare añadió autenticación por correo a los Quick Tunnels: con --allowed-mail, solo las direcciones o dominios que indiques entran a tu localhost, tras verificar un PIN de un solo uso. Gratis y sin cuenta."
tags: [cloudflare, cloudflared, tunnel, localhost, seguridad, autenticacion, trycloudflare, compartir]
sidebar:
  order: 8
draft: false
resourceCategory: Documentación oficial
official: true
website: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/
url: https://blog.cloudflare.com/protected-quick-tunnels/
github: https://github.com/cloudflare/cloudflared
technologies:
  - terminal/cli/cli-cloudflare-trycloudflare
  - terminal/cli/cli-cloudflare-wrangler
note: "Requiere cloudflared 2026.9.3 o posterior. No hace falta cuenta de Cloudflare ni para quien comparte ni para quien entra."
warnings:
  - "La protección depende de un único flag: si lo olvidas, el túnel es público. Si un agente de IA abre túneles por ti, déjalo escrito en su AGENTS.md o CLAUDE.md y revisa el comando que ejecutó."
  - "Los Quick Tunnels son para pruebas: sin garantía de disponibilidad, con un máximo de 200 peticiones simultáneas y sin soporte de Server-Sent Events."
  - "La verificación es para personas con navegador. Un webhook, un script o un cliente de API no pueden pasar el PIN, así que no sirve para exponer una API a otra máquina."
updatedAt: 2026-10-12
---

## En pocas palabras

Desde octubre de 2026, los **Quick Tunnels** de Cloudflare (la URL aleatoria en `trycloudflare.com` que da `cloudflared` con un solo comando) admiten **autenticación por correo**. Añades `--allowed-mail` con las direcciones o el dominio permitidos, y cualquier otra persona que abra la URL se queda fuera. El anuncio está en el [blog de Cloudflare](https://blog.cloudflare.com/protected-quick-tunnels/) y la referencia en su [documentación](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/).

```bash
cloudflared tunnel --url http://localhost:8080 --allowed-mail tu@ejemplo.com
```

Es gratis, como los Quick Tunnels normales.

## Qué es un túnel y por qué hace falta

Tu servidor de desarrollo escucha en `localhost`: solo tu máquina llega a él. Para enseñárselo a otra persona tendrías que abrir un puerto en el router, tener una IP pública fija y configurar HTTPS. Un **túnel** evita todo eso: un programa en tu máquina abre una conexión **saliente** hacia un servicio externo, que te da una URL pública y reenvía por esa conexión las peticiones que llegan. No abres puertos ni tocas el router.

Cloudflare ofrece dos tipos:

| Tipo              | Cómo se crea                                 | URL                               | Para qué                       |
| ----------------- | -------------------------------------------- | --------------------------------- | ------------------------------ |
| **Quick Tunnel**  | Un comando, sin cuenta                       | Aleatoria en `trycloudflare.com`, cambia cada vez | Enseñar algo un rato, pruebas |
| **Named Tunnel**  | Con cuenta, dominio en Cloudflare y configuración | Tu dominio, estable          | Servicios permanentes, con Cloudflare Access para reglas ricas |

La entrada de [TryCloudflare](/terminal/cli/cli-cloudflare-trycloudflare) cubre el Quick Tunnel básico. El problema que tenía era que **cualquiera con la URL entraba**. Protected Quick Tunnels resuelve exactamente eso.

## Cómo se usa

Instala o actualiza `cloudflared` (hace falta la versión 2026.9.3 o posterior):

```powershell
# Windows
winget install --id Cloudflare.cloudflared

# macOS
brew install cloudflared
```

Comprueba la versión con `cloudflared --version`. Después, según a quién quieras dejar pasar:

```bash
# Una sola persona
cloudflared tunnel --url http://localhost:8080 \
  --allowed-mail alice@example.com

# Varias personas y un dominio completo (el flag se repite)
cloudflared tunnel --url http://localhost:8080 \
  --allowed-mail alice@example.com \
  --allowed-mail bob@example.com \
  --allowed-mail '*@example.com'
```

La documentación también acepta una lista separada por comas. El comodín de dominio va entre comillas para que la terminal no lo expanda.

Si usas Wrangler, la CLI de Cloudflare Workers, hay un equivalente (con la última versión de `wrangler`):

```bash
npx wrangler tunnel quick-start http://localhost:8080 --allowed-mail alice@example.com
```

Sin `--allowed-mail`, el túnel sigue siendo público como siempre:

```bash
cloudflared tunnel --url http://localhost:5173
```

Al arrancar, `cloudflared` indica si la autenticación por correo está activa y cuántas reglas tiene, pero no imprime las direcciones.

## Qué ve la persona que entra

1. Abre la URL y la redirigen a la página de acceso de **Cloudflare Access**.
2. Escribe su correo y recibe un **PIN de un solo uso** en ese buzón.
3. Lo introduce y, si su dirección está en tu lista, entra a la aplicación.

No necesita cuenta de Cloudflare. La sesión dura **hasta cuatro horas** (menos si su acceso caduca antes) o hasta que detengas `cloudflared`.

## Cómo funciona por dentro

El diseño tiene una idea central, en palabras del artículo: **Cloudflare verifica el correo; tu máquina decide quién entra.**

- **Cloudflare Access** se encarga de la parte difícil de un login por correo: enviar el PIN, frenar abusos y servir la página de acceso.
- Cuando el visitante demuestra que controla el correo, un **broker sin estado en Cloudflare Workers** emite una afirmación firmada y de corta duración, ligada al hostname del túnel y a un estado de un solo uso válido diez minutos. Se entrega por un POST de formulario, no en la URL.
- **`cloudflared`, en tu máquina,** verifica esa afirmación y compara el correo con tus reglas, en memoria. Si coincide, crea una sesión local; si no, devuelve una respuesta genérica.

La consecuencia práctica es que Cloudflare sabe que tu túnel usa autenticación por correo, pero **no conoce tu lista de invitados**. Además, el túnel protegido nunca cae a modo público: si el servicio no confirma el modo de autenticación, `cloudflared` se niega a arrancar. Y si cualquier comprobación falla, la petición no llega a tu servicio local. `cloudflared` también elimina las credenciales de autenticación antes de reenviar la petición a tu app.

## Límites

- **La lista es fija.** Para cambiarla hay que detener `cloudflared` y abrir un túnel nuevo, que tendrá otra URL. Al cerrar el proceso, todos pierden el acceso.
- **Hasta 200 peticiones en curso** por túnel; las siguientes reciben un `429`.
- **Sin Server-Sent Events (SSE).** Si tu app depende de ellos para actualizarse en vivo, no funcionará bien.
- **Sin garantía de disponibilidad**, como cualquier Quick Tunnel.
- **Solo navegador.** La verificación necesita una sesión interactiva: no sirve para clientes automáticos.

Para hostnames estables o reglas más ricas (grupos de tu proveedor de identidad, por ejemplo), el propio artículo remite a un Named Tunnel con Cloudflare Access.

## Comparativa

| Herramienta           | Cuenta                | Restringir el acceso                                      | URL                         |
| --------------------- | --------------------- | --------------------------------------------------------- | --------------------------- |
| Protected Quick Tunnel | No                   | Lista de correos o dominios, con PIN; gratis              | Aleatoria, cambia cada vez  |
| ngrok                 | Sí                    | OAuth, IP y otras políticas, según el plan                | Aleatoria o fija según plan |
| localtunnel           | No                    | No hay control por usuario; solo una página intermedia antes de entrar | Aleatoria o subdominio pedido |
| Tailscale Funnel      | Sí (tailnet)          | Funnel es público; para acceso privado se usa Tailscale Serve dentro de tu red | Fija en `ts.net`  |

**Cuándo usarlo.** Para enseñar una demo a un cliente, que un compañero pruebe tu rama o revisar una web en el móvil de alguien concreto, sin exponerla a quien adivine o reenvíe la URL. Si lo que necesitas es recibir webhooks de un servicio externo, sigue haciendo falta un túnel público (o uno con nombre y reglas propias).

## Fuentes

- [Protected Quick Tunnels, en el blog de Cloudflare](https://blog.cloudflare.com/protected-quick-tunnels/)
- [Documentación de Quick Tunnels (TryCloudflare)](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/do-more-with-tunnels/trycloudflare/)
- [Repositorio de cloudflared](https://github.com/cloudflare/cloudflared)
