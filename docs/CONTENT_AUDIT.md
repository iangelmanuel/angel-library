# Auditoría de contenido — 7 de septiembre de 2026

## Conclusión editorial

La biblioteca tiene una cobertura amplia y varios recorridos sólidos, especialmente en JavaScript, React, bases de datos y testing. Su principal debilidad no es la cantidad de temas: es la distancia entre una explicación conceptual, un fragmento de referencia y una receta que promete funcionar de principio a fin.

Para principiantes faltaban un punto de entrada transversal, requisitos explícitos y criterios para comprobar resultados. Para lectores experimentados, los mayores riesgos eran ejemplos con contratos incorrectos, configuración de versiones mezcladas e imports que no coincidían con los archivos mostrados. La estructura repetida ayuda solo si el código y las explicaciones cumplen lo que prometen.

## Alcance y evidencia

- Este documento conserva la fotografía editorial de la auditoría del 7 de septiembre: partía de 718 Markdown y terminó con 721. El catálogo actual tiene **736 entradas**, **24 categorías** y **170 subcategorías**; las cifras históricas que aparecen en los resultados no describen el estado actual.
- Inventario estructural de **721 Markdown del snapshot auditado**, en **23 categorías**. Se añadieron tres guías en esa revisión.
- Lectura editorial de páginas representativas y revisión técnica priorizada de autenticación, HTTP, utilidades, React, Prisma, configuración, terminal y recetas de infraestructura. El inventario por archivo está en [content-inventory.json](content-inventory.json).
- Correcciones apoyadas en documentación primaria de Node.js, MDN, TypeScript, React, Prisma, Astro, Better Auth, Auth.js, GitHub, Docker y daisyUI, enlazada en las entradas correspondientes.
- Ejecución de casos de los dos servidores Node, Fetch y promesas; comprobación estricta de tipos de esos bloques, utilidades de formularios y el laboratorio TypeScript.
- Pruebas con React 19.2.8 y JSDOM 26.1.0 de tres Hooks: SSR/hidratación, almacenamiento y suscripciones. No equivalen a una prueba visual en todos los navegadores.
- Prisma 7.10.0: validación del esquema, generación del cliente y tipos estrictos de configuración, cliente, consultas, servicio, demo, servidor Express y repository. Sin conexión a PostgreSQL ni ejecución de migraciones.
- Comprobación de integridad global mediante `pnpm check` y `pnpm build`.

Actualización del 9 de septiembre: las 40 entradas de tipo `libraries` se
consolidaron en `packages`, con una subcategoría por paquete y etiquetas que
indican su ecosistema. Los frameworks, incluido Express, se conservaron en sus
categorías tecnológicas; las referencias internas se trasladaron a las nuevas
rutas.

Última validación de aquel snapshot: `pnpm check` revisó 58 archivos sin errores, advertencias ni sugerencias de diagnóstico. `pnpm build` terminó correctamente con **1.728 páginas**, índice de búsqueda y sitemap. La validación actual debe ejecutarse con los comandos de [ARCHITECTURE.md](ARCHITECTURE.md), porque el catálogo ya cambió.

**El inventario abarca todos los archivos, pero no equivale a una certificación técnica individual de las 721 entradas.** No se ejecutaron todas las integraciones con bases de datos, proveedores OAuth, servicios externos o herramientas de terceros. Tampoco se validaron exhaustivamente todos los enlaces externos ni todas las versiones de los productos catalogados. Los cambios de autenticación tienen revisión de código y fuentes; aún necesitan pruebas integradas en aplicaciones con su base de datos y credenciales de prueba.

## Criterios empleados

| Dimensión                | Qué se busca                                                     | Qué no demuestra calidad por sí solo                      |
| ------------------------ | ---------------------------------------------------------------- | --------------------------------------------------------- |
| Claridad                 | Definición, propósito, términos explicados y secuencia legible   | Una introducción larga                                    |
| Accesibilidad pedagógica | Requisitos, entorno, pasos y resultado observable                | Añadir «para principiantes» al título                     |
| Utilidad de consulta     | Contrato, ejemplo localizado y límites fáciles de encontrar      | Muchas tablas sin decisiones                              |
| Exactitud                | APIs coherentes, manejo de errores y versiones compatibles       | Que Astro renderice el bloque                             |
| Completitud              | Cumplir el objetivo declarado o enlazar la preparación necesaria | Cubrir todos los temas posibles en una página             |
| Continuidad              | Relaciones y siguientes pasos sin duplicar explicaciones         | Repetir exactamente la misma plantilla en todos los tipos |

