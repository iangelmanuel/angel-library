# Guía para añadir contenido

Esta guía explica el modelo editorial sin necesidad de conocer la implementación de Astro. La forma recomendada de crear una entrada es usar el generador:

```bash
pnpm content:new
```

El asistente pregunta lo obligatorio, muestra las opciones válidas y crea un borrador en la colección correcta. Para consultar todo el catálogo sin abrir el código:

```bash
pnpm content:new -- --list
```

## El modelo en cuatro conceptos

Cada entrada tiene una ubicación editorial formada por estas piezas:

1. **Tipo de contenido o colección:** indica qué clase de documento es y determina la carpeta y la URL. Ejemplos: `guides`, `commands`, `recipes`.
2. **Categoría:** indica el área principal de conocimiento. Ejemplos: `frontend`, `git`, `security`.
3. **Subcategoría o stack:** organiza una categoría en temas más pequeños y ordenados. Ejemplos dentro de `git`: `git`, `github-platform`, `repository-management`, `github-actions`.
4. **Tags:** conectan temas transversalmente. No definen la ubicación ni el orden de la entrada.

Por ejemplo:

```yaml
category: git
stack: github-actions
tags: [github, github-actions, ci-cd]
```

Esta entrada aparecerá en la categoría **Git & GitHub**, dentro de **GitHub Actions**. Su prefijo de URL dependerá de la colección donde se creó; si está en `src/content/guides/`, la URL será `/guides/<slug>/`.

## Flujo recomendado

### 1. Decide el tipo de contenido

Usa esta regla práctica:

| Tipo | Carpeta | Úsalo para | Campos propios más importantes |
| --- | --- | --- | --- |
| Tecnología | `technologies` | Fundamento de una tecnología o lenguaje | `website`, `github` |
| Librería | `libraries` | API e instalación de un paquete reutilizable | `install`, `technologies`, `website`, `github` |
| Integración | `integrations` | Cómo combinar dos o más tecnologías | `technologies` con mínimo 2 referencias |
| Receta | `recipes` | Solución completa y repetible a un problema | `problem`, `technologies` |
| Snippet | `snippets` | Fragmento corto de código | `language` |
| Hook | `hooks` | Hook reutilizable | `framework`, `language`, `parameters`, `returns` |
| Utility | `utilities` | Función auxiliar pequeña | `runtime`, `language` |
| Recurso | `resources` | Enlace externo recomendado | `url`, `resourceCategory`, `official` |
| Skill | `skills` | Flujo o capacidad de una herramienta de IA | `tool` |
| Comando | `commands` | Comando de terminal y sus riesgos | `command`, `whenToUse`, `warnings` |
| Patrón | `patterns` | Solución estructural reutilizable | `problem` |
| Buena práctica | `practices` | Regla de calidad o mantenimiento | `practice`, `why` |
| Guía | `guides` | Explicación práctica con varios pasos | `scope`, `technologies`, `libraries` |
| Truco | `tricks` | Atajo o solución puntual | `problem` |

Si la explicación enseña un proceso, normalmente es una `guide`. Si resuelve un caso concreto con una solución lista para adaptar, suele ser una `recipe`. Si solo conserva una orden de terminal, usa `commands`.

### 2. Consulta las categorías disponibles

```bash
pnpm content:new -- --list
```

El listado sale directamente de `src/config/site.ts`, así que siempre coincide con lo que entiende el sitio. Las subcategorías se muestran debajo de su categoría válida.

### 3. Genera el borrador

Ejecuta el asistente interactivo:

```bash
pnpm content:new
```

También puedes crear la entrada con un solo comando:

```bash
pnpm content:new -- \
  --type guides \
  --slug ejecutar-workflow-manualmente \
  --title "Ejecutar un workflow manualmente" \
  --description "Cómo configurar y lanzar workflow_dispatch desde GitHub." \
  --category git \
  --stack github-actions \
  --tags github,github-actions,ci-cd
```

El archivo se crea con `draft: true`. Esto permite revisarlo en desarrollo sin publicarlo en la compilación de producción.

