---
title: "fernando-skills — desarrollo guiado por specs con /spec y /spec-impl"
description: "Dos skills de Fernando Herrera (DevTalles) para trabajar con specs: /spec diseña el documento de una funcionalidad haciendo preguntas y /spec-impl implementa una spec aprobada paso a paso, en su propia rama y con pausas para revisar cada diff."
tags: [ai, skill, spec-driven, planificacion, claude-code, cursor, codex, workflow]
sidebar:
  order: 34
draft: false
tool: Cross-tool
resourceCategory: Repositorio oficial
official: true
url: https://github.com/Klerith/fernando-skills
technologies:
  - findings/hallazgos-recursos/matt-pocock-skills
  - skills/ia-skills/skill-find-skills
note: "Licencia MIT. Pensado para Claude Code; Cursor, Codex y Antigravity se soportan con un script de instalación que adapta el formato."
warnings:
  - "/spec-impl crea y cambia de rama git por defecto; pon AutoCreateBranch: false en specs/.spec-config.yml si prefieres que pregunte antes."
updatedAt: 2026-10-12
---

## En pocas palabras

[fernando-skills](https://github.com/Klerith/fernando-skills) es un paquete pequeño de skills de [Fernando Herrera](https://github.com/Klerith), instructor de DevTalles. Trae **dos** skills que funcionan en pareja para aplicar *spec-driven development* con un agente de código:

| Skill | Qué hace | Argumento |
| --- | --- | --- |
| `/spec` | Diseña el documento de la funcionalidad haciendo preguntas aclaratorias | Tema corto (opcional) |
| `/spec-impl` | Comprueba que la spec está aprobada y la implementa paso a paso | `<NN-slug>` |

Una **skill** es una carpeta con un `SKILL.md` que el agente carga para una tarea concreta (ver [fundamentos de skills](/skills/skills-fundamentos/ai-tools-skills-fundamentals)). Una **spec** es un documento Markdown que describe una funcionalidad antes de escribir código: objetivo, alcance, modelo de datos, plan de pasos y criterios de aceptación.

## Qué problema resuelve

Si le pides a un agente "hazme un Arkanoid con niveles y power-ups", va a improvisar decenas de decisiones de diseño sin que veas ninguna. El README del proyecto resume por qué con un LLM esto pesa más que con una persona:

1. La velocidad de generación esconde el coste de cada decisión.
2. Cada conversación empieza de cero: sin un documento, en la siguiente sesión el agente vuelve a improvisar, quizá en otra dirección.
3. El contexto se llena rápido si tienes que repetir lo decidido en cada prompt.

La spec resuelve las tres: hace explícitas las decisiones, persiste entre sesiones en `specs/` y se carga una vez como referencia. **La spec es el artefacto principal; el código es la consecuencia.**

## El flujo en seis pasos

1. **Describir** el problema, no la solución.
2. **Planificar** en modo plan: el agente propone sin editar archivos.
3. **Refinar** con decisiones concretas ("saca X del alcance", "los datos van en JSON"), dos o tres iteraciones.
4. **Guardar** la spec en `specs/NN-slug.md` con estado `Draft`, releerla fuera del chat y cambiarla a `Approved` a mano.
5. **Ejecutar** paso a paso, con una pausa después de cada paso del plan.
6. **Revisar** el diff de cada paso, no 600 líneas mezcladas al final.

El hueco entre las dos skills es deliberado: cambiar el estado a `Approved` es un acto humano. El agente no puede aprobar su propio trabajo.

## Instalación

La vía recomendada usa el CLI de skills.sh y vale para Claude Code:

```bash
npx skills@latest add Klerith/fernando-skills
```

El asistente pregunta en qué agentes instalarlas. En alcance de proyecto (el predeterminado) la copia canónica queda en `.agents/skills/`, Claude Code la ve en `.claude/skills/` (por enlace simbólico o copia) y el CLI anota el origen en `skills-lock.json`. Con `-g` se instalan en tu carpeta de usuario para todos los proyectos.

Para desinstalar:

```bash
npx skills@latest remove Klerith/fernando-skills
```

### Otros agentes: Cursor, Codex, Antigravity

```bash
git clone https://github.com/Klerith/fernando-skills ~/.fernando-skills
cd ~/tu-proyecto
~/.fernando-skills/scripts/install-to-agent.sh <agente>
```

| Agente | Qué escribe el script |
| --- | --- |
| `claude` | Enlaces de cada skill en `.claude/skills/` |
| `cursor` | Reglas `.cursor/rules/<nombre>.mdc`; se invocan con `@spec`, `@spec-impl` |
| `codex` | Un bloque `## Skills` en `AGENTS.md` y copias en `.codex/skills/` |
| `antigravity` | Copias en `.antigravity/skills/` |

Cursor y Codex no entienden `argument-hint` ni `disable-model-invocation`, así que el script quita esos campos y conserva el cuerpo: el flujo es el mismo, cambia cómo se dispara.

### Manual

```bash
# Por proyecto (versionado en git)
mkdir -p .claude/skills
cp -r skills/engineering/spec .claude/skills/
cp -r skills/engineering/spec-impl .claude/skills/
```

Para uso personal, la misma copia va en `~/.claude/skills/`. En cualquier caso crea la carpeta de specs en la raíz:

```bash
mkdir specs
```

### Comprobar que el agente las ve

```bash
npx skills list
```

En Claude Code, escribe `/` en una sesión nueva: deben aparecer `/spec` y `/spec-impl`. Ambas declaran `disable-model-invocation: true`, de modo que el agente no las lanza por su cuenta; solo corren cuando las invocas.

## Uso

```text
/spec niveles-y-records
```

`/spec` pasa por cuatro fases: lee la memoria del proyecto (`CLAUDE.md`, `AGENTS.md`, `GEMINI.md` o `README.md`, el primero que exista) y las specs previas; pregunta en bloques de 3 a 5 hasta que la funcionalidad está clara; desarrolla la spec sección por sección pidiendo confirmación; y la guarda como `specs/03-niveles-y-records.md` con estado `Draft`. No escribe código.

Relees el archivo en el editor y cambias el estado a `Approved`. Después:

```text
/spec-impl 03-niveles-y-records
```

`/spec-impl` localiza la spec, verifica que el estado signifique "aprobado" (vale `Approved`, `Aprobado` o el equivalente en cualquier idioma) y si no lo está se detiene. Luego crea la rama `spec-03-niveles-y-records`, cambia a ella, muestra el resumen e implementa paso a paso con pausas.

Si la creación automática de ramas choca con tu flujo de Git:

```yaml title="specs/.spec-config.yml"
AutoCreateBranch: false
```

### Estados de una spec

| Estado | Significado |
| --- | --- |
| `Draft` | La generó `/spec`, nadie la ha releído |
| `In review` | Se está revisando o iterando |
| `Approved` | Una persona la leyó y la autorizó; es el único estado que acepta `/spec-impl` |
| `Implemented` | El código existe y cumple los criterios de aceptación |
| `Obsolete` | La reemplazó otra spec; no se borra, se referencia |

## Anatomía de una spec útil

La plantilla (`skills/engineering/spec/template.md`) gira alrededor de seis partes: objetivo en una frase, alcance explícito **y lo que queda fuera**, modelo de datos con nombres concretos, plan ordenado donde cada paso deja el sistema funcionando (si un paso pasa de 30–50 líneas, se parte), criterios de aceptación verificables con sí o no, y decisiones tomadas y descartadas con su motivo.

## Cuándo conviene y cuándo no

Escribe una spec cuando la tarea toca más de dos archivos, hay decisiones caras de revertir (esquemas, formatos, APIs), va a durar más de una sesión o define un contrato que otros artefactos reutilizarán.

Usa un prompt directo para un bug puntual, un refactor mecánico, un experimento exploratorio o una tarea que se entiende a la primera. La regla del README: si te tienta abrir el modo plan, probablemente lo necesitas; si planificar te aburre, probablemente no.

## Alternativas

- [Skills de Matt Pocock](/findings/hallazgos-recursos/matt-pocock-skills): una colección más amplia de skills de ingeniería; fernando-skills se centra solo en el ciclo spec → implementación.
- Spec Kit de GitHub y otros marcos similares cubren el mismo enfoque con más ceremonia y plantillas. fernando-skills apuesta por dos comandos y una carpeta.
- [find-skills](/skills/ia-skills/skill-find-skills) sirve para buscar otras opciones en el catálogo de skills.sh.

## Límites y precauciones

- **La disciplina es tuya.** Las skills no impiden saltarse la relectura; el método pierde su valor si apruebas sin leer.
- **Toca Git.** `/spec-impl` crea ramas; revisa `git status` antes de lanzarlo con cambios sin commitear.
- **Contenido de terceros.** Lo que instalas son instrucciones que el agente obedecerá: revisa los `SKILL.md` antes de commitearlos.
- **Proyecto joven.** Unas 300 estrellas y versión v0.1.2 a octubre de 2026; puede cambiar.

## Fuentes

- [Repositorio y README de fernando-skills](https://github.com/Klerith/fernando-skills)
- [README en español](https://github.com/Klerith/fernando-skills/blob/main/README-es.md)
- [Ficha en skills.sh](https://skills.sh/Klerith/fernando-skills)
- [CLI de skills (vercel-labs/skills)](https://github.com/vercel-labs/skills)
