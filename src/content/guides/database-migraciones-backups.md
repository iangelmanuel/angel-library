---
title: Migraciones, backups y recuperación
description: Cambiar esquemas y recuperar datos con despliegues compatibles, copias verificadas, objetivos RPO/RTO y simulacros de restauración.
category: database
stack: database-operacion
order: 1
tags: [database, migrations, backups, restore, operations]
related:
  - guides/postgresql-practico
  - guides/cicd-pipeline-fundamentals
updatedAt: 2026-08-28
---

Una **migración** es un cambio versionado del esquema o de los datos. Un **backup** es una copia recuperable. Ninguno es confiable hasta comprobar que puede aplicarse o restaurarse en el tiempo esperado.

## Dos responsabilidades diferentes

| Pieza | Responde a | No sustituye |
| --- | --- | --- |
| migración | ¿cómo evoluciona el esquema? | backup |
| backup | ¿cómo recupero una copia anterior? | réplica |
| réplica | ¿cómo distribuyo o continúo el servicio? | historial ante borrado lógico |
| registro de transacciones | ¿cómo reproduzco cambios hasta un punto? | simulacro de restauración |

Las migraciones pertenecen al repositorio y siguen el mismo proceso de revisión que el código. No edites una migración que ya pudo ejecutarse en otros entornos: crea la siguiente corrección.

## Migraciones de esquema y de datos

- una migración **DDL** cambia objetos: tabla, columna, constraint o índice;
- una migración de **datos** transforma filas existentes;
- un cambio de aplicación modifica cómo se lee o escribe.

Aunque una herramienta los presente juntos, pueden tener tiempos y riesgos diferentes. Separar el backfill largo del cambio estructural permite medir, pausar y reanudar.

## Cambios compatibles: expandir y contraer

Renombrar o eliminar una columna en el mismo despliegue puede romper instancias antiguas que aún atienden tráfico. Un flujo más seguro es:

1. **Expandir:** agregar la nueva columna o tabla sin retirar la anterior.
2. Desplegar código capaz de convivir con ambas versiones.
3. Migrar datos en lotes y observar errores.
4. Cambiar lecturas a la nueva estructura.
5. **Contraer:** retirar escritura y columna antiguas en otro despliegue.

```sql
ALTER TABLE users ADD COLUMN display_name text;

-- Backfill por lotes, no una transacción gigantesca.
UPDATE users
SET display_name = full_name
WHERE id > $1 AND id <= $2 AND display_name IS NULL;
```

En tablas grandes, revisa si una operación toma locks prolongados o reescribe todas las filas. Define timeout y un plan de cancelación.

## Añadir una columna obligatoria sin detener el sistema

Un despliegue gradual puede seguir esta secuencia:

1. agrega la columna permitiendo `NULL` o con un valor predeterminado seguro;
2. despliega escritura del nuevo campo;
3. rellena datos antiguos en lotes;
4. verifica que no queden nulos;
5. añade la restricción `NOT NULL` mediante una estrategia apropiada para el tamaño y versión;
6. elimina compatibilidad antigua en un despliegue posterior.

Durante la transición, la aplicación debe poder leer filas antiguas y nuevas. El contrato temporal es parte del diseño, no un accidente.

## Índices y constraints en tablas grandes

Crear un índice o validar una constraint puede bloquear o consumir recursos. PostgreSQL ofrece variantes como `CREATE INDEX CONCURRENTLY`, con reglas y fallos parciales que la herramienta de migración debe manejar. Una opción frecuente es añadir una constraint como `NOT VALID` y validarla después, según el tipo compatible.

No copies el comando sin comprobar versión, motor y framework de migración. Prueba con una copia representativa y establece `lock_timeout` para fallar rápido antes de detener tráfico inesperadamente.

## Migraciones de datos

Un backfill debe poder reanudarse y ejecutarse varias veces. Procesa lotes con checkpoint, limita carga y mide filas pendientes/errores. No mantengas una transacción gigante durante horas.

```text
seleccionar lote pendiente → actualizar idempotentemente → guardar progreso
                    ↑                                ↓
                    └──────── siguiente lote ───────┘
```

