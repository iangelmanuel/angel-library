---
title: "PMTiles: mapas web servidos desde un solo archivo estático"
description: "Formato abierto de archivo único para teselas de mapa que el navegador lee por partes con peticiones HTTP Range, sin servidor de teselas. Incluye CLI, librerías para MapLibre, Leaflet y OpenLayers, y el mapa base de Protomaps construido con OpenStreetMap."
tags: [mapas, pmtiles, protomaps, openstreetmap, maplibre, leaflet, teselas, http-range, s3, gis]
sidebar:
  order: 10
draft: false
resourceCategory: Sitio oficial
official: true
website: https://protomaps.com
github: https://github.com/protomaps/PMTiles
technologies:
  - backend/backend-fundamentos/backend-archivos-object-storage
  - performance/performance-operacion/performance-cache-cdn
note: "Tres licencias distintas: la especificación PMTiles es dominio público/CC0, las implementaciones de referencia (librería JS, CLI) son BSD-3-Clause y el mapa base de Protomaps es un «Produced Work» de OpenStreetMap bajo ODbL, con atribución obligatoria."
warnings:
  - "Si usas datos de OpenStreetMap (incluido el mapa base de Protomaps) tienes que mostrar la atribución «© OpenStreetMap» en el mapa. Omitirla incumple la licencia ODbL."
  - "La API alojada de Protomaps solo es gratuita para uso no comercial; para uso comercial piden hacerse GitHub Sponsor. Requiere clave de API, y la clave queda visible en el navegador (se protege con restricciones CORS por clave)."
  - "Las descargas del mapa base cambian de URL y desaconsejan el hotlinking: copia el archivo a tu propio almacenamiento. Si lo sirves desde un bucket público, revisa los costes de transferencia de tu proveedor."
updatedAt: 2026-11-16
---

## En pocas palabras

