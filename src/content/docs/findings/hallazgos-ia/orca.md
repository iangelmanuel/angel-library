---
title: "Orca: orquestación visual de agentes en worktrees"
description: Entorno de desarrollo que ejecuta agentes en worktrees aislados, centraliza sus cambios y permite automatizar el escritorio y la revisión.
type: resources
order: 8
tags: [orca, agentes, git, worktrees, automatizacion, github, linear]
url: https://github.com/stablyai/orca
website: https://www.onorca.dev/
resourceCategory: ia
official: true
personalNote: La separación por worktree hace visible qué agente modifica qué rama; úsala antes de enviar varias tareas que puedan tocar los mismos archivos.
updatedAt: 2026-09-10
---

## En pocas palabras

[Orca](https://github.com/stablyai/orca) es un entorno de desarrollo y orquestador para trabajar con varios agentes en paralelo. Cada agente obtiene su propio worktree de Git, mientras la aplicación reúne terminales, diffs, archivos y tareas en una sola vista.

Funciona con agentes de CLI y no exige un proveedor concreto. Puede conectar GitHub y Linear, acceder por SSH y enviar anotaciones de diseño o de diff al agente que trabaja en ese contexto.

## La unidad de aislamiento: un worktree

Un worktree es otra carpeta de trabajo enlazada al mismo repositorio. Orca usa esa carpeta para que cada agente tenga:

- una rama y un estado de archivos independientes;
- una terminal propia con salida observable;
- un diff que puede revisarse antes de integrar;
- la posibilidad de ejecutar pruebas sin modificar la tarea vecina.

El aislamiento reduce colisiones, pero no decide cómo fusionar cambios. Cuando dos worktrees editan la misma parte de un archivo, todavía necesitas resolver el conflicto y revisar el resultado.

## Flujo recomendado

1. Abre el repositorio y comprueba que el árbol de trabajo esté limpio.
2. Crea un worktree para cada tarea con un nombre que describa el objetivo.
3. En cada agente, indica archivos, criterio de aceptación y comandos de verificación.
4. Observa el diff y los logs desde Orca; no aceptes una tarea solo porque el agente terminó.
5. Ejecuta pruebas en el worktree y fusiona o crea el pull request desde Git.

El producto también ofrece un modo de diseño: puedes enviar HTML/CSS y una captura recortada para que el agente entienda una diferencia visual. Describe qué debe conservarse y qué debe cambiar, porque una imagen por sí sola no define accesibilidad, estados vacíos ni comportamiento responsive.

## Automatización y controles

La documentación del proyecto incluye una CLI para crear worktrees, tomar snapshots, hacer clic y rellenar campos. Esa superficie es útil para demos o flujos repetibles, pero una automatización de escritorio debe ser idempotente y tener un límite de tiempo.

Antes de permitir que un agente ejecute comandos automáticamente:

- limita el repositorio y la rama que puede modificar;
- deja explícitas las pruebas y el criterio de finalización;
- guarda el snapshot antes de acciones destructivas;
- revisa secretos, archivos ignorados y permisos de GitHub/Linear.

## Instalación

Puedes descargar la aplicación desde el [sitio oficial](https://www.onorca.dev/) o instalarla con Homebrew:

```bash
brew install --cask stablyai/orca/orca
```

El repositorio también documenta una opción para Arch y una guía de servidor headless. Usa las instrucciones de tu sistema y revisa la versión antes de automatizar atajos o comandos.

## Cuándo conviene

- explorar varias implementaciones de una tarea sin mezclar archivos;
- coordinar agentes que trabajan en paralelo sobre un repositorio;
- revisar cambios con una vista conjunta de terminal, diff y tareas;
- conectar el trabajo local con issues de GitHub o Linear.

Para una sola tarea lineal, crear un worktree a mano y usar tu terminal puede ser más fácil de aprender. Orca aporta cuando el coste de cambiar entre contextos supera el coste de mantenerlos aislados.

## Límites

- Los worktrees consumen disco y pueden quedar desactualizados si no sincronizas la rama base.
- La aplicación no valida la corrección del código ni sustituye la revisión de seguridad.
- La integración con trackers y SSH añade credenciales que debes rotar y limitar.
- Los atajos y la automatización de UI pueden cambiar entre versiones.

## Fuentes

- [Repositorio y README de Orca](https://github.com/stablyai/orca)
- [Sitio oficial](https://www.onorca.dev/)
