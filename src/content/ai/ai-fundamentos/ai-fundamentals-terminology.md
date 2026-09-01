---
title: Fundamentos y terminología de inteligencia artificial
description: Vocabulario y modelo mental para trabajar con modelos generativos, prompts, herramientas, embeddings, RAG, agentes y evaluaciones.
type: guides
tags: [ia, llm, prompts, rag, agentes, fundamentos, glosario]
order: 1
updatedAt: 2026-08-25
---

La **inteligencia artificial (IA)** agrupa sistemas capaces de realizar tareas que asociamos con percepción, lenguaje, predicción o decisión. El **aprendizaje automático**, conocido como **ML** por _Machine Learning_, es una rama en la que un sistema aprende patrones a partir de datos en lugar de recibir todas las reglas de forma manual.

En aplicaciones web actuales es frecuente usar **IA generativa**, que produce texto, imágenes, audio, video o código. Esta guía se concentra en los modelos de lenguaje y en cómo integrarlos sin confundir una respuesta convincente con una respuesta garantizada.

## Aprende o consulta

Si estás aprendiendo, sigue esta progresión: modelo y tokens → prompt y contexto → salida estructurada → herramientas → embeddings/RAG → agentes → evaluaciones → SDK e infraestructura. No saltes a un agente con diez herramientas antes de poder evaluar una llamada simple.

| Necesito recordar                      | Documento                                                                   |
| -------------------------------------- | --------------------------------------------------------------------------- |
| instrucciones, contexto y JSON estable | [Prompts y salidas](/ai/ai-prompts/ai-prompts-contexto-salidas)             |
| embeddings, chunks y recuperación      | [RAG](/ai/ai-rag/ai-rag-embeddings)                                         |
| tools, guardrails y agentes            | [Agentes y herramientas](/ai/ai-agentes/ai-agentes-herramientas-evaluacion) |
| archivos, imágenes, audio y privacidad | [IA multimodal](/ai/ai-fundamentos/ai-multimodal-privacidad)                |
| arquitectura común de proveedores      | [SDK para IA](/ai/ai-sdk/ai-sdk-fundamentos)                                |
| calidad, regresiones, latencia y costo | [Evaluaciones de IA](/ai/ai-agentes/ai-evaluaciones-observabilidad)         |

Una demo responde “¿puede producir algo?”. Una integración confiable también responde “¿con qué frecuencia cumple?”, “¿qué datos recibió?”, “¿cuánto tarda y cuesta?” y “¿qué ocurre cuando falla?”.

## Modelo, entrenamiento e inferencia

Un **modelo** es una función parametrizada que transforma una entrada en una salida. Durante el **entrenamiento** se ajustan sus parámetros con ejemplos; durante la **inferencia** se usa el modelo ya entrenado para producir una respuesta.

Un **LLM** (_Large Language Model_ o modelo de lenguaje de gran tamaño) procesa y genera secuencias de unidades llamadas **tokens**. Un token puede ser una palabra corta, parte de una palabra, un signo o un espacio, según el tokenizador del modelo. Los límites y costos suelen medirse en tokens, no directamente en caracteres.

| Término             | Qué representa                                                     | Por qué importa                                    |
| ------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| Parámetro           | Valor aprendido durante el entrenamiento                           | Influye en el comportamiento del modelo            |
| Token               | Unidad en la que se divide entrada y salida                        | Consume contexto, tiempo y costo                   |
| Ventana de contexto | Cantidad de tokens que el modelo puede considerar en una solicitud | Lo que queda fuera no forma parte de esa ejecución |
| Inferencia          | Ejecución del modelo para responder                                | Es la operación que integra una aplicación         |
| Latencia            | Tiempo hasta obtener una respuesta o el primer fragmento           | Afecta la experiencia de usuario                   |

## Prompt, mensajes e instrucciones

Un **prompt** es el conjunto de instrucciones y contexto enviado al modelo. No es solo la pregunta final: puede incluir reglas del sistema, mensajes previos, documentos, ejemplos y resultados de herramientas.

Los sistemas de chat suelen distinguir roles:

