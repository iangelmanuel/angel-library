---
title: "Resend — servicio de email transaccional con plan gratuito"
description: "Resend como servicio: plan gratuito de 3.000 emails al mes y 100 al día, dominios verificados, API keys con permisos, límites de reputación y cómo configurar SPF, DKIM y DMARC para que los correos lleguen a la bandeja de entrada."
tags: [servicios, email, resend, gratis, spf, dkim, dmarc, entregabilidad]
sidebar:
  order: 3
draft: false
resourceCategory: servicios
official: true
website: https://resend.com
url: https://resend.com/docs
technologies:
  - packages/node-resend/resend
  - packages/react-email/react-email
  - backend/express/express-email-transaccional
note: "Los planes cambian: los límites de esta página son los de resend.com/pricing y la documentación de cuotas a octubre de 2026. El uso del SDK en código está en la entrada del paquete Resend."
warnings:
  - "Con una tasa de rebote superior al 4% o de quejas de spam superior al 0,08%, Resend puede pausar los envíos de la cuenta."
  - "El remitente de pruebas onboarding@resend.dev solo entrega al email de tu propia cuenta: para usuarios reales necesitas un dominio verificado."
updatedAt: 2026-10-12
---

**Resend** es un servicio para enviar emails desde tu aplicación mediante una API HTTP: confirmaciones de registro, recuperación de contraseña, facturas, notificaciones. Se encarga de lo difícil del correo —servidores de envío, reputación de IP, rebotes, quejas de spam— y tú solo haces una petición con el remitente, el destinatario y el contenido. Está hecho por el mismo equipo que [React Email](/packages/react-email/react-email), así que las plantillas en JSX encajan de forma natural.

Esta entrada trata el **servicio**: plan, límites, dominios y entregabilidad. Cómo instalar el SDK y mandar el primer email está en [Resend (paquete)](/packages/node-resend/resend), y los flujos completos de confirmación y recuperación de contraseña en [Email transaccional con Express](/backend/express/express-email-transaccional).

## Transaccional y marketing

- **Email transaccional**: lo dispara una acción del usuario y le interesa recibirlo (el enlace para restablecer la contraseña). Va uno a uno.
- **Email de marketing**: newsletters y campañas a una lista de contactos (en Resend, "Broadcasts"). Tiene reglas legales propias, como el enlace para darse de baja.

Resend cobra cada tipo por separado: el transaccional por emails enviados, el de marketing por contactos.

## Plan gratuito

