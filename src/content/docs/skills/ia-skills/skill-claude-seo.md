---
title: "Claude SEO — auditorías SEO completas desde Claude Code"
description: "Plugin open source de Claude Code con 26 sub-skills y 19 subagentes que auditan un sitio en vivo: SEO técnico, E-E-A-T, Schema.org, búsqueda con IA (GEO), SEO local, e-commerce e internacional, con un plan de acción priorizado."
tags: [ai, skill, plugin, seo, auditoria, schema, geo, claude-code]
sidebar:
  order: 33
draft: false
tool: Claude Code
resourceCategory: Sitio oficial
official: true
website: https://claude-seo.md
github: https://github.com/AgriciDaniel/claude-seo
technologies:
  - skills/ia-skills/skill-seo-astro
  - skills/ia-skills/skill-seo-nextjs
  - seo/seo-tecnico/seo-auditoria-migraciones
note: "Licencia MIT. Requiere Claude Code y Python 3.10 o posterior (el README recomienda 3.11+ para instalaciones nuevas); Playwright Chromium es opcional y solo hace falta para renderizar SPA y capturas."
warnings:
  - "Cinco de los agentes corren en Opus desde la v2.3.1: una auditoría completa consume bastante más uso de Claude que un prompt normal."
  - "Las extensiones MCP (SE Ranking, Profound, Bing Webmaster…) envuelven servicios de terceros con cuenta propia, algunos de pago."
  - "Existe un espejo privado de la comunidad (AI-Marketing-Hub/claude-seo); instala desde AgriciDaniel/claude-seo si quieres la versión pública."
updatedAt: 2026-10-12
---

## En pocas palabras

