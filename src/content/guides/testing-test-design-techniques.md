---
title: Diseño de casos de prueba — límites, tablas y estados
description: Convertir requisitos y riesgos en casos útiles mediante particiones, valores límite, tablas de decisión, transiciones de estado y pruebas exploratorias.
category: testing
stack: testing-fundamentos
order: 3
tags: [testing, test-design, quality, requirements]
related:
  - guides/testing-fundamentals-terminology
  - guides/testing-strategy
  - guides/testing-property-mutation
updatedAt: 2026-08-25
---

Probar todas las entradas posibles casi nunca es viable. El diseño de casos de prueba consiste en elegir un conjunto pequeño que represente los riesgos importantes. Estas técnicas sirven tanto antes de escribir código como al investigar un bug.

## Mapa rápido

| Técnica | Pregunta que responde | Ejemplo |
| --- | --- | --- |
| Particiones de equivalencia | ¿Qué grupos deberían comportarse igual? | edad inválida, menor y adulta |
| Valores límite | ¿Dónde cambia una regla? | `17`, `18` y `19` |
| Tabla de decisión | ¿Qué combinaciones alteran el resultado? | sesión, rol y ownership |
| Transición de estados | ¿Qué acciones son válidas desde cada estado? | pedido pendiente → pagado |
| Pairwise | ¿Cómo reducir muchas combinaciones? | navegador, plan, idioma y dispositivo |
| Exploratoria | ¿Qué riesgos no capturó la especificación? | sesión guiada por hipótesis |

## Particiones y valores límite

Si una entrada acepta cantidades entre 1 y 10, no necesitas repetir todos los valores para comprobar la misma regla. Divide el dominio en grupos y prueba alrededor de sus fronteras.

```ts
it.each([
  { quantity: 0, expected: 'invalid' },
  { quantity: 1, expected: 'valid' },
  { quantity: 10, expected: 'valid' },
  { quantity: 11, expected: 'invalid' },
])('clasifica $quantity como $expected', ({ quantity, expected }) => {
  expect(classifyQuantity(quantity)).toBe(expected);
});
```

Incluye límites vacíos y técnicos cuando apliquen: cadena vacía, espacios, `null`, fechas de cambio de mes, cero, negativos, valor máximo de base de datos y caracteres Unicode. Un valor “normal” demuestra el camino feliz; un límite demuestra que entendiste la regla.

## Tablas de decisión

Cuando varias condiciones interactúan, escribir casos desde intuición deja huecos. Una tabla hace visible cada combinación relevante.

| Sesión | Es dueño | Es admin | Resultado |
| --- | --- | --- | --- |
| no | — | — | `401 Unauthorized` |
| sí | no | no | `403 Forbidden` |
| sí | sí | no | permitido |
| sí | no | sí | permitido |

`401` significa que falta una identidad válida; `403` significa que la identidad existe, pero no tiene permiso. La prueba debe verificar también que un rechazo no produzca cambios persistidos.

## Transiciones de estado

Modela entidades con ciclo de vida como una máquina de estados. Para un pedido, no basta probar `pending → paid`: también importa que `cancelled → paid` sea rechazado y que repetir el mismo evento no duplique el cobro.

```text
pending --pay--> paid --refund--> refunded
   |
 cancel
   v
cancelled
```

Por cada transición prueba origen, evento, destino y efectos secundarios. Añade transiciones inválidas, repetición e interrupción a mitad de operación.

## Pruebas exploratorias

Una prueba automatizada confirma lo que ya expresaste. Una sesión exploratoria aprende sobre el sistema mientras lo prueba. Define una misión breve —por ejemplo, “investigar pérdida de datos al editar sin conexión”—, limita el tiempo, registra recorridos y convierte hallazgos repetibles en casos automatizados.

## Del requisito al conjunto de pruebas

1. Escribe el comportamiento observable y su riesgo.
2. Identifica entradas, estados, actores y dependencias.
3. Usa una técnica para reducir combinaciones sin perder límites.
4. Añade camino feliz, error, permiso y recuperación.
5. Elige el nivel más barato que reproduzca el riesgo.
6. Confirma que la prueba falla si rompes deliberadamente la regla.

Una suite madura no es la que acumula más tests, sino la que explica qué riesgos protege y detecta una regresión con un fallo claro.
