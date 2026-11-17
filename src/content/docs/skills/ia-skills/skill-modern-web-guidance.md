---
title: "Modern Web Guidance — la skill de Google Chrome para que el agente use la web moderna"
description: "Skill y CLI de Google Chrome, mantenida junto a los equipos de Edge, Firefox y MDN, que inyecta en el contexto del agente guías de APIs modernas de HTML, CSS y JavaScript con datos de compatibilidad Baseline, en vez de patrones antiguos o polyfills pesados."
tags: [ai, skill, frontend, html, css, javascript, baseline, accesibilidad, rendimiento, claude-code, codex, copilot]
sidebar:
  order: 37
draft: false
tool: Cross-tool
runtime: Node.js 22 o superior
resourceCategory: Documentación oficial
official: true
website: https://developer.chrome.com/docs/modern-web-guidance
github: https://github.com/GoogleChrome/modern-web-guidance
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - skills/ia-skills/skill-frontend-design
  - skills/ia-skills/skill-impeccable
  - frontend/frontend-fundamentos/frontend-fundamentals-terminology
note: "Versión 1.0 desde el 10 de noviembre de 2026 (1.0.1 el 16 de noviembre). Código bajo Apache 2.0 y guías bajo CC BY 4.0. Ronda las 20.000 estrellas en GitHub."
warnings:
  - "Envía telemetría anónima a Google por defecto: número de instalaciones, nombre del agente, IDs de las guías recuperadas y las consultas de búsqueda que genera el agente (no tus prompts). Se desactiva con `DISABLE_TELEMETRY=1`."
  - "Se ejecuta con `npx ...@latest`, así que cada uso descarga la última versión publicada en npm. Si tu entorno exige versiones fijadas, instala una versión concreta."
  - "Quien la instaló desde el marketplace `claude-plugins-official` de Claude Code se quedó en la v0.0.194; hay que reinstalarla desde el marketplace `googlechrome` para recibir actualizaciones."
updatedAt: 2026-11-16
---

## En pocas palabras

**Modern Web Guidance** es un conjunto de [skills](/skills/skills-fundamentos/ai-tools-skills-fundamentals) (instrucciones que un agente carga cuando la tarea lo pide) más una pequeña CLI. Cuando el agente va a escribir HTML, CSS o JavaScript de cliente, primero busca en un catálogo de guías curadas y mete en su contexto la que encaja: el patrón moderno, sus trampas y un fallback ligero para navegadores que aún no lo soportan.

La publica Google Chrome y, desde la versión 1.0, la mantienen también los equipos de **Microsoft Edge, Mozilla Firefox y MDN**, junto a la comunidad.

## Qué problema resuelve

Los modelos se entrenan con mucho más código antiguo que moderno. Por eso, aunque "conozcan" una API, tienden a resolver un modal con un `div` y JavaScript a medida, un tooltip con una librería de posicionamiento o una validación con lógica propia, cuando hoy existen `<dialog>`, _anchor positioning_ o `:user-invalid`. El resultado es más JavaScript, peor rendimiento y peor accesibilidad.

La skill corrige ese sesgo con tres criterios, según su README:

- **APIs modernas bien usadas**: cómo estructurar las que los modelos suelen usar mal.
- **Rendimiento y accesibilidad**: preferir lo que el navegador ya optimiza y trae accesible.
- **Fallbacks responsables**: alternativas pequeñas (menos de 50 líneas) o polyfills cargados solo si hacen falta, en lugar de librerías pesadas.

## Cómo funciona

1. **Activación**: el agente activa la skill `modern-web-guidance` cuando la tarea toca interfaz web, CSS o JavaScript de cliente. Su `SKILL.md` excluye explícitamente backend, infraestructura y configuración de herramientas.
2. **Búsqueda local**: el agente ejecuta `search` con una consulta corta en inglés. La CLI compara la consulta con el catálogo mediante un modelo de _embeddings_ sin dependencias y BM25 (un algoritmo clásico de búsqueda por texto), **sin llamadas de red ni API keys** para la búsqueda en sí.
3. **Recuperación**: con `retrieve <id>` obtiene la guía completa (patrón, trampas, fallback) y la añade a su contexto.
4. **Verificación y aviso**: el agente comprueba su código contra la guía y cierra la respuesta con una sección `### Modern Web Guidance` que explica qué guías aplicó.

