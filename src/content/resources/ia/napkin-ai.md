---
title: "Napkin AI — texto convertido en diagramas editables"
description: Herramienta que interpreta un texto y propone una forma visual de explicarlo, como un flujo o una jerarquía; el resultado se puede editar y exportar.
category: resources
tags: [ai, diagramas, visuales, documentacion, presentaciones, svg]
url: https://www.napkin.ai/
resourceCategory: ia
technologies: []
personalNote: Lo valioso es que exporta SVG y todo queda editable; sirve para ilustrar documentación técnica sin abrir una herramienta de diseño. El plan gratuito no incluye SVG ni PPT.
related:
  - resources/ia/vibiz-ai
updatedAt: 2026-08-30
---

## Qué hace

Escribes o pegas texto, seleccionas un fragmento y Napkin propone varias formas de dibujarlo: diagrama de flujo, jerarquía, línea de tiempo, mapa mental radial, gráfico de datos o infografía. No hay que redactar un prompt: lee el propio texto y deduce los pasos, la jerarquía y las relaciones de causa y efecto.

Acepta entrada escrita directamente, pegada o importada desde archivos PPT, DOC, PDF, HTML y MD.

## Por qué sirve en documentación técnica

El resultado **no es una imagen cerrada**. Se pueden cambiar colores, tipografías, disposición e iconos, reformar elementos sueltos o cambiar el visual entero. Eso lo separa de un generador de imágenes: un diagrama de arquitectura que quedó casi bien se corrige, no se vuelve a generar.

La exportación a **SVG** es la que más conviene para un sitio propio: escala sin perder nitidez y pesa poco.

## Planes

| Plan | Qué incluye |
| --- | --- |
| Gratis | Créditos de IA semanales, edición ilimitada, importación de archivos, exportación ilimitada a PNG y PDF |
| Plus y Pro | Más créditos, exportación a PPT y SVG, marca propia y más opciones de diseño |

Requiere cuenta. Soporta más de 60 idiomas para el contenido.

## Antes de usarlo en algo serio

- **Revisa el diagrama, no lo publiques a ciegas.** La IA interpreta el texto; en un flujo con condiciones o excepciones puede simplificar de más y dejar un diagrama que dice algo distinto a la prosa.
- **Si necesitas SVG, cuenta con el plan de pago.** El gratuito llega hasta PNG y PDF, que para documentación web significa imágenes que no escalan bien.
- **No pegues información sensible.** El texto se procesa en su servicio; para diagramas de arquitectura interna, revisa antes su política de datos.
- **Para diagramas versionables, Mermaid sigue ganando.** Napkin brilla cuando el destino es una presentación o un documento; para algo que vive en un repositorio y cambia con el código, el texto plano de Mermaid se revisa en un *pull request* y Napkin no.
