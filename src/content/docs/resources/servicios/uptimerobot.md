---
title: "UptimeRobot — monitorización de uptime con plan gratuito"
description: Servicio que comprueba cada pocos minutos si tu web, API o servidor responde y te avisa cuando cae; plan gratuito de 50 monitores cada 5 minutos con status page, tipos de monitor HTTP, keyword, ping, puerto y más.
tags: [servicios, monitorizacion, uptime, observabilidad, alertas, status-page, gratis]
sidebar:
  order: 4
draft: false
resourceCategory: servicios
official: true
website: https://uptimerobot.com
technologies:
  - devops/observabilidad/observability-fundamentals
  - devops/observabilidad/observability-health-shutdown
  - devops/observabilidad/observability-incident-response
note: "Los planes cambian: los límites de esta página son los de uptimerobot.com/pricing y sus términos a octubre de 2026. La página de precios presenta el plan gratuito como pensado para proyectos personales y sin ánimo de lucro, aunque los términos permiten cualquier uso, incluido el comercial."
warnings:
  - "Con un intervalo de 5 minutos, una caída corta puede pasar desapercibida y una larga tarda hasta 5 minutos en avisarte."
  - "Un monitor externo solo ve lo que se ve desde fuera: que la portada responda 200 no garantiza que la base de datos o los procesos en segundo plano funcionen."
updatedAt: 2026-10-12
---

**UptimeRobot** es un servicio de **monitorización de disponibilidad** (uptime): cada pocos minutos, desde sus servidores, hace una petición a tu web, API o servidor y comprueba que responde como debe. Si deja de hacerlo, te avisa por email u otros canales, y guarda el historial de caídas y tiempos de respuesta. Es de los servicios gratuitos más usados para esto por lo fácil que es: en dos minutos tienes un monitor funcionando.

## Qué es la monitorización de uptime

Es la forma más básica de observabilidad: una comprobación **desde fuera** (sintética), igual que la haría un usuario. No sabe qué pasa dentro de tu aplicación —eso lo cubren logs, métricas y trazas, ver [fundamentos de observabilidad](/devops/observabilidad/observability-fundamentals)—, pero responde la pregunta más urgente: **¿está arriba?** Y lo hace aunque tu servidor esté tan caído que no pueda avisar por sí mismo.

## Plan gratuito

