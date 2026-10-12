---
title: "Public APIs — catálogo de APIs públicas gratuitas"
description: Catálogo colaborativo de unas 1.400–1.500 APIs públicas organizadas en 52 categorías, para practicar peticiones HTTP o prototipar; cada API tiene reglas propias de acceso, uso y disponibilidad.
tags: [api, javascript, backend, learning, http, catalogo]
draft: false
resourceCategory: apis
official: true
url: https://publicapis.dev/
github: https://github.com/marcelscruz/public-apis
technologies:
  - resources/developer-tools/omatsuri
  - resources/apis/rapidapi-hub
  - languages/javascript/javascript-fetch-apis
  - backend/express/express-cors
note: "publicapis.dev es el sitio del repositorio marcelscruz/public-apis (MIT), no del conocido public-apis/public-apis. Son listas parecidas pero mantenidas por separado."
warnings:
  - "Estar en la lista no garantiza que la API siga viva, sea fiable ni permita tu caso de uso: revisa siempre su documentación y sus términos."
  - "Nunca pongas una clave secreta de API en código que corre en el navegador."
updatedAt: 2026-10-12
---

**publicapis.dev** es un directorio web de APIs públicas para desarrolladores: el título del sitio habla de "1400+" APIs y su listado completo ronda las 1.500 entradas, repartidas en **52 categorías** (IA, animales, anime, libros, criptomonedas, cambio de divisas, geocodificación, música, noticias, datos abiertos, deportes, datos de prueba, clima…). Cada ficha muestra logo, nombre, categoría, una descripción corta y el enlace a la documentación de la API.

## Qué es una API pública

Una API (interfaz de programación) es un servicio al que tu código le pide datos por HTTP y que responde, normalmente, en JSON. "Pública" quiere decir que cualquiera puede usarla, a veces sin registrarse y a veces con una clave (API key) gratuita. Son la forma más rápida de practicar `fetch`, construir un prototipo con datos reales o aprender a manejar errores de red. Si estás empezando, mira [Fetch y APIs en JavaScript](/languages/javascript/javascript-fetch-apis).

## publicapis.dev y public-apis/public-apis

Hay dos proyectos con nombre casi idéntico y conviene no confundirlos:

| Proyecto                                                                       | Qué es                                                                                                                                                   |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [marcelscruz/public-apis](https://github.com/marcelscruz/public-apis)          | El repositorio detrás de **publicapis.dev**. Mantenido por Marcel Cruz, licencia MIT, unas 9.500 estrellas. No es un fork en GitHub.                     |
| [public-apis/public-apis](https://github.com/public-apis/public-apis)          | La lista original y más famosa (cerca de 490.000 estrellas, MIT), patrocinada por APILayer. No enlaza a publicapis.dev y no tiene web propia de listado. |

Las dos listas se organizan en categorías muy parecidas y se alimentan con pull requests de la comunidad. La de public-apis/public-apis es solo un README enorme con tablas (columnas Auth, HTTPS y CORS) y ahora incluye también una sección de servidores MCP. publicapis.dev aporta una interfaz navegable con buscador (atajo `Ctrl K` / `⌘ K`), paginación y fichas con logo.

## Cómo usarlo

1. Entra en una categoría o usa el buscador.
2. Abre la ficha y, desde ahí, la documentación oficial de la API.
3. Comprueba en esa documentación tres cosas antes de escribir código:
   - **Autenticación**: si no pide nada, pide una `apiKey` o usa OAuth.
   - **CORS**: si permite llamadas directas desde el navegador. Si no, tendrás que llamarla desde un backend o un proxy (ver [CORS en Express](/backend/express/express-cors)).
   - **Límites**: cuántas peticiones por minuto o por día permite.

En publicapis.dev estos datos no siempre aparecen como campos estructurados (a veces solo en la descripción), así que la documentación de cada API es la fuente. En la lista de public-apis/public-apis sí hay columnas Auth/HTTPS/CORS, aunque CORS figura a menudo como `Unknown`.

Para proponer una API nueva, el sitio tiene un enlace **Submit** y el repositorio acepta contribuciones por pull request.

## Antes de depender de una API

Una entrada en la lista es un punto de descubrimiento, no una garantía de calidad ni de permanencia. Revisa su documentación, autenticación, límites de solicitudes, licencia de los datos y política de disponibilidad. Prueba también errores y tiempos de espera.

Si el proyecto va a producción:

- No llames desde el navegador con una clave secreta: pásala por tu backend.
- Cachea respuestas para no gastar cuota ni depender de cada petición.
- Diseña qué ocurre cuando el servicio externo falla, responde lento o cambia su formato.

Si necesitas APIs comerciales con facturación unificada, una alternativa es un marketplace como [RapidAPI Hub](/resources/apis/rapidapi-hub).

## Fuentes

- [publicapis.dev](https://publicapis.dev/)
- [marcelscruz/public-apis](https://github.com/marcelscruz/public-apis)
- [public-apis/public-apis](https://github.com/public-apis/public-apis)
