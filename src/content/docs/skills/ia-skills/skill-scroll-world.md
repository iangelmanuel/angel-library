---
title: "scroll-world — landings de mundo 3D que se recorren con el scroll"
description: "Skill para Claude Code, Codex y otros agentes que entrevista sobre una marca, genera escenas isométricas y vuelos de cámara con IA, y monta una landing donde el scroll mueve la cámara de escena en escena sin cortes."
tags: [ai, skill, landing, scroll, video, generacion, higgsfield, frontend]
sidebar:
  order: 35
draft: false
tool: Cross-tool
resourceCategory: Repositorio oficial
official: true
url: https://github.com/oso95/scroll-world
technologies:
  - resources/ia-media/higgsfield-cli
  - resources/ia-media/higgsfield
  - packages/astro-gsap/gsap
note: "Licencia MIT. Necesita la CLI de Monid (vídeo, por defecto) y la de Higgsfield (imágenes y respaldo de vídeo), ambas con saldo, además de ffmpeg/ffprobe y Python 3 con Pillow."
warnings:
  - "Generar los recursos cuesta dinero: según el README, una cadena de 6 escenas a 1080p en Monid ronda los 27 USD, y la versión móvil duplica los clips de vídeo."
  - "Cada generación tarda minutos; la skill las lanza en segundo plano y las sondea, así que una página completa no sale en una sola respuesta rápida."
  - "Una landing basada en vídeo pesa: vigila el tamaño de los clips, la carga en móvil y ofrece una alternativa para quien prefiere menos movimiento."
updatedAt: 2026-10-12
---

## En pocas palabras

