# Arquitectura

El sitio usa Astro y Starlight para publicar Markdown como HTML estático. No tiene servidor de aplicación, base de datos ni una API propia. Para añadir artículos empieza por [CONTENT_GUIDE.md](CONTENT_GUIDE.md); para evaluar qué puede retirarse, consulta [COMPLEXITY_REVIEW.md](COMPLEXITY_REVIEW.md).

## Mapa de archivos

```text
src/
├─ content/docs/<categoría>/
│  ├─ _meta.json                  presentación opcional de esa categoría
│  └─ <subcategoría>/*.md         artículos
├─ content.config.ts             esquema de los artículos
├─ config/
│  ├─ catalog.ts                  descubre carpetas y lee sus metadatos
│  ├─ content-types.ts            tipos editoriales y orden de aprendizaje
│  ├─ navigation.ts               enlaces compartidos de cabecera y pie
│  ├─ sidebar.ts                  adapta el catálogo al menú de Starlight
│  ├─ site.ts                     identidad, URLs y SEO
│  └─ icons.ts                    iconos propios y excepciones
├─ lib/
│  ├─ content.ts                  cargar, filtrar, ordenar y agrupar entradas
│  ├─ validation.ts               comprobar estructura, referencias y enlaces
│  ├─ relations.ts                calcular recomendaciones de lectura
│  └─ seo.ts                      metadatos y datos estructurados
├─ pages/                        portada y listados propios
├─ components/                   componentes compartidos y overrides
├─ features/landing/             portada con su composición y estilos
├─ markdown/                     pestañas de comandos de instalación
└─ styles/                       tokens y hojas compartidas

scripts/check-catalog.mjs         comprobación aislada del catálogo
```

## 1. Carpetas primero, metadatos después

La ruta `src/content/docs/frontend/react/mi-articulo.md` determina categoría, subcategoría y URL. No existe una lista de ids que debas sincronizar con esa carpeta.

`catalog.ts` hace tres cosas:

1. Lee las carpetas de categorías y sus subcarpetas.
2. Lee `_meta.json` si existe; si no, usa valores predeterminados.
3. Devuelve las categorías ordenadas y sus subcategorías.

Exporta dos vistas del mismo resultado:

- `CATEGORY_LIST`: array ordenado para dibujar listados.
- `CATEGORIES`: objeto indexado por id para encontrar una categoría sin recorrer la lista.

`CATEGORY_IDS` y las etiquetas de recursos se derivan del mismo catálogo. No son otro registro que haya que mantener.

Los cinco bloques de navegación se definen una sola vez en `NAVIGATION_GROUPS`. Cada categoría puede elegir su `group` en su archivo local; no necesita añadirse a una lista dentro del bloque.

### Orden y valores predeterminados

Una categoría nueva usa su nombre de carpeta como etiqueta, icono `folder`, color `--accent-blue`, bloque `referencia` y orden 1000. En igualdad de orden se compara la etiqueta en español.

Las claves del objeto `subcategories` de `_meta.json` dan el orden personalizado. Después aparecen las demás carpetas, ordenadas por id. Un registro de metadatos no crea una carpeta ni una página.

Los metadatos se validan con Zod: un campo desconocido, un grupo inexistente o un JSON inválido generan un error con la ruta del archivo. Los ids de carpetas usan minúsculas, números y guiones.

### Una decisión explícita sobre los tipos

Los ids de carpetas son `string` porque se conocen al leer el disco. Sus valores se validan al construir el catálogo. Mantener una unión TypeScript de ids obligaría a volver a escribir en código cada carpeta nueva.

Los tipos editoriales sí son un conjunto cerrado: `ContentTypeId` se deriva de las claves de `CONTENT_TYPES`. Cada registro indica si participa en la ruta de aprendizaje con `learning` y, cuando corresponde, incluye su `learningOrder`. La lista de tipos de aprendizaje se deriva de ese mismo registro.

## 2. El menú y la colección tienen trabajos distintos

Astro necesita la configuración del menú antes de que esté disponible `astro:content`. Por eso `sidebar.ts` lee los títulos del frontmatter al preparar Starlight. No renderiza Markdown, no calcula relaciones y no carga el cuerpo en el navegador.

El flujo es:

```text
carpetas + _meta.json → catalog.ts → sidebar.ts → configuración de Starlight
Markdown → docsLoader + schema → content.ts → páginas y relaciones
```

El lector del menú espera `title`, `type`, `order`, `private` y `draft` en líneas simples, como muestran las plantillas. Excluye `private: true` y `draft: true`. Los tipos de aprendizaje se ordenan por `order` y después por título; los tipos informativos mantienen el orden alfabético. El esquema de Starlight valida el documento completo después.

