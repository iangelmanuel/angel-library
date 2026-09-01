---
title: "Gestión de repositorios: estructura y lista de comprobación"
description: Qué necesita un repositorio mantenible desde su creación hasta releases, contribuciones, seguridad y archivo.
type: guides
order: 1
tags: [github, repositorios, mantenimiento, colaboracion, gobernanza]
related:
  - git/repository-management/repository-files-community
  - git/repository-management/repository-issues-planning
  - git/repository-management/git-colaboracion-pull-requests
  - git/repository-management/repository-licenses
  - git/repository-management/repository-rules-security
updatedAt: 2026-08-25
---

Un repositorio no es únicamente una carpeta con código y un historial de Git. También es la **interfaz de colaboración** del proyecto: explica qué resuelve, cómo se ejecuta, quién puede cambiarlo, cómo se reportan problemas y qué controles deben cumplirse antes de publicar.

## Aprende o consulta

Si estás creando tu primer repositorio, sigue esta secuencia: propósito → ejecución local → archivos esenciales → Issues → Pull Requests → licencia → automatización y protección. Si vienes a revisar uno existente, usa la tabla como auditoría rápida.

| Pregunta | Documento |
| --- | --- |
| ¿Qué archivos debería tener? | [Archivos y documentación comunitaria](/git/repository-management/repository-files-community) |
| ¿Cómo convertir trabajo en Issues útiles? | [Issues, etiquetas y planificación](/git/repository-management/repository-issues-planning) |
| ¿Cómo preparar y revisar una PR? | [Pull Requests y revisión](/git/repository-management/git-colaboracion-pull-requests) |
| ¿Qué licencia corresponde? | [Licencias de software](/git/repository-management/repository-licenses) |
| ¿Cómo proteger la rama principal? | [Rulesets, automatización y seguridad](/git/repository-management/repository-rules-security) |

## Mínimo viable de un repositorio

Todo proyecto que otra persona deba entender necesita, como mínimo:

- `README.md` con propósito, requisitos, instalación, ejecución y comandos;
- `.gitignore` adecuado al lenguaje y sin secretos versionados;
- lockfile del gestor elegido para instalaciones reproducibles;
- una licencia explícita si se permite reutilización;
- pruebas o, al menos, una comprobación automatizada del build;
- un canal claro para reportar fallos o pedir cambios.

Un repositorio público necesita además explicar cómo contribuir y reportar vulnerabilidades. En uno privado siguen siendo útiles `CONTRIBUTING.md`, las plantillas y la protección de ramas: reducen conocimiento implícito dentro del equipo.

## Ciclo de vida

```text
idea o problema
  → Issue con contexto y criterio de aceptación
  → rama corta y commits revisables
  → Pull Request con evidencia
  → revisión + comprobaciones automáticas
  → merge y despliegue
  → release, monitoreo y documentación
```

Cada etapa deja evidencia. Una conversación privada puede desbloquear el trabajo, pero la decisión importante debe quedar en el Issue, la PR, un ADR o la documentación correspondiente.

## Salud observable

Un repositorio saludable permite responder rápidamente:

1. ¿Qué problema resuelve y cuál es su estado?
2. ¿Cómo lo ejecuto sin adivinar versiones o variables?
3. ¿Qué cambios están permitidos y quién los revisa?
4. ¿Qué pruebas protegen el comportamiento importante?
5. ¿Cómo se reporta un fallo de seguridad sin publicarlo?
6. ¿Qué versión está desplegada y cómo se revierte?

La cantidad de archivos no garantiza calidad. Una plantilla que nadie completa o un CI que siempre se ignora crea apariencia de proceso sin reducir riesgo.

## Repositorio público, privado o archivado

**Público** describe visibilidad, no permiso de uso: la licencia define lo que terceros pueden hacer. **Privado** limita acceso, pero todavía requiere permisos mínimos, secretos externos y trazabilidad. **Archivado** comunica que el proyecto queda en modo de solo lectura; antes de archivarlo conviene explicar su reemplazo, estado de seguridad y última versión soportada.

## Auditoría rápida antes de compartir

- clonar en una carpeta limpia y seguir el README literalmente;
- comprobar que `.env.example` no contenga credenciales reales;
- ejecutar tipos, pruebas, lint y build;
- revisar archivos grandes, binarios y datos personales;
- confirmar licencia, propietarios y política de seguridad;
- verificar reglas de la rama predeterminada y permisos de Actions;
- probar una contribución simulada desde Issue hasta merge.

La meta es que el repositorio explique su propio funcionamiento y que los controles críticos no dependan de que una persona recuerde ejecutarlos.