- **Sistema o desarrollador:** define comportamiento, límites y formato general.
- **Usuario:** expresa el objetivo o aporta datos.
- **Asistente:** contiene respuestas anteriores del modelo.
- **Herramienta:** devuelve información obtenida por una función o servicio externo.

Una instrucción útil define objetivo, contexto, restricciones y formato esperado. Los ejemplos ayudan cuando la forma de la salida es difícil de describir, pero ocupan espacio en la ventana de contexto.

```text
Objetivo: clasifica el mensaje de soporte.
Categorías permitidas: facturación, acceso, error técnico.
Devuelve: un objeto JSON con category y reason.
Restricción: no inventes datos que no aparezcan en el mensaje.
Mensaje: "Me cobraron dos veces este mes".
```

El formato explícito reduce ambigüedad. Aun así, en producción debe validarse la salida antes de guardarla o usarla para ejecutar una acción.

## Aleatoriedad, temperatura y alucinaciones

El modelo calcula probabilidades para posibles tokens siguientes. La **temperatura** controla, de forma general, cuánta variación se permite al elegirlos: valores bajos suelen producir respuestas más estables; valores altos pueden aumentar diversidad. No convierte una salida en verdadera ni sustituye una evaluación.

Una **alucinación** es contenido generado que parece plausible pero no está sustentado. Puede ser una fecha, una API inexistente o una cita inventada. Para reducir el riesgo:

- proporciona fuentes relevantes;
- pide que distinga hechos, inferencias e incertidumbre;
- valida datos importantes con sistemas deterministas;
- limita las acciones disponibles;
- mide el comportamiento con casos reales.

No se debe pedir a un modelo que sea la única autoridad para decisiones médicas, legales, financieras o de seguridad.

## Salida estructurada

Una **salida estructurada** obliga o guía al modelo para responder con un esquema, normalmente JSON. Esto facilita la integración porque el programa recibe campos conocidos en lugar de interpretar prosa libre.

```ts
type TicketClassification = {
  category: "facturacion" | "acceso" | "error_tecnico"
  reason: string
  confidence: number
}

function isValidConfidence(value: number) {
  return Number.isFinite(value) && value >= 0 && value <= 1
}
```

El tipo ayuda durante el desarrollo, pero los datos que llegan por red siguen necesitando validación en tiempo de ejecución. La confianza expresada por el modelo tampoco debe interpretarse automáticamente como una probabilidad calibrada.

## Llamadas a herramientas o _tool calling_

Una llamada a herramienta permite que el modelo solicite una función con argumentos estructurados. El modelo propone la llamada; la aplicación valida permisos y argumentos, ejecuta la función y devuelve el resultado.

```text
Usuario → modelo → solicitud de herramienta → validación de la aplicación
        → API o función real → resultado → modelo → respuesta para el usuario
```

El término **function calling** suele referirse al mismo patrón. El modelo no obtiene poderes por sí solo: únicamente puede solicitar las herramientas expuestas por la aplicación.

Cada herramienta debe tener un propósito estrecho, un esquema inequívoco y controles de autorización. Leer un calendario y eliminar un evento son capacidades distintas y no deberían compartir permisos implícitos.

## Embeddings y búsqueda semántica

Un **embedding** es una representación numérica de un texto, imagen u otro dato. Elementos con significado parecido suelen quedar próximos en ese espacio matemático. Esto permite hacer **búsqueda semántica**, que compara significado aproximado en lugar de exigir las mismas palabras.

Una **base de datos vectorial** almacena embeddings y encuentra los más cercanos. El proceso habitual es:

1. dividir documentos en fragmentos;
2. generar un embedding para cada fragmento;
3. almacenar vector, texto y metadatos;
4. generar el embedding de la consulta;
5. recuperar fragmentos similares;
6. filtrar y usar los fragmentos pertinentes.

El tamaño de los fragmentos importa. Un bloque enorme mezcla temas; uno demasiado pequeño pierde contexto. Los metadatos —fecha, autor, permisos y origen— permiten filtrar antes de responder.

## RAG: generación aumentada por recuperación

