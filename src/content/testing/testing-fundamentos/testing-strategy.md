---
title: Estrategia de testing — qué probar en cada nivel
description: Diseñar una pirámide útil de tests unitarios, integración, contratos y E2E sin duplicar las mismas comprobaciones.
type: guides
tags: [testing, architecture, quality, e2e]
scope: estrategia de pruebas
order: 2
related:
  - testing/nextjs/nextjs-testing
  - testing/astro/astro-testing
  - testing/testing-unitario/vitest-backend
  - testing/testing-integracion/supertest
updatedAt: 2026-08-28
---

La unidad correcta no siempre es una función. Elige el nivel más bajo que reproduzca el riesgo real sin simular la parte que quieres verificar.

## Referencia rápida por frontera

```text
regla pura → unitario
adaptador + dependencia real → integración
productor ↔ consumidor → contrato
componente + DOM → componente/navegador
flujo completo → E2E
atributo transversal → seguridad, accesibilidad o rendimiento
```

| Nivel       | Útil para                     | Evitar                                 |
| ----------- | ----------------------------- | -------------------------------------- |
| Unitario    | reglas, parsers, cálculos     | mocks de cada línea interna            |
| Integración | DB, HTTP, módulos colaborando | reemplazar la dependencia principal    |
| Contrato    | APIs entre servicios          | asumir que OpenAPI y runtime coinciden |
| E2E         | flujos críticos de usuario    | cubrir cada combinación visual         |

## Qué merece prioridad

- Autorización y ownership.
- Pagos, inventario y cálculos.
- Migraciones y queries importantes.
- Formularios y flujos de recuperación.
- Bugs que ya ocurrieron: cada regresión debería dejar una prueba.

## Priorizar por riesgo

Una matriz sencilla combina probabilidad e impacto. Un error frecuente pero cosmético y un error raro que duplica un cobro no reciben el mismo esfuerzo.

| Impacto / Probabilidad | Baja                               | Alta                              |
| ---------------------- | ---------------------------------- | --------------------------------- |
| Bajo                   | exploratoria o comprobación manual | automatización pequeña            |
| Alto                   | prueba dirigida + monitoreo        | varias capas y bloqueo de release |

Para un pago, una prueba unitaria protege el cálculo, integración protege idempotencia y persistencia, contrato protege al proveedor y un E2E confirma el recorrido principal. No son cuatro copias: cada una observa una frontera diferente.

## Propiedades de una buena suite

- Determinista: controla reloj, random y datos.
- Aislada: no depende de orden ni ambiente personal.
- Legible: explica comportamiento, no implementación accidental.
- Rápida en feedback local y completa en CI.
- Con datos mínimos que destaquen el caso relevante.

## Mocks

Sustituye límites lentos o no deterministas —correo, pagos o APIs externas—, pero mantén pruebas de integración para el adaptador real. Si todo está simulado, la suite solo demuestra que los dobles coinciden entre sí.

## CI mínima

Ejecutar formato/lint, tipos, unitarios, build y un conjunto E2E crítico. Separa tests lentos, pero no permitas que queden permanentemente fuera del camino de publicación.

| Momento                  | Suite apropiada                                           |
| ------------------------ | --------------------------------------------------------- |
| mientras programas       | archivo o módulo afectado en watch                        |
| pre-push / PR            | unitarios, integración, tipos y smoke E2E                 |
| rama principal           | matriz completa y contratos                               |
| programada               | navegadores amplios, visual, carga y exploración asistida |
| antes de release crítico | aceptación, migración y rollback ensayados                |

## Elegir el nivel por riesgo

Si una regla puede expresarse como una función pura, pruébala con muchos casos pequeños. Si depende de SQL, serialización, cookies o encabezados, usa integración con la dependencia real en un entorno controlado. Si el riesgo está en la navegación, el streaming o la composición de varias piezas, usa pruebas de extremo a extremo (E2E). La cantidad de pruebas debe seguir el costo de una regresión, no una proporción rígida.

| Riesgo                        | Prueba recomendada         | Señal de éxito                  |
| ----------------------------- | -------------------------- | ------------------------------- |
| Precio o descuento incorrecto | unitario con límites       | total exacto y errores claros   |
| Query no autorizada           | integración con DB         | usuario ajeno recibe rechazo    |
| API consumida por otro equipo | contrato + integración     | schema y errores compatibles    |
| Compra completa               | E2E con proveedor simulado | usuario puede terminar el flujo |

## Datos, aislamiento y tiempo

Usa una base de datos efímera o un schema por suite para integración. Limpia por test o genera identificadores únicos; depender de un orden compartido crea fallos que solo aparecen en CI paralelo. Congela reloj y random cuando sean parte del resultado, pero agrega al menos un test de límites reales de zona horaria y fechas.

## Testear fallos

Incluye timeout, respuesta parcial, reintento, doble clic, sesión expirada, permiso revocado y dependencia caída. Un sistema confiable no solo devuelve el resultado feliz: conserva invariantes cuando una operación se repite o falla a mitad. Los bugs descubiertos en producción deben transformarse en una prueba de regresión antes de cerrar el incidente.

## Mantener la suite

Mide duración, flaky rate y cobertura de rutas críticas. Elimina tests duplicados cuando una prueba superior ya cubre el mismo riesgo, pero no borres un caso porque “ya pasó una vez”. Revisa cada test que falla por un cambio de texto o estructura: quizá el selector está acoplado a implementación y debe migrar a un rol o contrato más estable.

## Presupuesto de retroalimentación

Define cuánto puede tardar cada ciclo. Si la suite de PR tarda una hora, el equipo empieza a evitarla; si dura dos minutos pero omite persistencia y navegación, entrega falsa velocidad. Paraleliza después de garantizar aislamiento y mueve suites costosas a etapas posteriores solo si todavía bloquean la publicación adecuada.

Registra por test o grupo:

- duración y tendencia;
- tasa de reintentos e inestabilidad;
- último fallo real detectado;
- propietario o área;
- evidencia disponible al fallar.

## Criterio de salida

“Todos los tests pasan” es insuficiente si faltan pruebas planificadas o existe un riesgo aceptado. Un criterio de salida puede exigir: rutas críticas verdes, cero defectos bloqueantes conocidos, migración ensayada, accesibilidad automática sin violaciones nuevas y observabilidad preparada. Las excepciones deben tener responsable y vencimiento.
