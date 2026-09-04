---
title: "Agentes de programación: conceptos fundamentales"
description: "Qué distingue a un agente de un chat o autocompletado, cómo combina contexto y herramientas, qué autonomía recibe y cómo verificar el trabajo de Claude Code, Codex CLI, Cursor u OpenCode."
type: guides
order: 1
tags: [ia, agentes, contexto, herramientas, permisos, subagentes, fundamentos]
related:
  - agents/agents-fundamentos/agent-safe-workflow
  - skills/skills-fundamentos/ai-tools-skills-fundamentals
updatedAt: 2026-09-04
---

Un **agente de programación** combina un modelo de lenguaje con acceso al proyecto y herramientas para inspeccionar archivos, editar código, ejecutar comandos y comprobar resultados. No se limita a proponer una respuesta: puede observar el estado del trabajo, actuar y adaptar el siguiente paso según lo que ocurra.

La capacidad real del agente no depende únicamente del modelo. También la determinan el contexto disponible, las instrucciones del repositorio, las herramientas habilitadas, los permisos concedidos y el criterio usado para decidir que la tarea terminó.

## Chat, autocompletado y agente

| Experiencia    | Entrada principal                     | Resultado habitual                        |
| -------------- | ------------------------------------- | ----------------------------------------- |
| Autocompletado | Código alrededor del cursor           | Sugiere la siguiente línea o bloque       |
| Chat           | Pregunta, fragmentos y archivos dados | Explica o propone cambios                 |
| Agente         | Objetivo y acceso al entorno          | Inspecciona, modifica, ejecuta y verifica |

Un agente sigue siendo probabilístico. Que pueda ejecutar una acción no significa que comprenda toda la intención ni que esa acción esté autorizada. La autonomía útil siempre necesita límites y evidencia.

## Ciclo de trabajo

```text
objetivo → inspeccionar → formular hipótesis → actuar → verificar
               ↑                                  │
               └──────── ajustar con evidencia ───┘
```

Cada vuelta debería reducir incertidumbre. Si una prueba falla, el agente usa ese resultado para corregir la hipótesis; si repite acciones sin aprender nada, el ciclo dejó de ser útil.

| Pieza              | Pregunta que debe responder                            |
| ------------------ | ------------------------------------------------------ |
| Objetivo           | ¿Qué resultado concreto se espera?                     |
| Alcance            | ¿Qué archivos, servicios y personas están incluidos?   |
| Contexto           | ¿Qué necesita conocer para tomar decisiones correctas? |
| Herramientas       | ¿Qué puede leer, ejecutar o modificar?                 |
| Permisos           | ¿Qué acciones requieren aprobación?                    |
| Criterio de salida | ¿Qué evidencia demuestra que el trabajo terminó?       |

## Agentes documentados en esta categoría

| Agente      | Superficie principal             | Empieza por                                                          |
| ----------- | -------------------------------- | -------------------------------------------------------------------- |
| Claude Code | Terminal                         | [CLAUDE.md](/agents/claude-code/claude-code-claude-md)               |
| Codex CLI   | Terminal                         | [AGENTS.md](/agents/codex/codex-agents-md)                           |
| Cursor      | Editor con agente y CLI          | [Rules y contexto](/agents/cursor/cursor-rules)                      |
| OpenCode    | Terminal y configuración abierta | [Instrucciones de proyecto](/agents/opencode/opencode-instrucciones) |

Los productos cambian de interfaz y de modelos, pero comparten el mismo problema: convertir una intención humana en una secuencia de acciones verificables sobre un entorno real.

## Contexto e instrucciones persistentes

El **contexto** reúne conversación, archivos, resultados de comandos, documentación y reglas. Una ventana grande no equivale a memoria perfecta: información irrelevante o contradictoria puede ocultar lo importante.

Las instrucciones persistentes —como `AGENTS.md`, `CLAUDE.md` o las Rules de Cursor— deberían contener solo lo que afecta la forma de trabajar en ese repositorio:

- comandos reales para instalar, probar y compilar;
- arquitectura y fronteras que no deben romperse;
- convenciones que el código no permite deducir;
- restricciones de seguridad o datos;
- criterio de validación esperado.

El objetivo concreto pertenece a la tarea actual, no al archivo permanente. Guardar solicitudes temporales en las reglas obliga a repetirlas en sesiones futuras donde ya no aplican.

## Herramientas, permisos y sandbox

Una herramienta es una capacidad concreta; el agente decide cuándo usarla. Leer un archivo, ejecutar una prueba, consultar una API y publicar un despliegue tienen impactos diferentes, por lo que no deberían compartir el mismo nivel de permiso.

| Nivel           | Ejemplos                                  | Riesgo principal                                  |
| --------------- | ----------------------------------------- | ------------------------------------------------- |
| Lectura         | Buscar código, inspeccionar configuración | Exponer información sensible                      |
| Escritura local | Editar archivos, generar artefactos       | Cambiar contenido fuera del alcance               |
| Ejecución       | Tests, builds, scripts, instalaciones     | Ejecutar código no confiable o consumir recursos  |
| Efecto externo  | Deploy, mensajes, bases de datos, cuentas | Afectar usuarios o sistemas fuera del repositorio |

Un **sandbox** limita archivos, red o procesos. Una **aprobación** amplía esos límites para una acción concreta. Ninguno reemplaza revisar el comando, el destino y la reversibilidad.

## Agentes y subagentes

Un subagente recibe una parte acotada del objetivo con contexto y herramientas propios. Es útil para investigaciones independientes o revisiones paralelas; no ayuda cuando varias tareas necesitan editar los mismos archivos o tomar una decisión compartida continuamente.

Delegar no elimina la responsabilidad del agente principal. Este debe comparar resultados, resolver contradicciones, integrar los cambios y ejecutar la validación final.

## Qué debe verificar una persona

La explicación del agente no es evidencia suficiente. Antes de aceptar el resultado revisa:

- el diff completo y los archivos no previstos;
- pruebas, tipos y build relevantes;
- errores ignorados o comandos que no encontraron nada que probar;
- cambios de dependencias, permisos o configuración;
- enlaces, comportamiento visual y accesibilidad cuando corresponda;
- efectos externos y datos enviados a terceros.

## Primer flujo recomendado

1. Describe resultado, alcance, restricciones y condición de finalización.
2. Deja que el agente inspeccione antes de proponer cambios grandes.
3. Concede primero permisos de lectura y ejecución reversible.
4. Pide cambios pequeños y observa la evidencia entre pasos.
5. Revisa el diff y ejecuta las comprobaciones del proyecto.
6. Conserva como instrucción permanente solo lo que será cierto en futuras tareas.

Las capacidades reutilizables que se conectan al agente —comandos, skills, plugins, hooks y MCP— se explican en [Fundamentos de IA Tools](/skills/skills-fundamentos/ai-tools-skills-fundamentals).