A octubre de 2026, según [resend.com/pricing](https://resend.com/pricing) y la [página de cuotas](https://resend.com/docs/knowledge-base/account-quotas-and-limits):

| Recurso                          | Plan gratuito                                     |
| -------------------------------- | ------------------------------------------------- |
| Emails transaccionales           | 3.000 al mes                                      |
| Límite diario                    | 100 emails al día (se reinicia a medianoche UTC)  |
| Dominios propios                 | 3                                                 |
| Retención de datos (logs)        | 30 días                                           |
| Webhooks                         | 1 endpoint, todos los eventos                     |
| Marketing                        | 1.000 contactos                                   |
| Límite de la API                 | 10 peticiones por segundo por equipo              |
| Envío por lotes                  | Hasta 100 emails por llamada                      |
| IP dedicada                      | No (solo como add-on del plan Scale)              |
| Soporte                          | Tickets                                           |

Cada destinatario cuenta como un email: un envío con dos direcciones en `to` y una en `cc` gasta tres de la cuota.

El siguiente escalón es **Pro**, desde 20 USD al mes por 50.000 emails, sin límite diario y con 10 dominios; después viene Scale. Para marketing, Pro Marketing empieza en 40 USD al mes por 5.000 contactos.

Los **100 emails diarios** son la cifra que de verdad limita: alcanzan para un proyecto personal o un MVP con pocos usuarios, pero un pico de registros puede agotarlos en horas.

## Dominios

Resend no envía desde dominios públicos (no puedes mandar como `@gmail.com`): necesitas **un dominio tuyo verificado**. Mientras no lo tengas, puedes probar con el remitente `onboarding@resend.dev`, que solo entrega a la dirección de tu cuenta (o a la dirección de pruebas `delivered@resend.dev`); a cualquier otra responde `403`.

Recomendaciones de la documentación:

- **Envía desde un subdominio** (`mail.tudominio.com`, `updates.tudominio.com`) en lugar del dominio raíz. Así la reputación de envío queda aislada: si algo sale mal, no arrastra el correo corporativo del dominio principal.
- Puedes verificar **varios subdominios** para separar propósitos (cuenta y facturación por un lado, newsletter por otro).
- Puedes elegir la **región** de envío y personalizar el subdominio del `Return-Path`.

La verificación suele completarse en unos 15 minutos tras crear los registros DNS, aunque la propagación puede tardar hasta 72 horas. Si tu DNS está en Cloudflare, **no actives el proxy** en los registros CNAME o la verificación no termina.

## Entregabilidad: SPF, DKIM y DMARC

Que un email "se envíe" no significa que llegue a la bandeja de entrada. Gmail, Outlook y compañía comprueban que el remitente esté autorizado a usar ese dominio. Para eso hay tres mecanismos, todos configurados con registros DNS:

| Mecanismo | Qué demuestra                                                                | En Resend                                                             |
| --------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **SPF**   | Qué servidores pueden enviar en nombre del dominio                          | Un `TXT` y un `MX` en el subdominio `send` (Resend envía sobre Amazon SES) |
| **DKIM**  | Que el mensaje está firmado por el dominio y no se alteró por el camino     | Un `TXT` en `resend._domainkey` con la clave pública                  |
| **DMARC** | Qué hacer si un email falla SPF y DKIM, y a dónde enviar informes           | Un `TXT` en `_dmarc` que configuras tú                                |

Los valores exactos los genera Resend en la pestaña **Records** de cada dominio: cópialos tal cual (el `MX` cambia según la región). El SPF que publica tiene esta forma:

```text
send.tudominio.com  TXT  "v=spf1 include:amazonses.com ~all"
```

DMARC no lo crea Resend, pero sin él los grandes proveedores tratan peor tu correo. La documentación propone endurecerlo por etapas:

```text
# 1. Solo observar: recibes informes, no se bloquea nada
_dmarc.tudominio.com  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@tudominio.com;"

# 2. Cuando todo lo legítimo pasa: lo que falle va a spam
_dmarc.tudominio.com  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@tudominio.com;"

# 3. Política estricta: lo que falle se rechaza
_dmarc.tudominio.com  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@tudominio.com;"
```

Antes de subir de etapa, envía desde **todas** las herramientas que usan tu dominio (también las que mandan poco, como la facturación) y comprueba en las cabeceras que aparece `dmarc=pass`. Un email pasa DMARC si pasa SPF **o** DKIM alineado con el dominio del remitente. Con `quarantine` o `reject` ya puedes configurar BIMI, que muestra el logo de la marca en algunos clientes de correo.

## API keys

- Cada clave tiene un **permiso**: `full_access` (gestiona cualquier recurso: dominios, claves, contactos…) o `sending_access` (solo envía emails).
- Una clave de envío se puede **restringir a un dominio**, de modo que si se filtra solo sirve para ese dominio.
- El valor de la clave **solo se muestra al crearla**; después no se puede ver ni editar.
- Usa claves distintas por aplicación o entorno: así ves los logs por clave y puedes revocar una sin tumbar las demás. La documentación sugiere borrar las que lleven 30 días sin usarse.

En producción, la aplicación casi nunca necesita más que `sending_access` restringida a su dominio. Guárdala en una variable de entorno (`RESEND_API_KEY`) y nunca en el frontend.

## Reputación y límites que pueden pausar la cuenta

Resend vigila dos métricas en todas las cuentas:

- **Tasa de rebote** por debajo del **4%**. Un rebote es un email que no se pudo entregar (dirección inexistente, buzón lleno).
- **Tasa de spam** por debajo del **0,08%**: menos de 1 queja por cada 1.250 emails.

Si se superan, Resend puede pausar temporalmente los envíos. Para mantenerlas bajas: valida el formato del email en el registro, pide confirmación (doble opt-in) antes de mandar nada más, deja de enviar a direcciones que rebotan (los webhooks de `bounced` y `complained` sirven para eso) y no mezcles marketing con transaccional en el mismo subdominio.

## Cuándo conviene y cuándo no

**Conviene** para proyectos personales, MVPs y apps pequeñas en JavaScript/TypeScript que necesitan email transaccional sin montar SMTP, sobre todo si ya usas React Email.

**No conviene** como única opción si esperas picos de más de 100 emails diarios sin pagar, o si necesitas una IP dedicada desde el primer día. Alternativas habituales con capa gratuita o barata: Amazon SES (muy barato, más configuración), Postmark, Brevo o Mailgun; compara sus límites antes de decidir.

## Fuentes

- [Precios de Resend](https://resend.com/pricing)
- [Cuotas y límites de la cuenta](https://resend.com/docs/knowledge-base/account-quotas-and-limits)
- [Dominios](https://resend.com/docs/dashboard/domains/introduction) y [cómo añadir un dominio](https://resend.com/docs/add-a-domain)
- [DMARC en Resend](https://resend.com/docs/dashboard/domains/dmarc)
- [API keys](https://resend.com/docs/dashboard/api-keys/introduction)
- [Error 403 con resend.dev](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain)
