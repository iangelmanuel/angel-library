---
title: "agent-skills (Addy Osmani) — 25 skills para el ciclo completo de desarrollo"
description: "Paquete de skills que codifica prácticas de ingeniería por etapa —definir, planear, construir, verificar, revisar y publicar— con comandos de entrada, puertas de verificación, tablas de anti-racionalización y personas de revisión."
tags: [ai, skill, plugin, claude-code, codex, buenas-practicas, tdd, code-review, agentes]
sidebar:
  order: 28
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://skills.addy.ie
github: https://github.com/addyosmani/agent-skills
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - resources/ia/skills-sh
  - findings/hallazgos-ia/clawscan
note: "Licencia MIT. Instalar una skill suelta con `npx skills add … --skill` no copia la carpeta compartida `references/`: la skill funciona, pero sin sus listas de comprobación."
warnings:
  - Son prácticas opinadas. Si tu equipo trabaja de otra forma, una skill que impone un flujo ajeno genera fricción en cada tarea.
  - La integración con Claude Code incluye hooks; revísalos antes de habilitar el plugin en sesiones sin supervisión.
updatedAt: 2026-10-12
---

> Creado por **[Addy Osmani](https://github.com/addyosmani)**, con Federico Bartoli y Joan León como colaboradores. Licencia MIT.

## En pocas palabras

[agent-skills](https://github.com/addyosmani/agent-skills) es un paquete de **25 skills** —24 del ciclo de vida más la meta-skill `using-agent-skills`— que guían a un agente de código por prácticas de ingeniería concretas en cada etapa, con puertas de calidad y criterios de salida explícitos. Ronda las **105 000 estrellas en GitHub a octubre de 2026** y tiene sitio propio en [skills.addy.ie](https://skills.addy.ie).

Una **skill** es un `SKILL.md` con instrucciones que el agente carga cuando la tarea lo pide; aquí cada una es un procedimiento con pasos y evidencias, no un documento de referencia. Si el concepto es nuevo para ti, empieza por [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

## Qué problema resuelve

Un agente tiende al camino más corto: se salta la especificación, las pruebas, la revisión de seguridad o el plan de despliegue. agent-skills convierte ese criterio de ingeniería senior en flujos que el agente sigue de forma consistente. Muchas ideas vienen de la cultura de ingeniería de Google (*Software Engineering at Google*): Ley de Hyrum en diseño de APIs, pirámide de pruebas y Regla de Beyoncé, tamaño de cambio en revisión, Valla de Chesterton al simplificar, desarrollo basado en trunk.

## Instalación

### Cualquier agente: CLI de skills

La [CLI de skills.sh](/resources/ia/skills-sh) instala en más de 70 agentes (Claude Code, Cursor, Codex, Copilot, Cline…):

```bash
npx skills add addyosmani/agent-skills
```

Para ver el catálogo antes de instalar, o elegir solo algunas:

```bash
npx skills add addyosmani/agent-skills --list
npx skills add addyosmani/agent-skills --skill test-driven-development
```

### Claude Code (recomendado)

Desde el marketplace de plugins, que además trae los comandos y los hooks:

```text
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

El marketplace clona por SSH. Si no tienes claves de GitHub configuradas, usa la URL HTTPS en el primer paso (`/plugin marketplace add https://github.com/addyosmani/agent-skills.git`) o configura Git para reescribir SSH a HTTPS:

```bash
git config --global url."https://github.com/".insteadOf git@github.com:
```

Para desarrollo local:

```bash
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /ruta/a/agent-skills
```

### Otros agentes

| Agente      | Instalación según el README                                                                  | Invocación                          |
| ----------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| Codex (v0.122+) | `codex plugin marketplace add addyosmani/agent-skills` y `codex plugin add agent-skills@agent-skills` | `@spec-driven-development`          |
| Gemini CLI  | `gemini skills install https://github.com/addyosmani/agent-skills.git --path skills`         | Autodescubrimiento                  |
| Antigravity | `agy plugin install https://github.com/addyosmani/agent-skills.git`                          | Skills con espacio de nombres       |
| Cursor      | Copiar a `.cursor/skills/` y políticas cortas en `.cursor/rules/`                            | Autodescubrimiento                  |
| OpenCode    | Copiar a `.opencode/skills/` o `~/.config/opencode/skills/`                                  | Herramienta `skill`                 |
| Copilot     | Personas de `agents/` e instrucciones en `.github/copilot-instructions.md`                    | Por nombre de skill                 |

Los comandos de ciclo (`/spec`, `/plan`…) son de Claude Code (y Gemini CLI); en Copilot o Codex se invocan las skills por su nombre.

## Comandos de entrada

Nueve comandos que mapean el ciclo de desarrollo y activan las skills que corresponden:

| Comando          | Para qué                              | Principio                           |
| ---------------- | ------------------------------------- | ----------------------------------- |
| `/spec`          | Definir qué construir                 | Especificación antes que código     |
| `/plan`          | Planear cómo construirlo              | Tareas pequeñas y atómicas          |
| `/build`         | Construir por incrementos             | Una porción cada vez                |
| `/test`          | Demostrar que funciona                | Las pruebas son la evidencia        |
| `/constraints`   | Fijar la barra de calidad             | Se decide una vez, se aplica siempre |
| `/review`        | Revisar antes de mergear              | Mejorar la salud del código         |
| `/webperf`       | Auditar rendimiento web               | Medir antes de optimizar            |
| `/code-simplify` | Simplificar                           | Claridad antes que ingenio          |
| `/ship`          | Publicar en producción                | Más rápido es más seguro            |

`/build auto` genera el plan e implementa todas las tareas en una pasada tras una única aprobación: cada tarea sigue siendo guiada por pruebas y con su propio commit, y se detiene ante fallos o pasos de riesgo. Las skills también se activan solas: diseñar una API dispara `api-and-interface-design`; construir UI, `frontend-ui-engineering`.

## Las 25 skills por etapa

| Etapa     | Skills                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Meta      | `using-agent-skills` (decide qué skill aplica)                                                                                                                           |
| Definir   | `interview-me`, `idea-refine`, `spec-driven-development`, `constraint-driven-development`                                                                               |
| Planear   | `planning-and-task-breakdown`                                                                                                                                            |
| Construir | `incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `frontend-ui-engineering`, `api-and-interface-design` |
| Verificar | `browser-testing-with-devtools`, `debugging-and-error-recovery`                                                                                                          |
| Revisar   | `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`                                                                  |
| Publicar  | `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch` |

Algunas destacan: `interview-me` hace una pregunta cada vez hasta tener claro qué quieres; `doubt-driven-development` somete cada decisión importante a una revisión adversarial con contexto limpio; `browser-testing-with-devtools` usa el MCP de Chrome DevTools para leer DOM, consola y red.

## Personas de revisión y listas de comprobación

Incluye cuatro **personas** (agentes con un rol fijo): `code-reviewer`, `test-engineer`, `security-auditor` y `web-performance-auditor`. `/ship` las lanza en paralelo y combina sus hallazgos en una decisión de publicar o no. La carpeta `references/` aporta siete listas: definición de terminado, patrones de pruebas, seguridad, rendimiento, accesibilidad, observabilidad y orquestación.

## Cómo está escrita cada skill

El formato es reutilizable para escribir las tuyas:

- frontmatter con `name` y `description` ("Úsala cuando…");
- resumen y condiciones de activación;
- el proceso, paso a paso;
- una **tabla de anti-racionalización**: las excusas habituales para saltarse el paso ("esto es demasiado simple para probarlo") con su réplica;
- señales de alarma y requisitos de verificación: "parece correcto" nunca basta.

El repositorio también incluye evaluaciones en tres niveles (estructura, enrutamiento de descripciones y comportamiento real) que comprueban que cada skill se active cuando debe y no choque con otra.

## Cuándo conviene y cuándo no

Conviene si quieres llevar una funcionalidad por todas las etapas con un punto de control humano en cada una, o si buscas una base de prácticas para un equipo que delega mucho en agentes. El propio repositorio publica una [comparativa](https://github.com/addyosmani/agent-skills/blob/main/docs/comparison.md) con [Superpowers](/skills/ia-skills/skill-superpowers) (más orientado a ejecuciones autónomas largas con subagentes) y con las [skills de Matt Pocock](/findings/hallazgos-recursos/matt-pocock-skills) (un kit más corto y muy centrado en requisitos y TDD).

No conviene instalar las 25 de golpe en un proyecto pequeño: compiten por el contexto. Empieza por dos o tres de la etapa donde realmente pierdes tiempo.

## Antes de instalar

1. **Lee lo que instalas.** Una skill son instrucciones que entran al contexto de un agente con acceso a tu repositorio. Puedes pasarlas por un escáner como [ClawScan](/findings/hallazgos-ia/clawscan).
2. **`references/` no viaja con las skills sueltas.** Para tener las listas, integra el repositorio completo o copia a mano las que necesites dentro de la skill instalada.
3. **Revisa los hooks** del plugin de Claude Code antes de usarlo sin supervisión.
4. **Adapta, no impongas.** Si tu equipo tiene otro flujo de Git o de pruebas, edita la skill o no la instales.

## Fuentes

- [Repositorio y README de agent-skills](https://github.com/addyosmani/agent-skills)
- [Sitio oficial](https://skills.addy.ie)
- [Comparativa con Superpowers y Matt Pocock's skills](https://github.com/addyosmani/agent-skills/blob/main/docs/comparison.md)
