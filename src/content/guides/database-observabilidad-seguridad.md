---
title: Observabilidad y seguridad de bases de datos
description: Proteger acceso y datos, definir métricas y alertas, responder a saturación o consultas lentas y reducir el impacto de incidentes.
category: database
stack: database-operacion
order: 3
tags: [database, observabilidad, seguridad, monitoreo, incidentes]
related:
  - guides/database-pooling-reliability
  - guides/database-migraciones-backups
  - guides/postgresql-mantenimiento-seguridad
  - guides/security-response-incidents
updatedAt: 2026-08-28
---

Operar una base significa saber si responde correctamente, si se acerca a un límite y si alguien accede más de lo necesario. La observabilidad explica el estado; la seguridad reduce probabilidad e impacto; los runbooks convierten señales en acciones controladas.

## Modelo de amenazas básico

Un **threat model** o modelo de amenazas enumera activos, actores, vías de acceso y controles. Para una base de datos, pregunta:

- ¿qué datos causarían mayor daño si se filtran, alteran o eliminan?
- ¿qué servicios, personas y proveedores pueden conectarse?
- ¿desde qué redes y con qué identidad?
- ¿cómo puede una entrada externa convertirse en consulta?
- ¿qué sucede si se roba una credencial de aplicación?
- ¿cómo se detecta y recupera una modificación no autorizada?

## Formas comunes de ataque o fallo

| Riesgo | Cómo ocurre | Defensa principal |
| --- | --- | --- |
| inyección SQL/NoSQL | entrada se mezcla con sintaxis | parámetros, allowlists y permisos mínimos |
| credencial filtrada | secreto en Git, log o cliente | secret manager, rotación, red privada |
| cuenta excesiva | aplicación usa rol administrador | separar roles y privilegios mínimos |
| exfiltración | endpoint devuelve datos sin autorización o límite | autorización por objeto, paginación, auditoría |
| borrado/ransomware | identidad comprometida modifica primario y réplicas | backups aislados, retención y restauración probada |
| DoS de consultas | filtros costosos o concurrencia sin límite | timeouts, límites, rate limiting, índices y backpressure |
| copia insegura | producción se descarga a desarrollo | anonimización y entornos con acceso controlado |

Los parámetros protegen valores, no nombres de tabla, columnas u operadores dinámicos. Esos fragmentos se eligen desde una lista permitida. En MongoDB, tampoco aceptes directamente un objeto de filtro del cliente.

## Defensa en profundidad

```text
Internet
  → autenticación y rate limit
  → API con autorización y validación
  → red privada / firewall
  → rol de base con mínimo privilegio
  → constraints y políticas por fila
  → cifrado, auditoría y backups aislados
```

Cada capa asume que otra puede fallar. La aplicación valida intención; la base protege integridad; la red reduce exposición; el backup permite recuperarse.

## Secretos y conectividad

- nunca envíes la URL de base al frontend;
- no guardes `.env` real en el repositorio;
- usa TLS y verificación adecuada al proveedor;
- limita orígenes de red y evita puertos públicos cuando sea posible;
- asigna identidad por servicio y entorno;
- rota credenciales con un periodo de convivencia;
- evita incluir contraseñas o parámetros en errores, traces y métricas.

Una conexión desde una función serverless sigue siendo acceso de servidor. El navegador llama a una API; la API autoriza y consulta con credenciales privadas.

## Autenticación no es autorización

Saber quién es el usuario no demuestra que pueda leer una fila. Verifica organización, propiedad y acción en cada operación.

```sql
SELECT id, title
FROM projects
WHERE id = $1
  AND tenant_id = $2;
```

El `tenant_id` proviene de una sesión validada, no de confiar en un campo enviado por el cliente. RLS puede reforzar este control, pero necesita contexto seguro, pruebas y un rol que no la eluda.

## Qué observar

### Capa de aplicación

- latencia por operación y percentiles p50, p95, p99;
- errores por código o clase, no solo total;
- tiempo de adquisición del pool y consultas por solicitud;
- filas retornadas y payload;
- reintentos, timeouts y cancelaciones.

