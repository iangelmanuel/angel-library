<div align="center">

<img src="public/angel-library.webp" alt="Portada de angel.library: el titular «Un segundo cerebro técnico, en disco.», el buscador de toda la biblioteca y las cifras del catálogo" width="880">

### Biblioteca personal de conocimiento técnico: 737 entradas en 24 categorías, publicadas como sitio estático en español

[![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![Starlight](https://img.shields.io/badge/Starlight-0.42-4F46E5?logo=astro&logoColor=white)](https://starlight.astro.build)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Licencia MIT](https://img.shields.io/badge/c%C3%B3digo-MIT-005187)](LICENSE)

[**Ver el sitio**](https://angel-library.vercel.app) &nbsp;•&nbsp;
[**Documentación**](docs/ARCHITECTURE.md) &nbsp;•&nbsp;
[**Añadir contenido**](docs/CONTENT_GUIDE.md) &nbsp;•&nbsp;
[**Sistema visual**](DESIGN.md)

</div>

---

## Qué es

**737 entradas** repartidas en **24 categorías**, publicadas como sitio estático
en español. No es un blog: cada entrada existe para que puedas recuperar algo
concreto —un comando, un patrón, una receta— sin releer un artículo entero.

- **La carpeta es la clasificación.** `frontend/astro/astro-islands.md` vive en
  la categoría Frontend, subcategoría Astro, y se publica en esa misma ruta.
  Mover el archivo lo recategoriza: no hay base de datos ni panel, y no hay
  un "tipo" editorial aparte que mantener sincronizado.
- **Tags cruzan categorías.** Cada entrada declara sus tags como metadata
  visible en la propia página; no hay una ruta `/tags` que los liste — cada
  una repetía el árbol completo del sidebar en su HTML y se comía el
  deployment storage.
- **Sidebar nativo de Starlight.** Un array estático por categoría, sin
  descubrimiento por filesystem. Cada subcategoría sigue el orden de
  aprendizaje de sus entradas (`sidebar.order`).
- **Tema claro y oscuro**, con un único botón compartido por la portada y
  la documentación.

## Stack

[Astro](https://astro.build) en modo estático con
[Starlight](https://starlight.astro.build) para la documentación,
[Pagefind](https://pagefind.app) para la búsqueda,
[Expressive Code](https://expressive-code.com) para los bloques de código y
Tailwind v4 en la portada. Sin backend y sin JavaScript de framework en cliente.

## Empezar

Requisitos: Node.js `>=22.12` y pnpm `11`.

```bash
pnpm install
pnpm dev
```

| Comando               | Qué hace                                          |
| --------------------- | ------------------------------------------------- |
| `pnpm dev`            | Servidor de desarrollo                            |
| `pnpm build`          | Sitio estático de producción (y sus validaciones) |
| `pnpm preview`        | Sirve la salida generada                          |
| `pnpm check`          | Diagnósticos de Astro y TypeScript                |
| `pnpm eslint`         | Linter                                            |
| `pnpm prettier:check` | Formato                                           |

## Añadir una entrada

Crea un `.md` dentro de `src/content/docs/<categoría>/<subcategoría>/` con su
frontmatter mínimo:

```markdown
---
title: View Transitions en Astro
description: Transiciones entre páginas sin volverse una SPA.
tags: [astro, navegación]
---
```

El menú se actualiza solo. El paso a paso completo está en
[`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

Las categorías y subcategorías viven a mano en `src/config/categories.ts` y
el menú en `src/config/sidebar.ts` — ver [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Documentación

| Documento                                        | Contenido                               |
| ------------------------------------------------ | --------------------------------------- |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)   | Cómo está montado el proyecto y por qué |
| [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) | Crear contenido, paso a paso            |
| [`DESIGN.md`](DESIGN.md)                         | El sistema visual «Tema de editor»      |
| [`CHANGELOG.md`](CHANGELOG.md)                   | Historial de versiones                  |
| [`CONTRIBUTING.md`](CONTRIBUTING.md)             | Cómo contribuir                         |

## Licencias

- Código: [MIT](LICENSE).
- Contenido educativo: [CC BY-NC-SA 4.0](LICENSE-CONTENT.md).
- Marcas y recursos de terceros: conservan la suya.

## Autor

**Angel De La Torre**

- GitHub: [@iangelmanuel](https://github.com/iangelmanuel)
- LinkedIn: [@iangelmanuel](https://www.linkedin.com/in/iangelmanuel)
- X: [@iangelmanuel](https://x.com/iangelmanuel)
- Website: [angeldm.dev](https://angel-website-pi.vercel.app)

---

<div align="center">

Si te gusta este proyecto, no olvides darle una estrella ⭐
<br />
Hecho por **Angel DM**

</div>