## Hallazgos y correcciones aplicadas

| Prioridad | Hallazgo                                                                                                                | Cambio                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Alta      | Auth.js copiaba un rol enviado por el cliente al JWT durante `update`                                                   | El servidor consulta el rol persistido; se explica la revocación y se añade una comprobación de abuso       |
| Alta      | Campos adicionales de rol en Better Auth aceptaban entrada                                                              | `input: false` en Astro, Express y Next.js; explicación uniforme de autoridad del servidor                  |
| Alta      | El servidor Node lanzaba `JSON.parse` dentro de un evento sin rechazar correctamente                                    | Captura local, errores diferenciados y prueba que confirma que el proceso sigue vivo                        |
| Alta      | `PUT` copiaba el cuerpo completo a la tarea                                                                             | Validación de campos permitidos y reemplazo explícito sin modificar el identificador                        |
| Alta      | El servidor de estáticos comprobaba solo un prefijo de texto                                                            | Frontera con `path.relative`, resolución de enlaces simbólicos y explicación de los límites del laboratorio |
| Alta      | Formulario confundía cantidad de archivos con tamaño en bytes                                                           | Validación por `archivo.size`; contrato de valores repetidos y manejo de archivos vacíos                    |
| Alta      | Ejemplos Prisma contaban e insertaban bajo aislamiento predeterminado, con riesgo de superar el límite concurrentemente | Servicio compartido con aislamiento serializable y reintentos acotados de P2034                             |
| Alta      | Express pasaba el cuerpo HTTP completo a Prisma                                                                         | Se retiró la escritura indiscriminada; se explicitan validación, identidad y campos editables               |
| Media     | Prisma instalaba una versión actual con configuración antigua y campos ausentes                                         | Base Prisma 7 con adapter, esquema completo y generación explícita; integración propia por framework        |
| Media     | Hooks leían valores del navegador durante la primera hidratación                                                        | Snapshots coherentes para localStorage y matchMedia; sincronización y validación de almacenamiento          |
| Media     | Ref vacío terminaba registrando eventos en window                                                                       | Se distingue target ausente de ref todavía vacío; prueba de regresión                                       |
| Media     | useEffect confundía dependencias omitidas con bucles, y useOptimistic omitía feedback                                   | Diagnóstico preciso, limpieza y estados de error/pendiente                                                  |
| Media     | Better Auth intentaba aplicar migraciones de Prisma con su propia CLI                                                   | Separación de generación del esquema, migración Prisma y generación del cliente                             |
| Media     | Receta Auth.js exportaba GET/POST desde un módulo que exporta `handlers`                                                | Exportación correcta, comprobación de sesión en servidor y logout explícito                                 |
| Media     | Receta Astro mezclaba Actions incompletas, rutas e imports distintos                                                    | Flujo de registro/login/logout con cliente, `App.Locals`, feedback y requisitos de SSR                      |
| Media     | Fetch reemplazaba señales externas y el helper repetía todos los errores                                                | Composición de señales, contrato `unknown` y política explícita de reintentos                               |
| Media     | Lotes de tamaño cero podían no terminar                                                                                 | Validación de entero positivo; limpieza del listener de espera cancelable                                   |
| Media     | Guía de API protegida presentaba un orden universal de costo y devolvía todo el usuario                                 | Explicación del parser/límites y selección de campos de respuesta                                           |
| Media     | Registro manual aceptaba datos sin validar y confundía JWT con token de un solo uso                                     | Validación, secreto requerido y límites de revocación/recuperación explícitos                               |
| Media     | Docker simplificaba incorrectamente la vida de volúmenes anónimos                                                       | Distinción entre conservar un volumen y reutilizarlo; prueba de persistencia y puerto local                 |
| Media     | Terminal proponía terminar procesos por defecto de forma forzada                                                        | Identificación previa, cierre normal, filtro exacto de listeners y comprobación posterior                   |
| Media     | daisyUI mezclaba configuración Tailwind 3 y 4                                                                           | Receta daisyUI 5/Tailwind 4 con ejemplo, resultado y límites                                                |
| Media     | Flowbite asumía una URL pública `node_modules/`                                                                         | Import del bundler y separación explícita de la variante Tailwind 3                                         |
| Media     | Workflow anunciaba paralelismo y artefactos inexistentes                                                                | Descripción fiel a pasos secuenciales; requisitos de scripts y comprobación del fallo                       |
| Editorial | Utilidades alternaban `lib`, `libs` e imports obligatorios sin explicar alias                                           | Nombres coherentes y advertencia concreta sobre configurar el alias                                         |
| Editorial | Dieciséis entradas carecían de tags                                                                                     | Tags añadidos a principios de arquitectura y utilidades                                                     |
| Editorial | Autoría apuntaba a la estructura anterior                                                                               | Ruta `src/content/docs`, configuración real y contrato editorial documentados                               |
| Editorial | Ficha de LLMs usaba estrellas como dato estático y afirmaciones imprecisas de licencia                                  | Se retiró el contador y se enlazó el archivo de licencia                                                    |

