---
title: Warp — terminal por bloques y sesiones de proyecto
description: Entender bloques, workflows, launch configurations, shell y funciones de IA sin perder el modelo real de la terminal.
category: applications
stack: apps-terminal
order: 1
tags: [warp, terminal, shell, workflows, ai]
related:
  - guides/terminal-fundamentals-terminology
  - guides/terminal-shell-scripting
updatedAt: 2026-08-25
---

**Warp** es una aplicación de terminal disponible para macOS, Windows y Linux. Organiza cada comando y su salida como un **Block**, añade edición moderna, búsqueda, sesiones guardadas, workflows y funciones de IA.

Sitio oficial: [warp.dev](https://www.warp.dev/).

## Warp no reemplaza el shell

La aplicación muestra y organiza la sesión; comandos como `cd`, `git`, `pnpm` o `docker` siguen siendo ejecutados por el shell y las herramientas instaladas en el sistema. Un comando válido en zsh puede necesitar cambios en PowerShell.

Warp admite shells como zsh, bash, fish y PowerShell. Confirma cuál está activo antes de copiar sintaxis de variables, pipes o rutas.

## Blocks

Un Block agrupa entrada, salida y código de salida. Permite copiar, buscar, compartir o volver a ejecutar una unidad sin seleccionar texto mezclado de toda la sesión.

Los bloques con salida roja o código distinto de cero señalan fallo, pero no explican la causa. Lee el primer error relevante y el comando exacto antes de reintentarlo.

## Workflows

Un workflow guarda un comando parametrizable que se repite. Es útil para recordar una operación, no para ocultar una secuencia crítica sin documentación.

```yaml
name: Buscar texto en el repositorio
command: rg "{{patron}}" {{ruta}}
arguments:
  - name: patron
    description: Texto o expresión regular
  - name: ruta
    default_value: src
```

Para procesos de proyecto, prefiere scripts versionados en `package.json`, `Makefile` o `scripts/`. Los workflows personales pueden llamar esos comandos sin duplicar su lógica.

## Launch Configurations

Una configuración de inicio conserva ventanas, tabs, paneles, directorios y comandos para reabrir un entorno de trabajo.

```yaml
---
name: Aplicación web
windows:
  - tabs:
      - title: Desarrollo
        layout:
          cwd: /ruta/absoluta/proyecto
          commands:
            - exec: pnpm dev
      - title: Git
        layout:
          cwd: /ruta/absoluta/proyecto
```

Las rutas deben corresponder a la máquina. Si el archivo se comparte, documenta cómo adaptarlas y evita comandos destructivos o que publiquen automáticamente.

## IA y datos

Las funciones conectadas pueden enviar prompts, contexto o salida a servicios remotos. No pegues tokens, `.env`, dumps, información de clientes ni logs completos sin revisar y anonimizar. Para comandos sensibles, solicita explicación y revisa cada argumento antes de ejecutar.

## Flujo recomendado

- usa Blocks para conservar contexto de una ejecución;
- convierte comandos repetidos y seguros en workflows;
- conserva lógica del proyecto en scripts versionados;
- usa launch configurations para sesiones, no para despliegues irreversibles;
- comprueba shell, directorio actual y entorno antes de ejecutar.

Fuentes: [instalación de Warp](https://docs.warp.dev/getting-started/quickstart/installation-and-setup), [Blocks](https://docs.warp.dev/terminal/blocks) y [Launch Configurations](https://docs.warp.dev/terminal/sessions/launch-configurations).

