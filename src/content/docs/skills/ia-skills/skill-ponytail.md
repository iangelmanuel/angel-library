---
title: "Ponytail: el senior perezoso que escribe solo lo necesario"
description: "Skill de una sola instrucción que hace que el agente reutilice lo que ya existe antes de escribir código nuevo, sin recortar validación, seguridad ni accesibilidad. Trae comandos de revisión, auditoría y deuda técnica."
tags: [ai, skill, plugin, minimalismo, code-review, auditoria, deuda-tecnica, claude-code, codex, cursor]
sidebar:
  order: 24
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://ponytail.dev
github: https://github.com/DietrichGebert/ponytail
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - skills/ia-skills/skill-code-review
  - skills/ia-comandos/comando-code-audit
  - agents/claude-code/claude-code-hooks
  - skills/ia-skills/skill-caveman
note: Licencia MIT. Los plugins de Claude Code, Codex y los hooks de Cursor ejecutan dos hooks pequeños de Node.js, así que `node` debe estar en el PATH.
warnings:
  - Instálalo solo desde `DietrichGebert/ponytail` en GitHub o `@dietrichgebert/ponytail` en npm; el autor avisa que nunca distribuye `.exe` ni `.dll`.
  - Las cifras de ahorro son del benchmark del propio autor; mídelo en tu repositorio antes de asumirlas.
updatedAt: 2026-10-12
---

## En pocas palabras

