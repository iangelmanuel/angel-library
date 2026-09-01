---
title: "UI y UX: fundamentos y terminología"
description: "Conceptos para diseñar interfaces comprensibles: modelos mentales, affordances, jerarquía, feedback, flujos y sistemas de diseño."
type: guides
tags: [ui, ux, diseño, usabilidad, sistemas-de-diseno, fundamentos]
order: 1
updatedAt: 2026-08-25
---

**UI** significa *User Interface* o interfaz de usuario: los elementos visibles y operables de un producto. **UX** significa *User Experience* o experiencia de usuario: la percepción completa antes, durante y después de usarlo.

Una interfaz visualmente atractiva puede tener mala UX si oculta acciones, pierde datos o responde tarde. Del mismo modo, un flujo lógico puede necesitar una UI más clara para que la persona descubra cómo usarlo.

## Aprende o consulta

La progresión recomendada es: objetivo y flujo → jerarquía → layout responsive → estados → formularios/feedback → accesibilidad → tokens/componentes → sistema de diseño → evaluación con usuarios. Una librería acelera implementación, pero no decide el flujo ni corrige una jerarquía débil.

| Necesito recordar | Documento |
| --- | --- |
| tipografía, espacio y énfasis | [Jerarquía visual](/ui-ux/ui-ux-design-systems/ui-ux-jerarquia-visual) |
| adaptar por contenido, no dispositivo concreto | [Layout responsive](/ui-ux/ui-ux-interaccion/ui-ux-responsive-layout) |
| loading, vacío, error y éxito | [Estados de interfaz](/ui-ux/ui-ux-interaccion/ui-ux-estados-interfaz) |
| labels, validación y confirmación | [Formularios y feedback](/ui-ux/ui-ux-interaccion/ui-ux-forms-feedback) |
| tokens y componentes compartidos | [Design systems](/ui-ux/ui-ux-design-systems/ui-ux-design-systems) |
| elegir una biblioteca UI | [Guía de selección](/ui-ux/ui-ux-design-systems/ui-library-selection) |
| revisar un componente completo | [Anatomía de componentes](/ui-ux/ui-ux-interaccion/ui-ux-component-anatomy) |

Quien aprende debe diseñar también errores, espera, permisos y contenido extremo. Quien recuerda puede usar las tablas y checklists, pero debe validar el flujo completo con teclado, zoom y datos reales.

## Usuario, objetivo y contexto

El diseño comienza por comprender quién intenta hacer qué y en qué condiciones. Un **flujo de usuario** representa los pasos para alcanzar un objetivo. Un **caso de uso** describe actor, intención, condiciones y resultado.

```text
Necesidad → punto de entrada → decisión → acción → feedback → resultado
```

Mapear también errores, cancelación y retorno evita diseñar solo el camino ideal.

## Modelo mental, affordance y signifier

Un **modelo mental** es la explicación interna que una persona construye sobre cómo funciona el producto. La interfaz debe ser coherente para que las mismas acciones produzcan resultados previsibles.

Una **affordance** es la acción que un objeto permite. Un **signifier** o indicador comunica esa posibilidad. Un botón permite activación; su forma, texto y estado visual indican que puede pulsarse.

Un icono sin texto puede ser familiar para el equipo y ambiguo para usuarios. Si la acción es importante o poco común, una etiqueta explícita reduce aprendizaje y errores.

## Feedback y estado del sistema

**Feedback** es la respuesta del sistema a una acción. Debe aparecer cerca de la causa, en el momento adecuado y explicar el resultado.

```text
Acción iniciada → estado de progreso → éxito, vacío o error → siguiente paso
```

Un indicador de carga infinito no explica si el sistema sigue trabajando. Después de un tiempo razonable se ofrece contexto, cancelación o reintento.

Los estados deshabilitados deben explicar por qué no se puede continuar. Cuando sea posible, es preferible permitir la acción y mostrar una validación concreta en vez de presentar un control inexplicablemente inactivo.

## Jerarquía visual

La **jerarquía** indica qué debe verse primero y qué elementos pertenecen juntos. Se construye con tamaño, peso, contraste, espacio, alineación y posición.

No todos los elementos pueden ser prominentes. Si cada bloque usa color intenso, sombra y tamaño grande, ninguno establece prioridad. El énfasis se reserva para la decisión principal del contexto.

La **proximidad** comunica relación: etiqueta y campo deben estar más cerca entre sí que de otros campos. La alineación repetida crea una estructura que se puede recorrer con menos esfuerzo.

## Carga cognitiva y reconocimiento

La **carga cognitiva** es el esfuerzo mental necesario para comprender y actuar. Se reduce manteniendo convenciones, mostrando opciones relevantes y dividiendo tareas complejas en pasos significativos.

El reconocimiento suele ser más fácil que el recuerdo. Una lista de opciones visibles exige menos memoria que pedir un comando exacto. Sin embargo, mostrar demasiadas decisiones simultáneas también aumenta carga; la **divulgación progresiva** revela complejidad cuando se necesita.

## Consistencia y patrones

Un **patrón de interfaz** es una solución repetida, como navegación por pestañas, autocompletado o confirmación. La consistencia permite transferir aprendizaje, pero no debe copiarse un patrón fuera de su contexto.

Los textos también forman parte del patrón. “Eliminar”, “Borrar” y “Quitar” no deberían significar cosas distintas sin una razón visible.

## Sistema de diseño

Un **sistema de diseño** reúne principios, tokens, componentes, patrones y documentación. No es únicamente una biblioteca de componentes.

- **Token:** nombre semántico para una decisión, como `color-danger` o `space-md`.
- **Componente:** unidad reutilizable con estructura, estados y API.
- **Patrón:** combinación de componentes para resolver un flujo.
- **Guía de contenido:** reglas de tono, etiquetas, errores y terminología.

Un token semántico expresa propósito y permite cambiar el valor sin renombrar cada uso. `color-text-muted` comunica mejor que `gray-500` cuando el tono puede variar entre temas.

## Wireframe, mockup y prototipo

Un **wireframe** representa estructura y prioridad con poco detalle visual. Un **mockup** muestra apariencia con mayor fidelidad. Un **prototipo** simula interacción para aprender antes de construir.

La fidelidad debe responder la pregunta. Para validar si el flujo se entiende, un prototipo simple puede ser mejor que una pantalla pulida que distrae con detalles de color.

## Usabilidad y accesibilidad

La **usabilidad** evalúa si una persona puede alcanzar objetivos con efectividad, eficiencia y satisfacción. La **accesibilidad** asegura que esa posibilidad incluya distintas capacidades y tecnologías asistivas.

Una prueba de usabilidad observa tareas reales. No se pregunta únicamente “¿te gusta?”; se define un objetivo, se observa dónde duda la persona y se analiza por qué.

## Heurísticas prácticas

Una **heurística** es una regla orientativa para evaluar diseño. Preguntas útiles:

1. ¿El sistema muestra qué está ocurriendo?
2. ¿Las palabras pertenecen al lenguaje del usuario?
3. ¿Existe salida, deshacer o cancelación?
4. ¿Los mismos elementos se comportan de forma consistente?
5. ¿Se previenen errores antes de explicarlos?
6. ¿La información necesaria está visible cuando se decide?
7. ¿Los mensajes indican causa y recuperación?

El diseño se valida con evidencia: analítica, soporte, pruebas de accesibilidad y sesiones con usuarios. Una preferencia del equipo es una hipótesis, no una conclusión.
