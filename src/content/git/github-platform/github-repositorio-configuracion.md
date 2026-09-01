---
title: GitHub — configurar un repositorio mantenible
description: Decidir visibilidad, rama por defecto, reglas de protección y archivos de comunidad para que un repositorio sea fácil de usar.
type: guides
order: 4
tags: [github, repositorios, branch-protection, readme, seguridad]
scope: configuración del repositorio
related:
  - git/repository-management/repository-management-fundamentals
  - git/repository-management/repository-files-community
  - git/repository-management/repository-rules-security
updatedAt: 2026-08-26
---

Crear el repositorio es solo el comienzo. Una configuración pequeña y coherente reduce preguntas repetidas, evita pushes accidentales a producción y hace explícito cómo colaborar.

## Decisiones iniciales

- **Visibilidad**: usa `private` para código sensible o en desarrollo; usa `public` solo cuando el contenido, el historial y la documentación puedan compartirse.
- **Rama por defecto**: `main` debe representar el estado que el equipo considera principal.
- **README**: explica qué hace el proyecto, cómo instalarlo, cómo ejecutar comprobaciones y dónde pedir ayuda.
- **Licencia**: un repositorio público sin licencia no concede automáticamente permiso para reutilizar el código.
- **Topics**: agrega palabras que ayuden a descubrir el proyecto, no una lista de tecnologías que realmente no usa.

## Proteger `main`

En Settings → Branches o Rulesets, considera exigir:

1. Pull Request antes de integrar.
2. Una o más aprobaciones cuando el cambio tenga riesgo.
3. Checks de CI exitosos.
4. Rama actualizada antes del merge.
5. Bloqueo de force-push y eliminación accidental.

No exijas diez comprobaciones lentas para cada cambio si nadie puede mantenerlas. Las reglas deben proteger una decisión real del equipo, no convertirse en una barrera que la gente intente saltarse.

## Archivos que conviene versionar

```text
README.md
CONTRIBUTING.md
LICENSE
SECURITY.md
CODE_OF_CONDUCT.md
.github/
  ISSUE_TEMPLATE/
  PULL_REQUEST_TEMPLATE.md
  CODEOWNERS
```

`CODEOWNERS` puede solicitar revisión a personas responsables de ciertas carpetas. Las plantillas convierten Issues y Pull Requests en información accionable desde el primer mensaje.

## Seguridad mínima

- Activa secret scanning y push protection si están disponibles.
- Usa Dependabot para recibir actualizaciones y alertas de dependencias.
- Revisa quién tiene permisos de administración y escritura.
- Guarda tokens en Secrets o variables protegidas, nunca en el repositorio.
- Revisa Actions de terceros antes de concederles permisos de escritura.

La configuración correcta depende del tamaño y sensibilidad del proyecto, pero documentar las decisiones evita que la seguridad dependa de la memoria de una sola persona.
