---
title: "Munder Difflin: oficina visual para varios agentes de código"
description: Aplicación local de escritorio que ejecuta CLIs de agentes reales en pseudo-terminales y coordina tareas con memoria, mailbox y un agente router.
tags: [munder-difflin, electron, react, agentes, terminal, memoria, orquestacion]
sidebar:
  order: 11
draft: false
resourceCategory: ia
official: true
website: https://munderdiffl.in/
url: https://github.com/chaitanyagiri/munder-difflin
updatedAt: 2026-09-10
---

## En pocas palabras

[Munder Difflin](https://github.com/chaitanyagiri/munder-difflin) es una aplicación local de escritorio para coordinar varios agentes de código. Cada agente ejecuta un proceso CLI real dentro de su propia pseudo-terminal (PTY) y aparece como un avatar en una oficina 2D. La interfaz visualiza actividad; no reemplaza la terminal ni convierte al agente en un sandbox.

El proyecto está construido con Electron, React, TypeScript, Pixi y `node-pty`. Soporta CLIs como Claude Code, Codex, Gemini CLI, GitHub Copilot CLI, OpenCode, Cursor y otras, además de modelos locales mediante Ollama, LM Studio o vLLM.

## Componentes principales

| Componente | Para qué sirve |
| --- | --- |
| PTY por agente | Ejecuta la CLI real y conserva su entrada y salida. |
| Oficina visual | Muestra quién trabaja, espera o necesita atención. |
| Michael/GOD | Agente router que puede distribuir mensajes y tareas. |
| Mailbox | Comunicación dirigida entre agentes y coordinación. |
| Memoria Markdown | Contexto persistente que se puede leer y versionar. |
| Pixi y xterm | Renderizado de la escena y de las terminales. |

La memoria basada en Markdown facilita inspección y copias, pero también puede contener instrucciones que un agente posterior interprete. Trata esos archivos como entrada no confiable y revísalos en cambios de Git.

## Instalación para probarlo

Puedes descargar un instalador firmado para tu sistema desde el [sitio oficial](https://munderdiffl.in/) o compilarlo desde el repositorio:

```bash
git clone https://github.com/chaitanyagiri/munder-difflin.git
cd munder-difflin
npm install
npm run dev
```

El `postinstall` reconstruye `node-pty` para el ABI de Electron. Si una actualización de Electron rompe el módulo nativo, vuelve a instalar dependencias con la versión de Node indicada por el proyecto y consulta sus incidencias abiertas.

## Flujo recomendado

1. Configura primero un agente sin acceso a datos sensibles.
2. Dale una tarea corta y observa los comandos que ejecuta en su PTY.
3. Comprueba cómo se escribe y recupera la memoria Markdown.
4. Añade un segundo agente solo cuando la primera tarea sea repetible.
5. Usa el router para delegar trabajo con criterios de aceptación y rutas de archivos claras.
6. Revisa diffs, logs y procesos antes de cerrar la sesión.

La interfaz permite ver muchos agentes a la vez, pero la coordinación sigue necesitando límites: un agente no debe asumir que otro terminó correctamente solo porque cambió de estado.

## Cuándo conviene

- experimentar con varios proveedores o suscripciones desde una máquina local;
- observar agentes de CLI sin abrir muchas ventanas de terminal;
- estudiar memoria y mailbox como primitives de coordinación;
- enseñar a un equipo cómo se descomponen y delegan tareas.

Para un solo agente, una terminal normal tiene menos superficie. Para ejecución aislada fuerte o equipos multiusuario, usa contenedores y un orquestador diseñado para ese nivel de seguridad.

## Seguridad y límites

- Las CLIs heredan los permisos del usuario que ejecuta la aplicación.
- Un proceso en una PTY puede borrar archivos, publicar cambios o leer variables de entorno.
- La memoria y el mailbox pueden filtrar secretos si se guardan en el repositorio.
- Electron y `node-pty` incluyen código nativo: mantén dependencias actualizadas y usa instaladores verificables.
- No está afiliado a la serie televisiva cuyo nombre evoca; el repositorio es un proyecto independiente.

## Fuentes

- [Repositorio y código de Munder Difflin](https://github.com/chaitanyagiri/munder-difflin)
- [Sitio oficial y descargas](https://munderdiffl.in/)
