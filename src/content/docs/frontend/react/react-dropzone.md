---
title: React Dropzone
description: Zonas de drag & drop para subir archivos — useDropzone, validación de tipo/tamaño y manejo de archivos rechazados.
type: libraries
order: 8
tags: [react, forms, files]
website: https://react-dropzone.js.org
github: https://github.com/react-dropzone/react-dropzone
install: npm install react-dropzone
related:
  - frontend/react/react-hook-form
updatedAt: 2026-08-25
---

Es un hook, no un componente con estilos propios: `useDropzone` maneja toda la lógica de drag & drop, validación y accesibilidad (teclado, focus), y tú pones el markup completo. Nada de CSS impuesto ni de un `<Dropzone>` con apariencia fija que después hay que sobreescribir.

## Uso básico

`getRootProps()` va en el contenedor (maneja los eventos de drag); `getInputProps()` en un `<input>` oculto (el fallback para hacer click y elegir un archivo, sin arrastrar nada).

```tsx
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

function ZonaDeSubida() {
  const onDrop = useCallback((archivosAceptados: File[]) => {
    console.log(archivosAceptados)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Suelta los archivos aquí</p>
      ) : (
        <p>Arrastra archivos o haz click</p>
      )}
    </div>
  )
}
```

## Restringir tipo y tamaño de archivo

```tsx
const { getRootProps, getInputProps, fileRejections } = useDropzone({
  onDrop,
  accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
  maxSize: 5 * 1024 * 1024, // 5 MB
  maxFiles: 3
})
```

## Mostrar archivos rechazados

Un archivo que no cumple `accept`/`maxSize`/`maxFiles` no llega a `onDrop` — aparece en `fileRejections`, con el motivo exacto de cada rechazo.

```tsx
{
  fileRejections.length > 0 && (
    <ul>
      {fileRejections.map(({ file, errors }) => (
        <li key={file.name}>
          {file.name}: {errors.map((e) => e.message).join(", ")}
        </li>
      ))}
    </ul>
  )
}
```

## API de Dropzone en una mirada

| API                            | Uso                                                |
| ------------------------------ | -------------------------------------------------- |
| `useDropzone({ onDrop, ... })` | Hook principal, devuelve props y estado            |
| `getRootProps()`               | Props para el contenedor (eventos de drag)         |
| `getInputProps()`              | Props para el `<input type="file">` oculto         |
| `isDragActive`                 | `true` mientras se arrastra algo sobre la zona     |
| `accept`                       | Tipos MIME/extensiones permitidos                  |
| `maxSize` / `maxFiles`         | Límites de tamaño (bytes) y cantidad               |
| `fileRejections`               | Archivos rechazados, con el motivo de cada rechazo |

## Archivos, accesibilidad y seguridad

- `onDrop` recibe los archivos que **pasaron** la validación — los rechazados nunca llegan ahí, solo a `fileRejections`.
- El input real queda oculto por CSS que la librería inyecta vía `getInputProps()` — no hace falta (ni conviene) esconderlo a mano con `display: none`, ya lo maneja la librería para mantenerlo accesible por teclado.
- Esto sube archivos al navegador (`File[]` en memoria) — todavía falta la parte de subirlos a algún lado (`FormData` + `fetch`, o un Server Action si el proyecto es Astro/Next).
