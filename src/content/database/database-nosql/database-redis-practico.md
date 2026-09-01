---
title: Redis práctico — estructuras, TTL y caché
description: Elegir estructuras de Redis, diseñar claves y expiración, implementar caché, rate limiting, locks y persistencia sin convertir Redis en un punto de fallo.
type: guides
order: 3
tags: [redis, cache, ttl, nosql, rate-limiting]
related:
  - database/database-nosql/database-nosql-modelado
  - backend/backend-fundamentos/backend-idempotencia-cache
  - database/database-operacion/database-pooling-reliability
updatedAt: 2026-08-28
---

Redis es un servidor de estructuras de datos en memoria. Es muy útil para caché, sesiones, contadores, coordinación y colas sencillas, pero su baja latencia no elimina límites de memoria, persistencia ni consistencia.

## Elegir la estructura

| Tipo | Operaciones | Caso frecuente |
| --- | --- | --- |
| string | `SET`, `GET`, `INCR` | caché serializada, contador, flag |
| hash | `HSET`, `HGET`, `HINCRBY` | objeto pequeño por campos |
| list | `LPUSH`, `RPOP` | cola o pila sencilla |
| set | `SADD`, `SISMEMBER` | pertenencia y valores únicos |
| sorted set | `ZADD`, `ZRANGE` | ranking o agenda por puntuación |
| stream | `XADD`, `XREADGROUP` | log de eventos con grupos de consumidores |

Redis también ofrece estructuras especializadas. Elige según las operaciones que necesitas, no solo según la forma de los datos.

## Diseñar nombres de clave

```text
app:prod:user:42:profile
app:prod:session:8f2...
app:prod:rate:user:42:login
```

Un nombre suele incluir aplicación, entorno, entidad e identidad. Evita claves con secretos o datos personales visibles; aparecerán en métricas, comandos y diagnósticos. Define longitud, cardinalidad y quién elimina cada familia.

## TTL y expiración

**TTL** (*Time To Live* o tiempo de vida) es cuánto queda antes de que una clave expire.

```text
SET session:abc '{"userId":42}' EX 1800
TTL session:abc
EXPIRE session:abc 1800
```

`EX` usa segundos; existen variantes en milisegundos. Una clave sin TTL permanece hasta eliminarla o hasta que una política de expulsión actúe. Comprueba que las claves temporales reciban expiración en la misma operación que las crea.

El vencimiento no es un cronómetro de negocio exacto. Si una acción legal o financiera debe ocurrir a una hora, conserva la verdad duradera en la base principal y usa Redis como acelerador o señal auxiliar.

## Cache-aside

```ts
const key = `app:prod:user:${userId}:profile`;
const cached = await redis.get(key);

if (cached) return JSON.parse(cached);

const user = await db.query(
  'SELECT id, display_name FROM users WHERE id = $1',
  [userId],
);

await redis.set(key, JSON.stringify(user), { EX: 300 });
return user;
```

En **cache-aside**, la aplicación consulta caché, carga desde la fuente al fallar y guarda una copia. Al modificar, actualiza la base primero y luego invalida la clave.

```ts
await db.query('UPDATE users SET display_name = $1 WHERE id = $2', [name, userId]);
await redis.del(`app:prod:user:${userId}:profile`);
```

Existe una pequeña ventana entre ambas operaciones. Decide si se tolera y cómo se repara. Para datos críticos, lee del origen o usa un diseño de eventos/versiones que haga visible la antigüedad.

## Problemas clásicos de caché

| Problema | Qué ocurre | Mitigación posible |
| --- | --- | --- |
| penetration | se consulta repetidamente una clave inexistente | validar, cachear ausencia por poco tiempo |
| stampede | muchas solicitudes regeneran la misma clave | bloqueo corto, single-flight, TTL con jitter |
| avalancha | muchas claves expiran simultáneamente | añadir variación al TTL y escalonar cargas |
| dato obsoleto | caché conserva versión anterior | invalidación, versión o TTL acorde al riesgo |
| hot key | una clave concentra tráfico | réplica, caché local o rediseño de acceso |

El **jitter** añade una variación aleatoria pequeña al TTL para que las expiraciones no coincidan.

## Rate limiting con contador

```text
MULTI
INCR app:prod:rate:user:42:login
EXPIRE app:prod:rate:user:42:login 60 NX
EXEC
```

El ejemplo cuenta intentos durante una ventana sencilla. Para precisión y atomicidad completas suele usarse un script Lua o una función del servidor que ejecute todos los pasos como una unidad. Elige algoritmo —ventana fija, deslizante, token bucket— según exactitud, memoria y experiencia esperada.

No confíes en una dirección IP como identidad perfecta: puede compartirse, cambiar o falsificarse según la red y proxies. Combina señales y configura correctamente qué proxy es confiable.

## Sorted sets para rankings y agenda

```text
ZADD leaderboard 9800 user:42
ZADD leaderboard 10400 user:9
ZREVRANGE leaderboard 0 9 WITHSCORES
```

La puntuación ordena elementos. También puede representar un timestamp para tareas programadas. Redis no ejecuta por sí solo el trabajo: un consumidor debe reclamar elementos de forma segura, registrar resultados y manejar reintentos.

## Transacciones y scripts

`MULTI` encola comandos y `EXEC` los ejecuta sin intercalado de otros clientes. No ofrece rollback tradicional si un comando falla durante la ejecución. `WATCH` permite control optimista: `EXEC` falla si cambió una clave observada.

Los scripts Lua y funciones ejecutan lógica atómicamente en el servidor, pero bloquean mientras trabajan. Deben ser breves, acotados y observables.

## Locks distribuidos: cautela

Un lock con `SET key token NX PX ttl` puede coordinar una instancia sencilla. El token debe ser único y solo su propietario puede liberar la clave, normalmente mediante script atómico. Aun así, pausas, expiración y fallos de red hacen que un lock no garantice por sí solo exclusión para operaciones críticas.

Cuando la base de verdad puede expresar la regla con una constraint, versión o lock transaccional, suele ofrecer garantías más claras. Para sistemas distribuidos críticos, estudia fencing tokens y las garantías reales de la topología.

## Memoria, eviction y persistencia

Una política de **eviction** decide qué claves se expulsan al alcanzar el límite de memoria. Si Redis guarda datos que no pueden perderse, una política de caché no es suficiente.

Opciones de persistencia comunes:

- **RDB:** snapshots periódicos, compactos, con posible pérdida desde el último snapshot;
- **AOF:** registra escrituras para reproducirlas, con costo y política de sincronización;
- ambas o ninguna, según durabilidad y caso.

Persistencia, replicación y backup son mecanismos diferentes. Prueba restauración y define RPO/RTO. Si Redis solo es caché, comprueba que el sistema se recupere con caché vacía sin tumbar la base principal por una avalancha.

## Seguridad y operación

- no expongas Redis directamente a Internet;
- usa autenticación, ACL, TLS y red privada según el entorno;
- evita comandos administrativos para roles de aplicación;
- establece límites de memoria y monitorea evictions;
- observa latencia, conexiones, hit rate, hot keys y replicación;
- no ejecutes `KEYS *` en una instancia grande; prefiere `SCAN` para inspección incremental;
- nunca uses claves o valores sensibles en logs.

## Referencias

- [Redis: tipos de datos](https://redis.io/docs/latest/develop/data-types/)
- [Redis: expiración](https://redis.io/docs/latest/commands/expire/)
- [Redis: transacciones](https://redis.io/docs/latest/develop/using-commands/transactions/)
- [Redis: persistencia](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
