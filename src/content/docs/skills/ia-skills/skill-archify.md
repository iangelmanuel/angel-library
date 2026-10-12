---
title: "Archify — diagramas interactivos compilados desde JSON tipado"
description: "Skill para agentes de código que convierte una descripción o un repositorio en un diagrama HTML interactivo y autocontenido, pasando por una representación JSON tipada que se valida antes de entregar."
tags: [ai, skill, diagramas, arquitectura, claude-code, codex, cursor, documentacion-tecnica]
sidebar:
  order: 31
draft: false
tool: Cross-tool
resourceCategory: Sitio oficial
official: true
website: https://archify.si
github: https://github.com/tt-a1i/archify
technologies:
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
  - skills/ia-skills/skill-understand-anything
  - applications/apps-design/application-excalidraw
note: "Licencia MIT. Requiere Node.js para el renderizador y los validadores. Versión estable 3.0.1 a octubre de 2026."
warnings:
  - "La skill consulta un manifiesto fijo para avisar de nuevas versiones (no descarga ni instala nada). Se desactiva con `ARCHIFY_UPDATE_CHECK_DISABLED=1`."
  - El diagrama refleja lo que el agente describió, no el sistema en ejecución. Verifica componentes y flechas contra el código antes de publicarlo.
  - Los servicios de pago o plataformas que aparecen como patrocinadores en el README son de terceros y no forman parte del proyecto.
updatedAt: 2026-10-12
---

## En pocas palabras

