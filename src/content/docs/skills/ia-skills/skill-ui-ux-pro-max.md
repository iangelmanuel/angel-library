---
title: "UI/UX Pro Max: base de datos de diseño consultable por el agente"
description: "Skill con un motor de búsqueda local (BM25 en Python) sobre estilos, paletas, tipografías, patrones de landing y guías UX, que genera un sistema de diseño a medida del producto antes de escribir la interfaz."
tags: [ai, skill, frontend, diseño, design-system, ux, tipografia, color, claude-code, cursor, codex]
sidebar:
  order: 25
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://uupm.cc
github: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
technologies:
  - skills/ia-skills/skill-impeccable
  - skills/ia-skills/skill-taste
  - skills/ia-skills/skill-frontend-design
  - skills/skills-fundamentos/design-md
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
note: Licencia MIT. Requiere Python 3 para el script de búsqueda (solo biblioteca estándar, sin llamadas de red). Existe una versión Premium de pago con skills de marca, logos y slides.
warnings:
  - El paquete npm vigente es `ui-ux-pro-max-cli` (comando `uipro`); las versiones antiguas de `uipro-cli` están desactualizadas.
  - "No subas el ZIP completo del repositorio a claude.ai como skill: supera el límite de 200 archivos y no es un artefacto de skill."
updatedAt: 2026-10-12
---

## En pocas palabras

[UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) es una skill de "inteligencia de diseño": en vez de dejar que el modelo improvise colores y tipografías, le da una **base de datos local** (archivos CSV) y un **script de búsqueda en Python** que recomienda estilo, paleta, tipografía, estructura de página y anti-patrones según el tipo de producto. El agente consulta esa base, genera un sistema de diseño y después implementa la interfaz con él.

Lo mantiene el equipo de NextLevelBuilder, con licencia MIT, y tiene **~135 k estrellas a octubre de 2026**. La versión 2.x añadió el generador de sistemas de diseño.

## Qué problema resuelve

Pedirle a un agente "hazme una landing" suele producir la misma estética genérica: degradados morados, tarjetas idénticas, tipografía por defecto. UI/UX Pro Max ataca el problema con datos curados:

- un spa recibe una paleta suave y tipografía serif elegante;
- un banco recibe la advertencia explícita de **no** usar degradados morados de "estética IA";
- todo resultado trae una lista de comprobación previa a la entrega (contraste 4.5:1, foco visible, `prefers-reduced-motion`, puntos de corte 375/768/1024/1440 px, iconos SVG en vez de emojis).

## Cómo funciona

1. **Petición**: "Construye una landing para mi spa".
2. **Búsqueda multidominio** (cinco búsquedas en paralelo): tipo de producto, estilo, paleta, patrón de landing y emparejamiento tipográfico.
3. **Motor de razonamiento**: aplica reglas por industria, prioriza estilos con ranking BM25, filtra anti-patrones y procesa reglas de decisión en JSON.
4. **Salida**: patrón + estilo + colores + tipografía + efectos + anti-patrones + checklist.

BM25 es un algoritmo clásico de ranking de texto por relevancia (el de los buscadores antes de los embeddings): rápido, determinista y sin modelo.

### Qué contiene la base

| Dato                  | Cantidad (según el README)                                           |
| --------------------- | -------------------------------------------------------------------- |
| Estilos de UI         | 79 consultables, 50 activos (glassmorphism, brutalism, bento grid, Fluent 2, Polaris…) |
| Tipos de producto y reglas de razonamiento | 192                                             |
| Paletas de color      | 192, una por tipo de producto                                        |
| Emparejamientos tipográficos | 74, con import de Google Fonts                                |
| Patrones de landing   | 34                                                                   |
| Tipos de gráfico      | 25                                                                   |
| Guías UX              | 119                                                                  |
| Stacks                | 22: HTML + Tailwind (por defecto), React, Next.js, shadcn/ui, Vue, Nuxt, Svelte, Astro, Angular, Laravel, SwiftUI, Jetpack Compose, React Native, Flutter, WPF, WinUI 3, Three.js… |

El plugin de Claude Code incluye además skills auxiliares en `.claude/skills/`: `design-system`, `design`, `ui-styling`, `brand`, `banner-design` y `slides`.

## Instalación

