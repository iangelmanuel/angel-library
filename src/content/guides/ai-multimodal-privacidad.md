---
title: IA multimodal, privacidad y manejo de archivos
description: Procesar imágenes, audio y documentos con límites, formatos, consentimiento, minimización de datos y salidas verificables.
category: ai
stack: ai-fundamentos
order: 2
tags: [ia, multimodal, vision, audio, privacy, files]
related:
  - guides/ai-fundamentals-terminology
  - guides/security-common-web-attacks
  - guides/ai-sdk-openai
updatedAt: 2026-08-19
---

Un modelo **multimodal** acepta o produce más de una modalidad, como texto, imagen, audio o video. La integración sigue siendo una canalización de datos: validar, transformar, enviar, interpretar y almacenar con una política explícita.

## Canalización segura

```text
cliente → autorización → límite de tamaño → validar tipo real
        → escanear/normalizar → almacenamiento temporal
        → proveedor de IA → validar salida → eliminar o conservar según política
```

La extensión `.png` o el header enviado por el navegador no demuestran el tipo real. Inspecciona la firma del archivo, limita dimensiones y duración y evita procesadores inseguros. Un PDF puede contener muchas páginas; un audio puede ser largo aunque pese poco.

## Casos frecuentes

- **Visión:** extracción de datos, clasificación o descripción. No presupongas que el modelo lee texto pequeño o cuenta objetos con precisión absoluta.
- **Audio:** transcripción, detección de idioma o respuesta por voz. Conserva timestamps si se necesita revisar evidencia.
- **Documentos:** extracción y preguntas. Mantén página, sección y fuente para poder citar.
- **Generación:** imagen o audio. Revisa derechos, consentimiento, moderación y etiquetado según el producto.

## Privacidad y retención

Antes de enviar un archivo a un proveedor, documenta:

- qué datos contiene y si son sensibles;
- base legal o consentimiento aplicable;
- región, retención y uso de datos del proveedor;
- quién puede acceder al resultado;
- cuándo se eliminan original, derivados y logs.

Aplica **minimización de datos**: recorta la región de una imagen, elimina metadatos EXIF, anonimiza identificadores o transcribe localmente si no se necesita enviar el audio completo.

## Verificar la salida

La extracción estructurada debe incluir esquema, confianza o evidencia y una ruta de revisión. Para decisiones de alto impacto, el resultado del modelo es una propuesta, no la autoridad final.

```ts
const Invoice = z.object({
  vendor: z.string(),
  total: z.number().nonnegative(),
  currency: z.string().length(3),
  sourcePage: z.number().int().positive(),
});
```

## Referencias

- [OpenAI: visión](https://platform.openai.com/docs/guides/images-vision)
- [OpenAI: speech to text](https://platform.openai.com/docs/guides/speech-to-text)

