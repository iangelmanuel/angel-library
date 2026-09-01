---
title: Testing asistido por IA — criterios y límites
description: Entender dónde aportan los agentes visuales, cómo evitar pruebas ambiguas y qué partes deben seguir siendo deterministas.
type: guides
order: 1
tags: [testing, ai, e2e, visual-testing]
related:
  - testing/testing-ai/midscene
  - testing/testing-e2e/testing-e2e-reliable-ci
  - skills/skills-fundamentos/ai-tools-safe-workflow
updatedAt: 2026-08-28
---

El testing asistido por inteligencia artificial (IA) usa modelos para interpretar la pantalla o una instrucción en lenguaje natural. Puede acelerar una exploración y tolerar cambios de estructura, pero introduce latencia, costo y variabilidad. Por eso debe complementar una base determinista, no reemplazarla.

## Dos significados diferentes

| Tema                       | Pregunta                                                                   |
| -------------------------- | -------------------------------------------------------------------------- |
| Testing asistido por IA    | ¿cómo ayuda un modelo a generar, explorar o ejecutar pruebas?              |
| Testing de sistemas con IA | ¿cómo evaluamos una salida probabilística, seguridad y calidad del modelo? |

Esta guía cubre el primer caso. Para el segundo, continúa con [Evals para aplicaciones con IA](/testing/testing-ai/testing-ai-evals).

## Qué conviene delegar

| Buen caso                                          | Mejor opción convencional             |
| -------------------------------------------------- | ------------------------------------- |
| encontrar un control por su apariencia o intención | selector por rol cuando es estable    |
| explorar un flujo cambiante                        | regresión crítica de pagos o permisos |
| extraer datos visuales difíciles de localizar      | afirmar un status HTTP exacto         |
| comprobar una idea semántica amplia                | cálculo con resultado exacto          |

Una instrucción como “abre el producto más barato” necesita contexto y puede cambiar con los datos. Una aserción como `expect(total).toBe(1990)` debe permanecer en código determinista.

La IA también puede proponer particiones, generar datos, resumir traces y explorar recorridos. Revisa siempre sus supuestos. Un test generado que solo repite la implementación o afirma `toBeDefined()` agrega archivos, no confianza.

## Escribir instrucciones verificables

Describe objetivo, alcance y señal final: “En la tabla Pedidos, abre el pedido cuyo identificador es A-42 y verifica que el estado visible sea Pagado”. Evita “comprueba que todo esté bien”, porque no define qué evidencia aceptar.

Separa acción, consulta y aserción. Si una acción falla, el reporte debe indicar si el modelo no encontró el elemento, si la aplicación no respondió o si la expectativa era incorrecta.

```text
Contexto: catálogo con datos de prueba estables.
Acción: filtra la categoría “Teclados” y abre el artículo KB-42.
Resultado: el detalle muestra estado “Disponible” y precio mayor que cero.
No hacer: comprar, iniciar sesión con otra cuenta o salir del dominio.
```

El límite “no hacer” reduce acciones inesperadas. Aun así, ejecuta en un tenant desechable sin permisos peligrosos.

## Riesgos operativos

- No envíes secretos, datos personales ni información de producción a un modelo sin revisar el tratamiento de datos.
- Fija modelo y versión cuando el proveedor lo permita; un cambio puede alterar resultados.
- Limita tiempo, tokens, reintentos y concurrencia para controlar costo.
- Conserva screenshot, trace e instrucción utilizada para reproducir fallos.
- Mantén un conjunto pequeño de pruebas de IA en cada pull request y ejecuta exploraciones amplias de forma programada.

## Medir estabilidad y costo

Registra por escenario:

- tasa de éxito al repetir;
- modelo, versión y parámetros;
- tokens, latencia y costo;
- cantidad de pasos y reintentos;
- screenshots y decisión del modelo;
- falsos positivos y falsos negativos confirmados.

Una prueba que pasa 7 de 10 veces no es una barrera de release confiable. Puede seguir siendo una exploración útil si se reporta como señal y requiere revisión.

## Estrategia híbrida

Usa selectores accesibles y aserciones exactas para el camino crítico. Añade IA en pasos visuales que cambian con frecuencia o en suites exploratorias. Cuando una prueba asistida encuentre un bug, crea una regresión determinista si el comportamiento puede expresarse con una condición estable.

## Revisión de pruebas generadas

Antes de aceptar código creado por IA, comprueba que:

- falla al romper deliberadamente la regla;
- no contiene selectores inventados o detalles internos;
- prepara y limpia datos;
- espera condiciones observables;
- no llama producción ni contiene secretos;
- añade un riesgo nuevo en lugar de duplicar otra prueba;
- el nombre explica condición y resultado.

La IA puede acelerar el primer borrador. La responsabilidad del oráculo y del riesgo protegido permanece en el equipo.