**Claude Code**, desde el marketplace del repositorio:

```text
/plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
/plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

**CLI (vía recomendada por el README)**, que genera los archivos correctos para cada agente desde plantillas:

```bash
npm install -g ui-ux-pro-max-cli
cd /ruta/a/tu/proyecto
uipro init --ai claude
```

Cambia `claude` por el agente que uses: `cursor`, `codex`, `windsurf`, `copilot`, `gemini`, `opencode`, `kiro`, `roocode`, `continue`, `droid`, `kilocode`, `warp`, `augment`, `amazonq`, `universal` (estándar `.agents/skills/`) o `all`. Sin instalación global:

```bash
npx ui-ux-pro-max-cli init --ai cursor
```

Otras opciones útiles:

```bash
uipro init --ai claude --global   # en ~/.claude/skills/ para todos los proyectos
uipro init --dry-run              # muestra lo que haría sin escribir nada
uipro update                      # refresca los archivos desde el paquete instalado
uipro uninstall                   # elimina la skill (detecta la plataforma)
```

Comprueba que tienes Python 3 (`python3 --version`). El README indica que el agente **no** debe instalarlo por ti: debe pedírtelo.

## Uso

En la mayoría de agentes (Claude Code, Cursor, Codex, Gemini CLI, OpenCode…) la skill se activa sola ante cualquier petición de UI:

```text
Crea un dashboard de analítica para una clínica, con modo oscuro.
```

En Kiro, GitHub Copilot, Roo Code y KiloCode se invoca como comando:

```text
/ui-ux-pro-max Construye una landing para mi producto SaaS
```

### Generador directo y persistencia

El script también se puede ejecutar a mano (la ruta cambia según el agente: `.cursor/skills/`, `.factory/skills/`…):

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fintech banking" --design-system -f markdown
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form validation" --stack react
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "SaaS dashboard" --design-system --persist -p "MyApp" --page "dashboard"
```

Con `--persist` crea `design-system/<proyecto>/MASTER.md` (fuente de verdad global) y `pages/<página>.md` con las excepciones por página: el agente lee primero la página y, si no existe, el maestro. Es la misma idea que un [`DESIGN.md`](/skills/skills-fundamentos/design-md) compartido entre sesiones.

## Cuándo conviene y cuándo no

**Conviene** para proyectos nuevos o prototipos donde aún no hay dirección visual, y para equipos sin diseñador que necesitan un punto de partida razonable y accesible.

**No conviene** si el proyecto ya tiene un sistema de diseño propio: las recomendaciones por industria pueden chocar con tus tokens. En ese caso, fija tus tokens en un `DESIGN.md` y usa la skill solo para consultas puntuales (`--domain ux`, `--stack`).

Comparación con vecinas de esta sección:

- [Taste](/skills/ia-skills/skill-taste) y [frontend-design](/skills/ia-skills/skill-frontend-design) orientan el gusto durante la generación mediante instrucciones;
- UI/UX Pro Max aporta **datos consultables** y un sistema de diseño explícito;
- [Impeccable](/skills/ia-skills/skill-impeccable) brilla al **auditar y pulir** una interfaz existente.

Pueden combinarse si todas reciben los mismos tokens.

## Límites y precauciones

- **Revisa lo que instalas.** Las skills entran al contexto de un agente con acceso al repositorio, y esta incluye scripts Python que el agente ejecuta. El README afirma que solo usan la biblioteca estándar y no hacen llamadas de red; compruébalo tú.
- **Recomendaciones, no verdad.** La paleta "correcta para un spa" es una heurística. Valida contraste y accesibilidad en tu interfaz real.
- **Respuestas largas en Claude Code.** Si aparece `response exceeded the ... output token maximum`, pide dividir la tarea en pasos y escribir resultados en archivos.
- **Versión Premium.** El repositorio es la versión básica open source; el sitio ofrece una versión de pago con skills de marca, logos e iconografía.
- **Instalación por marketplace anterior a v2.5.1.** Fallaba con enlaces simbólicos; usa la CLI si te ocurre.

## Fuentes

- [Repositorio y README de UI/UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Sitio oficial](https://uupm.cc)
- [Paquete `ui-ux-pro-max-cli` en npm](https://www.npmjs.com/package/ui-ux-pro-max-cli)
