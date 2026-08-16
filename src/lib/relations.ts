import { buildEntryMap, entryKey, type AnyEntry } from './content';

/**
 * Sistema de relaciones entre contenidos.
 *
 * Las referencias en frontmatter son ids planos (`related: [zod, prisma]`).
 * De aquí salen tres fuentes de relación:
 * - relaciones explícitas (campo `related`)
 * - backlinks (entradas que referencian a esta)
 * - afinidad por tags compartidos
 *
 * Las integraciones y recetas que usan una tecnología se detectan solas
 * a través de su campo `technologies`: no hay que declarar nada en ambos
 * sentidos ni duplicar contenido.
 */

export interface RelatedData {
  /** Declaradas explícitamente en `related` */
  explicit: AnyEntry[];
  /** Entradas que referencian a esta en su `related` */
  backlinks: AnyEntry[];
  /** Integraciones cuyo `technologies` incluye esta entrada */
  integrations: AnyEntry[];
  /** Recetas cuyo `technologies` o `related` incluye esta entrada */
  recipes: AnyEntry[];
  /** Recursos externos relacionados explícitamente */
  resources: AnyEntry[];
  /** Afinidad por tags compartidos (máx. 6) */
  byTags: AnyEntry[];
}

interface WithRefs {
  related?: string[];
  technologies?: string[];
  libraries?: string[];
  dependencies?: string[];
  library?: string;
}

function referenceKey(ref: string): string {
  return ref;
}

function referencesOf(data: WithRefs): string[] {
  return [
    ...(data.related ?? []),
    ...(data.technologies ?? []),
    ...(data.libraries ?? []),
    ...(data.dependencies ?? []),
    ...(data.library ? [data.library] : []),
  ];
}

/**
 * Validación de integridad referencial. Se ejecuta en build
 * (getStaticPaths) y falla con mensajes claros si:
 * - dos entradas comparten id
 * - una referencia (`related` / `technologies`) apunta a un id inexistente
 */
export function validateContentRelations(all: AnyEntry[]): void {
  const entryMap = buildEntryMap(all);
  const errors: string[] = [];

  for (const entry of all) {
    const data = entry.data as WithRefs;
    for (const ref of referencesOf(data)) {
      if (!entryMap.has(referenceKey(ref))) {
        errors.push(`  ${entry.collection}/${entry.id} → "${ref}" no existe`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `[contenido] Referencias rotas:\n${errors.join('\n')}`,
    );
  }
}

export function getRelated(
  entry: AnyEntry,
  all: AnyEntry[],
  entryMap: Map<string, AnyEntry> = buildEntryMap(all),
): RelatedData {
  const selfKey = entryKey(entry);
  const seen = new Set<string>([selfKey]);

  const take = (target: AnyEntry[], item: AnyEntry | undefined): boolean => {
    if (!item || seen.has(entryKey(item))) return false;
    seen.add(entryKey(item));
    target.push(item);
    return true;
  };

  const integrations: AnyEntry[] = [];
  const recipes: AnyEntry[] = [];
  const resources: AnyEntry[] = [];
  const backlinks: AnyEntry[] = [];

  for (const other of all) {
    if (entryKey(other) === selfKey) continue;
    const data = other.data as WithRefs;
    const tech = data.technologies ?? [];
    const rel = data.related ?? [];

    // Los grupos semánticos tienen prioridad sobre "Relacionado"
    if (other.collection === 'integrations' && tech.includes(entryKey(entry))) {
      if (take(integrations, other)) continue;
    }
    if (
      other.collection === 'recipes' &&
      (tech.includes(entryKey(entry)) || rel.includes(entryKey(entry)))
    ) {
      if (take(recipes, other)) continue;
    }
    if (rel.includes(entryKey(entry))) {
      if (other.collection === 'resources') {
        take(resources, other);
      } else {
        take(backlinks, other);
      }
    }
  }

  const explicit: AnyEntry[] = [];
  for (const ref of (entry.data as WithRefs).related ?? []) {
    const relatedEntry = entryMap.get(referenceKey(ref));
    if (relatedEntry?.collection === 'resources') {
      take(resources, relatedEntry);
    } else {
      take(explicit, relatedEntry);
    }
  }

  const myTags = new Set(entry.data.tags ?? []);
  const byTags =
    myTags.size === 0
      ? []
      : all
          .filter((other) => !seen.has(entryKey(other)))
          .map((other) => ({
            other,
            score: (other.data.tags ?? []).filter((tag) => myTags.has(tag)).length,
          }))
          .filter(({ score }) => score > 0)
          .sort(
            (a, b) =>
              b.score - a.score ||
              a.other.data.title.localeCompare(b.other.data.title, 'es'),
          )
          .slice(0, 6)
          .map(({ other }) => other);

  return { explicit, backlinks, integrations, recipes, resources, byTags };
}
