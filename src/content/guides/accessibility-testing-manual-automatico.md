---
title: Pruebas de accesibilidad manuales y automáticas
description: Combinar teclado, zoom, lectores de pantalla, árbol accesible, axe y pruebas de componentes sin confiar en una sola herramienta.
category: accessibility
stack: a11y-testing
order: 1
tags: [accessibility, testing, keyboard, screen-reader, axe]
related:
  - practices/accessibility-checklist
  - guides/accessibility-semantics-keyboard-focus
  - guides/testing-e2e-reliable-ci
updatedAt: 2026-08-19
---

Las pruebas automáticas detectan patrones conocidos —por ejemplo, un `label` ausente o contraste calculable—, pero no pueden decidir si el texto alternativo comunica el propósito ni si el orden de foco tiene sentido. La estrategia debe combinar métodos.

## Recorrido manual mínimo

1. Navega solo con `Tab`, `Shift+Tab`, Enter, Space y flechas cuando corresponda.
2. Comprueba que el foco sea visible, siga el orden visual y no quede atrapado.
3. Activa zoom de 200 % y 400 %; busca recortes y pérdida de funciones.
4. Revisa modo oscuro, alto contraste y movimiento reducido.
5. Completa formularios con errores y confirma que se anuncien.
6. Prueba al menos un lector de pantalla en los flujos críticos.

No uses el lector de pantalla solo para “leer toda la página”. Navega por encabezados, landmarks, controles, formularios y tablas como lo haría una persona experta.

## Auditoría automática

```ts
import AxeBuilder from '@axe-core/playwright';

test('checkout sin violaciones detectables', async ({ page }) => {
  await page.goto('/checkout');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Ejecuta auditorías sobre estados reales: diálogo abierto, error de formulario, menú móvil y contenido cargado. Una página inicial limpia no cubre interacciones posteriores.

## Pruebas por rol

```tsx
expect(screen.getByRole('button', { name: /guardar/i })).toBeEnabled();
```

Buscar por rol y nombre accesible se aproxima a cómo las tecnologías asistivas encuentran el control y evita selectores basados en clases. Aun así, una prueba puede aprobar con una experiencia confusa; revisa el flujo completo.

## Criterio de salida

Define qué combinaciones de navegador y tecnología asistiva soporta el producto, qué severidades bloquean despliegue y cómo se registra una excepción. Incluye personas con discapacidad en investigación y pruebas cuando el alcance lo permita.

## Referencias

- [W3C WAI: evaluación de accesibilidad](https://www.w3.org/WAI/test-evaluate/)
- [Testing Library: prioridad de queries](https://testing-library.com/docs/queries/about/#priority)

