---
title: "Archify: diagramas técnicos compilados desde una descripción"
description: Skill y compilador open source que convierte una representación JSON tipada en diagramas HTML, SVG y otros artefactos reproducibles.
tags: [archify, diagramas, arquitectura, agentes, documentacion-tecnica]
sidebar:
  order: 8
draft: false
resourceCategory: developer-tools
official: true
website: https://tt-a1i.github.io/archify/
url: https://github.com/tt-a1i/archify
updatedAt: 2026-09-10
---

## En pocas palabras

[Archify](https://github.com/tt-a1i/archify) es un sistema de Node.js, una skill para agentes de código y un compilador determinista de diagramas. El agente no dibuja directamente: produce una representación intermedia (IR) en JSON con tipos y relaciones, y Archify compila ese documento en una salida visual. La separación permite revisar el dato, repetir la compilación y comparar versiones de una arquitectura.

El proyecto se puede usar desde Raven, Cursor, Claude Code, Codex CLI u OpenCode. La [demo oficial](https://tt-a1i.github.io/archify/) muestra las salidas sin que tengas que instalarlo.

## Qué problema resuelve

Editar un diagrama manualmente mezcla decisiones de contenido con decisiones de diseño. En un proyecto de software eso provoca imágenes desactualizadas, flechas ambiguas y revisiones difíciles de comparar. Archify propone un flujo declarativo:

1. el agente o la persona describe componentes, límites y conexiones;
2. la salida se valida como JSON tipado;
3. el compilador genera el diagrama con un preset y un tema;
4. la arquitectura se guarda como una instantánea que puede compararse con otra.

El resultado sirve para documentación, revisiones de diseño, mapas de dependencias y explicaciones de cambios. No sustituye una herramienta de modelado formal ni descubre por sí solo toda la arquitectura del repositorio.

## Cómo funciona

Archify organiza el proceso en tres capas:

| Capa | Responsabilidad |
| --- | --- |
| Descripción | Componentes, grupos, relaciones, notas y metadatos en una IR tipada. |
| Compilación | Renderizado determinista según tipo de diagrama, preset, tema y marcas. |
| Artefactos | HTML autocontenido, SVG, PNG, WebM y tarjetas para compartir, según la salida elegida. |

El repositorio documenta cinco familias de diagramas y cuatro presets. También incluye temas claro y oscuro, marcas de producto y movimiento finito. Estas opciones son decisiones de presentación; la información importante permanece en la IR.

## Flujo recomendado para un repositorio

1. Empieza con un solo límite del sistema y nombra cada componente con una responsabilidad observable.
2. Pide al agente que devuelva la IR, no una imagen, y revisa nombres, direcciones de las flechas y dependencias externas.
3. Compila con un preset estable y guarda el JSON junto a la documentación.
4. En una revisión posterior, genera una vista **Before/Delta/After** para que el cambio arquitectónico sea explícito.
5. Enlaza la fuente de cada afirmación: archivo, ruta, endpoint o decisión de diseño.

Una búsqueda grounded y el trazado de fuentes ayudan a evitar que el agente invente componentes. Aun así, la revisión humana sigue siendo necesaria cuando el diagrama representa permisos, datos sensibles o contratos de producción.

## Cuándo conviene

- cuando varios agentes necesitan producir el mismo tipo de diagrama;
- cuando una arquitectura se revisa por pull request y quieres comparar instantáneas;
- cuando la documentación debe publicarse como HTML o SVG sin depender de un servicio externo;
- cuando el equipo prefiere revisar texto estructurado antes de aceptar una imagen.

Para un esquema rápido de una reunión, una pizarra o Mermaid pueden ser más directos. Archify aporta valor cuando la repetibilidad y el historial importan.

## Límites y comprobaciones

- **La IR no es la verdad del sistema.** Verifica el repositorio y las decisiones reales antes de publicar el diagrama.
- **La salida depende del preset.** Un cambio de preset puede alterar la lectura visual sin cambiar los datos.
- **Los artefactos grandes pesan.** Publica SVG o HTML cuando PNG/WebM no sean necesarios.
- **El proyecto evoluciona.** Revisa los esquemas y las instrucciones de la skill antes de automatizar una integración.

Comprueba que cada flecha tenga una dirección entendible, que los límites de confianza estén visibles y que la leyenda explique colores o símbolos. Si una persona nueva no puede seguir una petición desde el actor hasta el almacenamiento, el problema está en la descripción, no en el color del diagrama.

## Fuentes

- [Repositorio y README de Archify](https://github.com/tt-a1i/archify)
- [Demo oficial](https://tt-a1i.github.io/archify/)
