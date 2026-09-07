---
title: PostgreSQL — mantenimiento, seguridad y diagnóstico
description: Comprender VACUUM, ANALYZE, roles, privilegios, RLS, logs, locks y estadísticas para operar PostgreSQL de forma segura.
type: guides
order: 3
tags: [postgresql, vacuum, seguridad, roles, observabilidad]
related:
  - database/database-postgresql/postgresql-practico
  - database/database-postgresql/postgresql-transacciones-concurrencia
  - database/database-operacion/database-pooling-reliability
  - database/database-operacion/database-migraciones-backups
updatedAt: 2026-08-28
---

Una base correcta puede degradarse si acumula versiones antiguas, pierde estadísticas, agota conexiones o concede permisos excesivos. La operación comienza por entender qué señales observar, no por copiar parámetros de otra instalación.

## Referencia rápida

| Necesidad                                      | Herramienta o vista                           |
| ---------------------------------------------- | --------------------------------------------- |
| actualizar estadísticas                        | `ANALYZE`                                     |
| recuperar espacio reutilizable y mantener MVCC | `VACUUM` / autovacuum                         |
| ver sesiones y consultas                       | `pg_stat_activity`                            |
| revisar uso de tablas e índices                | `pg_stat_user_tables`, `pg_stat_user_indexes` |
| encontrar bloqueos                             | `pg_locks` + `pg_stat_activity`               |
| controlar privilegios                          | roles, `GRANT`, `REVOKE`                      |
| aislar filas por tenant                        | RLS con políticas bien probadas               |
| medir consultas agregadas                      | `pg_stat_statements` si está disponible       |

No ejecutes comandos de mantenimiento destructivos o cambios globales sin conocer versión, proveedor, tamaño y carga. En servicios administrados algunas tareas y parámetros pertenecen al proveedor.

## Por qué existe `VACUUM`

PostgreSQL utiliza MVCC. Un `UPDATE` crea una nueva versión y un `DELETE` deja una versión muerta que no puede retirarse mientras una transacción antigua todavía pueda verla.

- `VACUUM` marca espacio para reutilización y mantiene información de visibilidad;
- `ANALYZE` toma muestras para estimaciones del optimizador;
- `VACUUM (ANALYZE)` realiza ambas tareas;
- `VACUUM FULL` reescribe y bloquea la tabla, por lo que no es mantenimiento rutinario.

El **autovacuum** automatiza estas tareas. Si no alcanza una tabla de mucha escritura, primero mide tuplas muertas, duración, transacciones largas y frecuencia; después ajusta por tabla cuando sea necesario.

```sql
SELECT relname,
       n_live_tup,
       n_dead_tup,
       last_autovacuum,
       last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

Las estadísticas son aproximadas y pueden reiniciarse. Úsalas como señales combinadas con tamaño, latencia y carga.

## Sesiones y consultas activas

```sql
SELECT pid,
       usename,
       application_name,
       state,
       wait_event_type,
       wait_event,
       now() - query_start AS duration,
       query
