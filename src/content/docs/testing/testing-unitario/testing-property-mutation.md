---
title: Property-based testing y mutation testing
description: Generar entradas para comprobar invariantes y medir si la suite detecta cambios defectuosos, con ejemplos y criterios de uso.
type: guides
order: 2
tags: [testing, unit-testing, property-based, mutation-testing, fast-check]
install: npm install -D fast-check
related:
  - testing/testing-unitario/testing-vitest-practico
  - testing/testing-fundamentos/testing-test-design-techniques
updatedAt: 2026-08-28
---

Los ejemplos concretos siguen siendo esenciales, pero no siempre descubren combinaciones inesperadas. El _property-based testing_ genera muchas entradas y comprueba una propiedad que debe cumplirse para todas. El _mutation testing_ modifica temporalmente el código para comprobar si la suite detecta el defecto. Son técnicas diferentes y complementarias.

## Propiedades en lugar de resultados aislados

Una propiedad o invariante describe algo que siempre debe ser cierto. En una función de ordenamiento, la salida conserva la longitud, contiene los mismos elementos y queda ordenada; no necesitas predecir cada arreglo generado.

```ts
import fc from "fast-check"
import { describe, expect, it } from "vitest"

describe("sortNumbers", () => {
  it("conserva los elementos y produce orden ascendente", () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (input) => {
        const output = sortNumbers(input)

        expect(output).toHaveLength(input.length)
        expect([...output].sort((a, b) => a - b)).toEqual(output)
        expect([...output].sort((a, b) => a - b)).toEqual(
          [...input].sort((a, b) => a - b)
        )
      })
    )
  })
})
```

`fast-check` intenta reducir —_shrink_— una entrada que falla hasta obtener un contraejemplo pequeño. Si el error aparece con un arreglo enorme, podría terminar reportando algo tan simple como `[0, -1]`, que es más fácil de diagnosticar.

El **arbitrary** es el generador de valores. Debe representar entradas válidas o inválidas según la propiedad, no ruido sin relación con el dominio.

```ts
const userArbitrary = fc.record({
  id: fc.uuid(),
  age: fc.integer({ min: 0, max: 120 }),
  email: fc.emailAddress()
})
```

Cuando una propiedad falla, conserva el seed y el path reportados para reproducirla. Después añade un ejemplo concreto si el contraejemplo documenta una regla importante.

## Buenas propiedades

- ida y vuelta: `decode(encode(value))` conserva el valor;
- idempotencia: normalizar dos veces produce lo mismo que una;
- límites: el resultado nunca excede el rango permitido;
- conservación: una transformación no pierde elementos;
- equivalencia: una implementación nueva coincide con una referencia confiable.

No repitas la implementación dentro de la propiedad: si calculas el resultado con el mismo algoritmo, ambos pueden compartir el mismo error. Combina propiedades con ejemplos explícitos que documenten casos de negocio.

## Propiedades que parecen buenas y no lo son

- “no lanza error” puede aceptar resultados incorrectos;
- comparar dos implementaciones copiadas comparte el mismo defecto;
- generar cualquier string para un dominio muy específico desperdicia casos;
- una propiedad sin límites puede crear entradas irreales y lentas;
- afirmar solamente tipos o longitudes puede omitir semántica.

Empieza con un oráculo independiente: una ley matemática, una ida y vuelta, un modelo sencillo o una invariante del negocio.

## Mutation testing

Una herramienta de mutación cambia operadores como `>` por `>=`, elimina una condición o sustituye un valor. Si todos los tests siguen verdes, el mutante “sobrevivió”: esa parte del comportamiento no está protegida por una aserción capaz de detectar el cambio.

| Resultado             | Significado                                   |
| --------------------- | --------------------------------------------- |
| Mutante eliminado     | al menos una prueba detectó el defecto        |
| Mutante sobreviviente | falta una prueba o una aserción útil          |
| Mutante equivalente   | el cambio no altera comportamiento observable |
| Timeout/error         | revisar costo, aislamiento o configuración    |

La puntuación de mutación orienta, no es una meta absoluta. Úsala en lógica crítica y módulos estables; ejecutarla sobre todo el repositorio puede ser costoso. Primero revisa sobrevivientes con impacto real: permisos, cálculos, validación y estados.

## Flujo con mutation testing

1. Ejecuta primero la suite normal y elimina flakiness.
2. Limita mutación a módulos críticos o modificados.
3. Revisa sobrevivientes por impacto, no solo por cantidad.
4. Añade una aserción si existe un comportamiento observable faltante.
5. Marca mutantes equivalentes con justificación.
6. Ejecuta el conjunto amplio de forma programada si es costoso.

La herramienta puede generar timeouts porque cada mutante vuelve a ejecutar pruebas. Excluir código generado o trivial es razonable; excluir lógica difícil porque baja el score elimina el valor de la técnica.

## Cuándo aplicar cada técnica

Usa generación de propiedades en parsers, serialización, cálculos y algoritmos con un dominio grande. Usa mutación cuando una suite tiene buena cobertura de líneas, pero no sabes si sus aserciones son sensibles. Para UI y flujos completos, las técnicas convencionales y E2E suelen comunicar mejor la intención.

## Referencias

- [fast-check: documentación](https://fast-check.dev/)
- [Stryker Mutator para JavaScript y TypeScript](https://stryker-mutator.io/docs/stryker-js/introduction/)