Antes de retirar el campo anterior, confirma que ninguna versión, job, script o consumidor todavía lo escribe.

Un backfill robusto registra:

- cursor o rango completado;
- filas procesadas por segundo;
- pendientes, omitidas y fallidas;
- carga sobre réplica o primario;
- versión del transformador;
- capacidad de detenerse sin perder progreso.

```sql
UPDATE users
SET normalized_email = lower(email)
WHERE id > $1
  AND id <= $2
  AND normalized_email IS NULL;
```

La condición final hace el lote idempotente. Aun así, decide qué ocurre si el correo cambia mientras el proceso avanza.

## RPO y RTO

- **RPO** (*Recovery Point Objective*): cuántos datos se acepta perder, medido en tiempo.
- **RTO** (*Recovery Time Objective*): cuánto puede tardar la recuperación del servicio.

Una copia nocturna implica potencialmente un RPO cercano a 24 horas. Para exigencias menores se necesitan respaldos continuos, registros de transacciones o replicación; la replicación por sí sola no protege contra un borrado lógico que también se replica.

## Backups lógicos y físicos

Un backup **lógico** exporta objetos y datos —por ejemplo con `pg_dump`—. Es portátil y permite seleccionar objetos, pero restaurar grandes volúmenes puede ser lento. Un backup **físico** copia el estado del cluster y suele combinarse con WAL para recuperación puntual; depende más de versión y topología.

**PITR** (*Point-in-Time Recovery* o recuperación a un punto en el tiempo) restaura una base física y reproduce WAL hasta antes de un incidente. Exige conservar la cadena completa, reloj confiable, permisos, almacenamiento y un procedimiento probado.

| Escenario | Mecanismo posible |
| --- | --- |
| recuperar una tabla pequeña | exportación lógica o restauración aislada |
| perder una instancia completa | backup físico + WAL o backup administrado |
| volver antes de un borrado | PITR en entorno separado y reconciliación |
| continuidad por fallo de nodo | failover a réplica, más backups independientes |

## Restaurar es la prueba

Un simulacro crea una base aislada, restaura, aplica claves necesarias y ejecuta consultas de integridad. Mide tiempo real y documenta dependencias: DNS, secretos, object storage, colas y archivos pueden requerir coordinación con la base.

Prueba también recuperación puntual cuando existe. La restauración técnica termina cuando el producto vuelve a una operación coherente, no cuando el comando deja de imprimir salida.

## Runbook de restauración

Un **runbook** es un procedimiento operativo ejecutable. Debe indicar:

1. quién declara el incidente y quién aprueba el punto de recuperación;
2. ubicación y cifrado de backups;
3. entorno aislado donde restaurar primero;
4. comandos, versiones y credenciales necesarias;
5. consultas de integridad y smoke tests;
6. cómo reconectar aplicaciones, DNS, colas y jobs;
7. qué datos posteriores al punto se reconciliarán;
8. cómo documentar tiempos reales y mejoras.

Evita restaurar directamente encima de la única copia dañada. Conserva evidencia y crea una instancia separada cuando sea posible.

## Checklist operativo

- Cifra backups y limita quién puede leerlos.
- Mantén copias en una ubicación o cuenta separada.
- Define retención y eliminación verificable.
- Automatiza restauraciones de prueba.
- Valida conteos, restricciones y consultas importantes después de restaurar.
- Documenta credenciales, orden de arranque y responsable de la decisión.
- Comprueba que el backup incluye roles, extensiones y configuración necesaria, o documenta cómo reconstruirlos.
- Alerta por backups atrasados, incompletos o imposibles de descifrar.
- Registra el RPO y RTO logrados en cada simulacro.

## Lista previa a una migración

- compatible con la versión anterior y siguiente de la aplicación;
- revisada sobre volumen representativo;
- tiempo de lock y duración conocidos;
- backup/restauración vigentes para cambios de alto riesgo;
- responsable, ventana, métricas y criterio de cancelación;
- rollback realista o estrategia de avance correctivo;
- jobs y consumidores antiguos incluidos en el análisis.

## Referencias

- [PostgreSQL: backup y restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL: pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL: archivado de WAL y PITR](https://www.postgresql.org/docs/current/continuous-archiving.html)