[Archify](https://github.com/tt-a1i/archify) es una **skill para agentes de código** que convierte una idea, un plan o un repositorio en un **diagrama HTML interactivo**. El agente no dibuja: escribe una representación intermedia (IR) en **JSON tipado** con componentes, grupos y relaciones; Archify la valida y la compila en un archivo HTML autocontenido que se puede explorar, exportar y compartir.

Funciona con Claude Code, Codex CLI, Cursor y OpenCode, y tiene integraciones de comunidad para Hermes Agent y DeepSeek Harness. Ronda las **82 000 estrellas en GitHub a octubre de 2026** y supera las 130 000 instalaciones en skills.sh según su README. La [galería oficial](https://archify.si/gallery.html) muestra los ejemplos sin instalar nada.

> Una **skill** es un `SKILL.md` con instrucciones (y aquí, también scripts) que el agente carga cuando la tarea lo pide. Más contexto en [IA Tools: comandos, skills, plugins, hooks y MCP](/skills/skills-fundamentos/ai-tools-skills-fundamentals).

## Qué problema resuelve

Editar un diagrama a mano mezcla decisiones de contenido con decisiones de dibujo. En un proyecto de software eso acaba en imágenes desactualizadas, flechas ambiguas y revisiones imposibles de comparar. Archify separa las dos cosas:

1. el agente o la persona describe componentes, límites y conexiones;
2. la descripción se guarda como JSON tipado, con esquema;
3. validadores comprueban esquema, layout, rutas y etiquetas antes de entregar;
4. el compilador genera el HTML; el JSON queda como fuente revisable y versionable.

No es un editor de dibujo general ni un tema para Mermaid. Su objetivo es un artefacto de comunicación técnica reproducible.

## Instalación

Instalación global con la CLI de skills.sh:

```bash
npx skills add tt-a1i/archify -g
```

Instalación explícita y no interactiva para un agente concreto (el ejemplo del README es Cursor):

```bash
npx -y skills add tt-a1i/archify --skill archify --agent cursor --global --copy --yes
```

Probar sin instalar:

```bash
npx skills use tt-a1i/archify@archify --agent codex
```

Dónde queda según la herramienta:

| Herramienta | Ubicación o método                                                      | Capacidad                              |
| ----------- | ----------------------------------------------------------------------- | -------------------------------------- |
| Claude Code | `~/.claude/skills/` o `.claude/skills/`                                 | Renderizador y validación completos    |
| Codex CLI   | `~/.agents/skills/` o `.agents/skills/`                                 | Renderizador y validación completos    |
| OpenCode    | `~/.config/opencode/skills/`, `.opencode/skills/` o `.agents/skills/`   | Renderizador y validación completos    |
| Claude.ai   | Subir `archify.zip` en Configuración → Capacidades → Skills             | Depende del acceso a Node.js del sandbox |

## Cómo se invoca

Se le habla al agente en lenguaje natural mencionando Archify. No hace falta un repositorio:

```text
Use Archify to draw: Browser -> API -> Redis cache -> PostgreSQL fallback.
```

Para un diagrama respaldado por el código, abre el repositorio y pide algo acotado:

```text
Analiza este repositorio y usa archify para crear un diagrama de arquitectura en tiempo de ejecución.
Muestra 8–12 componentes, un camino principal, dependencias externas y límites de confianza.
Pon los detalles en tarjetas en lugar de añadir más flechas.
```

Después se itera en el chat: "añade autenticación", "resalta el camino del cache miss", "cambia al tema claro". El agente modifica la IR y el resto de la estructura se mantiene estable.

## Tipos de diagrama

| Tipo         | Para qué sirve                                    | Qué incluir en el prompt                      |
| ------------ | ------------------------------------------------- | --------------------------------------------- |
| Architecture | Componentes, servicios, almacenamiento, límites   | Alcance, componentes principales, camino clave |
| Workflow     | CI/CD, aprobaciones, llamadas a herramientas      | Participantes, orden, ramas, excepciones      |
| Sequence     | Llamadas a API, fallback de caché, autenticación  | Quién llama, a quién, respuestas, tiempos     |
| Data Flow    | Pipelines, linaje, datos personales, consumidores | Orígenes, transformaciones, almacenes, límites |
| Lifecycle    | Estados, reintentos, esperas, finales             | Estados, eventos, reintentos y cancelaciones  |

Para revisiones de diseño o de PR, **Architecture Delta** compara dos instantáneas validadas y genera una vista Before / Delta / After con lo añadido, quitado, cambiado y movido. No infiere impacto ni riesgo: solo muestra los hechos que se describieron.

## Cómo funciona por dentro

| Paso       | Qué ocurre                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Generar    | El agente crea la IR en JSON a partir de la descripción                                              |
| Validar    | Validadores y reglas de layout revisan la fuente; los fallos devuelven JSON con la corrección concreta |
| Previsualizar | Opcional: una sesión local recarga solo revisiones que pasan todas las comprobaciones             |
| Entregar   | Se renderiza un candidato y solo reemplaza al archivo final si pasa todo                              |
| Iterar     | El agente edita la fuente sin tocar la estructura no relacionada                                      |

La skill limita las correcciones automáticas a dos rondas; la revisión visual sigue siendo humana. Cuando se pide evidencia, los nodos de arquitectura marcan `SRC n` y enlazan archivos y rangos de líneas fijados a un commit público.

El repositorio incluye una CLI sin dependencias para trabajar fuera del agente:

```bash
cd archify
node bin/archify.mjs doctor
node bin/archify.mjs guide "Show CI/CD checks, approval, deploy, and rollback"
node bin/archify.mjs validate workflow examples/agent-tool-call.workflow.json --quality showcase --json
node bin/archify.mjs deliver workflow examples/agent-tool-call.workflow.json /tmp/workflow.html --quality showcase --open --json
node bin/archify.mjs compare architecture base.json head.json architecture-delta.html --json
```

El idioma de la interfaz del diagrama (títulos, leyenda, accesibilidad) se fija con `meta.locale`. Inglés y chino vienen incluidos; para español hay que aportar `meta.translations` (el repositorio trae `archify/examples/locales/es.json` como base). El contenido que escribes no se traduce.

## Explorar el resultado

El HTML no necesita Archify para abrirse. Incluye atajos de teclado:

| Acción                                          | Tecla       |
| ----------------------------------------------- | ----------- |
| Guía del diagrama                               | `?`         |
| Buscar y enfocar un nodo                        | `/`         |
| Trazar una ruta entre dos nodos                 | `R`         |
| Comparar uno o dos roles                        | `L`         |
| Minimapa                                        | `M`         |
| Modo presentación                               | `F`         |
| Estilo visual / tema / exportar                 | `S` / `T` / `E` |

Desde un nodo enfocado se ven sus dependencias hacia arriba y hacia abajo. Las vistas se comparten con enlaces (`#focus=<id>`, `#route=<origen>~<destino>`…). El menú de exportación copia PNG y descarga formatos estáticos, vídeo y tarjetas para compartir de 1200×630.

## Cuándo conviene

- Cuando varios agentes o personas deben producir diagramas con el mismo formato.
- Cuando la arquitectura se revisa por pull request y quieres comparar versiones.
- Cuando la documentación debe publicarse como HTML sin depender de un servicio externo.
- Cuando prefieres revisar texto estructurado antes de aceptar una imagen.

Para un esquema rápido de reunión, una pizarra como [Excalidraw](/applications/apps-design/application-excalidraw) o Mermaid es más directo. Si lo que necesitas es **explorar** un repositorio desconocido (no comunicar una decisión), [Understand Anything](/skills/ia-skills/skill-understand-anything) genera un grafo completo del código.

## Límites y comprobaciones

- **La IR no es la verdad del sistema.** El perfil `deployment-ownership` falla si faltan datos, pero no inspecciona infraestructura real.
- **Fuera de alcance:** parsear Mermaid automáticamente, layout automático general, alojamiento de diagramas y edición WYSIWYG.
- **Vista previa local.** `preview` vigila un único JSON y sirve en un puerto aleatorio de `127.0.0.1`; si una revisión falla, mantiene visible la última versión válida.
- **El proyecto evoluciona rápido.** Revisa el [CHANGELOG](https://github.com/tt-a1i/archify/blob/main/CHANGELOG.md) antes de automatizar una integración.

Antes de publicar, comprueba que cada flecha tenga una dirección clara, que los límites de confianza se vean y que la leyenda explique colores y símbolos. Si alguien nuevo no puede seguir una petición del actor al almacenamiento, el problema está en la descripción, no en el color.

## Fuentes

- [Repositorio y README de Archify](https://github.com/tt-a1i/archify)
- [Sitio oficial](https://archify.si)
- [Galería de ejemplos](https://archify.si/gallery.html)
- [Contrato de la skill (`SKILL.md`)](https://github.com/tt-a1i/archify/blob/main/archify/SKILL.md)
