---
title: Subidas de archivos y object storage
description: Recibir archivos sin agotar el servidor mediante URLs firmadas, validación, cuarentena, metadatos y autorización en descargas.
category: backend
stack: backend-fundamentos
order: 7
tags: [backend, uploads, object-storage, files, security]
related:
  - guides/security-common-web-attacks
  - guides/ai-multimodal-privacidad
  - guides/backend-webhooks-tiempo-real
updatedAt: 2026-08-19
---

El **object storage** almacena objetos por clave, no como un sistema de archivos local compartido. En despliegues con varias instancias o serverless, guardar en el disco del proceso suele ser temporal y no está disponible para los demás servidores.

## Carga directa con URL firmada

```text
1. Cliente solicita permiso y metadatos al backend.
2. Backend autoriza, crea una clave no predecible y firma una URL limitada.
3. Cliente sube directamente al almacenamiento.
4. Backend confirma o recibe un evento, valida y marca el archivo disponible.
```

La URL debe limitar método, clave, tamaño aproximado, tipo permitido y expiración. El cliente no decide una ruta pública arbitraria.

```ts
const objectKey = `${tenantId}/${crypto.randomUUID()}`;
const upload = await storage.createSignedUpload({
  key: objectKey,
  expiresInSeconds: 300,
  contentType: 'image/png',
});
```

## Validación por capas

- Límite de bytes antes y durante la lectura.
- Tipo real mediante firma o decodificación, no solo extensión.
- Dimensiones, páginas o duración máximas.
- Nombre original tratado como metadato, nunca como ruta.
- Escaneo y procesamiento en cuarentena.
- Re-encode de imágenes cuando corresponda.

No sirvas HTML, SVG u otros contenidos activos desde el mismo origen de la aplicación sin una política explícita. Usa otro dominio, `Content-Disposition: attachment` y headers apropiados.

## Autorización de descarga

Que una persona conozca la URL no significa que tenga permiso. Para objetos privados, el backend autoriza y entrega una URL de descarga de corta duración. Registra propietario, tenant, estado, hash, tamaño y política de retención en la base de datos.

## Limpieza

Programa la eliminación de cargas incompletas, versiones reemplazadas y archivos cuya retención terminó. La eliminación debe considerar copias, miniaturas, índices de IA y backups según la política del producto.

