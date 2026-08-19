---
title: Contenido accesible — encabezados, imágenes, tablas y multimedia
description: Hacer que el contenido conserve significado con lectores de pantalla, zoom, audio desactivado y formatos alternativos.
category: accessibility
stack: a11y-contenido
order: 1
tags: [accessibility, content, alt-text, tables, captions]
related:
  - guides/accessibility-fundamentals-terminology
  - guides/accessibility-visual-reflow-motion
  - practices/accessibility-checklist
updatedAt: 2026-08-19
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
```

## Texto alternativo

La decisión depende del propósito:

| Imagen | Tratamiento |
| --- | --- |
| Decorativa | `alt=""` para ignorarla |
| Informativa | Describe la información relevante en contexto |
| Enlace o botón | Describe la acción o destino, no “imagen de” |
| Gráfico complejo | Resumen corto y explicación o datos cercanos |

No repitas un pie de foto idéntico en `alt`. Si una captura enseña varios pasos, el procedimiento debe existir también como texto.

## Tablas de datos

```html
<table>
  <caption>Resultados por trimestre</caption>
  <thead>
    <tr><th scope="col">Trimestre</th><th scope="col">Ingresos</th></tr>
  </thead>
  <tbody>
    <tr><th scope="row">Q1</th><td>$12 000</td></tr>
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

## Referencias

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI: imágenes](https://www.w3.org/WAI/tutorials/images/)

