---
title: Cómo elegir una biblioteca de UI
description: Comparar componentes headless, kits visuales y bloques copiables por accesibilidad, control, mantenimiento y costo de migración.
category: ui-ux
stack: ui-ux-design-systems
order: 3
tags: [ui, libraries, design-system, accessibility, evaluation]
related:
  - guides/ui-ux-design-systems
  - guides/ui-ux-component-anatomy
  - guides/resources-evaluation-guide
updatedAt: 2026-08-25
---

Una biblioteca UI puede aportar comportamiento accesible, estilos, tokens o bloques completos. Antes de comparar popularidad, identifica qué capa necesitas.

## Tipos

| Tipo | Aporta | Costo habitual |
| --- | --- | --- |
| headless/primitives | comportamiento y accesibilidad | diseñar apariencia |
| kit completo | componentes, tema y patrones | adaptar identidad y overrides |
| bloques copiables | propiedad del código | mantenimiento propio |
| CSS framework | utilidades o clases visuales | comportamiento complejo aparte |

## Matriz de decisión

Evalúa con un componente difícil, no con un botón:

- navegación por teclado y lector de pantalla;
- focus management en diálogo/menú;
- theming, dark mode y contraste;
- SSR/hidratación y tamaño cliente;
- formularios, validación y estados;
- TypeScript y composición;
- frecuencia de releases y política de breaking changes;
- licencia y posibilidad de salida.

```text
caso piloto: combobox con búsqueda
  → 500 opciones
  → teclado completo
  → error y loading
  → mobile + zoom 200 %
  → tema del producto
```

## No mezclar sin estrategia

Dos kits completos pueden traer resets, tokens, portales y modelos de estilo incompatibles. Si se combinan, define una capa interna que normalice componentes y evita que cada feature importe proveedores directamente.

## Adaptador de UI

```tsx
export function PrimaryButton(props: ButtonProps) {
  return <VendorButton variant="solid" color="brand" {...props} />;
}
```

No envuelvas cada componente por reflejo. Crea adaptadores donde el producto impone nombre, comportamiento o estilo estable. Una abstracción que solo reenvía todas las props añade trabajo sin aislar nada.

## Para aprender

Construye primero un componente nativo simple y luego compara qué resuelve la biblioteca: roles, teclado, estado, portal, posicionamiento y animación. Así puedes revisar el resultado en vez de confiar en la etiqueta “accesible”.

## Para recordar

Necesidad → tipo de biblioteca → piloto complejo → accesibilidad → integración → mantenimiento → salida. La mejor opción es la que reduce riesgo del producto, no la que tiene más componentes.

