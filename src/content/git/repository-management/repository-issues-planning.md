---
title: Issues, etiquetas y planificación del trabajo
description: Convertir errores, propuestas y tareas en Issues accionables sin usar GitHub como una lista desordenada de pendientes.
type: guides
order: 3
tags: [github, issues, planning, labels, triage]
related:
  - git/repository-management/git-colaboracion-pull-requests
  - git/repository-management/repository-files-community
updatedAt: 2026-08-25
---

Un **Issue** registra trabajo o una conversación que necesita seguimiento. Puede representar un error, una mejora, investigación, deuda técnica o documentación. No debería ser únicamente un título como “arreglar login”: debe permitir entender el problema y decidir cuándo está resuelto.

## Anatomía de un Issue accionable

```md
## Contexto

El usuario pierde el formulario al renovar una sesión expirada.

## Comportamiento actual

Después de iniciar sesión nuevamente, vuelve al inicio.

## Comportamiento esperado

Regresa al formulario con los datos no sensibles conservados.

## Criterios de aceptación

- conserva campos permitidos;
- nunca conserva contraseña ni token;
- funciona con teclado;
- incluye una prueba de regresión.

## Fuera de alcance

Rediseñar toda la autenticación.
```

El criterio de aceptación describe resultados verificables. La implementación puede cambiar durante el trabajo sin volver inválido el Issue.

## Tipos y etiquetas

Usa pocas dimensiones estables:

- tipo: `bug`, `feature`, `documentation`, `maintenance`;
- área: `frontend`, `api`, `database`, `auth`;
- estado: `needs-triage`, `blocked`, `ready`;
- prioridad o impacto: solo si existe una definición compartida.

Evita etiquetas casi equivalentes como `urgent`, `critical`, `high-priority` y `do-now`. Una etiqueta útil cambia una decisión de búsqueda, asignación o planificación.

## Triage

**Triage** significa clasificar y decidir el siguiente paso. Al revisar un Issue:

1. confirma que sea reproducible o comprensible;
2. elimina datos personales, tokens y capturas sensibles;
3. relaciona duplicados en vez de mantener conversaciones paralelas;
4. define responsable, prioridad y siguiente acción;
5. divide el trabajo si mezcla resultados independientes;
6. cierra con explicación cuando no se realizará.

Cerrar no significa borrar. La decisión y su motivo sirven como historial para futuras consultas.

## Issue Forms

GitHub puede convertir el reporte en un formulario estructurado dentro de `.github/ISSUE_TEMPLATE`:

```yaml title=".github/ISSUE_TEMPLATE/bug.yml"
name: Reportar un error
description: Ayúdanos a reproducir un comportamiento inesperado
title: "[Bug]: "
labels: [bug, needs-triage]
body:
  - type: textarea
    id: reproduction
    attributes:
      label: Pasos para reproducirlo
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Resultado esperado
    validations:
      required: true
```

No solicites secretos, información médica, datos de clientes ni archivos privados. Para vulnerabilidades usa el canal privado indicado en `SECURITY.md`, no un Issue público.

## Milestones y Projects

Un **milestone** agrupa Issues y PR alrededor de una versión u objetivo con fecha. GitHub Projects permite estados, vistas y campos personalizados. Empieza simple: si una lista ordenada resuelve la coordinación, no diseñes un sistema de gestión más complejo que el producto.

## Relación con la Pull Request

La PR explica la solución; el Issue conserva el problema y los criterios. Usa `Closes #123` cuando el merge realmente complete el Issue. Si solo aporta una parte, referencia `Related to #123` y deja explícito qué falta.

Fuente oficial: [plantillas e Issue Forms de GitHub](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates).
