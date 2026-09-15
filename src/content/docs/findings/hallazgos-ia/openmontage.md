---
title: "OpenMontage: producción de vídeo guiada por agentes"
description: Plataforma open source que coordina investigación, guion, assets, edición y render mediante pipelines declarativos, checkpoints y aprobación humana.
tags: [openmontage, video, agentes, pipelines, ffmpeg, python, produccion]
sidebar:
  order: 10
draft: false
resourceCategory: ia
official: true
website: https://www.openmontage.video/
url: https://github.com/calesthio/OpenMontage
updatedAt: 2026-09-10
---

## En pocas palabras

[OpenMontage](https://github.com/calesthio/OpenMontage) es una plataforma open source para producir vídeos con agentes. El agente actúa como control plane: lee manifiestos de pipeline y skills de dirección, llama herramientas Python registradas, escribe checkpoints JSON y pausa en puntos de aprobación.

El repositorio anuncia una docena de pipelines, más de cien herramientas y cientos de archivos de conocimiento para producción. Esas cifras describen la versión consultada; revisa el repositorio antes de planificar un proyecto con ese alcance.

## El pipeline es el contrato

OpenMontage pide que la producción pase por un pipeline, no por scripts sueltos. Una etapa recibe entradas declaradas y produce artefactos que la siguiente puede verificar:

```text
investigación → guion → assets → montaje → revisión → render → entrega
```

Los manifiestos indican qué etapas existen, qué herramientas están registradas y dónde se guardan los checkpoints. Así puedes reanudar desde la última etapa aprobada y repetir un render sin volver a investigar todo.

## Preparación

Los requisitos publicados incluyen Python 3.10 o superior, FFmpeg, Node.js 18 o superior y un asistente de código con acceso a los archivos del proyecto (Claude, Cursor, Copilot, Windsurf o Codex, entre otros).

```bash
git clone https://github.com/calesthio/OpenMontage.git
cd OpenMontage
make setup
```

Después abre el directorio en tu agente y lee los manifiestos, la guía del agente y las skills de etapa antes de pedir un vídeo. El [AGENT_GUIDE](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md) explica el orden de lectura y las reglas de producción.

## Flujo para principiantes

1. Elige un pipeline pequeño y un objetivo de duración, formato y audiencia.
2. Declara qué fuentes se pueden usar y cómo se atribuirán.
3. Ejecuta la investigación y revisa el checkpoint antes de generar assets.
4. Aprueba el guion y comprueba que cada afirmación tenga una fuente.
5. Revisa imágenes, audio y licencias antes del montaje.
6. Inspecciona el vídeo intermedio, corrige la etapa responsable y vuelve a renderizar.

La revisión por etapas evita que un error de investigación se multiplique en el guion, las imágenes y el montaje final.

## Herramientas y agentes

El agente no debería inventar una llamada Python ni escribir un script ad hoc para saltarse el pipeline. Busca una herramienta registrada o añade una nueva con su contrato, entradas, salida y prueba. Los proveedores de generación, búsqueda de stock y voz pueden cambiar el coste y la disponibilidad; configúralos como dependencias explícitas.

## Cuándo conviene

- series de vídeos donde repetir el proceso importa;
- equipos que necesitan checkpoints y aprobación humana;
- investigación y edición que deben quedar auditables;
- experimentos que combinan material real, stock e imágenes generadas.

Para un clip único con edición manual, un editor tradicional es más rápido. OpenMontage aporta estructura cuando hay muchas etapas o se necesita reanudar y revisar.

## Límites, licencias y costes

- El proyecto usa licencia AGPL-3.0; revisa sus obligaciones antes de ofrecer un servicio modificado.
- La disponibilidad y licencia de material externo depende de cada fuente, no del repositorio.
- APIs de generación, voz y stock pueden tener costes, límites o cambios de calidad.
- El agente puede operar sobre archivos y ejecutar comandos: usa un entorno separado y no le des secretos innecesarios.

## Fuentes

- [Repositorio y README de OpenMontage](https://github.com/calesthio/OpenMontage)
- [Sitio oficial](https://www.openmontage.video/)
- [Guía para agentes](https://github.com/calesthio/OpenMontage/blob/main/AGENT_GUIDE.md)
- [Arquitectura del proyecto](https://github.com/calesthio/OpenMontage/blob/main/ARCHITECTURE.md)
