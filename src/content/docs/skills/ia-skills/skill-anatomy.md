---
title: "Anatomy — ilustraciones isométricas interactivas que explican un concepto"
description: "Skill para Claude Code y otros agentes que explica una idea técnica inventando un objeto físico cuyo funcionamiento es el concepto, y lo construye como figura isométrica interactiva en SVG, con capas WebGL opcionales y un modo 3D en beta."
tags: [ai, skill, svg, webgl, ilustracion, isometrico, documentacion-tecnica, claude-code, codex, opencode]
sidebar:
  order: 36
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://skills.wheresryan.sh/anatomy
github: https://github.com/wheresryan22/anatomy
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - agents/claude-code/claude-code-skills
  - resources/ia/skills-sh
  - skills/ia-skills/skill-archify
note: "Licencia MIT. Requiere Node.js 20.10 o superior (solo módulos nativos, nada que instalar con npm) y Chrome o Chromium para las comprobaciones visuales. Versión 1.1.0 a octubre de 2026."
warnings:
  - "Es lenta a propósito: una figura ocupa una sesión larga del agente (lista de piezas, geometría, auditoría y capturas de cada unión en ambos temas), con el consumo de tokens que eso implica."
  - "El modo 3D está en beta: según el README solo se ha probado en su ejemplo y en una figura de prueba, no en una figura de producción."
  - "En Codex, el sandbox puede bloquear el Chrome headless de las comprobaciones. La salida `--sandbox danger-full-access` levanta todos los límites de la sesión: resérvala para proyectos de confianza."
updatedAt: 2026-10-27
---

## En pocas palabras

