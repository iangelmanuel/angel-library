---
title: "Fieldwatch: un observador pasivo de Wi-Fi y Bluetooth para Android"
description: "App de Android, MIT y sin servidor, que escucha balizas Wi-Fi y anuncios Bluetooth LE y los compara con un catálogo de firmas para señalar rastreadores, cámaras, gafas inteligentes, drones con Remote ID y radios que se mueven contigo."
tags: [android, bluetooth-le, wifi, privacidad, rastreadores, remote-id, contravigilancia, kotlin, sideload]
sidebar:
  order: 16
draft: false
resourceCategory: Repositorio oficial
official: true
url: https://github.com/OffGridPete/Fieldwatch
note: "Solo Android 10 o superior, por sideload (no está en Play Store). Licencia MIT. Versión 1.1.32 (octubre de 2026); el catálogo de firmas de serie, el 97, tiene 255 entradas."
warnings:
  - "Que no aparezca nada no significa que la zona esté limpia: radios apagadas, solo celulares, dormidas o con MAC aleatoria no se ven, y cada móvil limita los escaneos de forma distinta."
  - "Una coincidencia de firma o un aviso de «se mueve contigo» es una hipótesis, no una identificación ni una prueba. No tomes decisiones de seguridad personal basándote solo en la app."
  - "El registro guarda coordenadas completas aunque actives el modo privacidad. Los nombres de calles y los mapas en línea vienen activados de serie y usan el geocodificador del sistema (a menudo de Google o del fabricante)."
  - "Registrar y publicar los dispositivos de otras personas puede chocar con leyes de privacidad o de protección de datos. Lo que hagas con los registros es tu responsabilidad."
updatedAt: 2026-10-27
---

## En pocas palabras

