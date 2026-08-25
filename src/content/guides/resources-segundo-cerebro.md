---
title: Arquitectura y mantenimiento del segundo cerebro técnico
description: Cómo organizar y mantener esta biblioteca de conocimiento; no es un enlace de Recursos, sino documentación editorial del proyecto.
category: tools
stack: tools-documentacion
tags: [knowledge-base, documentation, snippets, learning, maintenance]
order: 2
related:
  - guides/tools-documentacion-tecnica
  - guides/content-references
updatedAt: 2026-08-19
---

Este documento explica cómo se organiza y mantiene **angel.library**. No describe una página externa, por eso vive en Herramientas → Documentación técnica y no en Recursos.

Un segundo cerebro técnico no intenta copiar toda la documentación oficial. Conserva lo que ayuda a **recordar, decidir y aplicar**: modelos mentales, ejemplos propios, errores frecuentes y enlaces a la fuente vigente.

## Estructura por necesidad

```text
categoría → subcategoría → progresión de aprendizaje → tipo de contenido
```

- **Fundamentos:** vocabulario y modelo mental.
- **Guía:** explicación y decisiones para realizar una tarea.
- **Referencia:** API, métodos o comandos consultables.
- **Receta:** implementación completa de un problema concreto.
- **Snippet/utilidad:** pieza pequeña con contrato, ejemplo y límites.

No coloques una receta completa antes de explicar los conceptos propios de la tecnología que utiliza.

## Plantilla para una entrada

```md
# Qué es y qué problema resuelve
## Modelo mental y terminología
## API o pasos
## Ejemplo con entrada y salida
## Caso de uso
## Errores y límites
## Relacionados y fuentes oficiales
```

No toda página necesita todos los encabezados, pero código sin explicación se vuelve difícil de adaptar. Incluye también qué no resuelve y cuándo elegir otra opción.

## Capturar sin crear basura

Antes de agregar una nota, busca si amplía una existente. Prefiere una fuente de verdad y enlaces relacionados. Un snippet debe compilar, indicar runtime y mostrar qué retorna. Nunca guardes tokens, datos personales o URLs privadas.

## Mantenimiento

- Revisa enlaces y ejemplos al actualizar una dependencia.
- Marca versión o alcance cuando una API cambia con rapidez.
- Une duplicados y redirige entradas reemplazadas.
- Conserva una lista de páginas débiles o sin ejemplo.
- Usa build, schemas y enlaces validados como controles automáticos.

La fecha de actualización solo es útil si representa una revisión real. El mejor indicador de calidad es poder aplicar el contenido en un proyecto y entender sus riesgos sin contexto adicional.