## Evaluación por categoría

La cantidad corresponde al inventario final. Las observaciones combinan estructura global y lectura representativa; las líneas de mantenimiento no deben confundirse con fallos confirmados en todas sus entradas.

| Categoría      | Entradas | Diagnóstico y criterio de continuidad                                                                                                                                                   |
| -------------- | -------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| General        |       31 | Se añadió «Empieza aquí», laboratorio TS y contratos más precisos de utilidades. Mantener una sola ruta de helpers por ejemplo                                                          |
| Lenguajes      |       51 | Buen mapa de JavaScript y APIs. Preservar fundamentos y ejemplos con salida; se corrigió la composición de señales en Fetch                                                             |
| Frontend       |       97 | Correcciones de hidratación, suscripciones, efectos y Actions en React. Tres Hooks tienen pruebas ejecutables; las demás recetas conservan comprobaciones manuales                      |
| Backend        |       81 | Mayor concentración de correcciones técnicas. Las recetas deben declarar servidor, base de datos, esquema y piezas importadas antes de prometer un flujo completo                       |
| Bases de datos |       18 | Nueva subcategoría Prisma ORM: preparación compartida, consultas y concurrencia. Las integraciones de Astro, Express y Next.js enlazan esta base                                        |
| Testing        |       22 | Estrategia, técnicas y herramientas bien separadas. El build del sitio se distingue ahora de ejecutar los ejemplos documentados                                                         |
| DevOps         |       34 | Recetas útiles de Docker, CI y operación. Se aclaró persistencia; mantener shell, versión y comprobación de estado en los comandos                                                      |
| UI / UX        |       36 | Fundamentos e interacción conviven con fichas de librerías muy breves. Se corrigieron daisyUI y Flowbite; conservar criterios de selección y comprobar interacción además de apariencia |
| Agentes        |       34 | Buen marco de contexto y permisos. Las fichas de configuración requieren vigencia por producto; no asumir equivalencia entre CLI, editor y aplicación                                   |
| IA Tools       |       50 | El mapa de skills, plugins y MCP orienta bien. Mantener fuente, alcance, permisos y forma de comprobar cada instalación                                                                 |
| IA SDK         |       10 | Distingue red, estado, evaluación y operación. Los ejemplos de proveedores deben contrastarse con versiones reales y probar formatos/errores                                            |
| Git            |       45 | Cobertura extensa del flujo. Se corrigió el workflow Node; cada comando que cambia historial debe explicar estado previo y efecto                                                       |
| Terminal       |       31 | Buen soporte de sistemas distintos. Se corrigió liberación de puertos; identificar claramente Bash, PowerShell y comandos externos                                                      |
| Arquitectura   |       28 | Ejemplos y criterios de elección; se completaron tags. Mantener consecuencias y cuándo evitar cada patrón, sin convertir preferencias en reglas universales                             |
| Seguridad      |       11 | Distingue autenticación, autorización, sesiones y recuperación. Las recetas de implementación deben aplicar esas mismas reglas; se corrigieron contradicciones en backend               |
| Rendimiento    |        8 | Enfoque de medición antes de optimización. Se distinguieron respuestas HTTP y políticas alternativas de caché                                                                           |
| Accesibilidad  |        9 | Cubre teclado, foco, formularios y pruebas manuales. Mantener la distinción entre atributos ARIA y comportamiento completo                                                              |
| SEO            |        9 | Explica correctamente rastreo, indexación y controles separados. Preservar fuentes oficiales y no presentar robots/noindex como privacidad                                              |
| Aplicaciones   |       26 | Inventario útil para el entorno de trabajo. Instalación y características necesitan fecha/versión; no todos los programas requieren una receta extensa                                  |
| Cursos         |       21 | Fichas orientadas al aprendizaje. Priorizar requisitos, idioma, práctica y resultado; planes y acceso se comprueban con el proveedor                                                    |
| Hallazgos      |       17 | Buen espacio para proyectos externos. Se corrigió la ficha de LLMs; popularidad y licencia requieren precisión                                                                          |
| Benchmarks     |        9 | Separa carga medida y límites de interpretación. Conservar fecha, hardware, versión y metodología antes de comparar resultados                                                          |
| Recursos       |       43 | Una ficha breve puede cumplir su propósito. Debe explicar la tarea que facilita y enlazar una guía práctica cuando exista                                                               |

