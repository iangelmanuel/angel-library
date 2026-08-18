---
title: Uploads con multer
description: Subir archivos a Express — memoria vs disco, validar tipo y tamaño, y guardar la referencia en la base.
category: backend
stack: express
order: 30
tags: [express, uploads, multer, files]
problem: Recibir un archivo (imagen de perfil, adjunto) desde un form-data, validarlo, y persistirlo.
technologies: [guides/express-prisma]
updatedAt: 2026-08-16
---

## Por qué hace falta multer

`express.json()` parsea bodies `application/json` — un archivo subido viaja como `multipart/form-data`, un formato distinto que Express no entiende nativamente. `multer` es el middleware estándar para parsear ese formato y exponer los archivos en `req.file`/`req.files`.

## Instalación

```bash
npm install multer
npm install --save-dev @types/multer
```

## Guardar en disco

```ts title="middlewares/upload.ts"
import multer from 'multer';
import path from 'node:path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, nombreUnico);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido'));
    }
    cb(null, true);
  },
});
```

```ts title="app.ts"
import express from 'express';
import { upload } from './middlewares/upload';

const app = express();

app.post('/perfil/avatar', upload.single('avatar'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Falta el archivo' });

  const url = `/uploads/${req.file.filename}`;
  await prisma.user.update({
    where: { id: req.user!.id },
    data: { avatarUrl: url },
  });

  res.json({ url });
});
```

`upload.single('avatar')` espera exactamente un archivo, en el campo `avatar` del form-data — `req.file` queda poblado con su info (`filename`, `path`, `mimetype`, `size`).

## Varios archivos

```ts
app.post('/galeria', upload.array('fotos', 10), (req, res) => {
  const archivos = req.files as Express.Multer.File[];
  res.json({ cantidad: archivos.length, urls: archivos.map((f) => `/uploads/${f.filename}`) });
});
```

## Guardar en memoria (para subir a un servicio externo, no a disco)

Si el destino final es un storage externo (S3, Supabase Storage, Cloudinary), no hace falta escribir a disco local primero:

```ts
const uploadMemoria = multer({ storage: multer.memoryStorage() });

app.post('/avatar', uploadMemoria.single('avatar'), async (req, res) => {
  // req.file.buffer tiene el contenido completo en memoria, listo para subir a otro lado
  const { data, error } = await supabaseAdmin.storage
    .from('avatars')
    .upload(`user-${req.user!.id}.png`, req.file!.buffer, { contentType: req.file!.mimetype });

  if (error) return res.status(500).json({ error: 'Error al subir' });
  res.json({ ok: true });
});
```

## Servir los archivos subidos

```ts
app.use('/uploads', express.static('uploads'));
```

## Resumen

| Config | Para qué |
| --- | --- |
| `multer.diskStorage` | Guarda en disco local |
| `multer.memoryStorage` | Guarda en memoria (`req.file.buffer`), para reenviar a otro storage |
| `limits: { fileSize }` | Rechaza archivos más grandes que el límite |
| `fileFilter` | Rechaza por tipo MIME antes de guardar nada |
| `.single(campo)` / `.array(campo, max)` | Uno o varios archivos |

## Consideraciones

- Disco local (`diskStorage`) no sobrevive a un deploy en muchas plataformas serverless/contenedores efímeros — para producción en esos entornos, `memoryStorage` + subir directo a S3/Supabase Storage/Cloudinary es el patrón real.
- `fileFilter` valida el `mimetype` que **el cliente declara**, no el contenido real del archivo — para validación robusta contra archivos maliciosos disfrazados, hace falta inspeccionar los bytes reales (magic numbers), fuera del alcance de esta receta básica.
- Nunca confiar en `file.originalname` para el nombre final en disco (puede contener caracteres de path traversal) — por eso el ejemplo genera un nombre nuevo random en vez de usar el original.
