---
title: "Matt Pocock Skills: habilidades de agentes para ingeniería real"
description: Colección editable y composable de skills para planificar, revisar, documentar e implementar cambios con asistentes de código.
tags: [skills, agentes, matt-pocock, arquitectura, code-review, especificaciones]
sidebar:
  order: 5
draft: false
resourceCategory: ia
official: true
website: https://www.aihero.dev/skills
url: https://github.com/mattpocock/skills
updatedAt: 2026-09-10
---

## En pocas palabras

[Matt Pocock Skills](https://github.com/mattpocock/skills) es una colección de instrucciones pequeñas para agentes de código. Su objetivo es ayudar a hacer ingeniería —entender el repositorio, convertir ideas en especificaciones, crear tickets, implementar y revisar— en lugar de pedirle al modelo que improvise una solución completa.

Las skills son archivos editables y combinables. Funcionan con distintos modelos y herramientas que entienden el formato de skills; el [sitio de AI Hero](https://www.aihero.dev/skills) explica la intención y el flujo de instalación.

## Qué incluye

El repositorio mantiene skills como:

- `ask-matt`, para consultar una decisión o pedir una explicación;
- `grill-with-docs`, para contrastar una idea con documentación;
- `triage`, para ordenar incidencias;
- `improve-codebase-architecture`, para detectar deuda estructural;
- `to-spec` y `to-tickets`, para convertir una petición en trabajo verificable;
- `implement`, para ejecutar una especificación y validar sus criterios;
- una skill de configuración inicial para adaptar el flujo al repositorio.

Los nombres y el contenido pueden crecer. Lee cada archivo antes de activarlo y revisa qué comandos, servicios o archivos espera.

## Instalación y configuración

El repositorio documenta dos caminos habituales:

```bash
# Instalador general de skills
npx skills@latest add mattpocock/skills

# Plugin de Claude Code
claude plugins install mattpocock-skills
```

Después, ejecuta `/setup-matt-pocock-skills` una vez por repositorio. El asistente pregunta dónde están tus documentos, si usas GitHub o Linear y qué etiquetas sirven para el triage. No aceptes valores por defecto sin comprobar que coincidan con tu proyecto.

## Cómo aprovecharlas sin perder control

1. Empieza con una skill de investigación o especificación, no con la de implementación.
2. Pide al agente que cite archivos y comandos que haya comprobado.
3. Revisa la especificación y conviértela en criterios de aceptación pequeños.
4. Ejecuta la implementación en una rama o worktree separado.
5. Conserva la skill y sus cambios en el repositorio si quieres que el equipo comparta el mismo proceso.

Una skill bien escrita explica entradas, pasos, límites y salida esperada. Si contiene instrucciones contradictorias, comandos peligrosos o supuestos sobre una estructura que no existe, edítala antes de usarla.

## Cuándo conviene

- equipos que quieren un proceso común para tareas asistidas por IA;
- repositorios donde la documentación y los tickets deben salir de la misma investigación;
- personas que están aprendiendo a dividir una petición grande en cambios comprobables;
- flujos que necesitan mejorar arquitectura sin reescribir todo de una vez.

Para una tarea de una línea, escribir el comando directamente es más rápido. El valor aparece al repetir una decisión o al compartirla entre varios repositorios.

## Límites y mantenimiento

- Una skill es texto ejecutable por contexto: inspecciona sus permisos y comandos.
- Las instrucciones pueden quedar desactualizadas cuando cambia el framework o el tracker.
- La instalación administrada por una herramienta puede sobrescribir cambios locales; decide qué versión debe ser la fuente de verdad.
- Un modelo puede seguir una skill y aun así equivocarse: conserva revisión humana y pruebas.

## Fuentes

- [Repositorio de skills](https://github.com/mattpocock/skills)
- [Guía oficial de AI Hero](https://www.aihero.dev/skills)
- [Catálogo de skills](https://skills.sh/mattpocock/skills)