[Anatomy](https://github.com/wheresryan22/anatomy) es una **skill para agentes de código** que explica una idea técnica **construyéndola como un objeto real**. Le pides una figura sobre, por ejemplo, una clave de caché que evita trabajo cuando nada cambió, y el agente inventa una cerradura de pines que solo gira cuando todos coinciden. Después dibuja ese objeto con decenas de piezas sólidas en perspectiva isométrica, lo enmarca en una tarjeta con título y una lectura en vivo, y lo hace reaccionar al puntero y al teclado.

Está escrita para Claude Code y sigue el formato abierto Agent Skills, así que también la cargan Antigravity, OpenCode, Codex y MiniMax Code. La creó Ryan ([@wheresryan22](https://x.com/wheresryan22)) en octubre de 2026 y ronda las **21 000 estrellas en GitHub** a finales de ese mes.

> Una **skill** es una carpeta con un `SKILL.md` (instrucciones) y, a veces, scripts que el agente carga cuando la tarea lo pide. Más contexto en [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

## Qué problema resuelve

Un diagrama de cajas y flechas dice qué piezas hay, pero rara vez transmite **cómo se comporta** un mecanismo: un rate limiter, un pool de conexiones, una caché con TTL. Anatomy apuesta por la metáfora física: el objeto inventado se mueve según un modelo pequeño, y **cada número que muestra la figura sale del mismo modelo que mueve sus piezas**. Sirve para documentación, artículos de blog o landings que necesitan un explicador interactivo en lugar de una imagen estática.

## Qué genera

Tres tipos de figura, que comparten el mismo kit, la misma cámara isométrica y las mismas reglas de oficio:

| Tipo             | Qué es                                                                                                       | Ejemplos del repositorio           |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| **SVG**          | El núcleo: piezas sólidas con sombreado de cuatro tonos, pintadas de atrás hacia delante, con movimiento suave | `dial-indicator`, `arcade-cabinet` |
| **SVG + WebGL**  | Para lo que las líneas no dibujan (fuego, agua, cáusticas, vapor): un shader entre una capa SVG trasera y otra delantera | `raptor-engine`, `ripple-tank`     |
| **3D** (beta)    | Piezas que giran en 3D real; se reproyectan y sombrean en cada fotograma, el resto queda estático             | `turning-dial`                     |

La salida puede ser una página HTML independiente, un `.svg` suelto con estilos incrustados o componentes de React/Next.js. Cada figura tiene tema claro u oscuro; el claro es el que la skill diseña primero. **WebGL** es la API del navegador para dibujar con la GPU; aquí solo se usa para efectos, y el SVG se sigue leyendo sin ella.

## Instalación

Con la CLI de skills ([skills.sh](/resources/ia/skills-sh)), para tu usuario y solo para Claude Code:

```bash
npx skills add wheresryan22/anatomy -g -a claude-code
```

Sin `-a`, la CLI pregunta qué agentes configurar. Los otros valores son `antigravity`, `opencode`, `codex` y `minimax-code`. Sin `-g` se instala en el proyecto actual (`.claude/skills/anatomy` en Claude Code).

También vale clonar el repositorio directamente en la carpeta de skills:

```bash
git clone https://github.com/wheresryan22/anatomy.git ~/.claude/skills/anatomy
```

Dónde queda según el agente:

| Agente       | Carpeta global                         | Cómo se invoca |
| ------------ | -------------------------------------- | -------------- |
| Claude Code  | `~/.claude/skills/anatomy`             | `/anatomy`     |
| Antigravity  | `~/.gemini/antigravity/skills/anatomy` | `/anatomy`     |
| OpenCode     | `~/.config/opencode/skills/anatomy`    | `/anatomy`     |
| Codex        | `~/.agents/skills/anatomy`             | `$anatomy`     |
| MiniMax Code | `~/.minimax/skills/anatomy`            | `/anatomy`     |

La CLI copia el repositorio entero, ejemplos incluidos (unos 10 MB). Claude Code detecta skills nuevas en una sesión abierta; si la carpeta `skills` no existía al empezar, ejecuta `/reload-skills`. Más detalle sobre cómo las carga en [Skills en Claude Code](/agents/claude-code/claude-code-skills).

## Uso

Escribe el comando y di qué debe explicar la figura:

```text
/anatomy explain how a token bucket rate limiter works, interactive
```

No hace falta nombrar la skill: el agente también la carga cuando pides una ilustración isométrica, una figura explicativa para documentación o un explicador interactivo. Un ejemplo de sus evals con más contexto:

```text
/anatomy an isometric SVG explaining how a CDN edge cache works, cache hit vs miss, TTL of 60 s, for a dark landing page. Just the SVG file and a PNG preview.
```

El README recomienda tres hábitos:

1. **Nombra la idea, no el dibujo**, con los números reales (tamaños, cantidades, tasas, umbrales). Inventar el objeto es la mayor parte del trabajo.
2. **O nombra el objeto** si ya lo tienes claro (una cafetera, un mechero Bunsen, una cerradura) y di qué debe moverse.
3. **Di dónde va a vivir**: HTML, SVG suelto o componente React; claro u oscuro. El build cambia en cada caso.

La figura llega como código tuyo: un script de build en Node y la página que genera, o, en React, módulos de geometría, un server component para el dibujo estático y un client component para el movimiento.

## Cómo funciona por dentro

| Pieza          | Qué hace                                                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `SKILL.md`     | El flujo: reunir los números reales, inventar el objeto, listar piezas, construir la geometría con el kit, pintar, enmarcar, animar y verificar |
| `kit/`         | Librería de dibujo: cámara isométrica, sólidos, piezas de revolución, tubos y cables, capa WebGL, runtime 3D y componentes React               |
| `references/`  | Guías largas que el agente abre cuando las necesita (oficio, API del kit, movimiento, React, WebGL, 3D)                                        |
| `kit/audit.mjs` | Auditoría geométrica: nada atraviesa nada, cada extremo apoya en un soporte y cada solapamiento se dibuja en el orden correcto                  |
| `scripts/`     | Comprobaciones en Chrome headless: capturas, primeros planos, hojas de contacto y detección de líneas que terminan en el aire                   |

La skill obliga al agente a leer cada PNG que genera, es decir, a revisar su propio resultado como un crítico. Los ejemplos ya construidos están en `examples/`: basta abrir cualquier `.html` para probarlos.

## Cuándo conviene y cuándo no

**Conviene** para explicar un mecanismo con partes que se mueven: protocolos, colas, cachés, limitadores, hardware. También cuando la figura va a vivir mucho tiempo en una documentación o una landing y compensa la inversión.

**No conviene** para:

- **Gráficos de datos.** No hay ejes ni series; para eso usa una librería como [Chart.js](/packages/javascript-chartjs/chartjs).
- **Diagramas de arquitectura.** Si lo que quieres es mostrar componentes y conexiones de un sistema, [Archify](/skills/ia-skills/skill-archify) es más directo y versionable.
- **Personas o mapas exactos.** La skill dibuja máquinas, instrumentos, herramientas y muebles; una idea sin un mecanismo que construir sale más floja.
- **Algo rápido.** Una figura lleva una sesión larga; el build del ejemplo del motor Raptor tarda varios minutos y una auditoría 3D completa, de 15 a 20 minutos para 30 piezas.

## Límites y precauciones

- **Rendimiento del modo 3D.** Una figura pequeña va a 60 fps; la mano de estrés de 380 piezas midió unos 20 fps a 1440 px de ancho, según el README.
- **Movimiento reducido.** Con `prefers-reduced-motion`, todas las figuras quedan quietas, lo que respeta la accesibilidad pero cambia la experiencia.
- **Galería comunitaria.** La skill puede publicar una figura en [anatomy-community](https://github.com/wheresryan22/anatomy-community) abriendo un pull request por ti; te muestra lo que va a enviar y pide confirmación, pero revisa que no incluya nada privado.

## Fuentes

- [Repositorio y README de Anatomy](https://github.com/wheresryan22/anatomy)
- [Sitio oficial](https://skills.wheresryan.sh/anatomy)
- [Releases](https://github.com/wheresryan22/anatomy/releases)