FROM pg_stat_activity
WHERE datname = current_database()
ORDER BY query_start;
```

Protege el acceso: el texto de consultas puede contener información sensible. Busca sesiones `idle in transaction`, esperas de lock y consultas largas. No canceles un PID solo por duración; confirma propietario, operación, impacto y si corresponde `pg_cancel_backend` o una terminación más fuerte.

## Detectar bloqueo

Un lock esperado es parte de la consistencia. El problema aparece cuando la espera supera el objetivo del producto o forma una cadena.

Preguntas de diagnóstico:

1. ¿qué sesión espera y desde cuándo?
2. ¿qué sesión bloquea y qué transacción mantiene abierta?
3. ¿es una migración, consulta de aplicación o tarea administrativa?
4. ¿se puede cancelar de manera segura?
5. ¿qué cambio evita la repetición: índice, lote, orden o timeout?

Configura `lock_timeout`, `statement_timeout` e `idle_in_transaction_session_timeout` según el rol y el caso. Un timeout global demasiado pequeño puede romper migraciones; uno infinito permite incidentes prolongados.

## Roles y principio de mínimo privilegio

Un **rol** puede iniciar sesión, poseer objetos o agrupar privilegios. Separa propiedad, migraciones y ejecución de la aplicación.

```sql
CREATE ROLE app_runtime LOGIN;
GRANT CONNECT ON DATABASE app_db TO app_runtime;
GRANT USAGE ON SCHEMA app TO app_runtime;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA app TO app_runtime;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA app TO app_runtime;
```

Los privilegios sobre tablas existentes no garantizan los de objetos futuros. Configura `ALTER DEFAULT PRIVILEGES` desde el rol que creará esos objetos. Evita `SUPERUSER` para la aplicación y rota credenciales sin interrumpir todas las instancias.

## Seguridad por fila con RLS

**RLS** (_Row-Level Security_ o seguridad por fila) aplica políticas dentro de la base.

```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_projects
ON projects
USING (tenant_id = current_setting('app.tenant_id')::bigint)
WITH CHECK (tenant_id = current_setting('app.tenant_id')::bigint);
```

`USING` controla filas visibles o modificables; `WITH CHECK` controla las filas nuevas o resultantes. RLS es defensa adicional, no magia:

- el propietario y roles con `BYPASSRLS` pueden comportarse distinto;
- el contexto de tenant debe fijarse de forma segura por transacción;
- el pool no debe filtrar contexto entre solicitudes;
- prueba `SELECT`, `INSERT`, `UPDATE`, `DELETE`, funciones y jobs administrativos;
- indexa las columnas usadas por la política.

## Conexión segura

- exige TLS cuando la red no sea confiable y verifica certificados según el proveedor;
- almacena credenciales en el sistema de secretos, no en Git;
- restringe red y direcciones permitidas;
- usa una identidad distinta por entorno y propósito;
- rota credenciales y registra accesos administrativos;
- no copies producción completa a desarrollo.

Una URL `postgresql://user:password@host/db` es un secreto. Oculta contraseña, parámetros sensibles y datos de consulta en logs y reportes.

## Estadísticas de consultas

`pg_stat_statements` agrupa consultas normalizadas y ayuda a encontrar costo total, frecuencia y variabilidad. Una consulta de 20 ms ejecutada millones de veces puede importar más que una de dos segundos ejecutada una vez.

Evalúa:

- tiempo total y medio;
- cantidad de llamadas;
- filas retornadas;
- bloques leídos o escritos;
- percentiles desde la observabilidad de la aplicación;
- endpoint, job o caso de uso que origina la consulta.

No optimices únicamente el SQL: a veces el problema es N+1, una respuesta sin límite o reintentos que multiplican carga.

## Particionamiento: cuándo considerarlo

El particionamiento divide una tabla lógica en partes físicas. Puede ayudar a retirar periodos completos, administrar índices y limitar escaneos cuando la consulta incluye la clave de partición. No acelera automáticamente todo ni sustituye índices.

Antes de adoptarlo, define:

- clave estable —fecha o tenant— y distribución equilibrada;
- creación futura y eliminación de particiones;
- constraints únicas, FK y consultas que cruzan particiones;
- automatización y monitoreo para evitar insertar sin partición válida.

## Rutina operativa

### Diario o automatizado

- errores, saturación del pool y conexiones;
- consultas lentas y lock waits;
- almacenamiento, WAL y retraso de réplica;
- backups y tareas fallidas.

### Periódico

- restauración de prueba;
- índices sin uso o duplicados con contexto suficiente;
- crecimiento por tabla e índice;
- tablas con autovacuum insuficiente;
- revisión de roles, accesos y credenciales;
- actualización planificada de PostgreSQL y extensiones.

## Referencias

- [PostgreSQL: mantenimiento rutinario](https://www.postgresql.org/docs/current/maintenance.html)
- [PostgreSQL: monitoreo de actividad](https://www.postgresql.org/docs/current/monitoring-stats.html)
- [PostgreSQL: privilegios](https://www.postgresql.org/docs/current/ddl-priv.html)
- [PostgreSQL: seguridad por fila](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