Opciones comunes:

```text
--type                 colección
--slug                 nombre o ruta sin .md
--title                título visible
--description          resumen breve
--category             área principal
--stack                subcategoría
--order                 orden manual dentro de la subcategoría
--tags                  lista separada por comas
--related               referencias separadas por comas
--publish               crea con draft: false
--private               excluye de navegación, tags y búsqueda
--dry-run               muestra el resultado sin escribir
```

El generador valida los IDs, comprueba que la subcategoría pertenezca a la categoría, crea subcarpetas cuando hacen falta y nunca sobrescribe un archivo existente.

### 4. Completa el Markdown

El cuerpo debe explicar primero el concepto y después incluir pasos, ejemplos, resultado esperado, caso de uso y errores frecuentes cuando apliquen.

Las referencias usan siempre el formato `colección/id`:

```yaml
related:
  - guides/git/flujo-de-trabajo
  - commands/git-pull
technologies:
  - technologies/react
```

Para recursos anidados, el ID incluye las subcarpetas. No uses un nombre sin colección como `react`, porque el build lo considera ambiguo.

### 5. Revisa y publica

```bash
pnpm check
pnpm build
```

`pnpm check` valida Astro, TypeScript y el frontmatter. `pnpm build` es la comprobación definitiva: valida referencias y genera todas las páginas estáticas.

Cuando el documento esté listo, cambia:

```yaml
draft: false
```

También puedes crear una entrada publicada desde el inicio añadiendo `--publish` al generador.

## Ejemplos frecuentes

### Guía dentro de una categoría y subcategoría

```bash
pnpm content:new -- \
  --type guides \
  --slug github-actions/variables-y-secrets \
  --title "Variables y secrets en GitHub Actions" \
  --description "Cómo definir, limitar y consumir configuración segura en workflows." \
  --category git \
  --stack github-actions \
  --order 20 \
  --tags github-actions,secrets,ci-cd
```

### Contenido general sin subcategoría

Omite `--stack`. La entrada aparecerá antes de los grupos de subcategorías como contenido introductorio:

```bash
pnpm content:new -- \
  --type guides \
  --slug conceptos-de-control-de-versiones \
  --title "Conceptos de control de versiones" \
  --description "Modelo mental antes de aprender comandos de Git." \
  --category git \
  --tags git,fundamentos
```

### Recurso externo

Los recursos necesitan una segunda clasificación propia, `resourceCategory`:

```bash
pnpm content:new -- \
  --type resources \
  --slug developer-tools/github-cli \
  --title "GitHub CLI" \
  --description "Cliente oficial para trabajar con GitHub desde la terminal." \
  --category resources \
  --url https://cli.github.com/ \
  --resource-category developer-tools \
  --official \
  --tags github,cli
```

### Integración entre tecnologías

Una integración exige al menos dos referencias:

```bash
pnpm content:new -- \
  --type integrations \
  --slug astro/react \
  --title "React dentro de Astro" \
  --description "Cómo hidratar componentes React en una aplicación Astro." \
  --category frontend \
  --stack astro \
  --technologies technologies/astro,technologies/react \
  --tags astro,react,islands
```

### Comando personal

Las entradas con `private: true` conservan una URL directa, pero no aparecen en navegación, listados, tags ni búsqueda pública:

```bash
pnpm content:new -- \
  --type commands \
  --slug mi-alias-de-despliegue \
  --title "Alias personal de despliegue" \
  --description "Recordatorio del comando usado en mi entorno local." \
  --category terminal \
  --stack terminal \
  --command "mi-comando" \
  --private
```

No guardes tokens, claves ni datos reales aunque la entrada sea privada.

## Crear contenido manualmente

El generador es una ayuda, no un requisito. Para crear una entrada a mano:

1. Elige una colección de `src/content/`.
2. Crea un archivo `.md`; las subcarpetas están permitidas.
3. Copia el frontmatter de una entrada similar o consulta `src/content.config.ts`.
4. Usa una `category` declarada en `CATEGORIES`.
5. Si usas `stack`, confirma que figure dentro de `CATEGORY_STACK_ORDER[category]`.
6. Escribe referencias namespaced como `guides/mi-guia`.
7. Ejecuta `pnpm check` y `pnpm build`.

