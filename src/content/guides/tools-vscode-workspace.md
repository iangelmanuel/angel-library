---
title: VS Code — workspace, tareas y depuración
description: Convertir el editor en un entorno reproducible con settings del proyecto, extensiones recomendadas, tasks y launch configurations.
category: tools
stack: tools-editor
order: 1
tags: [vscode, editor, workspace, tasks, debugging]
related:
  - guides/developer-tools-fundamentals
  - guides/tools-calidad-codigo
  - guides/tools-chrome-devtools
updatedAt: 2026-08-19
---

Un **workspace** representa el proyecto que el editor tiene abierto. Puede ser una carpeta o un archivo `.code-workspace` con varias raíces. La configuración compartida debe describir decisiones del proyecto; las preferencias personales permanecen en la configuración del usuario.

## Configuración versionable

```json title=".vscode/settings.json"
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.astro": true,
    "**/dist": true
  }
}
```

`typescript.tsdk` hace que el editor use la versión instalada por el proyecto. Así, diagnósticos y refactors se acercan a lo que ejecuta CI.

```json title=".vscode/extensions.json"
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "astro-build.astro-vscode"
  ]
}
```

Las recomendaciones no instalan extensiones de forma silenciosa. Evita exigir extensiones que no sean necesarias y revisa su editor, permisos y procedencia como cualquier dependencia.

## Tasks: comandos repetibles

```json title=".vscode/tasks.json"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "check",
      "type": "shell",
      "command": "pnpm check",
      "group": { "kind": "test", "isDefault": true },
      "problemMatcher": ["$tsc"]
    }
  ]
}
```

Una task debe invocar el script del proyecto, no duplicar su lógica. De este modo la misma orden funciona desde terminal, editor y CI.

## Launch: depurar con breakpoints

```json title=".vscode/launch.json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Node actual",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/server.ts",
      "runtimeArgs": ["--enable-source-maps"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

Los **source maps** relacionan código transformado con el archivo original. Comprueba que no se publiquen mapas con código sensible si el despliegue no los necesita públicamente.

## Qué conviene compartir

- formato, lint y versión de TypeScript;
- tareas del proyecto y depuración reproducible;
- exclusiones de carpetas generadas;
- extensiones indispensables.

No compartas rutas absolutas, tokens, fuentes privadas ni decisiones puramente personales como tema o tamaño de fuente.

## Referencias

- [VS Code: workspaces](https://code.visualstudio.com/docs/editor/workspaces)
- [VS Code: tasks](https://code.visualstudio.com/docs/debugtest/tasks)
- [VS Code: debugging](https://code.visualstudio.com/docs/debugtest/debugging)

