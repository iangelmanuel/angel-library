---
title: Plan de pruebas y calidad no funcional
description: Convertir riesgos en un plan de pruebas, distinguir smoke, regresión y aceptación, y cubrir accesibilidad, seguridad, rendimiento y resiliencia.
type: guides
order: 4
tags: [testing, quality, planning, non-functional, risk]
related:
  - testing/testing-fundamentos/testing-fundamentals-terminology
  - testing/testing-fundamentos/testing-strategy
  - testing/testing-fundamentos/testing-test-design-techniques
updatedAt: 2026-08-28
---

Un plan de pruebas no tiene que ser un documento largo. Debe hacer visibles alcance, riesgos, ambientes, datos, responsables y señales para decidir si un cambio puede publicarse.

## Plantilla mínima

| Campo               | Pregunta                                                |
| ------------------- | ------------------------------------------------------- |
| Objetivo            | ¿qué cambio o producto evaluamos?                       |
| Riesgos             | ¿qué fallos causarían daño?                             |
| Alcance             | ¿qué se prueba y qué queda fuera?                       |
| Niveles             | ¿qué se cubre en unitario, integración, contrato y E2E? |
| Ambientes           | ¿qué depende del runtime o proveedor real?              |
| Datos               | ¿cómo se crean, aíslan y eliminan?                      |
| Evidencia           | ¿qué reportes permiten diagnosticar?                    |
| Criterio de entrada | ¿qué debe estar listo para comenzar?                    |
| Criterio de salida  | ¿qué condiciones permiten publicar?                     |
| Excepciones         | ¿qué riesgo se acepta, quién y hasta cuándo?            |

El plan se actualiza al descubrir información. Si una migración o proveedor externo aparece tarde, cambia el riesgo y también la estrategia.

## Smoke, sanity, regresión y aceptación

| Suite      | Propósito                                   | Ejemplo                                  |
| ---------- | ------------------------------------------- | ---------------------------------------- |
| Smoke      | confirmar que lo esencial arranca           | home, login y health responden           |
| Sanity     | revisar el área modificada                  | cupón corregido aplica y rechaza límites |
| Regresión  | detectar comportamientos que ya funcionaban | compra, permisos y recuperación          |
| Aceptación | confirmar una necesidad acordada            | Given/When/Then del criterio de producto |

Una misma prueba puede pertenecer a varias suites mediante tags o proyectos. Evita copiar el archivo para cada nombre: clasifica la intención y controla cuándo se ejecuta.

```ts
test(
  "una persona recupera acceso con un enlace vigente",
  {
    tag: ["@smoke", "@auth"]
  },
  async ({ page }) => {
    // Flujo observable.
  }
)
```

La sintaxis exacta depende del runner. Lo importante es que la selección sea visible y que la suite crítica no se quede fuera del pipeline por accidente.

## Pruebas funcionales y no funcionales

Una prueba funcional pregunta “¿hace lo correcto?”. Una no funcional pregunta “¿con qué calidad o bajo qué condiciones?”.

| Atributo       | Señal                               | Ejemplo de presupuesto                  |
| -------------- | ----------------------------------- | --------------------------------------- |
| Rendimiento    | latencia, throughput, recursos      | p95 menor de 300 ms bajo carga acordada |
| Accesibilidad  | semántica, teclado, contraste       | recorrido crítico operable sin mouse    |
| Seguridad      | autorización, exposición, abuso     | tenant A nunca obtiene datos de B       |
| Resiliencia    | recuperación ante dependencia caída | timeout acotado y reintento idempotente |
| Compatibilidad | navegador, dispositivo, versión     | smoke en Chromium, Firefox y WebKit     |
| Usabilidad     | éxito y comprensión de tareas       | mensaje permite corregir un formulario  |

Un **SLO** (_Service Level Objective_ u objetivo de nivel de servicio) expresa una meta medible del sistema. Una prueba de carga puede verificar capacidad antes de publicar; la observabilidad confirma comportamiento bajo tráfico real.

## Rendimiento: tipos de prueba

- **load test:** comportamiento bajo carga esperada;
- **stress test:** encuentra el límite y cómo degrada;
- **spike test:** cambio repentino de tráfico;
- **soak test:** estabilidad durante un periodo prolongado;
- **scalability test:** respuesta al aumentar recursos o instancias.

Define modelo de carga, datos, calentamiento, duración y criterios. “Cien usuarios” no explica qué hacen ni con qué ritmo. Separa latencia de cliente, red, API y base para diagnosticar.

## Seguridad integrada

Incluye casos de abuso en pruebas normales:

```ts
it("impide leer el proyecto de otra organización", async () => {
  const project = await factory.project({ tenantId: tenantB.id })

  const response = await request(app)
    .get(`/projects/${project.id}`)
    .set("Authorization", await tokenFor(memberOfTenantA))

  expect(response.status).toBe(404)
})
```

Comprueba autorización por objeto, validación, rate limiting, manejo de secretos y dependencias. Escáneres estáticos y dinámicos aportan señales, pero no entienden todas las reglas de negocio.

## Accesibilidad como parte del flujo

Una suite automática detecta roles, nombres, relaciones y algunos contrastes. Añade pruebas manuales de teclado, zoom, reflow, lector de pantalla y contenido. Automatiza regresiones encontradas, pero no declares conformidad completa solo porque `axe` no encontró errores.

## Resiliencia y recuperación

Prueba qué ocurre cuando:

- una dependencia tarda más que el timeout;
- llega `429` con instrucción de reintento;
- una respuesta está truncada o no cumple schema;
- se pierde conexión después de enviar una escritura;
- dos solicitudes compiten por el mismo recurso;
- el proceso reinicia con trabajo pendiente.

La aserción debe proteger invariantes: no duplicar cobros, no perder eventos confirmados y no revelar detalles sensibles.

## Matriz de ambientes

| Ambiente             | Qué demuestra                          | Limitación                           |
| -------------------- | -------------------------------------- | ------------------------------------ |
| local                | feedback rápido                        | puede diferir de CI/producción       |
| CI efímero           | reproducibilidad e instalación limpia  | recursos limitados                   |
| preview              | integración del despliegue             | datos y proveedores simulados        |
| staging              | topología cercana a producción         | puede tener configuración divergente |
| producción sintética | disponibilidad real de una ruta segura | nunca debe modificar datos reales    |

No conviertas staging en la única prueba: su estado compartido suele ser menos determinista. Tampoco ejecutes flujos destructivos contra producción.

## Informe útil

Un resultado debe indicar versión, ambiente, datos, navegador, duración y evidencia. Clasifica defectos por impacto y reproducibilidad; distingue fallo del producto, del test y de infraestructura.

```text
Resultado: bloqueado
Riesgo: checkout duplica orden al reintentar tras timeout
Ambiente: preview / commit abc123
Evidencia: trace, request-id y filas creadas
Criterio afectado: idempotencia de pagos
```

## Lista de comprobación

- riesgos y alcance explícitos;
- nivel de prueba elegido por frontera;
- datos y ambientes controlados;
- smoke pequeño y realmente crítico;
- calidad funcional, seguridad, accesibilidad y rendimiento;
- fallos y recuperación, no solo camino feliz;
- evidencia diagnóstica y criterio de salida;
- riesgo aceptado con responsable y vencimiento.

## Referencias

- [Playwright: buenas prácticas](https://playwright.dev/docs/best-practices)
- [Playwright: pruebas de accesibilidad](https://playwright.dev/docs/accessibility-testing)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
