---
title: "Caveman: menos tokens hablando como un cavernícola"
description: "Skill que comprime las respuestas del agente (respuesta primero, una idea por frase, código intacto) y proxy local que reduce lo que el agente lee: logs, JSON, salida de tests y páginas web."
tags: [ai, skill, plugin, tokens, costes, compresion, proxy, claude-code, codex, cursor]
sidebar:
  order: 27
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://caveman.so
github: https://github.com/JuliusBrussee/caveman
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - skills/ia-skills/skill-ponytail
  - skills/ia-comandos/comando-commit
  - agents/claude-code/claude-code-claude-md
  - agents/claude-code/claude-code-hooks
note: Licencia Apache-2.0. La skill sola no necesita nada más; el proxy (`@caveman-ai/cli`) requiere Node.js 22.13 o posterior.
warnings:
  - La CLI `caveman` envía estadísticas de uso por defecto (comandos, recuento de tokens, ID de instalación, sistema operativo e IP; nunca prompts ni código). Se desactiva con `caveman telemetry off` o `DO_NOT_TRACK=1`. La skill sola no envía nada.
  - El proxy intercepta lo que el agente lee y corre con tus claves y tu sesión de Claude; revísalo antes de ponerlo en medio de tu flujo.
  - Si pagas por petición y no por token (por ejemplo, peticiones premium de Copilot), una respuesta más corta cuesta lo mismo.
updatedAt: 2026-10-12
---

## En pocas palabras

