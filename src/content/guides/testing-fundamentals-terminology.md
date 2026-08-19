---
title: "Testing: fundamentos y terminología"
description: Modelo mental para entender tipos de prueba, aserciones, dobles, cobertura, pirámide, TDD y pruebas confiables.
category: testing
stack: testing-fundamentos
tags: [testing, pruebas, unitarias, integracion, e2e, fundamentos]
order: 1
updatedAt: 2026-08-19
---

Una **prueba automatizada** ejecuta un comportamiento y comprueba un resultado esperado. Su valor principal no es demostrar que el sistema nunca fallará, sino detectar regresiones con rapidez y hacer explícitas las expectativas importantes.

**Testing** es la actividad completa de evaluar calidad. Un archivo con muchas aserciones puede tener poco valor si verifica detalles internos y no protege el comportamiento que importa.

## Vocabulario básico

| Término | Significado |
| --- | --- |
| Caso de prueba | Un escenario con preparación, acción y resultado esperado |
| Suite | Grupo de casos relacionados |
| Runner | Programa que descubre y ejecuta pruebas |
| Aserción | Comprobación que puede aprobar o fallar |
| SUT | *System Under Test*, sistema bajo prueba |
| Fixture | Datos o estado preparados para una prueba |
| Oráculo | Fuente que determina cuál es el resultado correcto |
| Regresión | Comportamiento que funcionaba y se rompe tras un cambio |

Un nombre de prueba debe describir el comportamiento y la condición, no repetir el nombre de la función.

```ts
it('rechaza el descuento cuando la fecha de la promoción venció', () => {
  const promotion = { percent: 20, expiresAt: new Date('2026-01-01') };

  const result = applyPromotion(10_000, promotion, new Date('2026-02-01'));

  expect(result).toEqual({ ok: false, reason: 'expired' });
});
```

La prueba fija el reloj mediante un argumento, ejecuta una conducta y observa una salida pública. Evita depender de la fecha real del equipo.

## AAA y Given–When–Then

**AAA** significa *Arrange, Act, Assert*: preparar, actuar y comprobar. **Given–When–Then** expresa lo mismo como dado, cuando y entonces. Ambos patrones ayudan a separar intención de detalles.

```ts
// Arrange: prepara entradas y dependencias.
const cart = [{ priceCents: 2_000, quantity: 2 }];

// Act: ejecuta una única acción principal.
const total = calculateTotal(cart);

// Assert: comprueba el resultado observable.
expect(total).toBe(4_000);
```

No es obligatorio añadir comentarios AAA en cada prueba; la estructura debe ser legible incluso sin ellos.

## Niveles de prueba

Los niveles describen alcance, no herramientas:

| Nivel | Qué integra | Ejemplo |
| --- | --- | --- |
| Unitario | Una unidad pequeña con dependencias controladas | Cálculo de impuestos |
| Integración | Varias piezas o una frontera real | Repositorio contra una base de prueba |
| Componente | Renderizado y conducta de un componente | Formulario muestra errores y permite corregirlos |
| Contrato | Acuerdo entre productor y consumidor | Forma y estados de una API |
| E2E | Flujo completo desde una interfaz externa | Usuario compra y recibe confirmación |

**E2E** significa *End to End* o extremo a extremo. Estas pruebas dan alta confianza en rutas críticas, pero son más lentas y tienen más puntos de fallo. No conviene usarlas para cada combinación de una función matemática.

La **pirámide de pruebas** propone muchas comprobaciones rápidas en la base y menos pruebas amplias en la parte superior. No fija porcentajes universales: la distribución depende de los riesgos y de la arquitectura.

## Dobles de prueba

Un **doble** sustituye una dependencia durante una prueba:

- **Stub:** devuelve respuestas preparadas.
- **Fake:** implementación funcional simplificada, como un repositorio en memoria.
- **Mock:** verifica interacciones esperadas según la definición usada por la herramienta.
- **Spy:** registra llamadas a una función real o sustituida.
- **Dummy:** valor requerido por la firma, pero irrelevante para el caso.

```ts
const emailGateway = {
  sendReceipt: vi.fn().mockResolvedValue({ messageId: 'msg-1' }),
};

await completeOrder(order, emailGateway);

expect(emailGateway.sendReceipt).toHaveBeenCalledWith(
  expect.objectContaining({ orderId: order.id }),
);
```

Esta prueba comprueba una interacción que forma parte del contrato del caso de uso. Espiar cada llamada interna vuelve la prueba frágil ante refactorizaciones que no cambian conducta.

## Determinismo y pruebas inestables

Una prueba **determinista** produce el mismo resultado con las mismas entradas. Una prueba **flaky** o inestable aprueba y falla sin que cambie el comportamiento relevante.

Causas frecuentes:

- reloj, zona horaria o aleatoriedad no controlados;
- espera con tiempos fijos en vez de condiciones;
- datos compartidos entre pruebas;
- dependencia de red externa;
- orden de ejecución implícito;
- selectores de interfaz basados en estructura o estilos.

No se debe resolver una prueba inestable con reintentos ilimitados. Los reintentos pueden reducir ruido temporal mientras se investiga, pero también esconden una carrera real.

## Cobertura y mutación

La **cobertura** indica qué líneas, ramas o funciones se ejecutaron durante las pruebas. No demuestra que se hayan hecho buenas aserciones.

Las **pruebas de mutación** cambian deliberadamente operadores o valores en el código y comprueban si la suite detecta el cambio. Si una mutación sobrevive, puede faltar una expectativa importante.

La cobertura sirve como señal para encontrar zonas no recorridas, no como objetivo aislado. Una ruta de autorización crítica merece casos explícitos aunque el porcentaje global sea alto.

## TDD y BDD

**TDD** significa *Test-Driven Development* o desarrollo guiado por pruebas. Su ciclo habitual es:

1. rojo: escribir una prueba que falla por la razón esperada;
2. verde: implementar lo mínimo para que pase;
3. refactorizar: mejorar diseño manteniendo las pruebas verdes.

**BDD** significa *Behavior-Driven Development* o desarrollo guiado por comportamiento. Destaca ejemplos expresados en lenguaje del dominio y colaboración entre negocio, producto y desarrollo.

Ninguno garantiza buen diseño automáticamente. Son herramientas para obtener retroalimentación temprana y aclarar expectativas.

## Qué conviene probar

Prioriza reglas de negocio, permisos, transformaciones de datos, estados de error, integración con fronteras y rutas que sostienen ingresos o confianza. Evita dedicar el mismo esfuerzo a un componente decorativo y a una transferencia de dinero.

Para cada riesgo, pregunta:

1. ¿Cuál es el comportamiento observable?
2. ¿Qué caso normal, límite y de error importa?
3. ¿Cuál es el nivel más pequeño que ofrece confianza suficiente?
4. ¿Qué dependencia real debe mantenerse para que la prueba sea representativa?
5. ¿Qué información mostrará el fallo para diagnosticarlo rápido?

Una buena suite es rápida para el alcance elegido, aislada entre casos, legible y confiable. Si el equipo ignora sus fallos, dejó de cumplir su propósito.
