---
title: "Node.js Best Practices (goldbergyoni)"
description: "Referencia para revisar decisiones de arquitectura, seguridad, pruebas y producción en Node.js; está pensada para consultar por tema, no para empezar desde cero."
type: resources
order: 3
tags: [cursos, nodejs, github, buenas-practicas, backend, espanol]
url: https://github.com/goldbergyoni/nodebestpractices/blob/spanish-translation/README.spanish.md
resourceCategory: learning
technologies: [backend/node/nodejs]
personalNote: Más útil como lista de repaso antes de un despliegue que como lectura seguida; cada punto enlaza el porqué con su fuente.
updatedAt: 2026-08-30
---

> Iniciado por **[Yoni Goldberg](https://github.com/goldbergyoni)** y mantenido por decenas de colaboradores, con licencia CC BY-SA 4.0. La rama en español es trabajo de traductores voluntarios.

La lista de buenas prácticas de **Node.js** más citada del ecosistema: más de cien recomendaciones agrupadas por área, cada una con un ejemplo de código y enlaces a la fuente que la respalda.

Ronda las 105.000 estrellas, se actualiza de forma continua y tiene licencia CC BY-SA 4.0. La traducción al español está en la rama `spanish-translation`.

## Qué cubre

| Área | Ejemplos de contenido |
| --- | --- |
| Estructura del proyecto | Separar por componentes, capas dentro del componente |
| Manejo de errores | Usar objetos `Error`, distinguir errores operacionales de bugs |
| Estilo de código | Convenciones, `const` sobre `let`, comparación estricta |
| Pruebas | Nombres de test que expliquen la intención, cobertura útil |
| Producción | Monitoreo, registro de eventos, delegar lo que no es Node |
| Seguridad | Validación de entrada, dependencias, cabeceras |
| Rendimiento | Evitar bloquear el bucle de eventos |

## Cómo usarlo

No está pensado para leerse de una sentada. Funciona mejor como **lista de verificación**: antes de sacar un servicio a producción, recorrer las secciones de seguridad y producción y comprobar punto por punto.

Cada recomendación tiene una versión corta y otra ampliada, así que se puede leer el titular y profundizar solo donde haga falta.

## Sobre la traducción

La rama en español puede ir por detrás de la principal. Cuando algo parezca desactualizado, conviene contrastar con el `README.md` en inglés de la rama por defecto.
