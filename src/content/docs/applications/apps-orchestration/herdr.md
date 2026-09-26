---
title: "Herdr: terminales persistentes para agentes de código"
description: Runtime de terminal escrito en Rust que mantiene sesiones vivas, reúne máquinas locales y remotas en una ventana y expone una CLI y un socket para que los agentes se coordinen.
tags: [herdr, terminal, rust, agentes, ssh, automatizacion, orquestacion, multiplexor]
sidebar:
  order: 1
draft: false
resourceCategory: developer-tools
official: true
website: https://herdr.dev/
github: https://github.com/herdrdev/herdr
technologies:
  - applications/apps-terminal/application-wezterm
  - agents/agents-fundamentos/agent-safe-workflow
note: Licencia Apache 2.0. Un solo binario en Rust, sin Electron; corre dentro de la terminal que ya uses.
updatedAt: 2026-09-26
---

## En pocas palabras

[Herdr](https://herdr.dev/) se presenta como «el runtime en el que viven tus agentes de código». Es un multiplexor de terminal pensado para flujos con agentes: un servidor en segundo plano mantiene los terminales vivos aunque cierres el cliente o se caiga la conexión SSH, y después vuelves a entrar a la misma distribución de paneles.

No envuelve ni sustituye a los agentes. Claude Code, Codex, Cursor, OpenCode, Grok y el resto se lanzan como procesos normales; Herdr es dueño de **sus terminales**, no del agente.

## Qué aporta frente a tmux

Conserva la idea de paneles y teclas con prefijo de tmux, pero añade una capa orientada a agentes:

| Capacidad | Qué significa en la práctica |
| --- | --- |
| Desconectar sin detener trabajo | Los terminales siguen en el servidor al cerrar el cliente o perder SSH |
| Restauración tras reinicio | Si se reinicia el servidor o la máquina, recupera el layout guardado y puede reanudar sesiones de agentes compatibles |
| Varias máquinas, una ventana | Mezcla trabajo local y máquinas SSH guardadas, con una lista de agentes combinada y reconexiones independientes |
| Estado por panel | Cada panel aparece como `working`, `blocked` o `idle`; cuando un agente se para y espera respuesta, Herdr lo señala |
| Nativo para agentes | Los agentes usan la CLI y el socket para crear paneles, enviarse instrucciones y esperar a que otro esté realmente bloqueado |
| Teclado y ratón | Prefijo al estilo tmux **y** clic, arrastrar y dividir; se elige en cada momento |
| Plugins | Extienden paneles y flujos desde un [marketplace](https://herdr.dev/plugins/) |

El servidor conserva terminales y layout, pero no resucita un proceso que ya terminó ni recupera archivos sin guardar: la persistencia del terminal no equivale a persistencia del programa.

## Instalación

```bash
# macOS / Linux
curl -fsSL https://herdr.dev/install.sh | sh

# Homebrew
brew install herdr

# mise
mise use -g herdr
```

En Windows (PowerShell):

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://herdr.dev/install.ps1 | iex"
```

Hay una guía específica para [Windows con protección de endpoint](https://herdr.dev/docs/windows-beta/) y binarios sueltos en las [releases de GitHub](https://github.com/herdrdev/herdr/releases). Revisa el script antes de ejecutar un instalador con `curl | sh`.

## Primer uso

Arráncalo en la carpeta donde vive el trabajo:

```bash
herdr
```

Lanza tus agentes, divide paneles y vete. `Ctrl+B` seguido de `Q` desconecta el cliente; volver a ejecutar `herdr` reconecta. Consulta `herdr --help`: los atajos y subcomandos se amplían con frecuencia.

```text
1. iniciar herdr en el repositorio;
2. crear un panel para el agente y otro para pruebas o logs;
3. lanzar el agente dentro de su panel;
4. desconectar (Ctrl+B Q) y volver a entrar con `herdr`;
5. mirar el estado del panel antes de enviar otra instrucción.
```

## Coordinar agentes

La [skill para agentes](https://herdr.dev/docs/agent-skill/) y la [documentación de automatización](https://herdr.dev/docs/agent-automation/) describen cómo un agente coordinador trata cada panel como una tarea:

1. crea un panel en el directorio del repositorio;
2. inicia el agente con los permisos mínimos necesarios;
3. envía una instrucción acotada y espera a que el panel pase a `idle` o `blocked`;
4. lee la salida y lanza las pruebas en otro panel;
5. cierra el proceso cuando la tarea quede confirmada.

El patrón evita que varias tareas escriban en la misma terminal, pero no resuelve conflictos de Git, secretos ni permisos del sistema. Si dos agentes pueden tocar los mismos archivos, dale a cada uno su rama o worktree.

## Cuándo conviene

- sesiones largas que deben sobrevivir a una caída de red o a un reinicio;
- supervisar varios agentes desde un solo escritorio sin buscar cuál está atascado;
- automatizaciones que crean paneles y esperan procesos;
- trabajo remoto por SSH con una vista unificada.

Si solo necesitas una shell temporal, `tmux` o la terminal del editor tienen menos piezas. El valor de Herdr aparece cuando el estado de muchos procesos es parte del flujo.

## Límites y seguridad

- Un agente con shell puede ejecutar cualquier comando que permita tu usuario.
- La sesión remota depende de SSH, red y permisos del host.
- Protege sockets y logs, sobre todo en máquinas compartidas: quien acceda al socket puede enviar comandos a los paneles.
- La reanudación tras reinicio solo aplica a agentes compatibles; comprueba cuál es tu caso antes de confiar en ella.

Para scripts, usa la [referencia de la CLI](https://herdr.dev/docs/cli-reference/), no las etiquetas visuales de la interfaz.

## Fuentes

- [Repositorio y README de Herdr](https://github.com/herdrdev/herdr)
- [Sitio oficial y documentación](https://herdr.dev/docs/)
- [Quick start](https://herdr.dev/docs/quick-start/) · [Conceptos](https://herdr.dev/docs/concepts/) · [Agentes compatibles](https://herdr.dev/docs/agents/)
- [Máquinas remotas](https://herdr.dev/docs/connecting-machines/)
- [Automatización para agentes](https://herdr.dev/docs/agent-automation/) · [Skill para agentes](https://herdr.dev/docs/agent-skill/)
- [Referencia de la CLI](https://herdr.dev/docs/cli-reference/)
