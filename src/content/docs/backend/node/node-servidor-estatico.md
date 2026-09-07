---
title: Servidor de archivos estáticos con fs
description: Servir una carpeta de archivos (HTML, CSS, imágenes) a mano con Node puro — Content-Type por extensión y manejo de 404.
type: recipes
order: 17
tags: [node, fs, http, static-files]
problem: Entender cómo un servidor de archivos estáticos (lo que hacen Express.static, nginx, etc.) resuelve el mapeo ruta → archivo → Content-Type.
related: [backend/node/node-filesystem, backend/node/node-http-server]
updatedAt: 2026-09-07
---

## Objetivo

Servir una carpeta `public/` completa (HTML, CSS, JS, imágenes) desde un servidor Node nativo — la ruta de la URL se mapea directo a un archivo en disco.

## Antes de empezar

Usa una carpeta de práctica con `package.json` que declare `"type": "module"`, Node.js 22.12 o posterior y `tsx` instalado con `pnpm add -D tsx`. Crea `public/index.html` con un saludo, guarda el siguiente archivo junto a `public/` y ejecuta `pnpm exec tsx server.ts`.

El ejemplo sirve archivos pequeños de una carpeta controlada por ti. No permitas que terceros modifiquen esa carpeta mientras corre el proceso.

## Código completo

```ts title="server.ts"
import { readFile, realpath, stat } from "node:fs/promises"
import { createServer } from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CARPETA_PUBLICA = await realpath(path.join(__dirname, "public"))

function estaDentro(ruta: string) {
  const relativa = path.relative(CARPETA_PUBLICA, ruta)
  return relativa !== ".." && !relativa.startsWith(`..${path.sep}`) && !path.isAbsolute(relativa)
}

const TIPOS_MIME: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
}

const server = createServer(async (req, res) => {
  try {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" })
      return res.end()
    }
    const url = new URL(req.url ?? "/", "http://localhost")
    const ruta = decodeURIComponent(url.pathname)
    // La barra invertida también puede ser separador en Windows.
    if (ruta.includes("\\") || ruta.includes("\0")) {
      res.writeHead(400)
      return res.end("Ruta inválida")
    }
    let rutaArchivo = path.resolve(CARPETA_PUBLICA, `.${ruta}`)
    if (!estaDentro(rutaArchivo)) {
      res.writeHead(403)
      return res.end("Prohibido")
    }
    const info = await stat(rutaArchivo)

    // Si es un directorio, servir su index.html
    if (info.isDirectory()) {
      rutaArchivo = path.join(rutaArchivo, "index.html")
    }

    // Resolver enlaces simbólicos antes de comprobar la frontera real.
    rutaArchivo = await realpath(rutaArchivo)
    if (!estaDentro(rutaArchivo)) {
      res.writeHead(403)
      return res.end("Prohibido")
    }

    const contenido = await readFile(rutaArchivo)
    const extension = path.extname(rutaArchivo)
    const tipoContenido = TIPOS_MIME[extension] ?? "application/octet-stream"

    res.writeHead(200, { "Content-Type": tipoContenido })
    res.end(req.method === "HEAD" ? undefined : contenido)
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code
    const status = error instanceof URIError ? 400 : ["ENOENT", "ENOTDIR"].includes(code ?? "") ? 404 : 500
    if (status === 500) console.error(error)
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" })
    res.end(req.method === "HEAD" ? undefined : status === 404 ? "No encontrado" : "No se pudo servir el archivo")
  }
})

server.listen(3000, "127.0.0.1", () => console.log("http://127.0.0.1:3000"))
```

## Las tres partes clave

1. **Mapeo ruta → archivo**: se decodifica la URL y se resuelve dentro de la carpeta pública; ver [Filesystem](/backend/node/node-filesystem).
2. **Content-Type por extensión**: sin el header correcto, el navegador no sabe interpretar la respuesta — un `.css` sin `Content-Type: text/css` puede no aplicarse como estilos.
3. **Frontera de archivos**: `path.relative` detecta rutas que salen de la raíz y `realpath` permite comprobar el destino de enlaces simbólicos. Comparar solo prefijos confunde `public` con `public-otro` y no detecta enlaces que apuntan fuera.

## Qué hacen las herramientas reales encima de esto

- `express.static()` hace exactamente este mapeo, con más tipos MIME (vía la librería `mime-types`), soporte de caché HTTP (`ETag`, `Last-Modified`, `304 Not Modified`), y range requests (para servir video/audio con seeking).
- Un servidor de producción real (nginx, Vercel, un CDN) además comprime la respuesta (gzip/brotli), sirve desde edge locations geográficamente cercanas al usuario, y cachea agresivamente — cosas que no tiene sentido reimplementar en Node para servir estáticos en producción.

## Consideraciones

- Este código es educativo — en un proyecto real, servir estáticos con `express.static()` (o directamente con un hosting estático/CDN) siempre va a manejar mejor caché, compresión y range requests que esta versión mínima.
- Sigue existiendo una ventana entre comprobar y abrir un archivo. El ejemplo asume una carpeta controlada e inmutable durante la petición; no es un servidor endurecido para archivos escritos por usuarios.

## Comprobación

Abre `http://127.0.0.1:3000/`: debe mostrar tu saludo. Un archivo inexistente debe dar 404; `HEAD /` devuelve encabezados sin cuerpo; `POST /` da 405. Un escape codificado como `/..%2fprivado.txt` no debe servir contenido exterior. Si pruebas un enlace simbólico dentro de `public/` hacia un archivo de prueba externo, debe responder 403.

## Fuentes

- [Node.js: path.relative](https://nodejs.org/api/path.html#pathrelativefrom-to)
- [Node.js: fs.realpath](https://nodejs.org/api/fs.html#fspromisesrealpathpath-options)