[scroll-world](https://github.com/oso95/scroll-world) es una skill de agente (funciona en Claude Code, Codex y cualquier agente compatible con `SKILL.md`) que construye una landing *scroll-scrubbed*: al hacer scroll, una cámara vuela desde fuera de cada escena hasta su interior y sigue hacia la siguiente **sin cortes**, como un único vuelo por un pequeño mundo generado. El autor cita como referencia la web de la logística Emons. Tiene unas 10 000 estrellas en GitHub a octubre de 2026.

*Scroll-scrubbing* significa que la posición del scroll controla el tiempo de un vídeo pre-renderizado: no hay 3D en tiempo real en el navegador. Es la misma técnica de las páginas de producto de Apple. La cámara se mueve de verdad en el vídeo; el scroll solo decide en qué fotograma estás.

Una **skill** es una carpeta con instrucciones (`SKILL.md`) y recursos que el agente carga para una tarea concreta (ver [fundamentos de skills](/skills/skills-fundamentos/ai-tools-skills-fundamentals)).

## Qué problema resuelve

Este tipo de hero cinematográfico suele exigir un estudio de 3D, un animador y bastante trabajo de integración. scroll-world reparte el trabajo entre servicios de generación con IA y un motor de reproducción ya escrito:

- las **escenas** (dioramas isométricos coherentes entre sí) se generan con GPT Image 2 vía [Higgsfield](/resources/ia-media/higgsfield) o vía la CLI de Codex;
- los **vuelos de cámara** se generan con modelos de imagen a vídeo (Seedance 2.0 en Monid por defecto; Seedance o Kling con créditos de Higgsfield como respaldo);
- un **motor de scrub** en JavaScript puro reproduce toda la cadena como un vuelo continuo.

No depende de ningún framework: el motor crea su propio DOM e inyecta su CSS en el contenedor que le indiques, así que entra en HTML plano, Next.js, Vue, Astro o una página servida por Python.

## Cómo funciona

Al invocarla, la skill sigue tres fases:

1. **Entrevista.** Pregunta de qué trata el mundo (en abierto, no con opciones inventadas), el kit de marca (importado de una URL, aportado o propuesto), la dirección de arte, las escenas en orden, si quieres versión móvil y el **presupuesto**, con el coste estimado de cada nivel de render. Nada se genera hasta que lo apruebas.
2. **Generación.** Para N escenas produce N imágenes fijas, N clips de "entrada" a cada escena y N−1 clips **conectores** entre escenas consecutivas. La versión móvil renderiza una segunda cadena nativa en 9:16, no un recorte de la horizontal.
3. **Montaje.** Configura el motor de scrub para reproducir la cadena como un solo vuelo y servir automáticamente los clips verticales en teléfonos.

### La regla de las costuras

El `SKILL.md` insiste en una única regla: las uniones entre clips deben ser **idénticas fotograma a fotograma**. Por eso cada conector se genera a partir de los fotogramas reales ya renderizados de sus vecinos (condicionando el primer y el último fotograma), y solo se usan modelos capaces de fijar esos extremos. Si una costura no coincide, se ve un "salto" entre escenas; según la propia skill es el fallo más común.

### Qué trae la skill

```text
skills/scroll-world/
├── SKILL.md                 procedimiento, regla de costuras y problemas conocidos
└── references/
    ├── prompts.md           checklist de la entrevista y plantillas de prompts
    ├── pipeline.md          scripts por lotes: generar, extraer fotogramas, conectores, codificar
    ├── scrub-engine.js      motor de scrub portable y configurable
    ├── index-template.html  página mínima que monta el motor
    └── knockout.py          recorte de fondo para escenas flotantes
```

Los `.mp4` y `.webp` generados son de cada proyecto; el repositorio no los incluye.

## Instalación

En Claude Code, como plugin (la vía recomendada):

```text
/plugin marketplace add oso95/scroll-world
/plugin install scroll-world@scroll-world
```

Después basta con pedir una landing de mundo recorrible o invocar `/scroll-world`.

Para Codex y otros agentes, con el CLI de skills:

```bash
npx skills add oso95/scroll-world
```

Para apuntar a Codex directamente, añade `-a codex`. En Codex se invoca con `$scroll-world`.

Manual, copiando la carpeta de la skill:

```bash
git clone https://github.com/oso95/scroll-world
cp -R scroll-world/skills/scroll-world ~/.claude/skills/
```

En Codex, la carpeta destino es `~/.codex/skills/`.

### Requisitos

| Herramienta | Para qué |
| --- | --- |
| CLI de Monid con API key y saldo | Cadena de vídeo por defecto (Seedance 2.0, pago por clip en USD) |
| [Higgsfield CLI](/resources/ia-media/higgsfield-cli) autenticada (`higgsfield auth login`) | Imágenes de las escenas, respaldo `kling3_0` y la cadena completa si no hay Monid |
| `ffmpeg` / `ffprobe` | Extracción de fotogramas y codificación |
| Python 3 con Pillow | Lienzos verticales para móvil y recorte de fondo opcional |
| CLI de Codex (opcional) | Generar las imágenes con la suscripción de ChatGPT en vez de créditos de Higgsfield |

## Cuándo conviene y cuándo no

Conviene para una landing de marca o de producto donde el impacto visual justifica el coste, para presentar un sector o un proceso como un recorrido, o para prototipar rápido una idea que antes exigía un estudio de animación.

No conviene si la página tiene que cargar al instante en conexiones lentas, si el contenido principal es texto o datos, o si no hay presupuesto para generar vídeo. Para animaciones ligadas al scroll sobre elementos HTML reales (sin vídeo), una librería como [GSAP](/packages/astro-gsap/gsap) con ScrollTrigger da más control y pesa mucho menos.

## Límites y precauciones

- **Coste real y variable.** Imágenes en Higgsfield y del orden de 2N−1 clips de vídeo en Monid; la cadena móvil duplica los de vídeo. Según el README, la CLI de Higgsfield no expone precios y la skill calibra contra tu saldo; en todo caso anuncia el total estimado antes de gastar.
- **El catálogo de modelos cambia.** La skill revisa el esquema del endpoint en cada build porque los modelos disponibles y sus parámetros varían.
- **Rendimiento.** El motor hace carga diferida, pero un vuelo de varias escenas sigue siendo mucho vídeo. Mide el peso real y el LCP antes de publicar.
- **Accesibilidad.** Un hero que se mueve con el scroll puede marear. Comprueba qué ocurre con `prefers-reduced-motion` y que el contenido esencial esté también como texto.
- **Derechos de imagen.** Las escenas y la marca se generan con IA; revisa los términos de cada servicio antes de usarlas comercialmente.

## Fuentes

- [Repositorio y README de scroll-world](https://github.com/oso95/scroll-world)
- [SKILL.md de scroll-world](https://github.com/oso95/scroll-world/blob/main/skills/scroll-world/SKILL.md)
- [Monid](https://monid.ai)
- [Higgsfield](https://higgsfield.ai)
