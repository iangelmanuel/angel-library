---
title: "IA Tools: comandos, skills, plugins, hooks y MCP"
description: "Cómo se diferencian las capacidades que amplían un agente de IA, qué problema resuelve cada una y qué revisar antes de incorporarlas a un proyecto."
type: guides
order: 1
tags: [ia, comandos, skills, plugins, hooks, mcp, herramientas, fundamentos]
related:
  - agents/agents-fundamentos/coding-agents-fundamentals
  - agents/agents-fundamentos/agent-safe-workflow
  - resources/ia/skills-sh
updatedAt: 2026-09-04
---

**IA Tools** reúne las piezas reutilizables que amplían el comportamiento de un agente: comandos, skills, plugins, hooks y conexiones MCP. El agente es quien decide y ejecuta; estas herramientas le proporcionan procedimientos, disparadores o acceso a capacidades adicionales.

La separación importa porque cada mecanismo tiene un ciclo de vida y un nivel de confianza diferente. Un prompt se consume como texto; un servidor MCP puede recibir credenciales y ejecutar acciones; un hook puede correr automáticamente después de cada edición.

## Mapa de conceptos

| Concepto    | Propósito principal                                       | Se activa                                 |
| ----------- | --------------------------------------------------------- | ----------------------------------------- |
| Prompt      | Dar una instrucción o contexto para una tarea             | Al enviarlo                               |
| Comando     | Iniciar manualmente un flujo conocido                     | Cuando la persona lo invoca               |
| Skill       | Enseñar un procedimiento con instrucciones y recursos     | Cuando la tarea coincide o se solicita    |
| Herramienta | Ejecutar una operación concreta                           | Cuando el agente decide usarla            |
| Plugin      | Distribuir varias capacidades como un paquete             | Al instalarlo y habilitar sus componentes |
| MCP         | Conectar herramientas o datos mediante un protocolo común | Al conectar un servidor                   |
| Hook        | Ejecutar una comprobación o automatización ante un evento | Automáticamente cuando ocurre el evento   |

## Qué elegir según la necesidad

| Necesidad                             | Empieza por                                        |
| ------------------------------------- | -------------------------------------------------- |
| Recordar una instrucción una sola vez | Prompt                                             |
| Repetir una solicitud explícita       | Comando                                            |
| Aplicar un método especializado       | Skill                                              |
| Consultar o modificar un servicio     | MCP o herramienta nativa                           |
| Instalar una integración completa     | Plugin                                             |
| Validar automáticamente cada cambio   | Hook                                               |
| Coordinar trabajo autónomo            | [Agentes](/categories/agents), no una tool aislada |

Usa el mecanismo más pequeño que resuelva el problema. Convertir cada instrucción en plugin o conectar un servidor para una consulta puntual añade mantenimiento y permisos sin aportar valor.

## Comandos

Un comando personalizado es un atajo para un prompt o flujo que una persona decide iniciar. Encaja en tareas frecuentes con un punto de entrada claro: preparar un commit, explicar código, ejecutar una auditoría o redactar una descripción de _pull request_.

Un buen comando declara qué información necesita, qué puede cambiar y qué resultado debe entregar. No debería esconder acciones destructivas ni asumir que cada proyecto utiliza los mismos scripts.

## Skills

Una **skill** empaqueta conocimiento operativo en un `SKILL.md` y puede incluir referencias, plantillas o scripts. A diferencia de un prompt suelto, define cuándo aplica, qué pasos seguir y cómo comprobar el resultado.

Antes de instalarla revisa:

- alcance y condiciones de activación;
- archivos adicionales y scripts ejecutables;
- herramientas o red que necesita;
- instrucciones que podrían contradecir las del repositorio;
- mantenedor, licencia y frecuencia de actualización.

Una skill no añade conocimiento mágico al modelo. Hace explícito un procedimiento y reduce decisiones improvisadas, pero todavía necesita contexto correcto y revisión humana.

## Plugins

Un plugin es un contenedor de distribución. Puede aportar skills, comandos, agentes especializados, hooks, servidores MCP o configuración. Por eso “instalar un plugin” no describe por sí solo qué acceso se está concediendo.

Revisa cada componente del manifiesto y deshabilita lo que no necesites. Actualizar un plugin también puede cambiar sus instrucciones, ejecutables o permisos, aunque conserve el mismo nombre.

## MCP

**MCP** significa _Model Context Protocol_. Permite que un cliente de IA descubra recursos y herramientas expuestos por un servidor compatible sin diseñar una integración distinta para cada agente.

Un servidor puede ser local o remoto y operar sobre repositorios, bases de datos, navegadores o cuentas externas. El protocolo normaliza la comunicación, pero no garantiza confianza. Antes de conectarlo comprueba:

- qué datos puede leer y dónde se procesan;
- qué acciones puede ejecutar o revertir;
- qué credenciales recibe y cómo se revocan;
- si permite limitar permisos o usar modo de solo lectura;
- qué registros conserva y quién mantiene el servidor.

## Hooks

Un hook responde a eventos como editar un archivo, terminar una tarea o ejecutar una herramienta. Es apropiado para reglas deterministas: formatear, impedir secretos, validar archivos modificados o exigir una comprobación antes de finalizar.

Como puede ejecutarse sin una petición nueva, debe ser rápido, predecible y visible. Un hook complejo que modifica muchos archivos silenciosamente es más difícil de depurar que el problema que intenta resolver.

## Cómo se combinan

```text
tarea
  └─ agente
      ├─ instrucciones del proyecto
      ├─ comando o skill que guía el procedimiento
      ├─ herramientas nativas o MCP para actuar
      ├─ plugin que distribuye capacidades relacionadas
      └─ hooks que validan eventos importantes
```

Las capas pueden combinarse, pero no deben duplicar la misma regla. Si una convención vive en `AGENTS.md`, copiarla dentro de cinco skills crea versiones contradictorias con el tiempo.

## Flujo de incorporación

1. Define el problema que la herramienta debe resolver.
2. Comprueba si basta un prompt, comando o instrucción existente.
3. Lee la fuente y enumera archivos, scripts, permisos y conexiones.
4. Instala primero en un proyecto de prueba o con el alcance mínimo.
5. Ejecuta una tarea conocida y revisa acciones, salidas y diff.
6. Documenta cómo actualizar, deshabilitar y eliminar la integración.
7. Reevalúa la herramienta cuando cambie de mantenedor o de permisos.

Para delimitar autoridad, permisos y verificación durante una tarea completa, consulta el [workflow seguro con agentes](/agents/agents-fundamentos/agent-safe-workflow).
