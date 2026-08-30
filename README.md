# angel.library

`angel.library` es un segundo cerebro técnico para desarrolladores: una biblioteca personal para aprender desde cero, recordar conceptos rápidamente y reutilizar soluciones en proyectos reales.

El sitio está construido con Astro y organiza el conocimiento por contexto, no como una colección plana de enlaces:

- General: HTML moderno, CSS avanzado y JavaScript.
- Frontend: Astro, React y Next.js.
- Backend: Node.js, Express y APIs.
- Bases de datos, arquitectura, DevOps, Git & GitHub, terminal, seguridad, performance, accesibilidad, testing, UI/UX, SEO, IA, herramientas y recursos.

## Desarrollo local

Requisitos: Node.js `22.12.0` o superior y pnpm `11`.

```bash
pnpm install
pnpm dev
```

Comandos útiles:

```bash
pnpm check             # valida Astro, TypeScript y Content Collections
pnpm build             # genera el sitio estático de producción
pnpm preview           # sirve la salida generada localmente
```

El contenido vive en `src/content/`. La navegación, categorías, iconos y orden editorial se centralizan en `src/config/site.ts`. El sitio genera las rutas y los índices automáticamente.

Para añadir una entrada basta con crear un `.md` en `src/content/<colección>/`. La [guía para añadir contenido](docs/CONTENT_GUIDE.md) explica el frontmatter de cada colección, cómo relacionar entradas y cómo ampliar la estructura editorial. La [documentación de arquitectura](docs/ARCHITECTURE.md) describe el flujo interno.

## Convenciones rápidas

- Escribe en español latinoamericano claro.
- Explica primero el concepto y después muestra código, salida esperada y caso de uso.
- Usa nombres de archivo descriptivos y tags consistentes.
- Coloca fundamentos antes de integraciones y recetas completas.
- No guardes secretos, tokens ni datos reales en el repositorio.
- Usa bloques de instalación que puedan mostrarse con tabs para npm, pnpm y Bun.

## Licencias

- Código de la aplicación: [MIT](LICENSE).
- Contenido educativo propio: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).
- Dependencias, marcas y recursos externos: conservan sus propias licencias.

Consulta también [CONTRIBUTING.md](CONTRIBUTING.md) y [SECURITY.md](SECURITY.md).

## Estado del proyecto

Proyecto personal en evolución. La versión actual es `0.1.0`. Las mejoras de contenido y estructura se registran en [CHANGELOG.md](CHANGELOG.md).
