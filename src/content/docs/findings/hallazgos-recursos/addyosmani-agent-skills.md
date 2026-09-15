---
title: "agent-skills (Addy Osmani): 25 skills para el ciclo completo"
description: "Colección de skills para Claude Code que codifican prácticas de ingeniería por etapa —especificar, planear, construir, verificar, revisar y publicar— con sus puertas de calidad."
tags: [claude-code, skills, plugins, buenas-practicas, agentes, github]
sidebar:
  order: 6
draft: false
resourceCategory: learning
url: https://github.com/addyosmani/agent-skills
updatedAt: 2026-09-14
---

> Creado por **[Addy Osmani](https://github.com/addyosmani)**, con aportes de Federico Bartoli y Joan León. Licencia MIT.

[agent-skills](https://github.com/addyosmani/agent-skills) es un paquete de 25 skills — 24 del ciclo de vida más una meta-skill — que guían a un agente de código por prácticas de ingeniería concretas en cada etapa, con puertas de calidad y criterios de decisión explícitos.

## Qué cubre

| Etapa      | Skills                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Definir    | Escribir especificaciones, entrevista de requisitos, refinar una idea  |
| Planear    | Descomponer tareas y ordenarlas por dependencias                       |
| Construir  | TDD, implementación incremental, diseño de frontend y de API           |
| Verificar  | Pruebas en navegador, depuración y recuperación de errores             |
| Revisar    | Puertas de calidad, simplificación, seguridad, rendimiento             |
| Publicar   | Flujo de Git, CI/CD, deprecación, documentación, observabilidad        |

## Instalarlas en Claude Code

La vía recomendada es el marketplace de plugins:

```text
/plugin marketplace add addyosmani/agent-skills
/plugin install agent-skills@addy-agent-skills
```

Para desarrollo o para leerlas con calma en local:

```bash
git clone https://github.com/addyosmani/agent-skills.git
claude --plugin-dir /ruta/a/agent-skills
```

Si el clon por SSH falla, necesitas claves de GitHub configuradas o forzar HTTPS en la URL del repositorio.

## Cómo está escrita cada skill

El formato es lo más reutilizable del proyecto, incluso para escribir las tuyas:

- Frontmatter con `name` y `description`.
- Resumen y disparadores de activación.
- El proceso, paso a paso.
- Una **tabla de anti-racionalización**: excusas habituales para saltarse el paso, con su réplica.
- Banderas rojas y requisitos de verificación.

Esa tabla es la parte que no se ve en otras colecciones: en vez de decir "escribe pruebas", anticipa el "esto es demasiado simple para probarlo" y responde.

## Antes de instalar

1. Revisa el contenido: una skill son instrucciones que entran al contexto de un agente con acceso a tu repositorio. Vale leerlas (o pasarlas por un escáner como [ClawScan](/findings/hallazgos-ia/clawscan)).
2. Instalar skills individuales con `npx` **omite el directorio `references/`** compartido, donde viven listas de comprobación complementarias. Las alternativas: integrar el repositorio completo o copiar a mano los archivos de referencia que necesites.
3. Veinticinco skills activas compiten por el contexto: empieza por las dos o tres de la etapa en la que realmente pierdes tiempo.
4. Son prácticas opinadas. Si tu equipo trabaja de otra forma, una skill que impone un flujo ajeno genera fricción en cada tarea.

## Fuentes

- [Repositorio y README de agent-skills](https://github.com/addyosmani/agent-skills)
