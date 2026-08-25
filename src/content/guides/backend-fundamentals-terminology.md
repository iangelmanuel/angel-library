---
title: "Backend: fundamentos y terminología"
description: Modelo mental de servidores, APIs, solicitudes, middleware, concurrencia, estado, caché, colas y operación segura.
category: backend
stack: backend-fundamentos
tags: [backend, servidor, api, http, concurrencia, fundamentos]
order: 1
updatedAt: 2026-08-25
---

El **backend** procesa reglas de negocio, identidad, permisos, persistencia e integración con otros sistemas. Puede ejecutarse como un servidor HTTP, una función, un proceso en segundo plano o varios servicios coordinados.

Una **API** (*Application Programming Interface* o interfaz de programación de aplicaciones) define cómo otro software solicita capacidades. Una API web suele usar HTTP, pero también puede usar colas, RPC u otros protocolos.

## Cómo usar esta subcategoría

### Si estás aprendiendo desde cero

Lee esta página completa para construir vocabulario. Después sigue el orden del sidebar:

1. [Diseño de APIs](/guides/backend-api-design): contratos y fronteras.
2. [Idempotencia y caché](/guides/backend-idempotencia-cache): repetición segura y frescura.
3. [Resiliencia](/guides/backend-resiliencia-dependencias): dependencias lentas o caídas.
4. [Colas y jobs](/guides/backend-colas-jobs): trabajo fuera de la request.
5. [Webhooks y tiempo real](/guides/backend-webhooks-tiempo-real): comunicación entre sistemas.
6. [Archivos y object storage](/guides/backend-archivos-object-storage): datos grandes y no estructurados.

Luego aprende Node.js y un framework. Estos fundamentos no dependen de la sintaxis de Express, Astro o Next.js.

### Si vienes a recordar

| Pregunta | Documento |
| --- | --- |
| ¿cómo estructuro contrato, status y validación? | [Diseño de APIs](/guides/backend-api-design) |
| ¿cómo evito pagos u órdenes duplicadas? | [Idempotencia](/guides/backend-idempotencia-cache) |
| ¿cómo manejo timeouts y retries? | [Resiliencia](/guides/backend-resiliencia-dependencias) |
| ¿cuándo saco trabajo de HTTP? | [Colas y jobs](/guides/backend-colas-jobs) |
| ¿webhook, SSE o WebSocket? | [Tiempo real](/guides/backend-webhooks-tiempo-real) |
| ¿cómo subo archivos sin agotar memoria? | [Object storage](/guides/backend-archivos-object-storage) |

La ruta guiada enseña conceptos en orden; la tabla sirve como índice operativo. Ambas llegan al mismo contenido.

## Ciclo de una solicitud

```text
Cliente → DNS/TLS → proxy o balanceador → servidor
        → middleware → autenticación → caso de uso
        → base de datos o servicio externo → respuesta
```

Cada flecha puede añadir latencia y fallar. Una respuesta útil incluye un estado HTTP correcto, datos con forma estable y un identificador que permita seguir la operación en registros.

## Ruta, controlador, servicio y repositorio

Estos nombres no son obligatorios, pero expresan responsabilidades comunes:

- **Ruta:** relaciona método y URL con un punto de entrada.
- **Controlador:** traduce la solicitud HTTP al lenguaje de la aplicación.
- **Caso de uso o servicio de aplicación:** ejecuta una acción de negocio.
- **Repositorio:** abstrae acceso a persistencia para una entidad o agregado.
- **Adaptador:** conecta un contrato interno con una tecnología externa.

```ts
app.post('/orders', async (request, response) => {
  const input = createOrderSchema.parse(request.body);
  const actor = await requireUser(request);
  const result = await createOrder.execute({ actor, input });

  response.status(201).json(result);
});
```

La ruta valida la forma, obtiene identidad y delega la regla. `201 Created` comunica que se creó un recurso. El caso de uso no necesita conocer objetos específicos del framework HTTP.

## REST, RPC y recursos

**REST** significa *Representational State Transfer*. Modela recursos identificados por URLs y utiliza semántica HTTP. **RPC** significa *Remote Procedure Call* o llamada a procedimiento remoto; modela acciones que se invocan a distancia.

```text
REST: POST /orders
RPC:  POST /orders/create
```

Ningún estilo es automáticamente superior. La consistencia, el contrato y la semántica de errores importan más que forzar una acción compleja a parecer un CRUD.

## Middleware