[Fieldwatch](https://github.com/OffGridPete/Fieldwatch) es una app de Android que pone el móvil a **escuchar** lo que emiten los aparatos cercanos por Wi-Fi y por Bluetooth Low Energy, y compara cada señal con un catálogo de firmas para ponerle nombre: un AirTag, una cámara corporal Axon, unas gafas Ray-Ban Meta, una cámara lectora de matrículas de Flock o un dron que emite Remote ID.

La publica Off Grid Pete LLC bajo **licencia MIT**, está escrita en Kotlin y ronda las 4.000 estrellas. El repositorio se creó en septiembre de 2026 y publica versiones casi a diario. Empezó llamándose _Spectre_ y cambió de nombre (y de identificador, `app.fieldwatch`) porque ya había otra app con ese nombre; instalar Fieldwatch no reemplaza a Spectre.

No tiene cuenta, servidor ni anuncios. Todo vive en el teléfono y funciona sin conexión, aunque algunas funciones opcionales sí usan internet (ver más abajo).

## Qué problema resuelve

A tu alrededor hay muchos aparatos que se anuncian por radio sin que lo sepas: etiquetas de búsqueda, cámaras, sensores de tráfico, wearables que graban audio o herramientas de pentesting. Saber qué hay requiere normalmente hardware dedicado (un adaptador en modo monitor, un SDR) y conocimientos de radio.

Fieldwatch se queda en lo que un Android normal deja ver sin root ni accesorios, y lo convierte en algo legible: nombres de familias de dispositivos, avisos sonoros cuando aparece algo marcado y un informe de lo que viste en los últimos minutos.

## Cómo funciona

Dos conceptos de partida:

- **Baliza Wi-Fi (beacon)**: el paquete que un punto de acceso emite varias veces por segundo para anunciar su red. Incluye su dirección MAC (BSSID), el nombre de la red y, a veces, datos del fabricante.
- **Anuncio BLE (advertisement)**: el equivalente en Bluetooth Low Energy. Un aparato BLE grita periódicamente quién es, sin que nadie se conecte a él. Así se encuentran los AirTags, los auriculares o las pulseras.

Fieldwatch es **solo receptor**: no se une a redes, no empareja y no envía nada a los aparatos que detecta. Con lo que oye hace cuatro cosas:

1. **Clasificación por firmas.** Cada firma es un conjunto de reglas: prefijo de MAC del fabricante (OUI), patrón de nombre, identificador de fabricante o UUID de servicio BLE. El catálogo de serie se puede actualizar desde GitHub o importar a mano, y puedes crear firmas propias. La app incluso propone firmas nuevas a partir de familias que se repiten en tu registro.
2. **Decodificación de campos.** Para algunas firmas lee el contenido del anuncio: presión y temperatura de sensores de neumáticos (TPMS) o la trama **Remote ID** de los drones, el identificador que la normativa obliga a emitir a muchos drones y que incluye la posición del aparato y la del punto de despegue o del piloto.
3. **Seguimiento con GPS.** Si activas el etiquetado, cada detección guarda dónde estaba **tu** móvil al oírla (no dónde está el otro aparato). Con eso, el filtro «Moving with you» marca radios fuertes y estables que te siguen al cambiar de sitio, como una etiqueta escondida en un bolso o un coche.
4. **Informes.** _Debrief_ resume en texto o PDF lo visto en una ventana de unos 15 minutos. También exporta el registro completo (CSV, GPX, KML, formato WiGLE), envía marcadores a TAK por CoT y genera un _AI Export_ para pegar en un chat de IA.

## Qué reconoce el catálogo

El catálogo de serie de la versión actual (catálogo 97) tiene 255 firmas, agrupadas en clases. Algunos ejemplos reales de la lista:

| Grupo                        | Firmas de ejemplo                                                     |
| ---------------------------- | --------------------------------------------------------------------- |
| Etiquetas de búsqueda        | Apple AirTags, Tile, Samsung SmartTags, Chipolo, Google Find Hub      |
| Cámaras corporales y policía | Axon, Digital Ally, Motorola Vigilant, Reveal Media, Wolfcom          |
| Lectores de matrículas       | Flock Safety Cameras, Genetec AutoVu, Rekor                           |
| Sensores de disparos         | Raven / ShotSpotter                                                   |
| Gafas y grabadoras           | Ray-Ban / Meta glasses, Snap Spectacles, Even G1, Limitless, Plaud    |
| Drones                       | Remote ID, DJI, Autel, Skydio, Parrot                                 |
| Herramientas de pentesting   | Flipper Zero, Hak5 Pineapple, Pwnagotchi, Marauder / Deauther         |
| Infraestructura y hogar      | Routers (UniFi, TP-Link, Eero…), cámaras (Hikvision, Ring…), cerraduras |

Algunas familias vienen marcadas de serie para avisar con un pitido: cámaras corporales, gafas Meta y Snap y kits de pentesting, entre otras.

Además, desde Ajustes puedes descargar dos capas de mapa que no se incluyen con la app: la lista de lectores de matrículas de EE. UU. (unos 37 MB) y otra de sensores (cámaras de velocidad, semáforos y detectores de disparos, procedente de OpenStreetMap bajo ODbL). Estas capas son puntos en un mapa, no detecciones por radio.

## Instalación

No está en Play Store. Descarga `Fieldwatch.apk` de la carpeta [`dist/`](https://github.com/OffGridPete/Fieldwatch/tree/main/dist) o de las [releases](https://github.com/OffGridPete/Fieldwatch/releases), ábrelo desde el gestor de archivos y permite instalar apps de esa fuente. Play Protect avisará de que no viene de Play: es lo esperado en un sideload. Con el móvil conectado por USB también vale:

```bash
adb install -r dist/Fieldwatch.apk
```

Para recibir actualizaciones, el README recomienda [Obtainium](https://github.com/ImranR98/Obtainium) apuntando al repositorio. Las únicas compilaciones oficiales son las releases de ese repositorio; el archivo `instruction.txt` publica el SHA-256 del APK y del certificado de firma para que puedas comprobarlos.

Después hay que tener activados a nivel de sistema la ubicación precisa, el Wi-Fi y el Bluetooth (Android no entrega resultados de escaneo sin ubicación) y conceder los permisos de dispositivos cercanos y notificaciones. Para escanear con la pantalla bloqueada conviene permitir el uso en segundo plano sin restricciones de batería.

## Qué no hace

Según el README y la tarjeta de instrucciones:

- No ve **clientes** Wi-Fi ni estaciones que solo envían sondeos, ni usa el modo monitor 802.11. Un móvil conectado a una red no aparece; un punto de acceso, sí.
- No hace búsqueda de **Bluetooth clásico** (módulos como HC-05 no aparecen).
- No escucha la red **celular**: una cámara o un poste que solo usa datos móviles no aparece.
- No hace **radiogoniometría**: el RSSI es intensidad de señal, no distancia. El modo _Hunt_ te dice si te acercas o te alejas, nada más.
- La vista en vivo guarda unas 400 radios (máximo 900) y olvida los BLE sin nombre a los pocos minutos.

## Cuándo conviene y cuándo no

Sirve para aprender cómo es el entorno de radio de un sitio, revisar un coche o una habitación en busca de etiquetas de búsqueda o saber si hay cámaras conectadas por Wi-Fi alrededor. También es un buen caso de estudio sobre lo mucho que se puede inferir con lo que expone un Android sin root.

No sirve como garantía. Si te preocupa que te estén siguiendo, la propia documentación pide no usarla en situaciones donde tu seguridad dependa de ella: un barrido sin resultados no demuestra nada.

## Alternativas

| Herramienta                                                                                  | Plataforma | Diferencia                                                         |
| -------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------ |
| [AirGuard](https://github.com/seemoo-lab/AirGuard)                                           | Android    | Centrada en AirTags y accesorios de Find My; proyecto académico del SEEMOO Lab |
| [WiGLE WiFi Wardriving](https://github.com/wiglenet/wigle-wifi-wardriving)                   | Android    | Registro y mapeo de redes Wi-Fi y BLE, sin catálogo de vigilancia  |
| Avisos de rastreo del sistema                                                                | iOS, Android | Avisan de etiquetas compatibles que viajan contigo; sin catálogo propio |

## Privacidad y precauciones

- Sin servidor no significa sin red: la actualización del catálogo, los mapas de teselas y los nombres de calles sí salen a internet. Desactiva «Online place names and maps» si no quieres consultas externas.
- El registro en disco guarda coordenadas completas. El modo privacidad solo enmascara la pantalla y los informes compartidos.
- Las funciones de _AI Export_ y _Share log_ sacan tus rutas del teléfono si las usas. Revisa qué compartes.

## Fuentes

- [Repositorio y README de Fieldwatch](https://github.com/OffGridPete/Fieldwatch)
- [Tarjeta de instrucciones (`instruction.txt`)](https://github.com/OffGridPete/Fieldwatch/raw/main/dist/instruction.txt)
- [Changelog](https://github.com/OffGridPete/Fieldwatch/blob/main/CHANGELOG.md)
- [Catálogo de firmas de serie](https://github.com/OffGridPete/Fieldwatch/blob/main/dist/fieldwatch-signatures-v2.json)
- [Releases](https://github.com/OffGridPete/Fieldwatch/releases)
