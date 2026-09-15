---
title: "AnyDoc: documentos a Markdown desde Rust, Node y Python"
description: Librería y CLI de Firecrawl que convierte documentos de oficina, PDF, EPUB, CSV y texto en Markdown estructurado.
tags: [anydoc, firecrawl, markdown, documentos, rust, node, python]
sidebar:
  order: 11
draft: false
resourceCategory: developer-tools
official: true
website: https://firecrawl.github.io/anydoc/
url: https://github.com/firecrawl/anydoc
updatedAt: 2026-09-10
---

## En pocas palabras

[AnyDoc](https://github.com/firecrawl/anydoc) es una librería open source escrita en Rust que transforma Word, PowerPoint, Excel, OpenDocument, RTF, EPUB, CSV, texto y PDF en Markdown compatible con GitHub. Ofrece una CLI, APIs para Node.js y Python, WebAssembly para navegador y un crate de Rust.

El proyecto usa un modelo interno común y serializadores por formato. Eso permite conservar títulos, tablas, celdas combinadas, notas al pie, ecuaciones y recursos incrustados con una salida que puede revisarse como texto.

## Qué problema resuelve

Los pipelines de documentación suelen mezclar extracción, limpieza y carga. AnyDoc concentra la primera transformación y deja el Markdown listo para revisar, versionar o pasar a un indexador. La [demo en el navegador](https://firecrawl.github.io/anydoc/) permite probar archivos sin preparar un proyecto.

No es un conversor semántico universal: convierte estructura y texto, pero no decide si el contenido es correcto ni sustituye un OCR especializado para todos los documentos escaneados.

## Inicio rápido

La CLI puede instalarse y ejecutarse con `npx`:

```bash
npx skills add firecrawl/anydoc
npx @firecrawl/anydoc report.docx
npx @firecrawl/anydoc slides.pptx -o slides.md
```

Para usar la distribución publicada en un proyecto Node, revisa el nombre y la versión del paquete en el [README](https://github.com/firecrawl/anydoc):

```bash
npm install @firecrawl/anydoc
```

La API expone funciones como `toMarkdown`, `toMarkdownBytes` y `toDocument`. En Python el paquete se instala como `firecrawl-anydoc`; en Rust, como `anydoc`; para navegador existe `@firecrawl/anydoc-wasm`.

## PDF y OCR

Los PDF con texto se pueden convertir localmente. Un PDF compuesto solo por imágenes necesita OCR. AnyDoc documenta una opción `--ocr hosted` que envía el documento a Firecrawl Parse; en ese caso deja de ser un procesamiento completamente local y debes revisar privacidad, tamaño y costes del servicio.

Una comprobación segura para un pipeline es:

1. identificar el tipo de archivo y si contiene texto seleccionable;
2. convertir un ejemplar pequeño;
3. revisar títulos, tablas y saltos de página;
4. decidir explícitamente si los escaneos pueden salir de la máquina;
5. guardar el Markdown y los metadatos de origen para poder rastrear errores.

## Ejemplo de integración

La idea es convertir antes de indexar:

```ts title="scripts/import-document.ts"
import { readFile } from "node:fs/promises"
import { toMarkdown } from "@firecrawl/anydoc"

const input = await readFile("./entrada.docx")
const markdown = await toMarkdown(input)
console.log(markdown)
```

Confirma la firma exacta para la versión instalada. En producción, captura errores por formato, limita el tamaño de entrada y conserva el nombre del archivo original.

## Cuándo conviene

- importar documentación de oficina a un repositorio Markdown;
- preparar corpus para búsqueda semántica o RAG;
- convertir archivos en un proceso CI sin depender de una aplicación de escritorio;
- ejecutar la conversión en navegador con WebAssembly cuando el archivo no debe salir del cliente.

Para documentos con maquetación muy visual, gráficos complejos o accesibilidad estricta, revisa la salida manualmente y conserva el original.

## Límites y seguridad

- La calidad depende del formato y de cómo fue creado el archivo.
- Las tablas y elementos incrustados deben verificarse; Markdown no representa todos los detalles de una hoja de cálculo.
- OCR hospedado implica una transferencia externa; el procesamiento Rust local no hace esa llamada por sí solo.
- El Markdown generado es contenido no confiable: sanitiza HTML y enlaces antes de mostrarlo en una aplicación.

## Fuentes

- [Repositorio y README de AnyDoc](https://github.com/firecrawl/anydoc)
- [Demo oficial](https://firecrawl.github.io/anydoc/)
- [Organización Firecrawl](https://www.firecrawl.dev/)
