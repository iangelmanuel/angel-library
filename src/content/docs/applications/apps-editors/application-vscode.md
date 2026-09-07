---
title: Visual Studio Code — workspace de desarrollo
description: Editor de código que reúne archivos, terminal, control de versiones y depuración; la guía separa la configuración personal de la que conviene compartir con el proyecto.
type: guides
order: 1
tags: [vscode, editor, workspace, extensions, debugging]
website: https://code.visualstudio.com
related:
  - applications/apps-editors/myjson
updatedAt: 2026-08-25
---

**Visual Studio Code**, o VS Code, es un editor extensible. Incluye edición, terminal, control de versiones, depuración y soporte para el **Language Server Protocol** (LSP), que permite que herramientas de distintos lenguajes ofrezcan autocompletado, navegación y diagnósticos mediante un protocolo común.

## Instalación

```bash
# Windows (winget)
winget install Microsoft.VisualStudioCode

# macOS (Homebrew)
brew install --cask visual-studio-code

# Linux — Debian/Ubuntu (repositorio oficial de Microsoft)
sudo apt install wget gpg
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft.gpg
echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/code stable main" |
  sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update && sudo apt install code

# Linux — Snap (cualquier distro con snapd)
sudo snap install --classic code
```

Fedora/RHEL usa el mismo repositorio de Microsoft pero con `dnf`/`yum`; el paso a paso completo está en la [guía de instalación en Linux](https://code.visualstudio.com/docs/setup/linux). Si prefieres no tocar la terminal, el `.exe`/`.dmg`/`.deb` está en la página de descarga directa.

## Aprende o consulta

Quien empieza debe distinguir configuración de usuario y de proyecto. Quien viene a recordar puede saltar a los archivos y comandos principales.

| Necesidad                  | Lugar                                                   |
| -------------------------- | ------------------------------------------------------- |
| abrir la paleta            | `Cmd+Shift+P` en macOS; `Ctrl+Shift+P` en Windows/Linux |
| configuración visual       | Preferences: Open Settings                              |
| configuración JSON         | Preferences: Open User Settings (JSON)                  |
| configuración del proyecto | `.vscode/settings.json`                                 |
| extensiones sugeridas      | `.vscode/extensions.json`                               |
| tareas repetibles          | `.vscode/tasks.json`                                    |
| perfiles de depuración     | `.vscode/launch.json`                                   |

## User settings y workspace settings

Las **User Settings** se aplican a todos tus proyectos. Las **Workspace Settings** viven dentro del repositorio y solo se aplican allí; tienen mayor prioridad.

```json title=".vscode/settings.json"
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "dist": true
  }
}
```

Versiona decisiones que hacen consistente el proyecto. Mantén fuera preferencias como tema, zoom, posición del panel o ligaduras de fuente, salvo que el repositorio sea una configuración del editor.

## Extensiones recomendadas

```json title=".vscode/extensions.json"
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "astro-build.astro-vscode"
  ],
  "unwantedRecommendations": []
}
```

Recomendar no instala silenciosamente. Reduce la lista a extensiones necesarias para trabajar en el repositorio y revisa editor, permisos y procedencia antes de instalarlas.

## Tareas reproducibles

Una **task** ejecuta un comando desde la paleta o como paso previo de depuración:

```json title=".vscode/tasks.json"
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "check",
      "type": "shell",
      "command": "pnpm check",
      "problemMatcher": [],
      "group": "test"
    }
  ]
}
```

La fuente de verdad debe seguir siendo un script del proyecto. La tarea aporta acceso desde el editor, no debe ocultar un proceso que CI no pueda repetir.

## Depuración

Un perfil de `launch.json` describe cómo iniciar o conectar el depurador. Usa breakpoints para inspeccionar estado y flujo antes de llenar el código con `console.log`.

```json title=".vscode/launch.json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Node: archivo actual",
      "type": "node",
      "request": "launch",
      "program": "${file}",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

## Profiles y Settings Sync

Un perfil agrupa settings, extensiones y disposición de la interfaz. Resulta útil para separar frontend, backend, escritura o demostraciones. Un perfil vacío también ayuda a diagnosticar si un fallo proviene de una extensión.

Settings Sync puede sincronizar configuración personal entre dispositivos. No reemplaza los archivos `.vscode` del repositorio, que documentan lo necesario para el equipo.

## Workspace Trust y seguridad

Abrir un repositorio puede activar tareas, extensiones, depuración y configuraciones. Usa **Workspace Trust** para mantener capacidades restringidas mientras verificas un proyecto desconocido. Lee scripts de instalación y tareas antes de ejecutarlos; el hecho de estar dentro del editor no vuelve seguro un comando.

Fuentes: [configuración de VS Code](https://code.visualstudio.com/docs/configure/settings) y [Profiles](https://code.visualstudio.com/docs/configure/profiles).
