# Revisión de complejidad interna

Revisión de la versión 0.31.0. El objetivo es reducir pasos manuales y código de coordinación, conservando el contenido y la interfaz existentes. La complejidad se valora por cuántas piezas hay que entender o sincronizar; no es una puntuación automática por líneas. Las cifras de 721 Markdown y 1.728 páginas corresponden a ese snapshot histórico; el catálogo actual tiene 726 entradas y 1.751 páginas generadas en el último build.

## Cambios aplicados

- Categorías y subcategorías descubiertas desde las carpetas, con `_meta.json` opcional y local.
- Eliminados `categories.ts`, `subcategories.ts`, `resources.ts` y `helpers.ts`: sus datos útiles están en metadatos locales o derivaciones sencillas.
- Eliminado el registro separado de prioridades editoriales: `learningOrder` vive con cada tipo.
- Menú alimentado por el catálogo, sin volver a combinar listas globales de subcategorías.
- Validaciones separadas de las relaciones recomendadas.
- Conteos y agrupaciones mediante un recorrido de entradas.
- Eliminados tipos y arrays de servicios/FAQ sin consumidores, tipos SEO sin uso, opciones JSX de React sin componentes React y la dependencia directa `@shikijs/transformers` sin imports.
- Se conservan las URLs, etiquetas, descripciones, orden visible y funciones de la interfaz. La versión de `package.json` se actualiza a 0.31.0 a petición del usuario; no se añade un indicador de versión a la página.

## Correcciones aplicadas en 0.35.0

- Los enlaces de cabecera y pie se derivan de `src/config/navigation.ts`; una
  ruta nueva se cambia en un solo lugar.
- `content.ts` separa el orden didáctico del alfabético con una función pequeña,
  y `relations.ts` crea un índice en memoria reutilizable durante el build.
- La validación reconoce las rutas reales (`/buscar`, categorías, tipos y tags)
  y acepta query strings y fragmentos sin ocultar enlaces rotos.
- El inventario conserva el snapshot de 723 entradas y las guías internas apuntan
  a `src/content/docs/`, sin introducir otro registro de contenido.

## Tabla de revisión

| Feature                              | Qué hace                                                                           | Nivel de complejidad                                 | Riesgo si se quita                                                                                          |
| ------------------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Registros paralelos de categorías    | Repetían ids, grupos, etiquetas y orden en varios lugares                          | Alta antes; eliminados                               | Bajo: ya sustituidos por carpetas y metadatos locales                                                       |
| Catálogo automático                  | Descubre carpetas, aplica valores predeterminados y valida `_meta.json`            | Media interna; baja para quien escribe               | Alto: dejarían de generarse clasificaciones y navegación coherentes                                         |
| Metadatos `_meta.json`               | Personalizan textos, icono, color y orden desde un archivo por categoría           | Baja                                                 | Medio: el sitio usaría nombres y estilos predeterminados; cambiaría la presentación actual                  |
| Tipos editoriales y esquema          | Definen qué campos tiene una guía, comando, recurso o integración                  | Media                                                | Alto: se admitirían datos incompletos y se perdería clasificación por tipo                                  |
| Validación de referencias            | Detecta relaciones y enlaces internos rotos durante el build                       | Media                                                | Alto: los errores podrían publicarse sin aviso                                                              |
| Relaciones de lectura                | Calcula enlaces directos, retroenlaces, recetas, integraciones y afinidad por tags | Media                                                | Medio: desaparecerían las recomendaciones al pie de los artículos                                           |
| Sidebar personalizada                | Agrupa categorías, conserva iconos, acordeones y controles de cierre               | Alta                                                 | Alto: cambiarían navegación, interacción y diseño                                                           |
| Lector de títulos para el menú       | Prepara los enlaces antes de cargar `astro:content`                                | Baja, con formato de título limitado                 | Alto si se elimina sin sustituto: no habría menú de artículos; usar otro generador exige comprobar el orden |
| Pestañas de gestores de paquetes     | Traduce comandos y permite elegir pnpm, Bun o npm                                  | Alta                                                 | Medio/alto: cambiarían los bloques mostrados y su interacción                                               |
| Portada separada                     | Compone estadísticas, recorridos, catálogo y secciones con layout propio           | Media                                                | Alto: fusionarla con Starlight sin adaptación cambiaría la portada                                          |
| SEO y datos estructurados            | Genera metadatos, enlaces canónicos, manifest y datos del sitio                    | Media                                                | Medio/alto: pérdida de metadatos, presentación al compartir e información de indexación                     |
| Pagefind y Starlight                 | Aportan búsqueda, renderizado de documentación y navegación base                   | Alta en la dependencia; baja en mantenimiento propio | Alto: retirar la integración exige reemplazar funciones completas                                           |
| Tokens y adaptación de estilos       | Mantienen coherencia entre portada y documentación                                 | Media                                                | Alto: alteraría directamente el diseño                                                                      |
| Iconos propios y recoloreados        | Mantienen los logos y excepciones visuales en una tabla                            | Baja/media                                           | Medio: iconos ausentes o distintos; una categoría nueva puede reutilizar Lucide                             |
| Prueba del catálogo                  | Comprueba carpetas automáticas, orden y errores de metadatos                       | Baja                                                 | Medio: se pierde una comprobación específica del flujo de autoría                                           |
| Configuración y dependencias sin uso | Añadían conceptos y paquetes sin consumidores                                      | Baja individual; acumulativa                         | Bajo: se retiraron tras revisar imports y usos                                                              |