[Caveman](https://github.com/JuliusBrussee/caveman) ("cavernícola") empezó en abril de 2026 como una broma — *why use many token when few token do trick* — y hoy son dos piezas:

- **La skill (la "roca pequeña")**: cambia la forma en que el agente **habla**. Respuesta primero, una idea por frase, sin saludos ni resúmenes de cierre, y el código, los comandos y las rutas intactos carácter por carácter.
- **El proxy (la "roca grande")**: reduce lo que el agente **lee**. Comprime logs, CSV, YAML, JSON y salida de tests antes de que entren al contexto, guardando el original en disco.

Lo mantiene Julius Brussee, con licencia Apache-2.0 y **~111 k estrellas a octubre de 2026**.

## Qué problema resuelve

Un *token* es la unidad en la que el modelo cuenta texto (y en la que se factura). Los agentes gastan tokens en dos sitios: en la prosa de sus respuestas ("La razón por la que tu componente se re-renderiza es probablemente…") y, sobre todo, en lo que leen (salidas de tests, logs, JSON enormes). El ejemplo del README:

| Modo            | Respuesta                                                                       | Tokens |
| --------------- | ------------------------------------------------------------------------------- | -----: |
| Agente normal   | Párrafo de tres frases explicando referencias de objeto y `useMemo`              |     63 |
| `/caveman`      | New object ref each render, so React re-renders. Wrap the prop in `useMemo`.    |     20 |
| `/ultracave`    | Inline object prop, new ref, re-render. `useMemo`.                              |     14 |
| `/megacave`     | La misma respuesta en chino clásico (文言文)                                    |     13 |

## Cómo habla Caveman

No es gramática rota sino un estilo controlado, inspirado en ASD-STE100 (el inglés simplificado de los manuales de mantenimiento aeronáutico):

- **Respuesta primero**: `[cosa] [acción] [motivo]. [siguiente paso].`
- **Una idea por frase**, máximo 20 palabras, voz activa.
- **El significado nunca se pierde**: los artículos pueden caer; *not*, *never*, *no*, *only*, números y unidades nunca.
- **Payload literal**: código, comandos, rutas, mensajes de error y comentarios existentes sin tocar.
- **Sabe cuándo parar**: advertencias de seguridad, acciones irreversibles, instrucciones paso a paso y usuarios confundidos reciben frases completas.
- **Tus prompts no se tocan**: según la investigación que cita el proyecto, comprimir el prompt del usuario empeora las respuestas.

## Instalación

### Solo la skill

```bash
npx skills add JuliusBrussee/caveman -g
```

Funciona en Claude Code, Codex, Gemini CLI, Cursor, Windsurf, Cline, Copilot y más de 30 agentes. Si no arranca sola, escribe `/caveman` (`$caveman` en Codex). Para volver al modo normal: `stop caveman`.

**Claude Code como plugin** (arranca en cada sesión interactiva, también en subagentes):

```text
/plugin marketplace add JuliusBrussee/caveman
/plugin install caveman@caveman
```

**Codex**, con hook de inicio de sesión (confírmalo una vez con `/hooks`):

```bash
npx -y github:JuliusBrussee/caveman -- --only codex
```

**Cursor**, con el instalador (skills, agentes y hook de sesión en `~/.cursor/`):

```bash
npx -y github:JuliusBrussee/caveman -- --only cursor
```

O como plugin local clonado en `~/.cursor/plugins/local/caveman`. No uses las dos vías a la vez: las reglas llegarían duplicadas.

**Gemini CLI**:

```bash
gemini extensions install https://github.com/JuliusBrussee/caveman
```

El [`INSTALL.md`](https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md) tiene la matriz completa y un instalador que detecta todos los agentes de tu máquina (admite `--dry-run` para previsualizar). Desde npm 12, que bloquea instalaciones desde git, algunos comandos necesitan `--allow-git=root`; el README lo detalla.

### El proxy

```bash
npm install -g @caveman-ai/cli && caveman setup --install
caveman claude        # o codex, gemini, aider, kilo, qwen, opencode, hermes, openclaw, pi
```

Corre en tu máquina con tus claves y tu sesión de Claude Pro/Max. Tras la primera ejecución, `claude` a secas sigue pasando por el proxy. Comandos útiles:

```bash
caveman learn                 # analiza en qué se van tus tokens, a partir del historial en disco
caveman trial -- claude       # prueba A/B de una sesión real
caveman shrink -- pnpm test   # comprime la salida de un comando ruidoso
caveman browse <url>          # página web comprimida en vez de un volcado de miles de tokens
caveman stats                 # tu historial de tokens
```

Para agentes propios hay middleware para Vercel AI SDK, LangChain, OpenAI y Anthropic (`@caveman-ai/middleware` en TypeScript, `caveman-middleware` en Python).

## Comandos y skills incluidas

| Comando o skill                                                         | Qué hace                                                                 |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/caveman` · `/ultracave` · `/megacave`                                 | Los tres niveles de compresión. `/caveman status` muestra el modo, `/caveman off` lo apaga |
| `/caveman-commit`                                                       | Mensaje de commit Conventional Commits en una línea                      |
| `/caveman-review`                                                       | Revisión de código con un hallazgo por línea: ubicación, problema, arreglo |
| `/caveman-compress <archivo>`                                           | Comprime archivos de memoria como `CLAUDE.md` y guarda copia del original |
| `/caveman-stats`                                                        | Uso real de tokens en la sesión de Claude Code                           |
| `/caveman-help`                                                         | Todos los modos y comandos en una pantalla                               |
| `cavecrew`                                                              | Subagentes que buscan, editan y revisan código y reportan en modo caveman |
| `investigate-first`, `lean-build`, `surgical-patch`, `safe-refactor`, `migration`, `verify-and-stop` | Patrones de trabajo que escriben menos código; el agente los usa cuando encajan |
| `caveman-setup`, `caveman-learn`, `caveman-optimize`…                   | Manejan el proxy desde dentro del agente                                 |

## Las cifras

El proyecto destaca estudios externos: un paper de Adobe Research (CAVEWOMAN, junio de 2026) con reducciones de coste de 1,4 a 2,4 veces según el modelo, un A/B de JetBrains en 86 tareas sin pérdida de calidad medible (p = 0,82) pero con solo un 8,5 % menos de tokens de salida, y una adaptación de Elastic. Sus propias mediciones del proxy dan un 33,2 % menos de tokens de entrada en sesiones completas de Claude Code (18 de 18 respuestas correctas), con HTML como caso en que **empeora** (+9,9 %).

Dato honesto del propio README: los modelos actuales ya responden de forma concisa si se lo pides, y frente a un simple "Answer concisely." `/caveman` solo recorta un 3 % adicional en la mediana; `/ultracave`, un 35 %. El repositorio mantiene un [`HONEST-NUMBERS.md`](https://github.com/JuliusBrussee/caveman/blob/main/docs/HONEST-NUMBERS.md) con todos los casos en que pierde.

## Cuándo conviene y cuándo no

**Conviene** cuando pagas por token y las sesiones son largas, cuando el agente lee mucha salida ruidosa (tests, logs, JSON), o simplemente si prefieres respuestas secas. `/caveman-compress` es útil por sí solo para adelgazar un [`CLAUDE.md`](/agents/claude-code/claude-code-claude-md) que se carga en cada sesión.

**No conviene** para explicaciones didácticas, documentación destinada a personas o equipos con poca experiencia: la brevedad extrema puede ocultar el razonamiento. Tampoco si pagas por petición. Para reducir el **código** que escribe el agente (no la prosa), mira [Ponytail](/skills/ia-skills/skill-ponytail); combinan bien.

## Límites y precauciones

- **Revisa lo que instalas.** La skill son instrucciones que entran en el contexto de un agente con acceso al repositorio; el plugin añade hooks y el proxy se sitúa entre el agente y lo que lee. Lee las skills y los hooks antes de activarlos (ver [hooks de Claude Code](/agents/claude-code/claude-code-hooks)).
- **Coste fijo de las reglas.** Las instrucciones de `/caveman` ocupan unos 1.160 tokens; si compensan depende del caché y de la longitud de la sesión, y el autor reconoce que no lo ha medido.
- **Telemetría en la CLI** activa por defecto (ver advertencias).
- **`/caveman-compress` reescribe archivos.** Guarda copia, pero revisa el diff antes de confirmar.
- **Caveman Cloud.** El sitio oficial promociona además un producto comercial en vista previa privada para controlar costes de agentes; no es necesario para la skill.

## Fuentes

- [Repositorio y README de Caveman](https://github.com/JuliusBrussee/caveman)
- [Matriz de instalación (INSTALL.md)](https://github.com/JuliusBrussee/caveman/blob/main/INSTALL.md)
- [Sitio oficial](https://caveman.so)
- [Documentación](https://docs.caveman.so/caveman)
- [Paper CAVEWOMAN de Adobe Research (arXiv)](https://arxiv.org/abs/2606.24083)
- [Artículo de JetBrains con el A/B](https://blog.jetbrains.com/ai/2026/07/speak-to-ai-agents-like-cavemen-tosave-tokens/)
