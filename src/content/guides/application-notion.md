---
title: Notion — notas, documentación y bases de datos
description: Espacio para combinar notas, documentación y bases de datos sencillas; explica cómo organizar información relacionada y automatizarla cuando una página deja de ser suficiente.
category: applications
stack: apps-productivity
order: 1
tags: [notion, notas, documentacion, wiki, base-de-datos]
website: https://www.notion.com
related:
  - guides/repository-files-community
updatedAt: 2026-08-26
---

**Notion** es un editor de documentos y bases de datos que combina notas, wikis y gestión de proyectos en un mismo sistema de bloques. Su unidad básica no es "el documento" como en un procesador de texto tradicional, sino el **bloque** — y esa diferencia es la que explica casi todo lo demás.

## Instalación

Notion funciona completo en el navegador (**notion.so**); la app de escritorio y la de móvil son clientes nativos del mismo contenido, sin diferencias de funcionalidad.

```bash
# Windows (winget)
winget install Notion.Notion

# macOS (Homebrew)
brew install --cask notion
```

En Linux no hay cliente oficial de escritorio; se usa desde el navegador o con clientes de comunidad no oficiales (Notion no los mantiene ni los respalda).

## Bloques y páginas anidadas

Todo en Notion es un **bloque**: un párrafo, un título, una imagen, una línea de código, una base de datos completa. Los bloques se reordenan arrastrando el icono `⋮⋮` que aparece al pasar el cursor, y `/` abre el menú para insertar cualquier tipo de bloque sin tocar el mouse.

Una **página** es, en el fondo, un bloque que puede contener otros bloques — incluidas otras páginas. De ahí que Notion permita anidar páginas dentro de páginas sin límite práctico: un wiki de equipo suele ser una jerarquía de páginas, no un espacio plano de documentos.

## Bases de datos: el bloque más potente

Una **base de datos** en Notion es una colección de páginas que comparten propiedades estructuradas (texto, número, fecha, selección, persona, relación con otra base). Cada fila de la base de datos **es una página completa** — puede tener su propio contenido de bloques debajo del título, no solo los valores de sus propiedades.

Esa misma base de datos se puede mostrar con distintas **vistas** sin duplicar los datos:

| Vista | Para qué sirve |
| --- | --- |
| **Table** | Como una hoja de cálculo — todas las propiedades visibles en columnas |
| **Board** | Tipo Kanban, agrupado por una propiedad de selección (por ejemplo, estado: Por hacer / En progreso / Hecho) |
| **Calendar** | Agrupa por una propiedad de fecha |
| **Gallery** | Tarjetas visuales, útil cuando cada fila tiene una imagen relevante |
| **Timeline** | Tipo Gantt, para propiedades con rango de fechas |
| **List** | La vista más compacta, sin columnas |

Cambiar de vista no mueve ni copia datos: son distintas formas de mirar la misma base, cada una con sus propios filtros y orden guardados.

## Relations y Rollups

Una propiedad **Relation** conecta filas de una base de datos con filas de otra — el equivalente a una llave foránea. Un ejemplo típico: una base de "Tareas" con una Relation a una base de "Proyectos", donde cada tarea apunta a su proyecto.

Una propiedad **Rollup** agrega información a través de esa relación: contar cuántas tareas tiene un proyecto, sumar sus horas estimadas, o mostrar si todas están completas. Es lo que convierte dos bases de datos separadas en un sistema con datos derivados, sin fórmulas manuales que haya que actualizar a mano.

## Templates

Una base de datos puede tener **templates**: una estructura de bloques predefinida que se inserta al crear una fila nueva. Útil para que cada nueva tarea, nota de reunión o documento de diseño arranque con las secciones esperadas (Objetivo, Contexto, Decisión) en vez de una página en blanco.

## La API de Notion

Notion expone una **API REST** que permite leer y escribir páginas y bases de datos programáticamente — la vía real para automatizar documentación (por ejemplo, el README de perfil de GitHub reescribiéndose desde datos que viven en Notion, o un bot que crea una página de "Postmortem" a partir de una plantilla cuando se cierra un incidente).

```bash
curl -X POST 'https://api.notion.com/v1/pages' \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": { "database_id": "'"$DATABASE_ID"'" },
    "properties": {
      "Name": { "title": [{ "text": { "content": "Tarea creada por API" } }] }
    }
  }'
```

El header `Notion-Version` fija qué versión del esquema de la API estás usando — Notion puede introducir cambios entre versiones, así que fijarla evita que una actualización futura rompa una integración en silencio.

## Cuándo usarlo

Notion resuelve bien documentación viva, wikis de equipo y seguimiento ligero de trabajo con relaciones simples entre entidades. Para datos con integridad referencial real, consultas complejas o volumen alto, una base de datos relacional de verdad sigue siendo la herramienta correcta — Notion no reemplaza [PostgreSQL](/guides/postgresql-practico) ni un ORM cuando el proyecto lo necesita.

Fuentes: [Notion Help Center](https://www.notion.com/help) y [documentación de la API](https://developers.notion.com/).
