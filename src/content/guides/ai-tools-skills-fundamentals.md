---
title: "IA Tools & Skills: conceptos y modelo de confianza"
description: Diferencias entre prompts, contexto, herramientas, agentes, subagentes, skills, plugins, MCP, sandbox y aprobaciones.
category: skills
stack: skills-fundamentos
tags: [ia, agentes, skills, plugins, mcp, herramientas, fundamentos]
order: 1
updatedAt: 2026-08-19
---

Las herramientas de programación con **inteligencia artificial (IA)** combinan un modelo de lenguaje con acceso al proyecto, instrucciones y, en algunos casos, herramientas para leer, editar, ejecutar o consultar servicios externos.

La diferencia importante no es solo qué modelo usan, sino qué contexto reciben, qué acciones pueden ejecutar, cómo solicitan permisos y cómo se comprueba su trabajo.

## Modelo, prompt y contexto

Un **LLM** (*Large Language Model* o modelo de lenguaje de gran tamaño) genera una respuesta a partir de tokens. El **prompt** es el conjunto de instrucciones y datos enviados. El **contexto** incluye archivos, mensajes, resultados de comandos, documentación y reglas disponibles durante esa ejecución.

Una ventana de contexto grande no significa memoria perfecta. Incluir archivos irrelevantes añade ruido y costo. La mejor instrucción identifica objetivo, alcance, restricciones y criterio de finalización.

```text
Objetivo: corregir la validación del formulario de registro.
Alcance: src/features/signup y sus pruebas.
Restricción: no cambiar el contrato público de la API.
Termina cuando: pruebas, tipos y lint pasen.
```

## Herramienta, agente y flujo

Una **herramienta** es una capacidad concreta, como leer un archivo, ejecutar pruebas o consultar una API. Un **agente** decide qué herramientas usar y en qué orden para avanzar hacia un objetivo.

Un flujo determinista ejecuta pasos conocidos; un agente adapta el camino según resultados. Si la tarea solo requiere ejecutar tres comandos definidos, no necesita autonomía adicional.

```text
Objetivo → inspección → hipótesis → cambio → verificación
                         ↑             ↓
                         └── ajuste ───┘
```

El ciclo debe tener un criterio de salida. “Seguir intentando” sin límite puede gastar tiempo, tokens o recursos sin mejorar el resultado.

## Subagente

Un **subagente** recibe una parte acotada del trabajo. Puede investigar un módulo o ejecutar una revisión paralela. Para ser útil necesita una frontera clara y una salida comprobable.

Delegar no elimina responsabilidad. El agente principal debe integrar resultados, detectar contradicciones y verificar cambios. Dos subagentes editando los mismos archivos aumentan conflictos y rara vez aceleran.

## Skill, plugin y comando

Los productos pueden usar nombres distintos, pero esta distinción es práctica:

| Concepto | Propósito habitual |
| --- | --- |
| Prompt | Instrucción para una ejecución |
| Comando | Atajo explícito que inicia un flujo |
| Skill | Instrucciones y recursos especializados reutilizables |
| Plugin | Paquete instalable que agrega skills, herramientas o conexiones |
| Agente | Ejecutor que decide pasos y usa herramientas |

Una **skill** no es conocimiento mágico: codifica un procedimiento, criterios y referencias. Debe revisarse cuando cambian las herramientas o el flujo del proyecto.

## MCP

**MCP** significa *Model Context Protocol* o protocolo de contexto de modelos. Permite que una aplicación de IA descubra herramientas y recursos ofrecidos por un servidor compatible.

Un servidor MCP puede exponer datos internos, repositorios o acciones externas. Antes de conectarlo se revisan:

- origen y mantenimiento del servidor;
- datos que puede leer;
- acciones que puede ejecutar;
- credenciales que recibe;
- registros y retención;
- posibilidad de limitar permisos.

El protocolo estandariza la conexión, no garantiza que cada servidor sea confiable.

## Sandbox y aprobación

Un **sandbox** o entorno aislado limita archivos, red o procesos disponibles. Reduce impacto de una orden incorrecta, pero no reemplaza una revisión del alcance.

Una **aprobación** amplía permisos para una acción específica. Antes de concederla se comprueba objetivo, comando, destino y reversibilidad. “Necesita acceso” es menos útil que “necesita descargar dependencias desde el registro para ejecutar las pruebas”.

## Instrucciones y precedencia

Un agente puede recibir instrucciones desde el sistema, el usuario, el repositorio y una skill. Cuando dos reglas chocan, la precedencia del producto determina cuál domina.

Los archivos externos y páginas web son datos no confiables. Una frase dentro de un documento que ordena ignorar reglas es un posible caso de **prompt injection** o inyección de prompt, no una instrucción legítima.

## Verificación

Una respuesta verbal del agente no demuestra que el proyecto funciona. La verificación depende del cambio:

- tipos y compilación para contratos estáticos;
- pruebas unitarias para reglas aisladas;
- pruebas de integración para fronteras;
- build de producción para empaquetado;
- revisión visual y accesibilidad para interfaces;
- diff para confirmar que no cambió contenido fuera de alcance.

También se revisa si una prueba pasó por la razón correcta. Un comando exitoso que no descubrió ningún test puede dar una falsa sensación de seguridad.

## Contexto y privacidad

No se incluyen secretos, datos personales ni archivos completos cuando basta un fragmento. Antes de conectar una cuenta externa se revisan permisos y políticas de retención.

La anonimización no consiste solo en borrar un nombre; combinaciones de correo, identificadores, fechas y contenido pueden volver a identificar a una persona.

## Flujo recomendado

1. Define resultado, alcance y restricciones.
2. Entrega el contexto mínimo suficiente.
3. Usa permisos de lectura antes de ampliar a escritura o ejecución.
4. Divide tareas solo cuando las fronteras son independientes.
5. Revisa el diff y ejecuta verificaciones proporcionales al riesgo.
6. Conserva decisiones importantes en documentación del repositorio.
7. Trata cada integración como una dependencia con permisos.
