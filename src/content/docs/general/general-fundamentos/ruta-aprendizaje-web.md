---
title: Empieza aquí — ruta de desarrollo web con JavaScript
description: Elegir un recorrido según tu experiencia y conectar fundamentos, implementación, pruebas y operación sin estudiar todas las herramientas a la vez.
type: guides
order: 0
tags: [learning, javascript, web, roadmap]
related:
  - languages/javascript/javascript-getting-started
  - general/typescript/typescript
  - testing/testing-fundamentos/testing-strategy
updatedAt: 2026-09-07
---

## Cómo usar esta biblioteca

Si estás empezando, sigue un recorrido y construye algo pequeño en cada etapa. Si ya programas, busca el problema concreto, revisa los requisitos y compara el resultado con la sección de comprobación. Una receta ilustra una implementación; antes de copiarla, identifica en qué entorno corre y qué piezas debes adaptar.

No necesitas aprender todos los frameworks ni servicios. Elige uno para practicar y regresa a las alternativas cuando tengas una necesidad que puedas explicar.

## Recorrido desde cero

| Etapa | Lectura inicial | Ejercicio y criterio para continuar |
| --- | --- | --- |
| 1. Entorno | [Terminal](/terminal/terminal/terminal-fundamentals-terminology) y [Node.js](/backend/node/node-primeros-pasos) | Crear una carpeta, ejecutar un archivo e interpretar un error |
| 2. Documento | [HTML](/languages/html/html) | Página con encabezados, enlaces y formulario que tenga etiquetas |
| 3. Presentación | [CSS](/languages/css/css) | Adaptar esa página a móvil sin ocultar información necesaria |
| 4. Lógica | [Primeros pasos con JavaScript](/languages/javascript/javascript-getting-started) | Leer entradas, transformar un array y actualizar texto con un evento |
| 5. Asincronía y red | [Promesas](/languages/javascript/javascript-async-promises) y [Fetch](/languages/javascript/javascript-fetch-apis) | Mostrar estados de carga, éxito, vacío y error |
| 6. Historial | [Git](/categories/git) | Guardar cambios pequeños, revisar un diff y recuperar una versión |
| 7. Contratos | [TypeScript](/general/typescript/typescript-primer-proyecto) | Distinguir un error de tipos de un dato externo inválido |
| 8. Aplicación | [Frontend](/categories/frontend) y [API con Node](/backend/node/node-rest-api-minima) | Conectar una interfaz con una API local que valide entradas |
| 9. Datos | [Fundamentos de bases de datos](/database/database-fundamentos/database-fundamentals-terminology) | Persistir datos y comprobar una restricción ante entradas duplicadas |
| 10. Calidad y entrega | [Testing](/testing/testing-fundamentos/testing-strategy) y [CI/CD](/devops/ci-cd/cicd-pipeline-fundamentals) | Reproducir el proyecto desde cero, comprobarlo y explicar cómo desplegar y volver atrás |

Integra accesibilidad y seguridad desde los primeros ejercicios. No son fases que se añaden solo al terminar.

## Proyecto conductor: una lista de tareas

Usa el mismo problema para reconocer conceptos entre categorías:

1. En HTML/CSS, crea el listado y el formulario con un botón que se pueda activar por teclado.
2. En JavaScript, añade tareas en memoria y muestra el estado vacío. Usa `textContent` para texto del usuario.
3. Con Fetch, consume la [API de tareas](/backend/node/node-rest-api-minima). Diferencia un fallo de red de un error HTTP.
4. Con TypeScript, modela la tarea y valida los datos que entran. Una anotación no impide recibir JSON incorrecto.
5. Con una base de datos, persiste la tarea. Reiniciar el proceso ya no debe borrarla.
6. Con autenticación, asigna un propietario desde la sesión del servidor. Cambiar un id en la solicitud no debe permitir editar tareas ajenas.
7. Añade una prueba de creación válida, otra de entrada inválida y otra de acceso ajeno. Documenta el resultado de las tres.

El criterio de éxito es explicar dónde vive cada responsabilidad y reproducir el resultado. Copiar un ejemplo que funciona una vez no demuestra todavía que sepas diagnosticarlo.

## Elegir la siguiente categoría

| Necesidad | Dónde continuar |
| --- | --- |
| Organizar módulos y evitar dependencias confusas | [Arquitectura](/categories/architecture) |
| Diseñar estados, formularios y componentes | [UI / UX](/categories/ui-ux) |
| Usar el sitio con teclado o lector de pantalla | [Accesibilidad](/categories/accessibility) |
| Proteger sesiones, secretos y datos | [Seguridad](/categories/security) |
| Medir carga o consultas lentas | [Rendimiento](/categories/performance) |
| Entender rastreo e indexación | [SEO](/categories/seo) |
| Elegir herramientas del entorno | [Aplicaciones](/categories/applications) |
| Encontrar material para practicar | [Cursos](/categories/courses) y [recursos](/categories/resources) |
| Estudiar proyectos reales | [Hallazgos](/categories/findings) |
| Interpretar comparaciones sin elegir solo por un ranking | [Benchmarks](/categories/benchmarks) |
| Programar una función que usa un modelo | [IA SDK](/categories/ai) |
| Trabajar con asistentes de programación | [Agentes](/categories/agents) y [IA Tools](/categories/skills) |

## Si vienes a recordar una implementación

Lee en este orden: objetivo, versión y requisitos, bloque relevante, comprobación y límites. Si un ejemplo importa un helper, abre su guía antes de inventar su comportamiento. Si dice «fragmento», intégralo en el archivo correspondiente; no lo ejecutes como un programa completo.

Mantén una pequeña nota al adaptar una receta: versión utilizada, decisión tomada y prueba que confirma el resultado. Así tu siguiente consulta recuperará también el contexto.

## Fuentes para ampliar fundamentos

- [MDN: aprender desarrollo web](https://developer.mozilla.org/en-US/docs/Learn_web_development)
- [TypeScript: documentación](https://www.typescriptlang.org/docs/)