La compatibilidad se apoya en **[Baseline](https://web.dev/baseline)**, el indicador de qué funciones están disponibles en todos los navegadores principales (Chrome, Edge, Firefox y Safari). Las APIs en _Origin Trial_ (pruebas experimentales de Chrome) y las funciones "volátiles" (de un solo motor, publicadas hace menos de tres meses o aún inestables) aparecen en `search`, pero `retrieve` las bloquea hasta que las habilitas a propósito.

## Qué cubre

Según el README, más de 200 guías por casos de uso que cubren unas 260 funciones de la plataforma web: 140 de CSS y layout, 37 de HTML y DOM y 85 de JavaScript y APIs.

| Área                 | Ejemplos                                                                       |
| -------------------- | ------------------------------------------------------------------------------ |
| Experiencia de usuario | View Transitions, animaciones de entrada y salida, `scrollbar-color`         |
| Layout CSS           | Container queries, `subgrid`, `oklch`, `text-wrap`                             |
| Rendimiento          | Precarga, diagnóstico de INP, `scheduler.yield`                                |
| Formularios y UI     | Anchor positioning, Popover API, `<dialog>`, `:user-invalid`, `field-sizing`   |
| Accesibilidad        | Lector de pantalla, teclado, contraste, movimiento reducido                    |
| IA integrada         | APIs locales de traducción, resumen y detección de idioma                     |

Hay dos paquetes de skills: `modern-web-guidance` (el general) y `chrome-extensions` (Manifest V3, service workers y publicación en la Chrome Web Store).

## Instalación

El instalador interactivo detecta tus agentes:

```bash
npx modern-web-guidance@latest install
```

Para elegir qué paquetes instalar:

```bash
npx modern-web-guidance@latest install --choose
```

Con la [Skills CLI](/resources/ia/skills-sh) de Vercel o con GitHub CLI:

```bash
npx skills add GoogleChrome/modern-web-guidance
gh skill install GoogleChrome/modern-web-guidance
```

Como plugin de Claude Code o de GitHub Copilot CLI:

```text
/plugin marketplace add GoogleChrome/modern-web-guidance
/plugin install modern-web-guidance@googlechrome
```

Con OpenAI Codex:

```bash
codex plugin marketplace add GoogleChrome/modern-web-guidance
codex plugin add modern-web-guidance@googlechrome
```

El README también da comandos para Google Antigravity (`agy`), Grok Build y Kimi Code, y el repositorio incluye manifiestos de plugin para Cursor y Gemini. Para actualizar una instalación hecha con el instalador:

```bash
npx modern-web-guidance@latest update
```

## Uso sin instalar

La CLI funciona sola, útil para probarla o para consultarla tú mismo:

```bash
npx modern-web-guidance@latest search "animate a dialog modal backdrop"
npx modern-web-guidance@latest retrieve "animate-to-from-top-layer"
npx modern-web-guidance@latest legacy-scan .
```

`legacy-scan` (nuevo en la 1.0) analiza un proyecto en busca de patrones antiguos y enlaza cada hallazgo con la guía que lo moderniza. Solo cubre el ~20 % de las guías, las que tienen reglas deterministas.

Para habilitar funciones experimentales en un repositorio se crea un `.mwgrc` (o `~/.mwgrc` a nivel de usuario):

```bash
npx modern-web-guidance@latest set-allow-origin-trials
npx modern-web-guidance@latest set-allow-volatile-features
```

## Evaluaciones

El proyecto publica un [panel de evaluaciones](https://googlechrome.github.io/modern-web-guidance-src/): tareas realistas sobre aplicaciones de prueba ("haz que mis imágenes carguen más rápido", sin nombrar la API) que verifican con Playwright, ejecutadas con y sin la skill. En la muestra del README de noviembre de 2026, la tasa de acierto sube unos 30 puntos con la guía en Claude Code, Codex y Antigravity. Son cifras del propio proyecto, con sus aplicaciones de prueba.

## Cuándo conviene y cuándo no

- **Conviene** si generas interfaces con un agente y quieres HTML semántico, CSS moderno y menos dependencias, o si vas a modernizar una base de código antigua.
- **Complementa**, no sustituye, a skills de dirección visual como [frontend-design](/skills/ia-skills/skill-frontend-design) o [impeccable](/skills/ia-skills/skill-impeccable): esta dice _qué API usar_, aquellas _qué aspecto debe tener_.
- **No aporta** en backend, scripts, CI o configuración de herramientas: la propia skill indica no activarse ahí.
- Si tu proyecto debe soportar navegadores muy antiguos, revisa los fallbacks que propone antes de aceptarlos.

## Fuentes

- [Documentación oficial en Chrome for Developers](https://developer.chrome.com/docs/modern-web-guidance)
- [Repositorio de distribución](https://github.com/GoogleChrome/modern-web-guidance) y [notas de la v1.0.0](https://github.com/GoogleChrome/modern-web-guidance/releases/tag/v1.0.0)
- [Repositorio del código fuente](https://github.com/GoogleChrome/modern-web-guidance-src)
- [Panel de evaluaciones](https://googlechrome.github.io/modern-web-guidance-src/)
- [Baseline en web.dev](https://web.dev/baseline)
