---
title: "Superpowers: metodología de desarrollo completa para agentes"
description: "Framework de skills componibles de Jesse Vincent (Prime Radiant) que obliga al agente a seguir un flujo fijo: aclarar la idea, planear, trabajar en un worktree, TDD estricto, subagentes con revisión y cierre de rama."
tags: [ai, skill, plugin, metodologia, tdd, subagentes, worktrees, claude-code, codex, cursor]
sidebar:
  order: 23
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://primeradiant.com/superpowers/
github: https://github.com/obra/superpowers
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - agents/claude-code/claude-code-plugins
  - agents/claude-code/claude-code-subagentes
  - skills/ia-skills/skill-tdd
  - skills/ia-skills/skill-addyosmani-agent-skills
note: Licencia MIT. Se instala por separado en cada agente que uses (Claude Code, Codex, Cursor, Gemini CLI…); los flujos son obligatorios, no sugerencias.
warnings:
  - El compañero visual opcional de brainstorming carga un logo desde la web de Prime Radiant con la versión instalada; se desactiva con `SUPERPOWERS_DISABLE_TELEMETRY` o con `DISABLE_TELEMETRY` de Claude Code.
  - La skill de TDD borra el código escrito antes de su test. Útil como disciplina, sorprendente si no lo esperas.
  - Las sesiones largas en modo subagentes consumen bastantes tokens; para cambios pequeños puede ser más proceso del necesario.
updatedAt: 2026-10-12
---

## En pocas palabras

