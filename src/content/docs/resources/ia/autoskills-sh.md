---
title: "autoskills.sh — detecta tu stack e instala skills"
description: Herramienta de terminal que reconoce las tecnologías de un proyecto y propone instrucciones reutilizables para que un agente de IA trabaje con ellas.
tags: [ai, skills, cli]
draft: false
resourceCategory: ia
official: false
url: https://www.autoskills.sh
technologies: [resources/ia/skills-sh]
updatedAt: 2026-08-17
---

## Cómo funciona

El comando inspecciona archivos como `package.json` y los lockfiles para reconocer frameworks, lenguajes y herramientas. Después muestra una selección de skills relacionadas en lugar de instalarlas todas automáticamente.

## Antes de aceptar una propuesta

La detección indica que una tecnología aparece en el proyecto, no que cada instrucción sea correcta o necesaria. Revisa el repositorio y el contenido de la skill, comprueba qué archivos puede modificar y selecciona solo las que cubran una tarea real. Es especialmente útil al explorar un proyecto desconocido, siempre que la revisión siga siendo humana.