A octubre de 2026, según [uptimerobot.com/pricing](https://uptimerobot.com/pricing/) y sus [términos](https://uptimerobot.com/terms/):

| Recurso                       | Plan gratuito                                                     |
| ----------------------------- | ----------------------------------------------------------------- |
| Monitores                     | 50                                                                |
| Intervalo de comprobación     | 5 minutos                                                         |
| Tipos de monitor              | HTTP(S), keyword, ping, puerto, API, UDP, DNS y dependencias      |
| Heartbeat (cron jobs)         | No: es de pago                                                    |
| Status pages                  | 1 básica, con URL de UptimeRobot (sin dominio propio)             |
| Retención de historial        | 3 meses                                                           |
| Integraciones de alerta       | Hasta 5                                                           |
| SMS y llamadas                | No incluidos; se compran como créditos aparte                     |
| Usuarios adicionales          | No (ni de solo notificación ni con acceso)                        |
| Uso comercial                 | Permitido según los términos (sujeto a su Fair Use Policy)        |

Sobre el uso comercial: entre finales de 2024 y 2026 se publicó en varios sitios que el plan gratuito era solo para uso no comercial. Los términos vigentes (con cambios de mayo de 2026) dicen que UptimeRobot "está disponible para cualquier uso, incluido el comercial y empresarial", sujeto a una política de uso justo. La página de precios, eso sí, sigue describiendo el plan como adecuado para proyectos personales y sin ánimo de lucro: si dependes de él para un negocio, relee los términos en el momento de decidir.

Sobre la monitorización de certificados SSL y expiración de dominio, la página de precios se contradice (la tarjeta del plan gratuito la menciona y la tabla comparativa dice que es solo de pago): compruébalo en tu panel.

El primer plan de pago, **Solo**, cuesta 9 USD al mes con pago anual e incluye comprobaciones cada 60 segundos, 3 status pages, 12 meses de historial y heartbeat. Después vienen Team, Scale y Enterprise, con intervalos de hasta 30 y 15 segundos.

## Tipos de monitor

| Tipo          | Qué comprueba                                                                            | Úsalo para                                         |
| ------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **HTTP(S)**   | Que la URL responde con un código correcto (2xx/3xx)                                     | Webs y endpoints                                   |
| **Keyword**   | Que la respuesta contiene (o no contiene) un texto                                       | Detectar páginas que responden 200 pero muestran un error |
| **Ping**      | Que el servidor responde a ICMP                                                          | Servidores y equipos de red                        |
| **Puerto**    | Que un puerto TCP acepta conexiones (SMTP, SSH, base de datos…)                         | Servicios que no son HTTP                          |
| **Heartbeat** | Al revés: tu proceso llama a una URL única de UptimeRobot; si deja de llamar, alerta     | Cron jobs, backups, workers (solo planes de pago)  |

El **keyword** merece más uso del que tiene: muchas aplicaciones devuelven `200 OK` con una página de "algo salió mal", y un monitor HTTP normal la daría por buena. Buscar un texto que solo aparece cuando todo va bien (o que aparezca "error") lo detecta.

## Qué URL monitorizar

Lo ideal es un **endpoint de salud** propio, como `/health` o `/healthz`, que compruebe las dependencias críticas (base de datos, caché) y devuelva un código distinto de 2xx si algo falla. Cómo diseñarlo está en [health checks y apagado ordenado](/devops/observabilidad/observability-health-shutdown). Monitorizar solo la portada puede dar un falso "todo bien" si la portada es estática o está cacheada.

Si tu hosting gratuito "duerme" las aplicaciones inactivas, un monitor cada 5 minutos las mantiene despiertas; revisa antes si los términos de ese hosting lo permiten.

## Alertas

- **Email** está incluido en el plan gratuito.
- Integraciones como Slack, Microsoft Teams, Telegram, Discord, Google Chat, webhooks, Zapier o PagerDuty existen; el plan gratuito permite **hasta 5** (la página de precios no detalla cuáles).
- **SMS y llamadas** funcionan con créditos que se compran aparte.
- Hay app móvil para iOS y Android.

Antes de conectar canales ruidosos (SMS, llamadas), decide a quién le llega cada alerta y revisa en el panel las opciones de retraso o confirmación que ofrezca tu plan, para no despertarte por un fallo aislado de red. Qué hacer una vez llega la alerta está en [respuesta a incidentes](/devops/observabilidad/observability-incident-response).

## Status pages

Una **status page** es una página pública que muestra si tus servicios están operativos y el historial de incidencias. Sirve para que los usuarios no tengan que preguntar "¿está caído o soy yo?". El plan gratuito incluye una básica bajo una URL de UptimeRobot; el dominio propio (`status.tudominio.com`) y la personalización completa son de pago.

## Cuándo conviene y cuándo no

**Conviene** para proyectos personales, portfolios, MVPs y APIs pequeñas: 50 monitores gratis cubren con holgura casi cualquier proyecto individual.

**No conviene** como única monitorización de un servicio con usuarios que pagan: 5 minutos de intervalo es mucho para detectar caídas, no hay heartbeat para tareas programadas en el plan gratuito y no ve lo que pasa dentro de la aplicación. Alternativas: Better Stack, Checkly, Freshping o, si prefieres alojarlo tú, Uptime Kuma (open source); compara sus límites actuales.

## Fuentes

- [uptimerobot.com](https://uptimerobot.com)
- [Precios](https://uptimerobot.com/pricing/)
- [Términos de servicio](https://uptimerobot.com/terms/)
- [Heartbeat monitoring](https://uptimerobot.com/blog/new-feature-heartbeat-monitoring/)
