---
title: Testing asistido por IA — criterios y límites
description: Entender dónde aportan los agentes visuales, cómo evitar pruebas ambiguas y qué partes deben seguir siendo deterministas.
category: testing
stack: testing-ai
order: 1
tags: [testing, ai, e2e, visual-testing]
related:
  - libraries/midscene
  - guides/testing-e2e-reliable-ci
  - guides/ai-tools-safe-workflow
updatedAt: 2026-08-25
---

El testing asistido por inteligencia artificial (IA) usa modelos para interpretar la pantalla o una instrucción en lenguaje natural. Puede acelerar una exploración y tolerar cambios de estructura, pero introduce latencia, costo y variabilidad. Por eso debe complementar una base determinista, no reemplazarla.

## Qué conviene delegar

| Buen caso | Mejor opción convencional |
| --- | --- |
| encontrar un control por su apariencia o intención | selector por rol cuando es estable |
| explorar un flujo cambiante | regresión crítica de pagos o permisos |
| extraer datos visuales difíciles de localizar | afirmar un status HTTP exacto |
| comprobar una idea semántica amplia | cálculo con resultado exacto |

Una instrucción como “abre el producto más barato” necesita contexto y puede cambiar con los datos. Una aserción como `expect(total).toBe(1990)` debe permanecer en código determinista.

## Escribir instrucciones verificables

Describe objetivo, alcance y señal final: “En la tabla Pedidos, abre el pedido cuyo identificador es A-42 y verifica que el estado visible sea Pagado”. Evita “comprueba que todo esté bien”, porque no define qué evidencia aceptar.

Separa acción, consulta y aserción. Si una acción falla, el reporte debe indicar si el modelo no encontró el elemento, si la aplicación no respondió o si la expectativa era incorrecta.

## Riesgos operativos

- No envíes secretos, datos personales ni información de producción a un modelo sin revisar el tratamiento de datos.
- Fija modelo y versión cuando el proveedor lo permita; un cambio puede alterar resultados.
- Limita tiempo, tokens, reintentos y concurrencia para controlar costo.
- Conserva screenshot, trace e instrucción utilizada para reproducir fallos.
- Mantén un conjunto pequeño de pruebas de IA en cada pull request y ejecuta exploraciones amplias de forma programada.

## Estrategia híbrida

Usa selectores accesibles y aserciones exactas para el camino crítico. Añade IA en pasos visuales que cambian con frecuencia o en suites exploratorias. Cuando una prueba asistida encuentre un bug, crea una regresión determinista si el comportamiento puede expresarse con una condición estable.
