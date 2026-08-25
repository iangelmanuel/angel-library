---
title: Servidor de archivos estáticos con fs
description: Servir una carpeta de archivos (HTML, CSS, imágenes) a mano con Node puro — Content-Type por extensión y manejo de 404.
category: backend
stack: node
order: 17
tags: [node, fs, http, static-files]
problem: Entender cómo un servidor de archivos estáticos (lo que hacen Express.static, nginx, etc.) resuelve el mapeo ruta → archivo → Content-Type.
related: [guides/node-filesystem, guides/node-http-server]
updatedAt: 2026-08-16
---

## Objetivo

Servir una carpeta `public/` completa (HTML, CSS, JS, imágenes) desde un servidor Node nativo — la ruta de la URL se mapea directo a un archivo en disco.

## Código completo

```ts title="server.ts"
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CARPETA_PUBLICA = path.join(__dirname, 'public');

const TIPOS_MIME: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url!, `http://${req.headers.host}`);
  let rutaArchivo = path.join(CARPETA_PUBLICA, url.pathname);

  // Seguridad: evitar que "../../../etc/passwd" en la URL se escape de CARPETA_PUBLICA
  if (!rutaArchivo.startsWith(CARPETA_PUBLICA)) {
    res.writeHead(403);
    return res.end('Prohibido');
  }

  try {
    const info = await stat(rutaArchivo);

    // Si es un directorio, servir su index.html
    if (info.isDirectory()) {
      rutaArchivo = path.join(rutaArchivo, 'index.html');
    }

    const contenido = await readFile(rutaArchivo);
    const extension = path.extname(rutaArchivo);
    const tipoContenido = TIPOS_MIME[extension] ?? 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': tipoContenido });
    res.end(contenido);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - No encontrado');
  }
});

server.listen(3000, () => console.log('http://localhost:3000'));
```

## Las tres partes clave

1. **Mapeo ruta → archivo**: `url.pathname` se concatena a la carpeta pública con `path.join` (no con `+` a mano, ver [Filesystem](/guides/node-filesystem)) para que funcione igual en Windows y Linux.
2. **Content-Type por extensión**: sin el header correcto, el navegador no sabe interpretar la respuesta — un `.css` sin `Content-Type: text/css` puede no aplicarse como estilos.
3. **Chequeo de path traversal**: sin el `startsWith(CARPETA_PUBLICA)`, una URL con `../../` podría escaparse de la carpeta pública y leer archivos arbitrarios del servidor — un problema de seguridad real, no cosmético.

## Qué hacen las herramientas reales encima de esto

- `express.static()` hace exactamente este mapeo, con más tipos MIME (vía la librería `mime-types`), soporte de caché HTTP (`ETag`, `Last-Modified`, `304 Not Modified`), y range requests (para servir video/audio con seeking).
- Un servidor de producción real (nginx, Vercel, un CDN) además comprime la respuesta (gzip/brotli), sirve desde edge locations geográficamente cercanas al usuario, y cachea agresivamente — cosas que no tiene sentido reimplementar en Node para servir estáticos en producción.

## Consideraciones

- Este código es educativo — en un proyecto real, servir estáticos con `express.static()` (o directamente con un hosting estático/CDN) siempre va a manejar mejor caché, compresión y range requests que esta versión mínima.
- El chequeo de path traversal (`startsWith`) es el detalle de seguridad más fácil de olvidar al escribir esto a mano — cualquier servidor de archivos hecho desde cero necesita esa validación explícita.
