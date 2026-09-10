---
title: "DeepSeek Harness: agentes componibles sobre Cordis"
description: Entorno open source en preview para montar modelos, herramientas, skills, sesiones, sandboxes, almacenamiento y bucles de agentes como plugins.
type: resources
order: 9
tags: [deepseek, harness, cordis, agentes, plugins, node, sandboxes]
url: https://github.com/deepseek-ai/deepseek-harness
website: https://deepseek.com/harness/en/
resourceCategory: ia
official: true
personalNote: Es material de exploración para entender un runtime componible; al estar en preview, fija versiones y aísla los experimentos antes de usarlo en un flujo real.
updatedAt: 2026-09-10
---

## En pocas palabras

[DeepSeek Harness](https://deepseek.com/harness/en/) es un entorno para construir y ejecutar agentes con piezas intercambiables. La página oficial lo presenta como una vista previa para desarrolladores y publica el código fuente en [GitHub](https://github.com/deepseek-ai/deepseek-harness).

La idea central es que el modelo, las herramientas, las skills, las sesiones, el sandbox, el almacenamiento, el bucle de ejecución y la interfaz se montan como plugins. El kernel **Cordis** gestiona el montaje, las dependencias, los servicios y los eventos para que la composición no obligue a editar el núcleo.

## Qué se puede componer

Piensa en el harness como una aplicación con puntos de extensión:

| Pieza | Pregunta que responde |
| --- | --- |
| Modelo | ¿Qué proveedor y capacidades usa el agente? |
| Herramientas | ¿Qué operaciones puede invocar y con qué permisos? |
| Skills | ¿Qué instrucciones o procedimientos conoce? |
| Sesión y almacenamiento | ¿Qué contexto se conserva y durante cuánto tiempo? |
| Sandbox | ¿En qué entorno se ejecutan comandos y archivos? |
| Loop y scheduling | ¿Cómo decide el siguiente paso y cuándo se despierta? |
| UI | ¿Cómo inspecciona la persona el estado y los resultados? |

La composición se declara con configuración y plugins. Un cambio de modelo no debería obligar a duplicar todo el flujo, pero sí exige comprobar herramientas, formato de mensajes y límites de contexto.

## Modos de trabajo

La documentación oficial describe cuatro modos:

- **Standard:** recorrido general para usar el harness.
- **Code:** el modelo genera y coordina la orquestación.
- **Minimal:** shell y editor mínimos para comparar con benchmarks.
- **Creator:** inspección del runtime y pruebas de plugins de Cordis.

Empieza por Standard para entender sesiones y permisos. Usa Minimal solo cuando la comparación requiera reducir la superficie del entorno; no lo confundas con un modo de producción.

## Primer arranque

El inicio rápido requiere Node.js y el paquete de ejecución. La guía oficial muestra:

```bash
npx @deepseek-ai/dsh web
```

También puedes clonar el repositorio para estudiar los ejemplos y consultar la [documentación publicada](https://deepseek-harness.github.io/). Fija la versión de Node y del paquete en un experimento reproducible; el estado preview significa que nombres de plugins y APIs pueden cambiar.

## Cómo estudiar un plugin

1. Identifica qué servicio monta y qué dependencias declara.
2. Busca los eventos que emite y escucha; evita acoplarte a estado interno.
3. Ejecuta una tarea en un sandbox sin secretos.
4. Comprueba qué se guarda en la sesión y cómo se reanuda.
5. Desmonta el plugin y verifica que no queden procesos ni archivos temporales.

Este recorrido enseña más que copiar una configuración completa: revela el contrato entre kernel, plugin y agente.

## Cuándo conviene

- experimentar con arquitecturas de agentes intercambiables;
- estudiar un kernel orientado a servicios y eventos;
- crear una interfaz de pruebas para modelos y herramientas;
- comparar bucles de agente en un entorno controlado.

Para llamar un modelo desde una aplicación web sencilla, un SDK y una cola de trabajos son más fáciles de mantener. Harness tiene sentido cuando necesitas cambiar muchas piezas sin duplicar el runtime.

## Límites y seguridad

- Es una preview para desarrolladores: espera cambios incompatibles y documentación incompleta.
- Un plugin puede ampliar herramientas, almacenamiento o ejecución; audita su código antes de instalarlo.
- Los sandboxes limitan el entorno, pero no convierten automáticamente una instrucción maliciosa en segura.
- Los benchmarks no representan el coste, latencia y fiabilidad de tu aplicación.

## Fuentes

- [Página oficial de DeepSeek Harness](https://deepseek.com/harness/en/)
- [Repositorio oficial](https://github.com/deepseek-ai/deepseek-harness)
- [Documentación del proyecto](https://deepseek-harness.github.io/)
