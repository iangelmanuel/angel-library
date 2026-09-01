# Contribuir a angel.library

Las contribuciones deben conservar el objetivo del proyecto: ser una referencia clara para quien aprende y una consulta rápida para quien ya conoce el tema.

## Antes de abrir un cambio

1. Revisa si ya existe una guía, librería, snippet o receta sobre el tema.
2. Evita duplicar contenido: enlaza la explicación base y documenta solo la parte específica.
3. Comprueba que la categoría y subcategoría sean semánticamente correctas.
4. Usa español latinoamericano y explica acrónimos la primera vez que aparezcan.

## Documentación

Una entrada debe incluir título, descripción, `type`, tags y, cuando corresponda, `order` y relaciones. La categoría y la subcategoría salen de la carpeta en la que la coloques. La explicación ideal contiene:

- definición breve;
- cuándo usarlo y cuándo evitarlo;
- ejemplo ejecutable o fácilmente adaptable;
- resultado esperado o explicación del código;
- caso de uso y errores frecuentes.

Los bloques de instalación deben escribirse una sola vez con npm, pnpm o Bun para que el sitio pueda generar las pestañas automáticamente.

Para crear una entrada, copia el frontmatter de una similar y colócala en `src/content/<categoría>/<subcategoría>/`. Los ids válidos de categoría, subcategoría y categoría de recurso están en `src/config/site.ts`, y `pnpm build` falla indicando cuál no existe.

Consulta la [guía de contenido](docs/CONTENT_GUIDE.md) para crear o modificar categorías, subcategorías, módulos y secciones.

## Validación local

```bash
pnpm check
pnpm build
```

Un Pull Request debe describir qué cambió, por qué corresponde a esa ubicación y qué comandos de validación se ejecutaron.

## Licencia

Al contribuir, aceptas que el código aportado quede bajo [MIT](LICENSE) y que el contenido educativo aportado quede bajo [CC BY-NC-SA 4.0](LICENSE-CONTENT.md), salvo que se indique explícitamente lo contrario antes de integrar el cambio.
