---
title: "Impeccable — auditoría y refinamiento visual para agentes"
description: "Skill y conjunto de comandos para dar contexto de producto a un agente, revisar interfaces existentes y corregir jerarquía, tipografía, color, accesibilidad y patrones genéricos."
type: skills
order: 2
tags: [ai, skill, frontend, diseño, auditoria, codex]
tool: Cross-tool
related:
  - skills/ia-skills/skill-frontend-design
  - skills/ia-skills/skill-taste
updatedAt: 2026-09-04
---

**Impeccable** proporciona una skill de diseño, comandos especializados y comprobaciones deterministas para que un agente pueda analizar y refinar una interfaz con un vocabulario común. Está pensado tanto para dar forma a una pantalla como para mejorar código existente sin ignorar el sistema de diseño del proyecto.

## Instalación

Desde la raíz del proyecto:

```bash
npx impeccable install
```

Después se ejecuta la inicialización dentro del agente:

```text
/impeccable init
```

El instalador detecta herramientas como Codex, Claude Code, Cursor, GitHub Copilot y Gemini CLI, y permite elegir instalación local o global. Requiere Node.js 22.12 o posterior. En Codex se carga como skill y puede invocarse con `$impeccable`; si instala hooks en el proyecto, hay que revisarlos y aprobarlos antes de habilitarlos.

## Qué añade al proyecto

- `PRODUCT.md` conserva audiencia, propósito, restricciones, voz y contexto operativo.
- `DESIGN.md` documenta tokens, tipografía, componentes y dirección visual compartida.
- Un detector identifica patrones genéricos y problemas repetibles sin depender de una llamada a un modelo.
- El modo Live permite seleccionar elementos en el navegador y comparar variantes sobre el código real.

## Comandos principales

| Comando                 | Uso                                                         |
| ----------------------- | ----------------------------------------------------------- |
| `/impeccable shape`     | Definir UX y dirección antes de implementar                 |
| `/impeccable critique`  | Revisar claridad, jerarquía y coherencia                     |
| `/impeccable audit`     | Comprobar accesibilidad, adaptación y calidad de producción |
| `/impeccable polish`    | Dar una pasada final respetando el sistema existente        |
| `/impeccable typeset`   | Corregir tipografía, escala y jerarquía                      |
| `/impeccable layout`    | Ajustar composición, espacios y ritmo                        |
| `/impeccable distill`   | Eliminar ruido y reducir la interfaz a lo esencial           |
| `/impeccable harden`    | Cubrir errores, textos largos, i18n y casos límite           |

## Cuándo usarlo

Impeccable encaja especialmente bien cuando ya existe una interfaz y hace falta auditarla, explicar qué se ve mal y aplicar mejoras controladas. Taste Skill actúa principalmente durante la generación para evitar una dirección genérica; Impeccable aporta un lenguaje de revisión y refinamiento. Se pueden combinar, siempre que ambos reciban los mismos tokens y restricciones.

## Fuente y precauciones

- [Documentación oficial](https://impeccable.style/)
- [Repositorio oficial](https://github.com/pbakaus/impeccable)

El instalador puede escribir skills, comandos y hooks dentro de las carpetas de la herramienta. Revisa el diff después de instalar, no habilites hooks que no entiendas y conserva en Git únicamente los archivos de producto o diseño que el equipo realmente quiera compartir.
