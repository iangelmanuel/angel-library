---
title: "Open Executive — equipo ejecutivo con agentes de IA"
description: "Equipo ejecutivo virtual: ocho agentes especializados que responden con una sola voz coherente, con memoria de decisiones entre sesiones."
category: findings
stack: hallazgos-ia
order: 2
tags: [ia, agentes, claude, python, fastapi, nextjs, multi-agente]
url: https://github.com/SenteLabsAI/OpenExecutive
resourceCategory: ia
personalNote: "El patrón vale más que el producto: varios agentes especializados por detrás y una sola voz por delante, en vez de obligar al usuario a elegir con cuál habla."
updatedAt: 2026-08-30
---

> Desarrollado por **[Sente Labs](https://sentelabs.ai)** ([SenteLabsAI](https://github.com/SenteLabsAI) en GitHub). Unas 3.000 estrellas, Python con FastAPI y Next.js.

**Open Executive** proporciona una voz ejecutiva única y coherente, respaldada por ocho agentes de IA especializados.

## Los ocho especialistas

| Rol | Área |
| --- | --- |
| Director de Estrategia | Análisis competitivo, fusiones y adquisiciones, posicionamiento, OKR |
| Director Financiero | Modelado financiero, captación de fondos, economía unitaria, flujo de caja |
| Director de Recursos Humanos | Contratación, compensación, desempeño, cultura |
| Asesor Jurídico | Contratos, propiedad intelectual, derecho laboral, cumplimiento |
| Director de Operaciones | Diseño de procesos, gestión de proveedores, escalabilidad |
| Director de Marketing | Estrategia de comercialización, marca, comunicación, relaciones públicas |
| Director de Producto | Hoja de ruta, priorización, estrategia de producto |
| Director de Comunicación del Consejo | Presentaciones al consejo, relaciones con inversores, gobernanza |

## La decisión de diseño interesante

**La arquitectura interna nunca se expone al usuario.** No hay que elegir con qué agente hablar ni entender cómo se reparte la pregunta: todas las respuestas llegan como una sola voz ejecutiva coherente.

Es lo contrario de la interfaz habitual de sistemas multiagente, donde se ve el enjambre trabajando. Aquí el enjambre es un detalle de implementación.

## Más allá de preguntas y respuestas

Dos piezas lo separan de un chat:

- **Registro episódico.** Mantiene memoria de decisiones e iniciativas anteriores **entre sesiones**, así que puede referirse a lo que se decidió antes.
- **Planificador integrado.** Puede sacar a la superficie, de forma proactiva, seguimientos pendientes y acciones urgentes, sin que nadie pregunte.

## Cómo usarlo

Es un proyecto autoalojado: backend en **FastAPI** y frontend en **Next.js**. Los agentes corren sobre modelos de Anthropic, así que hace falta una clave de API propia y el consumo se factura aparte.

## Qué tener en cuenta

- **No sustituye asesoría real.** Las áreas que cubre —jurídica, financiera, laboral— son justo donde una respuesta incorrecta sale cara. Sirve para preparar el terreno y ordenar ideas, no para decidir.
- **La licencia no es estándar.** GitHub la reporta como no reconocida automáticamente, así que conviene leer el archivo de licencia antes de usarlo en algo comercial.
- **La memoria persistente guarda información sensible.** Si el registro episódico almacena decisiones de negocio, ese almacenamiento merece el mismo cuidado que cualquier otro dato confidencial.
