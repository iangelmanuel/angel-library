---
title: Vite y el proceso de build
description: Entender servidor de desarrollo, grafo de módulos, variables de entorno, chunks, source maps y análisis del bundle.
category: tools
stack: tools-build
order: 1
tags: [vite, bundler, build, modules, source-maps]
related:
  - guides/developer-tools-fundamentals
  - guides/performance-resource-loading
  - guides/tools-chrome-devtools
updatedAt: 2026-08-19
---

Vite ofrece un servidor de desarrollo basado en módulos nativos y una construcción optimizada para producción. Desarrollo y producción persiguen objetivos distintos: respuesta rápida a cambios frente a archivos compactos, versionados y desplegables.

## Grafo de módulos

Cada `import` crea una relación. El bundler recorre ese grafo para transformar archivos, separar chunks y eliminar exportaciones no utilizadas cuando puede demostrarlo.

```ts
const editor = await import('./editor');
editor.mount();
```

Un `import()` dinámico crea un punto potencial de **code splitting**. Úsalo en funcionalidades grandes y no críticas, pero evita producir decenas de solicitudes diminutas sin medir.

## Variables de entorno

```ts
const apiUrl = import.meta.env.PUBLIC_API_URL;
```

Las variables expuestas al código cliente quedan dentro del bundle. El prefijo configurado permite exposición, no confidencialidad. Claves privadas, tokens de proveedor y credenciales de base de datos solo viven en el servidor.

## Verificar el artefacto

Después de `vite build` revisa:

- tamaño comprimido de entradas y chunks;
- duplicación de dependencias;
- source maps y su política de publicación;
- rutas base y carga de assets;
- compatibilidad objetivo del navegador;
- comportamiento con caché y navegación directa.

```ts title="vite.config.ts"
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 600,
  },
});
```

`hidden` genera mapas sin incluir el comentario que los anuncia al navegador; todavía debes subirlos de forma privada al servicio de errores y protegerlos en el artefacto.

## Errores frecuentes

- Un paquete mezcla CommonJS y ESM de forma incompatible.
- Dos versiones de una dependencia terminan en chunks distintos.
- Un import con efecto secundario impide *tree shaking*.
- El código accede a `window` durante renderizado de servidor.
- Desarrollo funciona por caché o alias, pero el build resuelve otra ruta.

Reproduce siempre con el comando de build y una vista previa del artefacto, no solo con el servidor de desarrollo.

## Referencias

- [Vite: guía](https://vite.dev/guide/)
- [Vite: opciones de build](https://vite.dev/config/build-options)

