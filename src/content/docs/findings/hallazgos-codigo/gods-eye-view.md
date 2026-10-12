---
title: "God's Eye View, Argos Atlas y OSIRIS: mapas de inteligencia en tiempo real"
description: "Tres globos que juntan vuelos, barcos, satélites, cámaras públicas y desastres naturales en una sola vista: el cliente open source de Bilawal Sidhu y dos plataformas web que beben de la misma idea."
tags: [osint, geoint, mapas, cesiumjs, maplibre, tiempo-real, adsb, ais, autoalojado]
sidebar:
  order: 14
draft: false
resourceCategory: Repositorio oficial
official: true
url: https://github.com/bilawalsidhu/gods-eye-view
technologies:
  - findings/hallazgos-web/flowsint
note: "God's Eye View arranca sin claves de API y se ejecuta en local (Node 24 o 26). Las capas fotorrealistas en 3D, los barcos, los incendios y la voz piden claves propias, algunas de pago por uso."
warnings:
  - "Que un dato sea público no significa que puedas usarlo para cualquier cosa: cruzar cámaras, matrículas, vuelos privados y ubicaciones puede convertirse en vigilancia de personas, y en la UE el RGPD aplica igual a datos personales obtenidos de fuentes abiertas."
  - "Los datos llegan con retraso, incompletos, simulados o estimados (el tráfico es una simulación y la pose de las cámaras, una aproximación). No sirven para navegar, ni para emergencias, ni para decisiones de inversión."
  - "Si compartes tu instancia de God's Eye View en la red local, cualquiera que llegue a ella gasta tus claves de API. Pon cuotas y alertas de facturación en cada proveedor antes de abrirla."
  - "OSIRIS anuncia un token de criptomoneda en la descripción de su repositorio y su RECON incluye escaneo activo de puertos. Escanear sistemas sin permiso es ilegal en muchos países."
updatedAt: 2026-10-12
---

## En pocas palabras

