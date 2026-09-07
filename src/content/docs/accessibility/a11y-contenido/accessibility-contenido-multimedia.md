---
title: Contenido accesible — encabezados, imágenes, tablas y multimedia
description: Hacer que el contenido conserve significado con lectores de pantalla, zoom, audio desactivado y formatos alternativos.
type: guides
order: 1
tags: [accessibility, content, alt-text, tables, captions]
related:
  - accessibility/a11y-fundamentos/accessibility-fundamentals-terminology
  - accessibility/a11y-contenido/accessibility-visual-reflow-motion
  - accessibility/a11y-testing/accessibility-checklist
updatedAt: 2026-08-25
---

El contenido accesible comunica la misma intención aunque cambie el canal. No consiste en describir cada píxel, sino en conservar información, estructura y acción.

## Encabezados y lenguaje

Usa un `h1` que identifique la página y niveles que representen secciones. No saltes niveles por tamaño visual; cambia el estilo con CSS. Los párrafos cortos, términos explicados y enlaces descriptivos reducen carga cognitiva.

```html
<h2>Configurar el proyecto</h2>
<h3>Variables de entorno</h3>
```

Define el idioma del documento y de fragmentos que cambian de lengua:

```html
<html lang="es">
  <p>La propiedad <span lang="en">stale-while-revalidate</span>...</p>
</html>
```

## Texto alternativo

La decisión depende del propósito:

| Imagen           | Tratamiento                                   |
| ---------------- | --------------------------------------------- |
| Decorativa       | `alt=""` para ignorarla                       |
| Informativa      | Describe la información relevante en contexto |
| Enlace o botón   | Describe la acción o destino, no “imagen de”  |
| Gráfico complejo | Resumen corto y explicación o datos cercanos  |

No repitas un pie de foto idéntico en `alt`. Si una captura enseña varios pasos, el procedimiento debe existir también como texto.

## Tablas de datos

```html
<table>
  <caption>
    Resultados por trimestre
  </caption>
  <thead>
    <tr>
      <th scope="col">Trimestre</th>
      <th scope="col">Ingresos</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1</th>
      <td>$12 000</td>
    </tr>
  </tbody>
</table>
```

No uses tablas para layout. En tablas complejas, simplifica la estructura o divide la información antes de agregar relaciones ARIA difíciles de mantener.

## Audio y video

- Subtítulos sincronizados para diálogo y sonidos relevantes.
- Transcripción para contenido de audio y búsqueda textual.
- Audiodescripción cuando la imagen aporta información que la narración no comunica.
- Controles operables con teclado y nombre accesible.
- Nada de reproducción automática con sonido.

## Enlaces, abreviaturas y lectura

El texto de un enlace debe conservar significado fuera del párrafo. Evita listas donde todos dicen “ver más”. Si descarga un archivo, comunica formato y tamaño cuando ayude a decidir.

```html
<a href="/reportes/2026.pdf">Descargar reporte anual 2026 (PDF, 2,4 MB)</a>
```

Explica una abreviatura en su primera aparición. Para fechas, precios e instrucciones, usa lenguaje directo y conserva el mismo término para la misma acción.

## Caso de uso: gráfico

Un `alt` corto identifica la conclusión; una tabla o descripción cercana expone valores y tendencia. No intentes comprimir veinte puntos de datos dentro del atributo.

```html
<img
  src="ventas.webp"
  alt="Las ventas crecieron 18 % entre enero y junio"
/>
<details>
  <summary>Consultar datos del gráfico</summary>
  <!-- tabla con meses y valores -->
</details>
```

## Comprobación

Recorre la página sin imágenes, sin audio y con estilos desactivados. La estructura, las acciones y la información esencial deben seguir disponibles. Después prueba zoom, lector de pantalla y subtítulos con el contenido real, no con texto de muestra.

## Referencias

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI: imágenes](https://www.w3.org/WAI/tutorials/images/)