No hay que crear una ruta Astro: `src/pages/[type]/[...slug].astro` descubre la entrada automáticamente.

## Ampliar la estructura editorial

Estas tareas sí cambian el vocabulario del sitio y deben empezar en `src/config/site.ts`.

### Añadir una categoría principal

1. Añade el ID a `CATEGORY_IDS` en el orden público del catálogo.
2. Añade una entrada a `CATEGORIES` con `id`, `label`, `icon`, `description` y `color`.
3. Añade su ID al bloque apropiado de `CATEGORY_GROUPS` para decidir su posición en la navegación.
4. Si tendrá subcategorías, añade una propiedad con el mismo ID en `CATEGORY_STACK_ORDER`.
5. Si el nombre del icono es nuevo, regístralo en `src/lib/icons.ts` y `src/components/shared/DynamicIcon.tsx`.
6. Ejecuta `pnpm check` y `pnpm build`.

`CATEGORY_IDS` es explícito porque su orden forma parte de la API y no coincide con el orden visual de `CATEGORY_GROUPS`. Las categorías agrupadas por stack sí se derivan automáticamente.

### Añadir una subcategoría

1. Añade una entrada a `STACKS` con `id`, `label` e `icon`.
2. Añade ese ID, en la posición deseada, al arreglo de la categoría en `CATEGORY_STACK_ORDER`.
3. Registra el icono en los dos registros si es nuevo.
4. Ejecuta `pnpm content:new -- --list` para confirmar que aparece bajo la categoría correcta.
5. Ejecuta `pnpm check` y `pnpm build`.

`STACK_IDS` se deriva de `STACKS`; no existe una segunda lista que actualizar.

### Añadir una categoría de recurso

Añade una entrada a `RESOURCE_CATEGORIES`. `RESOURCE_CATEGORY_IDS`, el selector del generador y el agrupamiento de la página se actualizan automáticamente.

### Añadir un tipo de contenido nuevo

Esta es la ampliación menos frecuente:

1. Añade el tipo a `CONTENT_TYPES`.
2. Declara su colección y sus campos propios en `src/content.config.ts` usando `contentCollection`.
3. Añádelo al objeto exportado `collections`.
4. Amplía `AnyEntry` en `src/lib/content.ts`.
5. Si tiene campos de autoría propios, añádelos al generador `scripts/new-content.ts`.
6. Ejecuta `pnpm sync`, `pnpm check` y `pnpm build`.

Las rutas de listado y detalle se generan automáticamente a partir del tipo.

## Qué archivo modificar según el objetivo

| Objetivo | Archivo principal |
| --- | --- |
| Crear una entrada | `pnpm content:new` o `src/content/<colección>/` |
| Cambiar campos permitidos | `src/content.config.ts` |
| Añadir categoría, subcategoría u orden | `src/config/site.ts` |
| Cambiar cómo se agrupa una categoría | `src/lib/content-groups.ts` |
| Cambiar datos entregados a una página | `src/lib/page-data.ts` |
| Cambiar relaciones automáticas | `src/lib/relations.ts` |
| Añadir un icono | `src/lib/icons.ts` y `src/components/shared/DynamicIcon.tsx` |

## Errores habituales

- **La entrada no aparece en producción:** revisa si conserva `draft: true` o `private: true`.
- **La entrada no aparece bajo la subcategoría esperada:** confirma la pareja `category`/`stack` con `pnpm content:new -- --list`.
- **El build falla por una referencia:** usa `colección/id`, comprueba la colección y recuerda incluir subcarpetas en el ID.
- **El recurso no aparece en su grupo:** verifica `resourceCategory`; no es lo mismo que `category`.
- **El icono no se ve en móvil o búsqueda:** los iconos de configuración tienen un registro Astro y otro React; actualiza ambos.
- **Los tipos generados están desactualizados:** ejecuta `pnpm sync` y después `pnpm check`.