**RAG** significa _Retrieval-Augmented Generation_ o generación aumentada por recuperación. Antes de responder, el sistema recupera información de una fuente y la añade al contexto del modelo.

RAG sirve para trabajar con documentación privada o cambiante sin reentrenar el modelo. No garantiza exactitud por sí solo: puede recuperar el fragmento equivocado, omitir uno importante o interpretar mal el texto.

```text
Pregunta
   ↓
Búsqueda y filtros de permisos
   ↓
Fragmentos relevantes + referencias
   ↓
Modelo de lenguaje
   ↓
Respuesta con evidencia verificable
```

Una implementación madura evalúa por separado la recuperación y la respuesta. Si el contexto correcto nunca llegó al modelo, ajustar el prompt final no resuelve la causa.

## Agentes, flujos y autonomía

Un **agente** combina un modelo con instrucciones, estado y herramientas para avanzar en una tarea mediante varios pasos. Puede observar un resultado, decidir la siguiente acción y repetir el ciclo.

No toda integración necesita un agente. Un flujo determinista es preferible cuando los pasos se conocen y deben cumplirse siempre. La autonomía aporta valor cuando el camino depende de información descubierta durante la ejecución.

| Enfoque     | Úsalo cuando                                        | Ventaja principal         |
| ----------- | --------------------------------------------------- | ------------------------- |
| Una llamada | La entrada produce una salida directa               | Menor costo y complejidad |
| Cadena fija | Los pasos son conocidos                             | Control y trazabilidad    |
| Agente      | El siguiente paso depende de resultados intermedios | Flexibilidad              |

Cada ciclo de un agente debe tener límites de pasos, tiempo, costo y acciones. Las operaciones destructivas o externas necesitan confirmaciones acordes con su riesgo.

## MCP, plugins y skills

**MCP** (_Model Context Protocol_ o protocolo de contexto de modelos) estandariza cómo una aplicación de IA descubre y usa herramientas o recursos ofrecidos por otros sistemas.

Un **plugin** suele ser un paquete instalable que amplía capacidades. Una **skill** o habilidad suele contener instrucciones especializadas, recursos y un flujo recomendado para resolver una clase de tarea. Los nombres exactos varían entre productos; conviene revisar qué permisos y código incorpora cada extensión.

## Evaluaciones y observabilidad

Una **evaluación**, o _eval_, es una prueba repetible del comportamiento del sistema. No basta con probar tres prompts manuales: se necesita un conjunto representativo de entradas, criterios de éxito y comparación entre versiones.

Se pueden medir, entre otras cosas:

- exactitud y cobertura;
- cumplimiento del formato;
- calidad de las referencias;
- tasa de llamadas incorrectas a herramientas;
- latencia y costo;
- seguridad frente a instrucciones maliciosas.

En producción también se registran identificadores de modelo, versión del prompt, herramientas invocadas, errores, tokens y tiempos. Los registros deben excluir o proteger datos personales y secretos.

## Seguridad, privacidad y _prompt injection_

Una **inyección de prompt** ocurre cuando contenido no confiable intenta cambiar las instrucciones del sistema. Puede llegar desde el usuario, una página recuperada o un documento de RAG. Ese contenido debe tratarse como datos, no como autoridad.

Principios mínimos:

- no introducir secretos en prompts que no los necesitan;
- separar instrucciones confiables de contenido externo;
- aplicar autorización fuera del modelo;
- permitir solo herramientas y argumentos necesarios;
- validar la salida antes de ejecutar código o consultas;
- solicitar confirmación antes de acciones irreversibles;
- definir retención y tratamiento de datos con cada proveedor.

## Flujo recomendado para una funcionalidad con IA

1. Define la tarea y una alternativa cuando el modelo falle.
2. Reúne casos reales, incluidos casos límite y ataques esperables.
3. Empieza con la solución de menor autonomía que funcione.
4. Exige una salida estructurada y valídala.
5. Separa datos, instrucciones y permisos.
6. Evalúa calidad, costo, latencia y seguridad antes de publicar.
7. Versiona prompts y modelos; supervisa cambios de comportamiento.