Un **middleware** participa en el flujo antes o después del controlador. Se usa para registro, autenticación, límites, compresión o contexto compartido.

El orden importa. Un middleware de autorización necesita identidad previa; uno de errores debe envolver el código que puede lanzar excepciones. Ocultar reglas de negocio dentro de una cadena de middleware dificulta seguir el flujo.

## Autenticación, autorización y sesión

La autenticación determina identidad; la autorización comprueba permisos. Una **sesión** relaciona una solicitud con estado de autenticación. Puede identificarse con una cookie opaca o un token, pero la decisión no elimina revocación, expiración ni protección ante robo.

Una cookie de sesión suele usar `HttpOnly`, `Secure` y una política `SameSite` apropiada. El servidor verifica permisos sobre cada recurso; confiar en que el cliente no mostrará una URL es una vulnerabilidad.

## Idempotencia

Una operación **idempotente** puede repetirse y producir el mismo efecto final que ejecutarla una vez. `GET` debe ser seguro e idempotente; `PUT` y `DELETE` se diseñan normalmente como idempotentes. `POST` no lo es por definición.

Para pagos o creación de pedidos se puede aceptar una clave de idempotencia:

```http
POST /payments
Idempotency-Key: checkout-7e8f
```

El servidor guarda el resultado asociado y evita duplicar el efecto si el cliente reintenta por una pérdida de conexión.

## I/O, CPU y concurrencia

**I/O** significa *Input/Output* o entrada y salida: red, archivos y base de datos. Esperar I/O no consume CPU de la misma forma que comprimir video o calcular un informe.

Un **proceso** es una instancia aislada del programa. Un **hilo** es una secuencia de ejecución dentro de un proceso. Un **event loop** coordina tareas y operaciones asíncronas. El modelo exacto depende del runtime.

En Node.js, JavaScript pesado puede bloquear el hilo principal aunque las APIs de red sean asíncronas. El trabajo de CPU se divide, se envía a workers o se procesa fuera de la ruta de solicitud.

## Caché

Una caché guarda resultados para responder con menos trabajo. Debe definir clave, duración, invalidación y comportamiento ante fallo.

```ts
const key = `product:${productId}:v2`;
const cached = await cache.get(key);

if (cached) return JSON.parse(cached);

const product = await repository.findById(productId);
await cache.set(key, JSON.stringify(product), { ttl: 300 });
return product;
```

**TTL** significa *Time To Live* o tiempo de vida. Versionar la clave ayuda cuando cambia la forma del dato. La invalidación debe contemplar actualizaciones; servir información rápida pero incorrecta no siempre es aceptable.

## Colas y trabajo en segundo plano

Una **cola** desacopla la recepción de una tarea de su procesamiento. Es útil para correos, conversiones, sincronizaciones o trabajo que puede reintentarse.

Un **worker** consume mensajes. Debe manejar duplicados, reintentos y una cola de mensajes fallidos, conocida como **DLQ** (*Dead-Letter Queue*). Entrega “al menos una vez” significa que un mensaje podría procesarse más de una vez; el manejador debe ser idempotente cuando el efecto lo requiera.

## Tiempo de espera, reintentos y circuit breaker

Toda llamada remota necesita un **timeout** o tiempo máximo. Los reintentos usan retraso creciente y aleatoriedad para no amplificar una caída. Solo se reintentan operaciones seguras o protegidas con idempotencia.

Un **circuit breaker** o cortacircuitos deja de llamar temporalmente a una dependencia que falla. Esto protege recursos y permite degradar la funcionalidad en vez de acumular solicitudes bloqueadas.

## Cierre ordenado

Un **graceful shutdown** o cierre ordenado deja de aceptar trabajo nuevo, termina lo que está en curso dentro de un plazo y cierra conexiones.

```text
Señal de apagado → marcar instancia no disponible → detener nuevas solicitudes
                 → terminar trabajo activo → cerrar pool y proceso
```

Sin este flujo, un despliegue puede cortar respuestas o dejar mensajes a medio procesar.

## Checklist de una operación

1. Valida forma y tamaño de entradas externas.
2. Autentica y autoriza el recurso concreto.
3. Define estados HTTP y errores de contrato.
4. Protege reintentos con idempotencia cuando haya efectos.
5. Establece límites de tiempo, tamaño y concurrencia.
6. Registra un identificador de correlación sin filtrar secretos.
7. Prueba dependencias lentas, caídas y cierre del proceso.