El catálogo se lee al iniciar Astro o compilar. Reinicia `pnpm dev` tras crear, borrar o renombrar entradas/carpetas o cambiar metadatos del menú. Esto evita un watcher propio, recargas globales ocultas y otra capa de estado que mantener.

## 3. Esquema y contenido visible

`src/content.config.ts` extiende `docsSchema`. Starlight aporta título, descripción, borradores y opciones de página; la biblioteca añade tipo editorial, tags, relaciones y datos propios de cada ficha.

| Tipo           | Requisitos adicionales      |
| -------------- | --------------------------- |
| `commands`     | `command`                   |
| `resources`    | `url` y `resourceCategory`  |
| `integrations` | Al menos dos `technologies` |

`type` es opcional para las páginas virtuales de Starlight, pero obligatorio para los artículos: `getAllEntries()` lo comprueba.

`getAllEntries()` conserva la política existente: los borradores solo están disponibles en desarrollo y las entradas privadas se excluyen por defecto de listados. `private` es un filtro editorial, no autenticación; la ruta del documento sigue existiendo.

## 4. Funciones con una responsabilidad

| Archivo         | Responsabilidad                                                 | No debería encargarse de              |
| --------------- | --------------------------------------------------------------- | ------------------------------------- |
| `content.ts`    | Cargar, filtrar, ordenar, agrupar y contar                      | Dibujar HTML o registrar categorías   |
| `validation.ts` | Rechazar estructura o referencias incorrectas                   | Recomendar lecturas                   |
| `relations.ts`  | Relaciones directas, retroenlaces, recursos y afinidad por tags | Leer directorios o validar el esquema |
| `sidebar.ts`    | Preparar enlaces y grupos de Starlight                          | Crear rutas o mantener otro catálogo  |

Los conteos por categoría y la agrupación por subcategoría recorren las entradas una vez para reunir resultados. La validación global se marca como completada solo después de pasar las comprobaciones. No se añaden índices persistidos, bases de datos ni cachés de aplicación.

## 5. Rutas y componentes

Starlight genera los artículos. El proyecto añade:

| Ruta                                     | Qué muestra                     |
| ---------------------------------------- | ------------------------------- |
| `/`                                      | Portada con layout propio       |
| `/categories` y `/categories/[category]` | Categorías y sus artículos      |
| `/tipos/[type]`                          | Entradas de un tipo editorial   |
| `/tags` y `/tags/[tag]`                  | Índice y cruces por tags        |
| `/buscar`                                | Acceso al buscador de Starlight |

Los overrides de `src/components/starlight/` conservan la presentación de cabecera, menú, metadatos y lecturas relacionadas. `ThemeSelect.astro` está vacío deliberadamente: desactiva el selector en un sitio de tema oscuro único.

La portada conserva su carpeta `features/landing/` porque tiene composición y estilos propios. Moverla o fusionar sus layouts no ayuda a añadir categorías y ampliaría innecesariamente el riesgo visual.

## 6. Estilos, búsqueda y Markdown

- `tokens.css` contiene los valores visuales compartidos.
- `starlight.css` adapta esos valores al layout de documentación.
- `global.css` y los estilos de la portada cubren su composición propia.
- Starlight/Pagefind generan el buscador estático. No existe un índice de búsqueda paralelo.
- `src/markdown/package-manager.mjs` transforma instalaciones en pestañas; `public/pm-tabs.js` controla su interacción.
- `icons.ts` permite reutilizar Lucide y los logos propios. Una categoría nueva puede usar un icono existente sin registrar otro.

Estas piezas se conservan porque retirarlas cambiaría funciones o diseño.

## 7. Comprobar cambios

```bash
pnpm check:catalog
pnpm check
pnpm eslint
pnpm build
```

`check:catalog` usa Node y carpetas temporales; no incorpora un framework de tests. El flag de eliminación de tipos permite importar el módulo TypeScript con la versión mínima de Node del proyecto. Astro sigue comprobando los tipos mediante `pnpm check`.

`pnpm build` es la comprobación real de integración: genera páginas y verifica las referencias. Los detalles de alcance y la comparación antes/después de esta refactorización se documentan en [COMPLEXITY_REVIEW.md](COMPLEXITY_REVIEW.md).

Si cambias el esquema de la colección, ejecuta también `pnpm sync`. Formatea solo los archivos del cambio; no reformatees artículos como efecto secundario de una modificación interna.