Una **vista de dios** (_god's eye view_) es un mapa del planeta donde se superponen señales públicas en tiempo real: aviones que emiten su posición por ADS-B, barcos que la emiten por AIS, satélites calculados a partir de sus elementos orbitales, terremotos, incendios detectados desde el espacio y cámaras de tráfico. Nada de eso es secreto. Lo que cambia es tenerlo todo en el mismo globo, con la estética de una sala de operaciones.

Esta entrada documenta tres proyectos de esa familia:

1. **[God's Eye View](https://github.com/bilawalsidhu/gods-eye-view)**: el cliente open source original, que se ejecuta en tu máquina. Es el más completo y el que conviene estudiar por dentro.
2. **[Argos Atlas](https://argosatlas.com/map/)**: una plataforma web en español centrada en cámaras públicas, con plan gratuito y planes de pago. Su globo 3D está basado en el código de God's Eye View.
3. **[OSIRIS](https://osirisai.live/)**: un panel OSINT open source (Next.js y MapLibre) que, además del mapa, trae herramientas de reconocimiento de red y una API pública.

> **OSINT** (_Open Source Intelligence_) es inteligencia a partir de fuentes abiertas: datos que cualquiera puede consultar. **GEOINT** es la parte que trabaja con información geográfica. Si te interesa el lado de investigación sobre entidades (dominios, correos, alias), mira [Flowsint](/findings/hallazgos-web/flowsint).

## God's Eye View

Lo publican [Bilawal Sidhu](https://github.com/bilawalsidhu) y Sameh Khamis ([Halfpixel](https://halfpixel.ai)). Sale de una serie de vídeos virales que antes se llamaba _WorldView_; en agosto de 2026 llegó al número 1 de GitHub Trending y supera las 52.000 estrellas. El README lo publica bajo **licencia MIT**, aunque GitHub no detecta la licencia automáticamente. Los conjuntos de datos incluidos tienen sus propios términos, que se recogen en `DATA_SOURCES.md`.

Su descripción lo resume bien: un simulador de satélite espía en el navegador, solo que los datos son reales.

### Qué hace

- **Seguir cualquier objeto**: haces clic en un avión, un barco o un satélite, la cámara se fija en él, dibuja su estela y enseña su telemetría.
- **Modo cabina**: la cámara viaja dentro de un vuelo real con el terreno debajo. Un panel de **contactos** lista lo que hay en un radio de 250 km para saltar de un avión a otro.
- **Filtros de sensor**: el globo se renderiza con shaders GLSL como CRT, visión nocturna (NVG), térmico (FLIR), _noir_ o nieve. Se cambian con las teclas `1` a `7`.
- **Cámaras proyectadas en 3D**: unas 3.900 cámaras públicas de tráfico no se muestran como un vídeo incrustado, sino proyectadas sobre la ciudad en 3D. El modo _viewshed_ dibuja hasta dónde ve cada una.
- **Control por voz**: con una clave de OpenAI, un agente de la Realtime API maneja el globo con unas treinta herramientas (volar a un sitio, activar capas, dibujar rutas, medir distancias o contar vuelos sobre una región).
- **Servidor MCP**: Claude Desktop, Codex o ChatGPT pueden abrir el globo en la conversación. Un **MCP** (_Model Context Protocol_) es el protocolo con el que un asistente de IA usa herramientas externas; ver [MCP en Claude Code](/agents/claude-code/claude-code-mcp).
- **Director de escenas y enlaces compartibles**: la cámara, las capas, el estilo y un objetivo seguido se guardan en una URL.

### Fuentes de datos

El README cuenta veinte capas y fuentes de mapa, diecisiete de ellas sin clave:

| Capa                     | Fuente                                     | Clave                          |
| ------------------------ | ------------------------------------------ | ------------------------------ |
| Mapa base                | Esri, OpenStreetMap, Google 3D, Cesium ion | Sin clave (Esri/OSM); 3D con clave |
| Vuelos (más de 11.000)   | OpenSky Network y adsb.lol                 | Sin clave (opcional para más cuota) |
| Vuelos militares         | adsb.lol                                   | Sin clave                      |
| Barcos                   | AISStream                                  | Gratuita con registro          |
| Satélites (838 objetos)  | CelesTrak                                  | Sin clave                      |
| Terremotos (24 h)        | USGS                                       | Sin clave                      |
| Incendios activos        | NASA FIRMS                                 | Gratuita con registro          |
| Tráfico                  | Simulado sobre calles de OSM; TomTom opcional | Sin clave; TomTom para velocidad real |
| Cámaras (unas 3.900)     | Portales de tráfico (TfL, Caltrans, TxDOT, Fintraffic, DelDOT…) | Sin clave |
| Cámaras ALPR mapeadas    | OpenStreetMap (incluye DeFlock)            | Sin clave                      |
| Nivel de calle           | Mapillary                                  | Gratuita                       |
| Transporte público       | Feeds GTFS-Realtime de operadores          | Sin clave                      |
| Lanzamientos espaciales  | Launch Library 2                           | Sin clave                      |
| Meteorología y ciclones  | NOAA GFS, ECMWF, nowCOAST, NHC/CPHC        | Sin clave                      |
| Radio                    | Radio Browser                              | Sin clave                      |

Las cámaras ALPR (lectores de matrículas) son **solo ubicaciones** etiquetadas por la comunidad en OpenStreetMap: no hay datos de matrículas ni vídeo. Además vienen incluidos conjuntos estáticos de centros de datos (4.351), presas (704) y cables submarinos (712).

### Arquitectura

No usa framework: **JavaScript sin dependencias de UI, CesiumJS y Vite**, con Google Photorealistic 3D Tiles para el planeta y la Realtime API de OpenAI para la voz.

```text
src/
├── main.js                 # Arranque: tiles 3D y registro de capas
├── ui.js                   # Paneles, HUD, estilos
├── hud.js                  # HUD de inteligencia y resumen con IA
├── keySetup.js             # Panel POWER UP para claves (solo en desarrollo)
├── mapStackController.js   # Cambio de mapa base
├── voice/                  # Sesión Realtime y herramientas de voz
├── layers/                 # Componentes de capa
├── data/                   # Un módulo por fuente de datos
└── scenes/                 # Director de escenas
```

Algunas decisiones técnicas que vale la pena leer en el código:

- **Movimiento suave con datos a saltos.** Los feeds llegan cada 15 a 30 segundos; el globo se pinta un intervalo por detrás del tiempo real e interpola entre posiciones conocidas, con navegación por estima para los huecos.
- **Satélites precisos.** Propagación SGP4 y órbitas realineadas con el tiempo sidéreo (GMST) para que no se desvíen.
- **Claves en el servidor.** Todo lo que usa una clave privada (OpenAI, AISStream, OpenSky, fotogramas de cámaras) pasa por un proxy del servidor con protección SSRF. El navegador solo ve las claves de Google Maps y Cesium ion, que hay que restringir en cada proveedor.
- **Presupuestos de peticiones.** Hay límites propios para los créditos de OpenSky y los tiles de TomTom, y caché en disco de los TLE de satélites.

### Cómo ejecutarlo

Hay dos caminos. El más sencillo es [Pinokio](https://pinokio.co/apps/github-com-bilawalsidhu-gods-eye-view) (versión 8.2 o superior): instalar y pulsar **Start**. Desde la terminal hace falta Node.js 24 (24.14.0 o superior) o 26:

```bash
git clone https://github.com/bilawalsidhu/gods-eye-view.git
cd gods-eye-view
npm ci
npm run doctor
npm run dev
```

Se abre en `http://localhost:4173`. `npm run doctor` comprueba Node, npm y qué proveedores tienes configurados sin imprimir las claves.

Las claves se añaden **desde la app**, en el botón **POWER UP** de la esquina inferior derecha, que las guarda en un `.env` con permisos solo para el propietario. Las que más cambian la experiencia:

| Clave        | Qué activa                                   | Coste                                         |
| ------------ | -------------------------------------------- | --------------------------------------------- |
| Cesium ion   | Google 3D fotorrealista y relieve mundial    | Gratuita para uso personal no comercial, con cuota |
| Google Maps  | El mismo 3D directo de Google y búsqueda de lugares | De pago por uso (hay cuota gratuita mensual) |
| OpenAI       | Voz y resumen del HUD                        | De pago por uso; la app pone un aviso a 2 USD y corta a 5 USD |
| AISStream    | Barcos                                       | Gratuita                                      |
| NASA FIRMS   | Incendios                                    | Gratuita                                      |

El servidor escucha solo en `localhost`. Para abrirlo a la red local hay que pedirlo explícitamente (`npm run dev -- --host 0.0.0.0 --port 4173`) y asumir que quien llegue gastará tus claves.

### Su línea roja

El proyecto modela **eventos, activos, infraestructura y sistemas**. No acepta funciones de búsqueda de personas por nombre, reconocimiento facial ni seguimiento de individuos: los _pull requests_ que crucen esa línea no se fusionan. El README también avisa de que es un cliente para explorar y aprender, no un servicio endurecido para producción.

## Argos Atlas

[Argos Atlas](https://argosatlas.com/map/) es una plataforma web en español con el lema _We never blink_. Se centra en **cámaras públicas de tráfico** (dice agregar miles de cámaras de cientos de portales oficiales; el mapa anuncia «+200.000» nodos) y añade capas de contexto: aeropuertos, puertos, centrales, vuelos y barcos en vivo.

**Qué muestra y de dónde sale.** Según su página de [fuentes y metodología](https://argosatlas.com/fuentes-y-metodologia/), reutiliza feeds que los organismos públicos de tráfico ya publican, a baja resolución, sin reconocimiento facial ni de matrículas, citando la fuente y guardando solo el último fotograma. Las [atribuciones](https://argosatlas.com/atribuciones/) nombran adsb.lol y OpenSky para los aviones, OpenStreetMap, Natural Earth y OurAirports para el contexto, CARTO y OpenFreeMap para los mapas base y, para el globo 3D, **God's Eye View** (MIT) sobre CesiumJS. No lista los portales de cámaras uno por uno. Los propietarios de un feed pueden pedir su retirada por correo.

**Cómo se usa.** Se abre el mapa en el navegador, se filtran las cámaras con **Filtros** y se marcan favoritas. Hace falta una cuenta, que es gratuita.

**Modelo de negocio.** Es un producto comercial, no un proyecto abierto:

| Plan       | Precio indicado              | Lo principal                                          |
| ---------- | ---------------------------- | ----------------------------------------------------- |
| Free       | 0 €                          | Mapa completo con anuncios; algunas cámaras piden ver un anuncio |
| Pase 24 h  | 3,99 € (pago único)          | Todas las cámaras sin anuncios durante un día         |
| OUTPOST    | 15,99 €/mes                  | Sin anuncios, grabación, ARGOS AI, alertas por geocerca |
| DISTRICT   | 56,99 €/mes                  | Más cámaras grabando, histórico de 7 días             |
| DIVISION   | 199 €/mes                    | Equipos de 10 plazas, histórico de 90 días            |
| AGENCY     | 1.049,99 €/mes               | Uso comercial                                         |

La [página de precios](https://argosatlas.com/pricing/) tiene contradicciones entre la tabla y la FAQ (cuántas cámaras graba cada plan, en qué plan empieza cada función). También choca con la metodología: esta dice que no se guarda histórico de las cámaras, mientras los planes de pago venden grabación. Además, el plan gratuito incluye una capa de «personas VIP». Comprueba qué incluye exactamente antes de pagar.

## OSIRIS

[OSIRIS](https://osirisai.live/) (_Open Source Intelligence & Reconnaissance Integrated System_) es un panel OSINT de [simplifaisoul](https://github.com/simplifaisoul/osiris) con **licencia MIT** y unas 10.700 estrellas. Se presenta como «alternativa open source a Palantir».

**Qué muestra.** En el mapa: aviación (OpenSky), más de 17.000 cámaras públicas (TfL, WSDOT, Caltrans, Taiwán, Hong Kong, Nueva Zelanda, Rijkswaterstaat…), terremotos (USGS), incendios (NASA FIRMS), clima severo (NASA EONET), clima espacial y satélites (NOAA SWPC, N2YO), CVE (NVD), noticias geolocalizadas (GDELT), 23 emisiones de noticias 24 h, publicaciones geolocalizadas de canales públicos de Telegram, y capas estáticas de puertos, puntos estratégicos marítimos, zonas de conflicto e instalaciones nucleares.

**Qué añade frente a los otros dos.**

- **RECON**: escaneo de puertos, DNS, WHOIS, certificados TLS, información de IP, búsqueda de CVE, rastreo de billeteras BTC y ETH, y cruce con la lista de sanciones OFAC (vía OpenSanctions). El escaneo activo lo hace un backend aparte.
- **API pública**: la documentación lista 69 endpoints `GET` que devuelven JSON sin clave; es la misma API que usa el panel.
- **OI**: un asistente que maneja el mapa por texto o voz y un motor de predicción que simula actores en varios mundos paralelos. Funciona con tu propia clave (OpenAI, Anthropic, Gemini, OpenRouter y otros), que se envía por cabecera y no se guarda. También expone un servidor MCP en `/api/mcp`.

**Arquitectura.** Next.js 16 con MapLibre GL: todo se renderiza con WebGL para mantener miles de entidades a 60 fps. Cada feed pasa por una ruta `/api` que normaliza formatos, límites y CORS antes de llegar al cliente.

**Cómo se usa.** En la web, sin cuenta. Para autoalojarlo hace falta Node 20 o superior y ninguna base de datos:

```bash
git clone https://github.com/simplifaisoul/osiris.git
cd osiris
npm install
npm run dev
```

Queda en `http://localhost:3000`. El repositorio también trae `docker-compose.yml` y una imagen en `ghcr.io/simplifaisoul/osiris`.

```bash
curl -s https://osirisai.live/api/stats
```

Esa llamada devuelve contadores agregados (vuelos, satélites, cámaras, incidentes) y sirve para comprobar que la API responde.

**Con cautela.** La descripción del repositorio incluye la dirección de un token de criptomoneda, y la interfaz muestra una etiqueta `$OSIRIS` que no explica. Algunas reseñas han señalado discrepancias entre lo anunciado y lo que hay. Trátalo como un proyecto interesante para leer el código, no como una fuente de verdad.

## Comparativa

| Aspecto            | God's Eye View                         | Argos Atlas                         | OSIRIS                                    |
| ------------------ | -------------------------------------- | ----------------------------------- | ----------------------------------------- |
| Tipo               | Cliente local open source              | Plataforma web comercial            | Plataforma web open source                |
| Licencia           | MIT (según README)                     | Propietaria                         | MIT                                       |
| Enfoque            | Globo 3D cinematográfico y exploración | Cámaras públicas de tráfico         | Panel OSINT con herramientas de red       |
| Motor de mapa      | CesiumJS y Google 3D Tiles             | CesiumJS (globo basado en GEV) y mapas 2D | MapLibre GL                         |
| Stack              | JavaScript sin framework y Vite        | No publicado                        | Next.js 16 y TypeScript                   |
| Cuenta             | No; claves opcionales                  | Sí (gratuita)                       | No                                        |
| Autoalojable       | Sí (Node 24/26 o Pinokio)              | No                                  | Sí (Node 20+ o Docker)                    |
| IA                 | Voz con OpenAI Realtime; MCP           | ARGOS AI en planes de pago          | OI con tu propia clave; MCP               |
| API para terceros  | No es su objetivo                      | Anunciada para planes altos         | 69 endpoints sin clave                    |
| Herramientas activas | No                                   | No                                  | Sí: escaneo de puertos, WHOIS, DNS        |

**Cuál elegir.** Para entender cómo se construye uno de estos globos (interpolación de feeds, SGP4, proyección de cámaras, proxy de claves), God's Eye View es el mejor código para leer. Para mirar cámaras de tráfico sin instalar nada, Argos Atlas. Para un panel con API y utilidades de reconocimiento que integrar en tus scripts, OSIRIS, con las cautelas de arriba.

## Uso responsable

1. **Lo que se puede ver no siempre se puede usar.** Una cámara de tráfico pública está pensada para ver el estado de la vía, no para seguir a alguien. Combinar fuentes puede identificar personas aunque ninguna lo haga por separado.
2. **Respeta los términos de cada fuente.** OpenSky, AISStream, Cesium ion o Google tienen cuotas y condiciones de uso; algunas prohíben el uso comercial en el plan gratuito.
3. **No uses las herramientas activas contra sistemas ajenos.** Un escaneo de puertos sin autorización puede ser delito.
4. **Desconfía de la precisión.** Las estelas son interpolaciones, el tráfico es simulado, las trayectorias de lanzamiento son reconstrucciones y las zonas de conflicto son listas estáticas.
5. **Protege tus claves.** No expongas tu instancia a internet sin un proxy con autenticación.

## Fuentes

- [Repositorio y README de God's Eye View](https://github.com/bilawalsidhu/gods-eye-view)
- [God's Eye View en Pinokio](https://pinokio.co/apps/github-com-bilawalsidhu-gods-eye-view)
- [Argos Atlas: mapa](https://argosatlas.com/map/), [sobre el proyecto](https://argosatlas.com/sobre/), [fuentes y metodología](https://argosatlas.com/fuentes-y-metodologia/), [atribuciones](https://argosatlas.com/atribuciones/) y [precios](https://argosatlas.com/pricing/)
- [OSIRIS: web](https://osirisai.live/), [documentación y API](https://osirisai.live/docs) y [repositorio](https://github.com/simplifaisoul/osiris)