### Gestor

- conexiones activas, esperando e inactivas en transacción;
- CPU, memoria, almacenamiento e IOPS;
- locks, deadlocks y consultas largas;
- lecturas de caché/disco y crecimiento de tablas/índices;
- WAL, lag de réplica y estado de backups;
- evictions y hit rate si el motor es de caché.

Una métrica sin objetivo ni acción produce ruido. Define un umbral sostenido, severidad, propietario y enlace al runbook.

## Logs, métricas y trazas

- un **log** narra un evento concreto;
- una **métrica** resume valores a lo largo del tiempo;
- una **traza** conecta el recorrido de una solicitud entre servicios.

Añade un identificador de solicitud o traza para relacionar endpoint y consulta, pero no registres SQL con datos personales completos. Normaliza consultas y separa valores. Controla acceso y retención de la telemetría: también contiene información sensible.

## Alertas útiles

| Alerta | Condición orientativa | Acción inicial |
| --- | --- | --- |
| pool saturado | espera alta durante varios minutos | revisar consultas, carga e instancias |
| almacenamiento | tendencia agotará capacidad antes del margen | identificar crecimiento y ampliar con plan |
| réplica atrasada | supera tolerancia de lectura/failover | revisar red, carga y WAL |
| backup fallido | no existe copia dentro del RPO | corregir y ejecutar/verificar copia |
| locks prolongados | bloquean una ruta crítica | identificar bloqueador y migración/query |
| error rate | aumenta sobre línea base | segmentar por operación y código |

Evita alertar por un pico de segundos que se resuelve solo. Tampoco esperes al 100 % de disco: la tendencia y el tiempo hasta el límite son más accionables.

## Diagnóstico de una base lenta

1. Confirma impacto: endpoints, regiones, tenants y periodo.
2. Separa espera de pool, red y ejecución SQL.
3. Revisa cambios recientes, migraciones y jobs.
4. Identifica consultas por costo total y frecuencia.
5. Examina locks, CPU, I/O, conexiones y almacenamiento.
6. Obtén un plan con parámetros representativos en un entorno seguro.
7. Mitiga con el cambio reversible más pequeño.
8. Verifica recuperación y documenta causa raíz.

Reiniciar puede borrar evidencia y ofrecer alivio temporal sin corregir el origen. Captura estado antes cuando el incidente lo permita.

## Reducir impacto de un incidente

- revoca o rota la credencial comprometida;
- aísla la vía de acceso sin destruir evidencia;
- preserva logs y línea temporal;
- determina datos leídos, modificados o eliminados;
- restaura en un entorno separado y valida;
- comunica según el plan de incidentes y obligaciones aplicables;
- corrige el control y prueba que el ataque ya no funciona.

No inventes una restauración durante el incidente. Practica con anticipación y registra tiempos reales.

## Datos en entornos no productivos

Una copia de producción en una laptop o preview amplía la superficie de ataque. Prefiere datos sintéticos. Si necesitas realismo, anonimiza de forma irreversible, conserva relaciones necesarias y elimina secretos, tokens, contenido personal y archivos asociados.

Prueba el anonimizador: reemplazar nombres pero dejar correos, texto libre o URLs firmadas no es suficiente.

## Lista de comprobación

- base no expuesta innecesariamente a Internet;
- identidades separadas y permisos mínimos;
- autorización por recurso y tenant;
- parámetros/allowlists para consultas dinámicas;
- secretos rotables fuera de Git y logs;
- métricas de aplicación, pool y gestor correlacionadas;
- alertas con propietario y runbook;
- backups aislados y restauración ensayada;
- datos no productivos sintéticos o anonimizados;
- plan de respuesta con evidencia y comunicación.

## Referencias

- [OWASP: SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [PostgreSQL: seguridad del cliente](https://www.postgresql.org/docs/current/libpq-ssl.html)
- [PostgreSQL: monitoreo](https://www.postgresql.org/docs/current/monitoring.html)
- [MongoDB: lista de comprobación de seguridad](https://www.mongodb.com/docs/manual/administration/security-checklist/)
