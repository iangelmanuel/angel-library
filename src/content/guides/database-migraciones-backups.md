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
updatedAt: 2026-08-25
---

Una **migración** es un cambio versionado del esquema o de los datos. Un **backup** es una copia recuperable. Ninguno es confiable hasta comprobar que puede aplicarse o restaurarse en el tiempo esperado.

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

## Migraciones de datos

Un backfill debe poder reanudarse y ejecutarse varias veces. Procesa lotes con checkpoint, limita carga y mide filas pendientes/errores. No mantengas una transacción gigante durante horas.

```text
seleccionar lote pendiente → actualizar idempotentemente → guardar progreso
                    ↑                                ↓
                    └──────── siguiente lote ───────┘
```

Antes de retirar el campo anterior, confirma que ninguna versión, job, script o consumidor todavía lo escribe.

## RPO y RTO

- **RPO** (*Recovery Point Objective*): cuántos datos se acepta perder, medido en tiempo.
- **RTO** (*Recovery Time Objective*): cuánto puede tardar la recuperación del servicio.

Una copia nocturna implica potencialmente un RPO cercano a 24 horas. Para exigencias menores se necesitan respaldos continuos, registros de transacciones o replicación; la replicación por sí sola no protege contra un borrado lógico que también se replica.

## Restaurar es la prueba

Un simulacro crea una base aislada, restaura, aplica claves necesarias y ejecuta consultas de integridad. Mide tiempo real y documenta dependencias: DNS, secretos, object storage, colas y archivos pueden requerir coordinación con la base.

Prueba también recuperación puntual cuando existe. La restauración técnica termina cuando el producto vuelve a una operación coherente, no cuando el comando deja de imprimir salida.

## Checklist operativo

- Cifra backups y limita quién puede leerlos.
- Mantén copias en una ubicación o cuenta separada.
- Define retención y eliminación verificable.
- Automatiza restauraciones de prueba.
- Valida conteos, restricciones y consultas importantes después de restaurar.
- Documenta credenciales, orden de arranque y responsable de la decisión.

## Referencias

- [PostgreSQL: backup y restore](https://www.postgresql.org/docs/current/backup.html)
- [PostgreSQL: pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)

