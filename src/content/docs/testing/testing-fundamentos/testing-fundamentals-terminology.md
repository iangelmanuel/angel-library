---
title: "Testing: fundamentos y terminología"
description: Modelo mental para entender tipos de prueba, aserciones, dobles, cobertura, pirámide, TDD y pruebas confiables.
type: guides
tags: [testing, pruebas, unitarias, integracion, e2e, fundamentos]
order: 1
updatedAt: 2026-08-28
---

Una **prueba automatizada** ejecuta un comportamiento y comprueba un resultado esperado. Su valor principal no es demostrar que el sistema nunca fallará, sino detectar regresiones con rapidez y hacer explícitas las expectativas importantes.

**Testing** es la actividad completa de evaluar calidad. Un archivo con muchas aserciones puede tener poco valor si verifica detalles internos y no protege el comportamiento que importa.

## Aprende o consulta

La ruta recomendada es: comportamiento y aserción → prueba unitaria → integración → dobles → componentes → E2E → contratos → estrategia en CI. Escribe primero casos pequeños y deterministas; añade niveles más costosos donde exista una frontera real.

| Necesito recordar                  | Documento                                                                                    |
| ---------------------------------- | -------------------------------------------------------------------------------------------- |
| qué nivel usar                     | [Estrategia de testing](/testing/testing-fundamentos/testing-strategy)                       |
| sintaxis, async, mocks y cobertura | [Vitest práctico](/testing/testing-unitario/testing-vitest-practico)                         |
| mock, stub, fake o contrato        | [Dobles y contratos](/testing/testing-integracion/testing-doubles-contracts)                 |
| API + base de datos real           | [Integración backend](/testing/testing-integracion/testing-backend-database)                 |
| UI React por comportamiento        | [React Testing Library](/testing/react/testing-react-testing-library)                        |
| navegador confiable en CI          | [E2E](/testing/testing-e2e/testing-e2e-reliable-ci)                                          |
| Playwright, locators y fixtures    | [Playwright práctico](/testing/testing-e2e/testing-playwright-practico)                      |
| regresión visual y accesibilidad   | [Pruebas visuales y accesibles](/testing/testing-e2e/testing-visual-accessibility)           |
| plan, smoke y calidad no funcional | [Plan de pruebas y calidad](/testing/testing-fundamentos/testing-quality-plan-nonfunctional) |
| datos, builders y snapshots        | [Datos de prueba y snapshots](/testing/testing-unitario/testing-fixtures-snapshots)          |
| evaluar una aplicación con IA      | [Evals para aplicaciones con IA](/testing/testing-ai/testing-ai-evals)                       |
| particularidades del framework     | [Astro](/testing/astro/astro-testing) o [Next.js](/testing/nextjs/nextjs-testing)            |

Quien aprende debe poder explicar por qué falla la prueba. Quien recuerda necesita una plantilla rápida, pero debe comprobar que la aserción observa conducta pública y no una implementación accidental.

## Vocabulario básico

| Término        | Significado                                                              |
| -------------- | ------------------------------------------------------------------------ |
| Caso de prueba | Un escenario con preparación, acción y resultado esperado                |
| Suite          | Grupo de casos relacionados                                              |
| Runner         | Programa que descubre y ejecuta pruebas                                  |
| Aserción       | Comprobación que puede aprobar o fallar                                  |
| SUT            | _System Under Test_, sistema bajo prueba                                 |
| Fixture        | Datos o estado preparados para una prueba                                |
| Oráculo        | Fuente que determina cuál es el resultado correcto                       |
| Regresión      | Comportamiento que funcionaba y se rompe tras un cambio                  |
| Oráculo        | Regla o fuente que decide cuál resultado es correcto                     |
| Flaky test     | Prueba que cambia de resultado sin cambiar el comportamiento relevante   |
| Test harness   | Infraestructura que prepara, ejecuta y observa las pruebas               |
| Testability    | Facilidad con la que un sistema puede controlarse y observarse al probar |

Un nombre de prueba debe describir el comportamiento y la condición, no repetir el nombre de la función.

```ts
it("rechaza el descuento cuando la fecha de la promoción venció", () => {
  const promotion = { percent: 20, expiresAt: new Date("2026-01-01") }

  const result = applyPromotion(10_000, promotion, new Date("2026-02-01"))

  expect(result).toEqual({ ok: false, reason: "expired" })
})
```

La prueba fija el reloj mediante un argumento, ejecuta una conducta y observa una salida pública. Evita depender de la fecha real del equipo.

## Verificación, validación y calidad

**Verificación** pregunta si construimos el sistema según la especificación. **Validación** pregunta si construimos el sistema que resuelve la necesidad real. Una suite puede verificar perfectamente una regla equivocada; por eso testing también incluye revisión de requisitos, pruebas exploratorias y retroalimentación de personas usuarias.

La calidad no es sinónimo de “los tests están verdes”. Incluye corrección, seguridad, accesibilidad, rendimiento, resiliencia y facilidad de uso. Cada atributo necesita una señal distinta: una aserción funcional no demuestra que una página sea accesible ni que soporte carga.

## AAA y Given–When–Then

**AAA** significa _Arrange, Act, Assert_: preparar, actuar y comprobar. **Given–When–Then** expresa lo mismo como dado, cuando y entonces. Ambos patrones ayudan a separar intención de detalles.

