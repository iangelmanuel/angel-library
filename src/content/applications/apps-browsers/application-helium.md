---
title: "Helium — navegador Chromium minimalista y sin servicios de Google"
description: "Navegador abierto basado en ungoogled-chromium que bloquea anuncios y rastreadores, evita conexiones sin consentimiento y conserva extensiones modernas."
type: guides
order: 2
tags: [helium, navegador, chromium, ungoogled-chromium, privacidad, open-source]
website: https://helium.computer/
github: https://github.com/imputnet/helium
related:
  - applications/apps-browsers/application-brave
updatedAt: 2026-09-04
---

> Proyecto de **imput**, construido sobre Chromium y ungoogled-chromium. Está publicado como software libre con GPL 3.0 para sus cambios propios y conserva las licencias de los componentes importados.

**Helium** es un navegador para Windows, macOS y Linux que intenta mantener la compatibilidad de Chromium sin depender silenciosamente de servicios de Google. Incluye bloqueo de anuncios y rastreadores, una interfaz compacta y controles de consentimiento durante la configuración inicial.

No es simplemente “Chrome sin iniciar sesión”: parte de **ungoogled-chromium**, sustituye o elimina integraciones de Google y añade servicios propios opcionales para actualizaciones, extensiones y listas de filtros.

## Estado del proyecto

Helium está en **beta**. Puede usarse a diario, pero todavía cabe esperar errores, cambios de interfaz o incompatibilidades que un navegador estable y masivo ya resolvió. Para trabajo crítico conviene conservar un segundo navegador actualizado.

El proyecto desarrolla macOS como plataforma principal. Windows y Linux tienen paquetes oficiales, pero una corrección puede llegar primero a macOS.

## Instalación

La [página oficial de descargas](https://helium.computer/download) detecta la plataforma y ofrece un binario compatible.

| Sistema | Requisito y paquete                                                         |
| ------- | --------------------------------------------------------------------------- |
| macOS   | macOS 13 Ventura o posterior; `.dmg` para Apple Silicon o Intel             |
| Windows | Windows 10 o posterior; instalador `.exe` x64 o ARM64                       |
| Linux   | Fedora, Debian/Ubuntu, AppImage o tarball para x64 y ARM64 según el paquete |

### Debian y Ubuntu

La instalación oficial añade una clave y el repositorio de Helium:

```bash
curl -fsSL https://raw.githubusercontent.com/imputnet/helium-linux/main/pubkey.asc \
  | sudo gpg --dearmor -o /usr/share/keyrings/helium.gpg

echo "deb [signed-by=/usr/share/keyrings/helium.gpg] https://pkg.helium.computer/deb stable main" \
  | sudo tee /etc/apt/sources.list.d/helium.list

sudo apt update
sudo apt install helium-bin
```

### Fedora

```bash
sudo dnf copr enable imput/helium
sudo dnf install helium-bin
```

También hay AppImage y archivos portables en las releases. Descarga siempre desde `helium.computer` o desde los repositorios enlazados por el proyecto; un ejecutable con el mismo nombre publicado por terceros no es equivalente.

## Privacidad y consentimiento

Según su política, Helium no hace solicitudes de red en el primer inicio y conserva localmente los datos de navegación. Durante el onboarding puedes autorizar servicios concretos, como:

- descargar actualizaciones del navegador;
- obtener y actualizar extensiones mediante un proxy de Helium;
- actualizar las listas de filtros de uBlock Origin;
- descargar la lista de atajos de búsqueda o _bangs_;
- enviar reportes de fallos de forma opcional.

Si rechazas esos servicios, el navegador evita esas conexiones, pero también pierdes las funciones que dependen de ellas. “Cero tracking” describe la intención y configuración del navegador, no una garantía de anonimato: los sitios visitados, el buscador elegido, la red y las extensiones conservan sus propias políticas.

## Bloqueo integrado

Helium incluye una bifurcación de **uBlock Origin** y bloquea de forma predeterminada anuncios, rastreadores, banners de cookies y cookies de terceros. También altera algunas APIs usadas para fingerprinting.

Ningún navegador puede eliminar por completo el fingerprinting sin romper funciones web. Cuantas más modificaciones hagas —fuentes raras, extensiones únicas, ventana con tamaño inusual— más singular puede resultar el perfil aunque el navegador bloquee señales comunes.

## Interfaz y funciones

Su enfoque minimalista no significa que falten herramientas modernas:

- cuatro disposiciones de interfaz y un modo sin marco;
- pestañas verticales, grupos de pestañas y vista dividida;
- cambio de pestaña por uso reciente (MRU);
- atajos de teclado personalizables;
- instalación de aplicaciones web progresivas (PWA);
- copia rápida de enlaces;
- extensiones de Chromium.

Las extensiones de Chrome Web Store se descargan a través de servicios proxy de Helium cuando das permiso, para no exponer directamente la descarga a Google. La extensión instalada todavía puede comunicarse con sus propios servidores y leer datos según los permisos concedidos.

## Diferencias frente a Brave

| Helium                                                                   | Brave                                                                |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| Interfaz más mínima y servicios remotos sujetos a consentimiento inicial | Producto más maduro con un ecosistema amplio de servicios opcionales |
| Bloqueo basado en su fork de uBlock Origin                               | Protección propia mediante Shields                                   |
| Basado en ungoogled-chromium                                             | Chromium modificado por Brave                                        |
| Actualmente beta                                                         | Canal estable consolidado, además de Beta y Nightly                  |

Ambos reducen rastreo y conservan compatibilidad con Chromium. La decisión real es estabilidad y ecosistema frente a una configuración más austera y explícita.

## Para desarrollo web

Las DevTools y el comportamiento de renderizado parten de Chromium, por lo que sirve para inspeccionar sitios modernos. No debe ser el único navegador de pruebas: los parches de privacidad pueden bloquear solicitudes y no cubre diferencias de Firefox o WebKit.

Cuando algo falle, reproduce el caso en un perfil limpio y en otro Chromium estable antes de reportarlo. Así podrás distinguir un bug de la página, de una extensión, de un filtro o de Helium.

## Cuándo encaja

- Quieres Chromium, extensiones y PWA sin la integración habitual con Google.
- Prefieres aprobar explícitamente los servicios de red del navegador.
- Aceptas usar software beta y reportar problemas reproducibles.

No encaja como único navegador en un equipo donde la estabilidad, políticas corporativas o soporte comercial sean requisitos estrictos.

## Enlaces oficiales

- [Sitio y descargas de Helium](https://helium.computer/)
- [Repositorio principal](https://github.com/imputnet/helium)
- [Política de privacidad](https://helium.computer/privacy)
- [Descargas por plataforma](https://helium.computer/download)
