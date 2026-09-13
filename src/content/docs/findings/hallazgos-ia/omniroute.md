---
title: "OmniRoute: gateway compatible con OpenAI y fallback entre modelos"
description: Gateway local que unifica proveedores de IA, detecta salud y cuota y redirige solicitudes cuando un modelo o su límite no está disponible.
type: resources
sidebar:
  order: 7
tags: [omniroute, ai-gateway, modelos, fallback, openai-compatible, proveedores]
url: https://github.com/diegosouzapw/OmniRoute
website: https://www.omniroute.online/
resourceCategory: ia
official: true
personalNote: "Trátalo como una capa de enrutamiento local: conserva tus clientes compatibles con OpenAI y cambia proveedores sin repartir esa lógica por toda la aplicación."
updatedAt: 2026-09-10
---

## En pocas palabras

[OmniRoute](https://github.com/diegosouzapw/OmniRoute) es un gateway local con un endpoint compatible con OpenAI. Centraliza credenciales y modelos de varios proveedores, consulta su salud y cuota y puede elegir un fallback cuando una solicitud falla o un proveedor alcanza su límite.

El proyecto anuncia cientos de proveedores y modelos, además de un catálogo de planes gratuitos. Esas cifras y la disponibilidad cambian; tómalas como el estado que declara el repositorio en la fecha de consulta, no como una garantía de capacidad futura.

## Qué problema resuelve

Sin un gateway, cada aplicación conoce un SDK, una variable de entorno y un formato de error distinto. OmniRoute propone esta forma:

```text
tu aplicación → endpoint OpenAI-compatible → regla de ruta → proveedor/modelo
                                                     ↘ fallback
```

La aplicación conserva una interfaz estable y el gateway decide qué proveedor utilizar. El fallback no convierte modelos incompatibles en equivalentes: debes elegir modelos con capacidades, contexto y formatos de salida que tu caso soporte.

## Primer recorrido local

El repositorio documenta una interfaz web local en `http://localhost:20128` y comandos de diagnóstico como `omniroute doctor`. La instalación y el nombre de los binarios pueden cambiar, así que empieza por el [README oficial](https://github.com/diegosouzapw/OmniRoute).

Después de levantarlo:

1. registra un proveedor de prueba y limita el permiso de su clave;
2. comprueba el estado de salud y la cuota desde el dashboard;
3. apunta un cliente OpenAI al endpoint local;
4. realiza una petición pequeña y revisa proveedor, latencia, tokens y error;
5. añade un segundo proveedor solo después de comprobar que la respuesta es compatible.

El gateway ofrece combinaciones orientadas a casos como `auto`, `auto/coding`, `auto/cheap` y `auto/offline`, según la configuración descrita por el proyecto. Usa nombres explícitos en producción para que una actualización del catálogo no cambie silenciosamente tu modelo.

## Fallback y cuotas

Una regla sana de fallback distingue al menos:

| Situación | Acción sugerida |
| --- | --- |
| Límite temporal o saturación | Reintentar con backoff y pasar al siguiente proveedor. |
| Error de autenticación | Detener esa ruta y alertar; no rotar claves sin control. |
| Modelo no disponible | Elegir un modelo alternativo previamente validado. |
| Respuesta inválida | Registrar la respuesta y no repetir indefinidamente. |
| Límite de presupuesto | Bloquear la ruta o pedir aprobación. |

El catálogo de tiers gratuitos sirve para explorar, pero los límites, regiones, retención y términos dependen de cada proveedor. Revisa el dashboard y la documentación del proveedor antes de enviar datos sensibles.

## Integración conceptual con un cliente OpenAI

La mayoría de clientes solo necesita cambiar la URL base y la clave del gateway:

```ts
import OpenAI from "openai"

const client = new OpenAI({
  baseURL: "http://localhost:20128/v1",
  apiKey: process.env.OMNIROUTE_KEY
})
```

Instala el cliente con `pnpm add openai` en el proyecto que haga la llamada.
El nombre exacto del endpoint, la autenticación y los parámetros admitidos deben copiarse de la [documentación del proyecto](https://github.com/diegosouzapw/OmniRoute) instalada. No guardes claves de proveedores en el frontend.

## Cuándo conviene

- prototipos que comparan modelos sin cambiar toda la aplicación;
- equipos que necesitan una política común de fallback y observabilidad;
- entornos locales donde varias herramientas comparten proveedores;
- pruebas de coste o disponibilidad con modelos equivalentes.

Una integración directa es más simple para una sola aplicación y un proveedor. Añade el gateway cuando el problema sea la coordinación, no solo porque exista un catálogo grande.

## Límites, privacidad y operación

- Un gateway se convierte en un punto único de fallo: monitoriza su proceso y su almacenamiento de logs.
- Los proveedores pueden recibir prompts, archivos y metadatos; define qué rutas admiten información privada.
- Las métricas de cuota no sustituyen la factura oficial de cada proveedor.
- Un fallback puede cambiar calidad, latencia, herramientas o precio si no lo acotas.
- Actualiza el gateway y revisa cambios de modelos antes de usarlo en un flujo crítico.

## Fuentes

- [Repositorio y README de OmniRoute](https://github.com/diegosouzapw/OmniRoute)
- [Sitio oficial](https://www.omniroute.online/)
- [Documentación del proyecto](https://github.com/diegosouzapw/OmniRoute/tree/main/docs)