```ts
// Arrange: prepara entradas y dependencias.
const cart = [{ priceCents: 2_000, quantity: 2 }]

// Act: ejecuta una única acción principal.
const total = calculateTotal(cart)

// Assert: comprueba el resultado observable.
expect(total).toBe(4_000)
```

No es obligatorio añadir comentarios AAA en cada prueba; la estructura debe ser legible incluso sin ellos.

## Niveles de prueba

Los niveles describen alcance, no herramientas:

| Nivel       | Qué integra                                     | Ejemplo                                          |
| ----------- | ----------------------------------------------- | ------------------------------------------------ |
| Unitario    | Una unidad pequeña con dependencias controladas | Cálculo de impuestos                             |
| Integración | Varias piezas o una frontera real               | Repositorio contra una base de prueba            |
| Componente  | Renderizado y conducta de un componente         | Formulario muestra errores y permite corregirlos |
| Contrato    | Acuerdo entre productor y consumidor            | Forma y estados de una API                       |
| E2E         | Flujo completo desde una interfaz externa       | Usuario compra y recibe confirmación             |

**E2E** significa _End to End_ o extremo a extremo. Estas pruebas dan alta confianza en rutas críticas, pero son más lentas y tienen más puntos de fallo. No conviene usarlas para cada combinación de una función matemática.

La **pirámide de pruebas** propone muchas comprobaciones rápidas en la base y menos pruebas amplias en la parte superior. No fija porcentajes universales: la distribución depende de los riesgos y de la arquitectura.

También existe el **trofeo de testing**, que resalta pruebas de integración como una zona de alto valor en aplicaciones web. Ninguna figura es una cuota. Elige el nivel que mantenga real la frontera donde vive el riesgo y simule únicamente lo que no necesitas comprobar en ese caso.

## Clasificaciones que no son niveles

| Tipo         | Qué significa                                                    |
| ------------ | ---------------------------------------------------------------- |
| Smoke        | recorrido pequeño que confirma que el sistema básico está vivo   |
| Sanity       | comprobación enfocada después de un cambio concreto              |
| Regresión    | conjunto que detecta comportamientos rotos anteriormente válidos |
| Aceptación   | ejemplos que confirman una necesidad del producto o negocio      |
| Exploratoria | aprendizaje y diseño de pruebas mientras se usa el sistema       |
| Visual       | comparación de apariencia o geometría                            |
| Rendimiento  | latencia, capacidad, estabilidad y uso de recursos               |
| Seguridad    | controles, abuso y vulnerabilidades                              |

Una prueba puede ser simultáneamente E2E, de regresión y de aceptación. Estas palabras describen propósito, no una herramienta diferente.

## Dobles de prueba

Un **doble** sustituye una dependencia durante una prueba:

- **Stub:** devuelve respuestas preparadas.
- **Fake:** implementación funcional simplificada, como un repositorio en memoria.
- **Mock:** verifica interacciones esperadas según la definición usada por la herramienta.
- **Spy:** registra llamadas a una función real o sustituida.
- **Dummy:** valor requerido por la firma, pero irrelevante para el caso.

```ts
const emailGateway = {
  sendReceipt: vi.fn().mockResolvedValue({ messageId: "msg-1" })
}

await completeOrder(order, emailGateway)

expect(emailGateway.sendReceipt).toHaveBeenCalledWith(
  expect.objectContaining({ orderId: order.id })
)
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

## Observabilidad y control

Para probar necesitas **controlar** entradas y dependencias y **observar** resultados. Un diseño testeable permite inyectar reloj, generar datos aislados, consultar efectos persistidos y obtener errores claros sin exponer detalles internos en producción.

```ts
const service = createSubscriptionService({
  clock: () => new Date("2026-08-28T12:00:00Z"),
  idGenerator: () => "sub_test_1",
  repository
})
```

Esto no existe “solo para el test”: hace explícitas dependencias que antes eran globales y mejora el diseño. No abras métodos privados únicamente para probarlos; observa la interfaz pública o extrae una responsabilidad con significado propio.

## Cobertura y mutación

La **cobertura** indica qué líneas, ramas o funciones se ejecutaron durante las pruebas. No demuestra que se hayan hecho buenas aserciones.

Las **pruebas de mutación** cambian deliberadamente operadores o valores en el código y comprueban si la suite detecta el cambio. Si una mutación sobrevive, puede faltar una expectativa importante.

La cobertura sirve como señal para encontrar zonas no recorridas, no como objetivo aislado. Una ruta de autorización crítica merece casos explícitos aunque el porcentaje global sea alto.

## TDD y BDD

**TDD** significa _Test-Driven Development_ o desarrollo guiado por pruebas. Su ciclo habitual es:

1. rojo: escribir una prueba que falla por la razón esperada;
2. verde: implementar lo mínimo para que pase;
3. refactorizar: mejorar diseño manteniendo las pruebas verdes.

**BDD** significa _Behavior-Driven Development_ o desarrollo guiado por comportamiento. Destaca ejemplos expresados en lenguaje del dominio y colaboración entre negocio, producto y desarrollo.

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

## Qué no demuestra una prueba

- Un caso feliz no demuestra manejo de límites o errores.
- Un mock verde no demuestra que el proveedor real mantenga el contrato.
- Una cobertura alta no demuestra aserciones sensibles.
- Un E2E verde no demuestra todas las combinaciones internas.
- Una prueba automática de accesibilidad no sustituye teclado y lector de pantalla.
- Una ejecución local no demuestra aislamiento en CI paralelo.

La confianza nace de señales complementarias y de haber visto cada prueba fallar por la razón que pretende detectar.
