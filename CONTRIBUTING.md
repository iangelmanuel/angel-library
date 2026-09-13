# Contribuir a angel.library

Las contribuciones deben conservar el objetivo del proyecto: ser una referencia clara para quien aprende y una consulta rápida para quien ya conoce el tema.

## Antes de abrir un cambio

1. Revisa si ya existe una guía, librería, snippet o receta sobre el tema.
2. Evita duplicar contenido: enlaza la explicación base y documenta solo la parte específica.
3. Comprueba que la categoría y subcategoría sean semánticamente correctas.
4. Usa español latinoamericano y explica acrónimos la primera vez que aparezcan.

## Documentación

Una entrada debe incluir título, descripción y tags. La categoría y la subcategoría salen de la carpeta en la que la coloques. La explicación ideal contiene:

- definición breve;
- cuándo usarlo y cuándo evitarlo;
- ejemplo ejecutable o fácilmente adaptable;
- resultado esperado o explicación del código;
- caso de uso y errores frecuentes.

Los bloques de instalación deben escribirse una sola vez con npm, pnpm o Bun para que el sitio pueda generar las pestañas automáticamente.

Para crear una entrada, copia el frontmatter de una similar y colócala en `src/content/docs/<categoría>/<subcategoría>/`. Si la categoría o subcategoría es nueva, agrégala primero a `src/config/categories.ts` y `src/config/sidebar.ts`. Lee `src/content.config.ts` para conocer los campos disponibles.

Usa las plantillas y los criterios editoriales de [CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md). Una receta que depende de otra guía debe enlazar sus requisitos antes del primer bloque. Indica si el código es completo o un fragmento, dónde se ejecuta y cómo reconocer que funcionó. Las fuentes oficiales y la versión de las APIs forman parte de la explicación cuando condicionan el ejemplo.

Consulta la [guía de contenido](docs/CONTENT_GUIDE.md) para crear o modificar categorías, subcategorías, módulos y secciones.

## Validación local

Reinicia el servidor de desarrollo después de cambios estructurales o en `categories.ts`/`sidebar.ts`.

```bash
pnpm check
pnpm build
```

Un Pull Request debe describir qué cambió, por qué corresponde a esa ubicación y qué comandos de validación se ejecutaron.

## Licencia

Al contribuir, aceptas que el código aportado quede bajo [MIT](LICENSE) y que el contenido educativo aportado quede bajo [CC BY-NC-SA 4.0](LICENSE-CONTENT.md), salvo que se indique explícitamente lo contrario antes de integrar el cambio.
