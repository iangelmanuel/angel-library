---
title: Diseño de casos de prueba — límites, tablas y estados
description: Convertir requisitos y riesgos en casos útiles mediante particiones, valores límite, tablas de decisión, transiciones de estado y pruebas exploratorias.
type: guides
order: 3
tags: [testing, test-design, quality, requirements]
related:
  - testing/testing-fundamentos/testing-fundamentals-terminology
  - testing/testing-fundamentos/testing-strategy
  - testing/testing-unitario/testing-property-mutation
updatedAt: 2026-08-28
---

Probar todas las entradas posibles casi nunca es viable. El diseño de casos de prueba consiste en elegir un conjunto pequeño que represente los riesgos importantes. Estas técnicas sirven tanto antes de escribir código como al investigar un bug.

## Mapa rápido

| Técnica                     | Pregunta que responde                        | Ejemplo                               |
| --------------------------- | -------------------------------------------- | ------------------------------------- |
| Particiones de equivalencia | ¿Qué grupos deberían comportarse igual?      | edad inválida, menor y adulta         |
| Valores límite              | ¿Dónde cambia una regla?                     | `17`, `18` y `19`                     |
| Tabla de decisión           | ¿Qué combinaciones alteran el resultado?     | sesión, rol y ownership               |
| Transición de estados       | ¿Qué acciones son válidas desde cada estado? | pedido pendiente → pagado             |
| Pairwise                    | ¿Cómo reducir muchas combinaciones?          | navegador, plan, idioma y dispositivo |
| Exploratoria                | ¿Qué riesgos no capturó la especificación?   | sesión guiada por hipótesis           |

## Particiones y valores límite

Si una entrada acepta cantidades entre 1 y 10, no necesitas repetir todos los valores para comprobar la misma regla. Divide el dominio en grupos y prueba alrededor de sus fronteras.

```ts
it.each([
  { quantity: 0, expected: "invalid" },
  { quantity: 1, expected: "valid" },
  { quantity: 10, expected: "valid" },
  { quantity: 11, expected: "invalid" }
])("clasifica $quantity como $expected", ({ quantity, expected }) => {
  expect(classifyQuantity(quantity)).toBe(expected)
})
```

Incluye límites vacíos y técnicos cuando apliquen: cadena vacía, espacios, `null`, fechas de cambio de mes, cero, negativos, valor máximo de base de datos y caracteres Unicode. Un valor “normal” demuestra el camino feliz; un límite demuestra que entendiste la regla.

No confundas una partición con un único valor. “Correo inválido” puede contener clases distintas: sin `@`, dominio ausente, Unicode, longitud excesiva y espacios. Si cada clase activa una regla o riesgo diferente, merece representación propia.

## Tablas de decisión

Cuando varias condiciones interactúan, escribir casos desde intuición deja huecos. Una tabla hace visible cada combinación relevante.

| Sesión | Es dueño | Es admin | Resultado          |
| ------ | -------- | -------- | ------------------ |
| no     | —        | —        | `401 Unauthorized` |
| sí     | no       | no       | `403 Forbidden`    |
| sí     | sí       | no       | permitido          |
| sí     | no       | sí       | permitido          |

`401` significa que falta una identidad válida; `403` significa que la identidad existe, pero no tiene permiso. La prueba debe verificar también que un rechazo no produzca cambios persistidos.

Convierte cada fila relevante en un caso nombrado. Cuando existen muchas condiciones, elimina combinaciones imposibles y marca reglas prioritarias. La tabla es documentación ejecutable solo cuando sus casos permanecen vinculados a las pruebas.

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

## Pairwise y combinaciones

**Pairwise** o pruebas por pares elige casos para que cada par de valores aparezca al menos una vez. Reduce matrices como navegador × idioma × rol × plan, pero no sirve cuando una combinación específica de tres o más factores tiene riesgo conocido.

```text
Factores: navegador [Chromium, Firefox, WebKit]
         rol       [guest, member, admin]
         idioma    [es, en]
```

Usa pairwise para compatibilidad amplia y añade manualmente combinaciones críticas: por ejemplo, WebKit + lector de pantalla + modal si ya produjo un defecto.

## Casos negativos y abuso

Un caso negativo no es enviar cualquier dato inválido. Debe demostrar una regla y que el sistema queda seguro:

- repetir una solicitud idempotente;
- modificar un ID para acceder al recurso ajeno;
- enviar un payload válido pero fuera de secuencia;
- cancelar a mitad de una operación;
- superar límites de tamaño, frecuencia o cantidad;
- entregar una respuesta externa parcial o mal formada.

Comprueba ausencia de efectos: no basta esperar `403`; verifica que el registro no cambió y que no se envió el evento.

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

## Plantilla breve de diseño

```text
Riesgo:
Comportamiento observable:
Precondiciones:
Entradas o actores:
Caso feliz:
Límites:
Errores y recuperación:
Efectos que no deben ocurrir:
Nivel y dependencia real:
Evidencia al fallar:
```

Esta plantilla puede vivir en una issue antes del código. Después se automatizan los casos repetibles y se conserva una misión exploratoria para lo que todavía necesita aprendizaje humano.
