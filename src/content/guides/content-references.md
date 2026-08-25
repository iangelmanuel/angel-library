---
title: Referencias entre contenidos
description: Convención para enlazar entradas, elegir relaciones útiles y evitar duplicación entre tecnologías, integraciones y recetas.
category: tools
stack: tools-documentacion
order: 3
technologies: []
libraries: []
related:
  - technologies/react
  - libraries/zod
updatedAt: 2026-08-25
---

## Convención

Usa siempre `colección/id`:

```yaml
related:
  - technologies/react
  - libraries/zod
  - recipes/react-hook-form-zod
```

Esto evita ambigüedades si en el futuro existen entradas con el mismo slug en colecciones diferentes.

## Qué relación añadir

Un enlace relacionado debe responder al menos una función:

- prerrequisito para comprender;
- siguiente nivel de aprendizaje;
- alternativa que ayuda a decidir;
- receta que aplica el concepto;
- referencia principal de una integración.

Evita listas de diez enlaces sin explicar dirección. Dentro del texto, enlaza en la frase donde aparece la necesidad.

## Regla

Una integración debe enlazar a sus miembros y explicar solamente lo específico de la combinación. La documentación común permanece en la entrada principal de cada tecnología o librería.

```text
tecnología → capacidades nativas
librería → API y límites propios
integración → configuración entre ambas
receta → implementación completa para un objetivo
```

Si dos páginas repiten el mismo bloque, elige una fuente principal y resume la diferencia en la otra. Al mover contenido, actualiza enlaces entrantes y conserva el slug o una redirección cuando ya se compartió públicamente.

## Validación

Comprueba que el target exista, que el texto del enlace describa el destino y que la relación siga siendo correcta tras cambios de versión. Un enlace sin contexto ayuda al crawler, pero no necesariamente a la persona.