[PMTiles](https://github.com/protomaps/PMTiles) es un **formato de archivo** que guarda una pirámide completa de teselas de mapa (todas las piezas cuadradas de todos los niveles de zoom) en **un solo archivo**. Subes ese archivo a un almacenamiento estático como S3, Cloudflare R2 o tu propio servidor web, y el navegador descarga solo las teselas que necesita mediante **peticiones HTTP Range**.

Lo mantiene [Protomaps](https://protomaps.com), tiene unas 3.200 estrellas y su especificación va por la versión 3. Protomaps ofrece además un mapa base mundial en este formato y una API alojada para quien no quiera gestionar el archivo.

## Qué problema resuelve

Un mapa web interactivo no es una imagen: es un mosaico de **teselas** (tiles), piezas cuadradas que se piden según la posición y el zoom con coordenadas `z/x/y`. Tradicionalmente tienes dos caminos:

- **Pagar un proveedor** (Google Maps, Mapbox…) por cada carga de mapa.
- **Montar tu propio servidor de teselas**, con base de datos, proceso siempre encendido y mantenimiento.

PMTiles elimina el servidor. Según su documentación, subir una pirámide global como unos 300 millones de archivos sueltos podría costar 1.500 USD solo en peticiones y tardar días; un único archivo se sube de una vez y, al deduplicar teselas repetidas (el océano, por ejemplo), reduce un 70 % o más el tamaño de un mapa base mundial.

## Cómo funciona

Una **petición HTTP Range** pide solo un rango de bytes de un archivo (`Range: bytes=1000-1999`) en lugar del archivo entero. Casi cualquier almacenamiento de objetos y servidor web la admite.

1. El archivo empieza con una cabecera fija y un **directorio raíz** que indica en qué posición del archivo está cada tesela.
2. El lector pide primero esa cabecera, y luego, si hace falta, un directorio intermedio. El diseño garantiza **como mucho dos peticiones intermedias cacheables** antes de la tesela.
3. Con la posición en la mano, pide el rango exacto de la tesela.
4. Las teselas se ordenan siguiendo una **curva de Hilbert**, de modo que las teselas cercanas en el mapa también quedan cerca en el archivo y se pueden agrupar.

Sirve para cualquier dato en teselas: vectoriales (MVT), raster (PNG, JPEG, WebP) o terreno. Es un formato **de solo lectura**: para cambiar algo hay que regenerar el archivo.

## Formato, API y datos: tres cosas distintas

| Pieza                       | Qué es                                                            | Condiciones                                                         |
| --------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------- |
| Formato PMTiles             | La especificación del archivo                                      | Dominio público / CC0                                                |
| Librerías y CLI             | `pmtiles` en npm y PyPI, `go-pmtiles`, plugins de visores          | BSD-3-Clause                                                         |
| Mapa base de Protomaps      | Un PMTiles del planeta (~120 GB hasta zoom 15) creado con OpenStreetMap | ODbL, atribución a OpenStreetMap obligatoria; descarga gratuita     |
| API alojada de Protomaps    | Teselas del mismo mapa base servidas por CDN con clave de API     | Gratis para uso no comercial; uso comercial vía GitHub Sponsors      |

La API alojada **no sirve PMTiles**: sirve las teselas en formato `z/x/y` y TileJSON, con el mismo contenido que las compilaciones diarias. Puedes reproducirla tú con un CDN, así que no te ata.

## Uso

Para crear archivos, descarga el binario `pmtiles` desde las [releases de go-pmtiles](https://github.com/protomaps/go-pmtiles/releases). Algunos comandos habituales:

```bash
pmtiles convert INPUT.mbtiles OUTPUT.pmtiles
pmtiles extract https://example.com/planet.pmtiles mi-region.pmtiles --bbox=MIN_LON,MIN_LAT,MAX_LON,MAX_LAT
pmtiles show mi-region.pmtiles
```

`extract` recorta una región o limita el zoom (`--maxzoom`) a partir de un archivo local o remoto, sin descargar el planeta entero. Cada nivel de zoom adicional duplica aproximadamente el tamaño.

Para leerlo en el navegador con MapLibre GL:

```bash
npm install pmtiles
```

```js
import maplibregl from "maplibre-gl"
import { Protocol } from "pmtiles"

const protocol = new Protocol()
maplibregl.addProtocol("pmtiles", protocol.tile)

// En el estilo del mapa:
// "sources": { "protomaps": { "type": "vector", "url": "pmtiles://https://example.com/mapa.pmtiles" } }
```

También hay integraciones para Leaflet y OpenLayers, plantillas para servirlo desde AWS Lambda o Cloudflare Workers, y un visor en [pmtiles.io](https://pmtiles.io) para inspeccionar archivos.

## Cuándo conviene y cuándo no

Conviene si quieres un mapa en tu web sin pagar por carga ni mantener un servidor, si tus datos cambian poco o si necesitas que el mapa siga funcionando años sin depender de un tercero.

No conviene si tus datos cambian constantemente (es solo lectura), si necesitas búsqueda de direcciones o rutas (PMTiles solo guarda teselas, no geocodifica) o si tu almacenamiento no admite peticiones Range ni CORS.

## Alternativas

| Opción                          | Diferencia                                                                  |
| ------------------------------- | --------------------------------------------------------------------------- |
| MBTiles                         | Contenedor basado en SQLite, pensado para leerse en disco desde un servidor |
| Teselas sueltas `z/x/y`         | Funciona en estático, pero con millones de archivos que subir               |
| Cloud Optimized GeoTIFF (COG)   | La misma idea de lectura remota por rangos, solo para raster                |
| Proveedores comerciales         | Mapas, geocodificación y rutas listos, a cambio de pago por uso y dependencia |

## Límites y precauciones

- **Atribución.** Cualquier mapa con datos de OpenStreetMap debe mostrar «© OpenStreetMap» con enlace a su página de copyright.
- **CORS y Range.** El bucket debe permitir peticiones desde tu dominio y exponer las cabeceras de rangos; es el error más común al empezar.
- **Rendimiento.** Leer directamente desde el navegador suma una o dos peticiones de directorio. Con un CDN o con `pmtiles serve` delante obtienes URLs `z/x/y` clásicas y menos latencia.
- **Clave de la API.** Restringe por dominio cada clave de la API alojada; en una web pública cualquiera puede verla.

## Fuentes

- [Repositorio y README de PMTiles](https://github.com/protomaps/PMTiles)
- [Especificación v3](https://github.com/protomaps/PMTiles/blob/main/spec/v3/spec.md)
- [Conceptos de PMTiles](https://docs.protomaps.com/pmtiles/)
- [CLI `pmtiles`](https://docs.protomaps.com/pmtiles/cli)
- [PMTiles en MapLibre GL](https://docs.protomaps.com/pmtiles/maplibre)
- [API alojada de Protomaps y política de uso](https://protomaps.com/api)
- [Descargas del mapa base](https://docs.protomaps.com/basemaps/downloads)
- [Copyright de OpenStreetMap](https://www.openstreetmap.org/copyright)