[Superpowers](https://github.com/obra/superpowers) no es una skill suelta sino una **metodología de desarrollo empaquetada como skills**. Una *skill* es un archivo de instrucciones (`SKILL.md`) que el agente carga cuando la tarea encaja con su descripción; aquí hay unas quince que se encadenan entre sí, más una skill de arranque (`using-superpowers`) que se inyecta al iniciar la sesión y le dice al agente que revise las skills disponibles antes de cada tarea. Si el concepto es nuevo para ti, empieza por [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

Lo creó **Jesse Vincent** y lo mantiene su empresa, **Prime Radiant**. Es el repositorio de skills más popular de GitHub: **~298 k estrellas a octubre de 2026**. Se publicó en octubre de 2025 ([anuncio original](https://blog.fsck.com/2025/10/09/superpowers/)).

## Qué problema resuelve

Un agente sin proceso tiende a saltar directamente a escribir código: interpreta la petición a su manera, implementa todo de golpe y declara éxito sin haber probado nada. Superpowers impone el orden que seguiría un equipo disciplinado:

1. preguntar qué quieres realmente antes de construir;
2. enseñarte el diseño en trozos legibles y esperar tu visto bueno;
3. escribir un plan tan detallado que un junior sin contexto pudiera seguirlo;
4. ejecutarlo tarea a tarea con tests primero y revisión entre tareas;
5. verificar antes de decir "listo".

Según el README, no es raro que el agente trabaje de forma autónoma un par de horas sin desviarse del plan aprobado.

## Cómo funciona: el flujo básico

Las skills se disparan solas según el momento de la conversación; no hay que invocarlas a mano.

| Paso | Skill                                                       | Qué hace                                                                                                                              |
| ---- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `brainstorming`                                             | Antes de construir, saca la intención con preguntas y te la devuelve para corregirla. Cambios pequeños se acuerdan en el chat; proyectos generan un documento de diseño. |
| 2    | `using-git-worktrees`                                       | Con el diseño aprobado, crea un *worktree* (copia de trabajo aislada) en una rama nueva, prepara el proyecto y comprueba que los tests pasan de partida. |
| 3    | `writing-plans`                                             | Divide el trabajo en tareas de 2 a 5 minutos con rutas exactas, código completo y pasos de verificación.                              |
| 4    | `subagent-driven-development` o `executing-plans`           | O lanza un subagente nuevo por tarea con revisión tras cada una (lo más riguroso), o lo hace todo en la sesión actual con una revisión final de la rama (lo más barato). |
| 5    | `test-driven-development`                                   | RED-GREEN-REFACTOR: test que falla, verlo fallar, código mínimo, verlo pasar, commit.                                                |
| 6    | `requesting-code-review`                                    | Entre tareas, revisa contra el plan y reporta por severidad; lo crítico bloquea el avance.                                            |
| 7    | `finishing-a-development-branch`                            | Al terminar, verifica tests, ofrece fusionar, abrir PR, conservar o descartar, y limpia el worktree.                                  |

## Skills incluidas

| Grupo        | Skills                                                                                                                                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Testing      | `test-driven-development` (incluye referencia de anti-patrones de testing)                                                                                                                                                          |
| Depuración   | `systematic-debugging` (proceso de causa raíz en cuatro fases), `verification-before-completion`, `diagnosing-superpowers`                                                                                                          |
| Colaboración | `brainstorming`, `writing-plans`, `executing-plans`, `dispatching-parallel-agents`, `requesting-code-review`, `receiving-code-review`, `using-git-worktrees`, `finishing-a-development-branch`, `subagent-driven-development`        |
| Meta         | `writing-skills` (crear y probar skills nuevas), `using-superpowers` (arranque del sistema)                                                                                                                                         |

`diagnosing-superpowers` merece mención: si una sesión se porta mal (una skill que no salta, un plan ignorado, demasiados tokens), le pides al agente "figure out what went wrong with superpowers in this session" y lee la transcripción, reporta con evidencia por línea y puede empaquetar un informe de error depurado.

## Instalación

Cada agente tiene su vía. Si usas varios, hay que instalarlo en cada uno.

**Claude Code**, desde el marketplace oficial de plugins de Anthropic (ver [plugins de Claude Code](/agents/claude-code/claude-code-plugins)):

```text
/plugin install superpowers@claude-plugins-official
```

O desde el marketplace propio del proyecto, que trae además plugins relacionados:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

**Codex**: está en el marketplace oficial de plugins de Codex. En la app, *Plugins* → sección *Coding* → `+` junto a Superpowers. En la CLI, abre `/plugins`, busca `superpowers` y elige *Install Plugin*.

**Cursor**, en el chat del agente:

```text
/add-plugin superpowers
```

**Gemini CLI**:

```bash
gemini extensions install https://github.com/obra/superpowers
```

**GitHub Copilot CLI**:

```bash
copilot plugin marketplace add obra/superpowers-marketplace
copilot plugin install superpowers@superpowers-marketplace
```

El README documenta además Antigravity (`agy plugin install`), Devin CLI, Factory Droid, Grok Build CLI, Kimi Code, OpenCode, Pi, Qwen Code, Hermes Agent y Muse. En OpenCode la instalación consiste en pedirle al agente que siga un `INSTALL.md` del repositorio.

Para comprobar que funciona, abre una sesión nueva y escribe algo como "Let's make a react todo list": una instalación correcta dispara `brainstorming` antes de escribir una línea de código.

## Ejemplo de uso

No hay comandos que memorizar. Describes lo que quieres y el flujo arranca:

```text
Quiero añadir exportación a CSV en el listado de pedidos.
```

El agente pregunta por columnas, filtros y tamaño esperado; te resume lo entendido; propone el diseño; tras tu "adelante" crea el worktree, escribe el plan en tareas cortas y empieza por el primer test que falla. Entre tareas verás revisiones con severidad, y al final la opción de abrir un PR.

## Cuándo conviene y cuándo no

**Conviene** cuando:

- trabajas en funcionalidades de varias horas y quieres que el agente no improvise;
- te importa TDD de verdad y quieres que el agente no se lo salte;
- delegas tareas largas y prefieres revisar un plan al principio en vez de un diff enorme al final.

**No conviene** (o conviene desactivarlo) cuando:

- el cambio es de una línea o una exploración rápida: el ritual de diseño, plan y worktree pesa más que la tarea;
- tu equipo ya tiene un flujo distinto (otra estrategia de ramas, sin TDD): una metodología obligatoria choca en cada tarea;
- vas justo de presupuesto de tokens: el modo con un subagente por tarea es el más caro; `executing-plans` es la variante barata.

Frente a [agent-skills de Addy Osmani](/skills/ia-skills/skill-addyosmani-agent-skills), que ofrece prácticas por etapa para elegir, Superpowers es un **sistema cerrado y opinado**: las skills se encadenan y el agente debe seguirlas. Frente a una skill aislada como [tdd](/skills/ia-skills/skill-tdd), Superpowers incluye TDD dentro de un ciclo completo.

## Límites y precauciones

- **Revisa lo que instalas.** Una skill son instrucciones que entran al contexto de un agente con acceso a tu repositorio y a tu terminal. Superpowers además usa hooks de arranque de sesión; en hosts como Muse hay que aprobarlos explícitamente. Lee las skills antes de confiar en ellas.
- **Contribuciones restringidas.** El proyecto no suele aceptar skills nuevas de terceros y exige que cualquier cambio funcione en todos los agentes soportados; es estable, pero no esperes ampliarlo fácilmente.
- **Compactación de contexto.** En agentes sin hook posterior a la compactación (Hermes, según el README), una sesión muy larga puede perder la instrucción de arranque; si las skills dejan de dispararse, abre una sesión nueva.
- **Telemetría mínima opcional.** Solo en el compañero visual de brainstorming, y desactivable (ver advertencias).
- **Soporte comercial.** Prime Radiant ofrece soporte y herramientas para empresas; el proyecto sigue siendo MIT.

## Fuentes

- [Repositorio y README de Superpowers](https://github.com/obra/superpowers)
- [Página de Superpowers en Prime Radiant](https://primeradiant.com/superpowers/)
- [Superpowers en el marketplace de plugins de Claude](https://claude.com/plugins/superpowers)
- [Anuncio original en el blog de Jesse Vincent](https://blog.fsck.com/2025/10/09/superpowers/)