[Claude SEO](https://github.com/AgriciDaniel/claude-seo) es un plugin para Claude Code creado por Agrici Daniel. Añade la familia de comandos `/seo` y, cuando le pides una auditoría, un orquestador reparte el trabajo entre subagentes especializados que analizan el sitio en paralelo y devuelven un plan de acción priorizado en Markdown (y, si quieres, en PDF).

Es el proyecto más conocido con ese nombre: unas 18 700 estrellas en GitHub a octubre de 2026, versión v2.4.2 y desarrollo activo. Existe un port para Codex del mismo autor, [Codex SEO](https://github.com/AgriciDaniel/codex-seo).

Dos conceptos para situarse:

- Una **skill** es una carpeta con un `SKILL.md` que el agente carga cuando la tarea lo pide (ver [fundamentos de skills](/skills/skills-fundamentos/ai-tools-skills-fundamentals)).
- Un **subagente** es una instancia aparte del modelo con su propio contexto e instrucciones. Claude SEO los usa para que cada área (schema, contenido, rendimiento…) se analice sin llenar el contexto de la conversación principal.

## En qué se diferencia de las skills de SEO de esta biblioteca

La biblioteca ya tiene [SEO en Astro](/skills/ia-skills/skill-seo-astro) y [SEO en Next.js](/skills/ia-skills/skill-seo-nextjs). Hacen cosas distintas y se complementan:

| | Skills de esta biblioteca (Astro / Next.js) | Claude SEO |
| --- | --- | --- |
| Qué hacen | **Implementan** un sistema SEO en el código: `SITE.seo`, JSON-LD, head, sitemap, robots | **Auditan** un sitio ya publicado (o en local) y proponen cambios |
| Entrada | El repositorio | Una URL |
| Alcance | Un patrón concreto y opinado por framework | Técnico, contenido, schema, IA, local, e-commerce, i18n, backlinks |
| Salida | Archivos de código en tu proyecto | Informes `.md`, PDF y JSON con hallazgos priorizados |
| Dependencias | Ninguna, solo el agente | Python, opcionalmente Playwright y APIs de Google |

Un flujo razonable: montas el SEO con la skill de tu framework, despliegas y pasas `/seo audit` sobre la URL para encontrar lo que falte.

## Instalación

Como plugin de Claude Code (versión 1.0.33 o posterior), dentro de una sesión:

```text
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

`/seo setup` crea un entorno de Python aislado en los datos persistentes del plugin e instala Playwright Chromium; no toca paquetes globales ni el `PATH`. `/seo doctor` comprueba en cualquier momento que el entorno está listo sin cambiar nada.

Instalación manual en macOS o Linux:

```bash
git clone --depth 1 https://github.com/AgriciDaniel/claude-seo.git
bash claude-seo/install.sh
```

En Windows, desde PowerShell:

```powershell
git clone --depth 1 https://github.com/AgriciDaniel/claude-seo.git
powershell -ExecutionPolicy Bypass -File claude-seo\install.ps1
```

El README recomienda clonar y revisar el script antes de ejecutarlo en vez de usar `irm | iex`, precisamente para poder leer lo que se va a correr. Para desinstalar existe `uninstall.sh`.

## Uso

```text
/seo audit https://example.com
/seo page https://example.com/about
/seo schema https://example.com
/seo geo https://example.com
/seo sitemap generate
```

Según el README hay 34 comandos invocables entre el orquestador, sus sub-skills y las extensiones. Los más útiles para empezar:

| Comando | Para qué |
| --- | --- |
| `/seo audit <url>` | Auditoría completa con subagentes en paralelo (hasta 17 a la vez) |
| `/seo page <url>` | Análisis profundo de una sola página |
| `/seo technical <url>` | SEO técnico en 9 categorías |
| `/seo content <url>` | Calidad de contenido y E-E-A-T |
| `/seo schema <url>` | Detectar, validar y generar marcado Schema.org |
| `/seo geo <url>` | Preparación para AI Overviews y búsqueda generativa |
| `/seo agentic <url>` | Preparación para agentes: Lighthouse Agentic Browsing, `llms.txt`, WebMCP |
| `/seo local <url>` | SEO local: perfil de empresa en Google, citas, reseñas |
| `/seo hreflang <url>` | Auditoría y generación de `hreflang` |
| `/seo google [comando]` | Search Console, PageSpeed, CrUX, GA4 e informes PDF |
| `/seo drift baseline \| compare <url>` | Instantáneas en SQLite para detectar regresiones entre auditorías |

La lista completa está en `docs/COMMANDS.md` del repositorio.

## Cómo funciona

El orquestador (`skills/seo/SKILL.md`) detecta el tipo de sitio (SaaS, local, e-commerce, medio, agencia), lanza los subagentes que tocan y sintetiza sus hallazgos. Skills y agentes se descubren solos desde `skills/seo-*/` y `agents/seo-*.md`, así que se pueden editar en local.

Cada recomendación sale con cuatro campos: la observación en la que se basa, de qué otras recomendaciones depende, una comprobación de "cómo sabríamos que esto falló" y un indicador adelantado que vigilar. Es lo que el README llama recomendaciones *falsables*: la idea es que cada consejo se pueda verificar, no solo aceptar.

Para páginas renderizadas en el cliente (React, Vue, Next.js con mucho JavaScript) usa un renderizador con Playwright que detecta cascarones vacíos tipo `<div id="root">` y cambia a una carga renderizada.

### Datos externos opcionales

Funciona sin ninguna clave. Las credenciales de Google se añaden por niveles con `/seo google setup` y se guardan en `~/.config/claude-seo/` con permisos `0o600`:

| Nivel | Credencial | Qué desbloquea |
| --- | --- | --- |
| 0 | API key | PageSpeed Insights, CrUX e historial de CrUX |
| 1 | + OAuth o cuenta de servicio | Search Console, inspección de URL, Indexing API |
| 2 | + propiedad de GA4 | Tráfico orgánico, páginas de entrada, desglose por país y dispositivo |
| 3 | + token de Google Ads | Volumen de búsqueda del Keyword Planner |

Sin credenciales, Core Web Vitals son estimaciones de laboratorio y la indexación se infiere de señales de la página.

## Cuándo conviene y cuándo no

Conviene cuando necesitas una auditoría amplia y repetible de un sitio, cuando quieres revisar schema, contenido o preparación para búsqueda con IA sin montar varias herramientas, o cuando un sitio ya está en producción y quieres comparar su estado entre semanas con `/seo drift`.

No reemplaza a un crawler dedicado como Screaming Frog para grafos de enlaces grandes (el propio README lo dice) ni sustituye datos reales de Search Console. Para **construir** el SEO de un proyecto nuevo, las skills de [Astro](/skills/ia-skills/skill-seo-astro) y [Next.js](/skills/ia-skills/skill-seo-nextjs) son más directos.

## Límites y precauciones

- **Coste de uso.** Varias decenas de subagentes, algunos en Opus, consumen bastante cuota. Empieza con `/seo page` antes de lanzar `/seo audit` sobre un sitio grande.
- **Hidratación tardía.** El README admite hallazgos ruidosos en páginas que cargan contenido al hacer scroll o tras una interacción.
- **Las afirmaciones sobre Google cambian.** El proyecto mantiene un registro de cambios de Google y lo refresca en cada versión; actualiza el plugin antes de basar decisiones en él.
- **Lo que no prometa una fuente primaria, no lo tomes como regla.** El propio proyecto marca heurísticas de terceros (por ejemplo, la longitud de pasajes citables) como tales.
- **Revisa antes de aplicar.** Los informes proponen cambios; aplicarlos al código sigue siendo tu decisión.

## Fuentes

- [Repositorio y README de Claude SEO](https://github.com/AgriciDaniel/claude-seo)
- [Sitio oficial](https://claude-seo.md)
- [Referencia de comandos](https://github.com/AgriciDaniel/claude-seo/blob/main/docs/COMMANDS.md)