[Ponytail](https://github.com/DietrichGebert/ponytail) mete dentro del agente al "senior de la coleta": el veterano que mira tus cincuenta líneas, no dice nada y las sustituye por una. Técnicamente es **un solo prompt** ([`skills/ponytail/SKILL.md`](https://github.com/DietrichGebert/ponytail/blob/main/skills/ponytail/SKILL.md), con una versión compacta en `AGENTS.md` para agentes que leen un archivo de reglas); todo lo demás del repositorio son adaptadores para cargar ese prompt en unos veinte agentes distintos.

Lo publica Dietrich Gebert bajo licencia MIT y tiene **~161 k estrellas a octubre de 2026**. La versión actual es Ponytail 5, reescrita desde cero.

## Qué problema resuelve

Los agentes de código tienden a sobreconstruir: piden un selector de fecha y el agente instala una librería o programa un calendario entero. El ejemplo del README: sin la skill, 335 líneas; con Ponytail 5, un archivo de 10 líneas que reutiliza el componente `Input` del repositorio con `type="date"`, porque el navegador ya trae el calendario.

La regla, según el autor, **nunca fue "menos tokens"**: es escribir solo lo que la tarea necesita y **no recortar nunca** validación en límites de confianza, manejo de pérdida de datos, seguridad ni accesibilidad. El código queda pequeño porque es necesario, no porque esté comprimido.

## Cómo funciona: la escalera

Antes de escribir código, el agente se detiene en el primer peldaño que resuelve la tarea:

| Peldaño | Pregunta                                          |
| ------- | ------------------------------------------------- |
| 1       | ¿Esto necesita existir?                           |
| 2       | ¿Ya está en este código?                          |
| 3       | ¿Lo hace la biblioteca estándar?                  |
| 4       | ¿Es una función nativa de la plataforma?          |
| 5       | ¿Lo resuelve una dependencia ya instalada?        |
| 6       | ¿Cabe en una línea?                               |
| 7       | Solo entonces: el mínimo que funcione, más un test pequeño si tiene lógica |

La escalera se aplica **después** de entender el problema: el agente lee el código afectado y sigue el flujo real antes de elegir peldaño. "Perezoso con la solución, nunca con la lectura". La lógica con ramas, bucles, parsers, dinero o seguridad deja siempre un test, y cada respuesta termina diciendo qué se omitió o no se comprobó.

Los atajos deliberados se marcan con comentarios `shortcut:` que indican cuándo revisarlos.

## Comandos

| Comando                                 | Qué hace                                                                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `/ponytail [lite \| full \| ultra \| off]` | Cambia la intensidad o la apaga. Sin argumento, la enciende en el nivel por defecto (`full`) o informa del actual.                      |
| `/ponytail-review`                      | Revisa el diff como quien recibe la alerta cuando algo se rompe: bugs, seguridad, carga real, lógica sin test, rutas lentas y qué sobra. Lee también el código que el cambio toca, no solo el diff. Acepta `uncommitted`, `staged`, `branch` o un enlace a PR. |
| `/ponytail-audit`                       | La misma revisión sobre todo el repositorio: mapea puntos de entrada y flujo de datos, y ordena los hallazgos por prioridad.             |
| `/ponytail-debt`                        | Recolecta los comentarios `shortcut:` en un registro para que "luego" no se convierta en "nunca".                                       |
| `/ponytail-gain`                        | Muestra el marcador de impacto medido en el benchmark.                                                                                   |
| `/ponytail-help`                        | Referencia rápida.                                                                                                                       |

En Codex se invocan con el espacio de nombres del plugin (`$ponytail:ponytail-review`). Los adaptadores que solo cargan reglas (el archivo de reglas de Cursor, Windsurf, Cline, Copilot, Kiro, Antigravity) aplican la regla siempre activa pero **sin comandos**.

## Instalación

**Claude Code**, en dos mensajes separados (el README insiste en que deben ser dos):

```text
/plugin marketplace add DietrichGebert/ponytail
```

```text
/plugin install ponytail@ponytail
```

**Codex**:

```bash
codex plugin marketplace add DietrichGebert/ponytail
codex plugin add ponytail@ponytail
```

Después abre `/hooks` en Codex, revisa y confía en sus dos hooks de ciclo de vida, y empieza un hilo nuevo.

**Cursor**, con hooks nativos:

```bash
git clone https://github.com/DietrichGebert/ponytail
node ponytail/scripts/cursor-hooks.js install
```

Fusiona dos hooks en `~/.cursor/hooks.json` (con `--project`, en el del proyecto) sin borrar los que ya tengas. Los subagentes de Cursor se quedan sin la regla porque `subagentStart` no puede inyectar contexto. La alternativa es la regla siempre activa `.cursor/rules/ponytail.mdc`; no uses las dos a la vez.

**Gemini CLI y OpenCode**:

```bash
gemini extensions install https://github.com/DietrichGebert/ponytail
opencode plugin add @dietrichgebert/ponytail
```

**Cualquier agente compatible con skills**, con la [CLI de skills](https://skills.sh) (solo copia las seis skills; para la regla siempre activa añade también `AGENTS.md`):

```bash
npx skills add DietrichGebert/ponytail
```

El [`INSTALL.md`](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md) cubre además Copilot CLI, Pi, Kimi Code, Qoder, Antigravity, Hermes, Devin CLI y OpenClaw. Para cualquier otro agente basta copiar `AGENTS.md` al proyecto.

### Ajustes

- Nivel por defecto: variable `PONYTAIL_DEFAULT_MODE` o campo `defaultMode` en `~/.config/ponytail/config.json` (`%APPDATA%\ponytail\config.json` en Windows).
- La regla se inyecta también en cada subagente; `PONYTAIL_SUBAGENT_MATCHER` (una regex sobre el tipo de agente) permite limitarlo, por ejemplo para no cargarla en agentes de solo búsqueda.

## Las cifras (según el autor)

El README publica un benchmark en Claude Code con 39 tareas (incluido un repositorio real FastAPI + React), cinco ejecuciones cada una, con y sin la skill: **-53 % de código, -41 % de tiempo, -26 % de coste, -45 % de tokens**, y el 98 % de la lógica de riesgo sale con test frente al 68 % sin la skill. En las seis tareas de seguridad (inyección SQL, path traversal, tokens falsificados, rate limiting…) pasó las 30 ejecuciones. El método está en `benchmarks/results/` del repositorio. Son números del propio proyecto: útiles como orientación, no como garantía.

## Cuándo conviene y cuándo no

**Conviene** cuando el agente infla los cambios, añade dependencias por reflejo o reescribe lo que ya existe; y como segunda opinión con `/ponytail-review` antes de un PR.

**No conviene** cuando estás prototipando a propósito una abstracción amplia, o en tareas donde "lo mínimo" no es el criterio (un andamiaje completo que luego vas a rellenar). Ahí `/ponytail off` o el nivel `lite`.

Combina bien con [Caveman](/skills/ia-skills/skill-caveman): Ponytail reduce el código que el agente escribe; Caveman, la prosa con que lo cuenta.

## Límites y precauciones

- **Revisa la skill y los hooks.** Es texto que entra en el contexto de un agente con acceso a tu repositorio, y los plugins ejecutan hooks de Node.js en cada sesión. Lee `SKILL.md` y los hooks antes de confiar en ellos (ver [hooks de Claude Code](/agents/claude-code/claude-code-hooks)).
- **Suplantaciones.** El autor advierte de copias no oficiales; instala solo desde las fuentes de las advertencias.
- **"Menos" no siempre es "mejor".** La skill prioriza reutilizar; verifica que el componente reutilizado sirve de verdad (accesibilidad, soporte de navegadores) y no solo que ocupa menos.
- **Comentarios `shortcut:`.** Si no encajan con tu estilo, puedes cambiar la palabra o eliminarla indicándolo en `CLAUDE.md` o `AGENTS.md`.

## Fuentes

- [Repositorio y README de Ponytail](https://github.com/DietrichGebert/ponytail)
- [Guía de instalación por agente (INSTALL.md)](https://github.com/DietrichGebert/ponytail/blob/main/INSTALL.md)
- [Sitio oficial](https://ponytail.dev)
- [Paquete en npm](https://www.npmjs.com/package/@dietrichgebert/ponytail)
