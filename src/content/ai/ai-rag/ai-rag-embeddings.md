---
title: Embeddings y RAG — recuperar antes de generar
description: Construir una búsqueda semántica con chunking, metadatos, ranking, citas y evaluación para responder sobre conocimiento propio.
type: guides
order: 1
tags: [ia, embeddings, rag, vector-search, retrieval]
related:
  - ai/ai-prompts/ai-prompts-contexto-salidas
  - database/database-sql/database-indices-explain
  - ai/ai-agentes/ai-agentes-herramientas-evaluacion
updatedAt: 2026-08-19
---

Un **embedding** representa texto, imagen u otro contenido como un vector numérico. Elementos semánticamente próximos tienden a quedar cerca según una métrica. **RAG** significa *Retrieval-Augmented Generation* o generación aumentada por recuperación: primero busca evidencia y después la entrega al modelo para producir una respuesta.

```text
documentos → limpiar → dividir → embedding → índice
pregunta   → embedding → buscar → filtrar/rankear → contexto → respuesta
```

RAG no “entrena” el modelo con los documentos. Los fragmentos se incorporan a la solicitud actual, por lo que pueden actualizarse sin volver a entrenar.

## Ingesta y chunking

Un **chunk** es un fragmento recuperable. Si es demasiado grande, mezcla temas y consume contexto; si es muy pequeño, pierde significado. Divide por estructura antes que por un número ciego de caracteres: título, sección, párrafo, función o bloque de tabla.

```ts
type Chunk = {
  id: string;
  documentId: string;
  heading: string;
  text: string;
  sourceUrl: string;
  updatedAt: string;
  permissions: string[];
};
```

Conserva metadatos para citar, filtrar por tenant, fecha, idioma o permisos y eliminar versiones antiguas. Un error de autorización en recuperación puede revelar datos aunque el prompt pida no hacerlo.

## Recuperación híbrida

La búsqueda vectorial captura similitud semántica; la búsqueda léxica encuentra nombres, códigos y frases exactas. Una estrategia híbrida combina ambas y luego usa un **reranker** para ordenar los candidatos más relevantes.

```text
consulta
 ├─ búsqueda semántica ─┐
 └─ búsqueda por texto ─┴─ fusionar → rerank → top 5
```

No uses un umbral universal sin datos. Registra puntuaciones y evalúa preguntas reales: según el dominio, una similitud aparentemente alta puede seguir siendo irrelevante.

## Generar con evidencia

El prompt debe indicar que la respuesta se base en los fragmentos y que reconozca cuando no existe evidencia suficiente. Devuelve identificadores o enlaces de las fuentes utilizadas. Las citas deben enlazar al fragmento que realmente respalda la afirmación, no solo al documento más cercano.

## Evaluar por capas

Separa el diagnóstico:

1. **Recall de recuperación:** ¿apareció el fragmento correcto entre los candidatos?
2. **Ranking:** ¿quedó suficientemente arriba?
3. **Fundamentación:** ¿la respuesta se apoya en la evidencia?
4. **Utilidad:** ¿responde la pregunta de forma clara?
5. **Abstención:** ¿evita responder cuando no existe respaldo?

Un modelo mejor no corrige documentos desactualizados, permisos incorrectos o una recuperación deficiente.

## Referencias

- [OpenAI: embeddings](https://platform.openai.com/docs/guides/embeddings)
- [OpenAI: retrieval](https://platform.openai.com/docs/guides/retrieval)