## Añadir contenido: antes y después

| Operación                          | Antes                                                                            | Ahora                                                               |
| ---------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Artículo en subcategoría existente | Crear Markdown                                                                   | Crear Markdown                                                      |
| Subcategoría nueva                 | Crear carpeta, registrar etiqueta y ajustar otra lista de orden                  | Crear carpeta y Markdown; personalización opcional en `_meta.json`  |
| Categoría nueva                    | Crear carpeta, declarar metadatos, añadirla a un grupo y registrar subcategorías | Crear carpeta y Markdown; un archivo opcional reúne la presentación |
| Renombrar una etiqueta             | Buscar el registro global correspondiente                                        | Modificar `label` junto a la categoría                              |
| Ajustar prioridad editorial        | Cambiar una lista en otro módulo                                                 | Modificar `learningOrder` en el propio tipo                         |

Reiniciar `pnpm dev` tras cambios estructurales es explícito. Se evita añadir un sistema de watchers y cachés para ocultar ese paso; el build siempre vuelve a descubrir las carpetas.

## Comprobaciones y límites

La referencia anterior a esta refactorización incluye hashes de 721 Markdown, las hojas de estilo, los archivos públicos y 1.728 páginas generadas. La comparación de catálogo y menú comprueba etiquetas, descripciones y orden existentes.

Resultado final: las 1.728 páginas HTML son idénticas a la referencia; los 721 Markdown, las siete hojas de estilo y los archivos públicos conservan sus hashes. Pasan `pnpm check`, `pnpm check:catalog`, `pnpm eslint` y `pnpm build`. La comprobación global de Prettier todavía detecta archivos con formato pendiente.

La nueva prueba automatizada cubre creación de categorías y subcategorías sin registro, metadatos opcionales, orden, errores JSON, campos desconocidos, nombres inválidos y etiquetas duplicadas. No ejecuta los ejemplos de los artículos.

Los metadatos de carpetas son dinámicos: un error semántico como escribir `recat` en lugar de `react` crea una carpeta diferente y válida. El sistema comprueba formato, no adivina la intención editorial. Revisa las URLs antes de publicar.

La lectura del menú conserva títulos de frontmatter en una sola línea. Si se quiere soportar YAML multilínea, debe sustituirse ese lector por un parser completo y comprobar que no cambien los títulos actuales.

No se retiran funciones visibles para reducir líneas de código. La tabla identifica el coste de mantenerlas y el efecto de una futura decisión de producto.
