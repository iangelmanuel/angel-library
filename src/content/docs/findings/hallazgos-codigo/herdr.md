---
title: "Herdr: terminales persistentes para agentes de código"
description: Runtime de terminal escrito en Rust que mantiene sesiones, conecta máquinas locales y remotas y expone automatización para agentes.
tags: [herdr, terminal, rust, agentes, ssh, automatizacion]
sidebar:
  order: 9
draft: false
resourceCategory: developer-tools
official: true
website: https://herdr.dev/
url: https://github.com/herdrdev/herdr
updatedAt: 2026-09-10
---

## En pocas palabras

[Herdr](https://herdr.dev/) es un runtime de terminal para flujos de desarrollo asistidos por agentes. Un servidor local mantiene las sesiones aunque cierres el cliente o pierdas la red; después puedes volver a conectarte y continuar desde la misma distribución de paneles. También puede reunir máquinas locales y remotas por SSH en una sola ventana.

Está escrito en Rust y se distribuye como un binario, sin Electron. El servidor conserva el layout y la configuración, pero no puede resucitar un proceso que terminó: la persistencia del terminal no equivale a persistencia del programa.

## Qué aporta frente a un multiplexor tradicional

Herdr conserva la idea de paneles y atajos de tmux, pero añade una vista orientada a agentes:

- cada panel muestra si está trabajando, bloqueado o inactivo;
- puedes abrir Claude Code, Codex, Cursor, OpenCode u otra CLI como un proceso normal;
- un socket y una CLI permiten crear paneles, enviar instrucciones y esperar a que terminen;
- plugins y automatizaciones pueden observar el estado sin raspar la pantalla;
- la misma sesión puede incluir un equipo local y una máquina SSH.

La [documentación de automatización](https://herdr.dev/docs/agent-automation/) describe la interfaz para que otro agente coordine estos paneles.

## Instalación y primer uso

El proyecto ofrece instaladores para macOS, Linux y Windows, además de Homebrew y mise. La forma exacta puede cambiar; usa la [guía oficial de instalación](https://herdr.dev/docs/quick-start/) para elegir el método de tu sistema.

Después de instalarlo, inicia Herdr y abre un panel. El atajo principal documentado es `Ctrl+B`, seguido de `Q`, para salir o gestionar la sesión según el modo activo. Consulta `herdr --help` porque los atajos y subcomandos se amplían con frecuencia.

Un flujo mínimo es:

```text
1. iniciar el servidor de Herdr;
2. crear un panel para el agente y otro para logs o pruebas;
3. lanzar el proceso del agente dentro del panel;
4. desconectar el cliente y volver a entrar;
5. comprobar el estado antes de enviar otra instrucción.
```

## Uso con agentes

Un coordinador puede tratar cada panel como una tarea:

1. crea un panel en el directorio del repositorio;
2. inicia el agente con los permisos mínimos necesarios;
3. envía una instrucción acotada y espera el estado de finalización;
4. lee la salida y ejecuta las pruebas en otro panel;
5. cierra el proceso cuando la tarea quede confirmada.

El patrón evita que varias tareas escriban en la misma terminal, pero no resuelve por sí mismo conflictos de Git, secretos ni permisos del sistema. Aísla también las ramas o worktrees cuando dos agentes puedan modificar archivos a la vez.

## Cuándo conviene

- sesiones largas que deben sobrevivir a una caída de red;
- equipos que supervisan varios agentes desde un solo escritorio;
- automatizaciones que necesitan crear paneles y esperar procesos;
- trabajo remoto por SSH con una vista unificada.

Si solo necesitas una shell temporal, `tmux` o la terminal integrada de tu editor tienen menos piezas. El valor de Herdr aparece cuando el estado de muchos procesos es parte del flujo.

## Límites y seguridad

- El servidor mantiene terminales, no procesos terminados ni cambios de archivos no guardados.
- Un agente que tiene una shell puede ejecutar cualquier comando permitido por tu usuario.
- La sesión remota depende de SSH, red y permisos del host; la interfaz no elimina esos fallos.
- Guarda los logs y los sockets con permisos adecuados, sobre todo en máquinas compartidas.

Antes de automatizar, prueba una tarea inocua, verifica cómo se informa un panel bloqueado y define quién puede enviar comandos. La [referencia de CLI](https://herdr.dev/docs/cli-reference/) es la fuente adecuada para scripts, no las etiquetas visuales de la aplicación.

## Fuentes

- [Repositorio y README de Herdr](https://github.com/herdrdev/herdr)
- [Sitio oficial](https://herdr.dev/)
- [Automatización para agentes](https://herdr.dev/docs/agent-automation/)
- [Referencia de CLI](https://herdr.dev/docs/cli-reference/)