## Uniformidad implementada

La [guía de autoría](CONTENT_GUIDE.md) establece secuencias diferentes por tipo. Las guías prácticas revisadas incorporan requisitos, implementación y comprobación; los recursos conservan un formato breve. Se evita inflar las fichas con secciones repetidas que no aportan información.

La nueva ruta `general/general-fundamentos/ruta-aprendizaje-web` conecta las categorías mediante una aplicación de tareas. El laboratorio `general/typescript/typescript-primer-proyecto` cubre el puente entre saber qué es TypeScript y poder comprobar un programa con datos externos.

No se renombraron URLs existentes ni encabezados de forma masiva: podrían romper enlaces y referencias a fragmentos. Tampoco se actualizaron todas las fechas por cambios mecánicos de tags o imports.

## Comprobaciones disponibles y evidencia histórica

Los laboratorios descritos en este informe se ejecutaron durante la auditoría editorial. Sus scripts auxiliares no forman parte del repositorio actual; los resultados anteriores son evidencia histórica y no una batería de pruebas reproducible con los archivos publicados.

Para comprobar la estructura actual del catálogo, los tipos y la integridad del sitio:

```bash
pnpm check:catalog
pnpm check
pnpm build
```

Estos comandos no ejecutan los ejemplos de los artículos. El inventario tampoco asigna una nota automática: encontrar una sección de comprobación o una URL no demuestra que el ejemplo funcione o que la fuente siga vigente.

Los laboratorios históricos de React verificaron `useLocalStorage`, `useMediaQuery` y `useEventListener`, incluidos sus tipos. El laboratorio Prisma generó los tipos del esquema para revisar consultas; no probó persistencia, autorización ni aislamiento contra una base de datos. Los ejemplos de `useActionState` y `useOptimistic` recibieron revisión de código, sin pruebas automatizadas de envío.

## Límites y mantenimiento pendiente

1. Ejecutar integraciones completas de autenticación en proyectos de prueba con versiones fijadas, base de datos aislada y casos de revocación, CSRF y permisos. La revisión de fuentes no sustituye ese ejercicio.
2. Ampliar la verificación ejecutable a más recetas: priorizar CRUD con persistencia, uploads, paginación y caché. Mantener el código en Markdown como fuente para evitar tests que prueben otra implementación.
3. Revisar los indicadores del inventario por tipo, empezando por recetas que no dicen cómo ejecutarse o comprobarse. No añadir texto genérico para hacer desaparecer indicadores.
4. Revisar periódicamente fuentes de productos, SDK, agentes, cursos y recursos. No se puede prometer vigencia indefinida de una «guía definitiva».

Durante la validación aparecieron advertencias de infraestructura sobre configuración Markdown obsoleta, `@theme` y la colección i18n/entrada 404. El build finalizó; esas advertencias no son fallos de los ejemplos y requieren una revisión separada de la integración Astro/Starlight.
