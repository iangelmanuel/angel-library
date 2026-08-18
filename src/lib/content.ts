import { getCollection, type CollectionEntry } from 'astro:content';
import { CONTENT_TYPES, CONTENT_TYPE_IDS, type ContentTypeId } from '@/config/site';

/** Cualquier entrada de cualquier colección de la biblioteca. */
export type AnyEntry =
  | CollectionEntry<'technologies'>
  | CollectionEntry<'libraries'>
  | CollectionEntry<'integrations'>
  | CollectionEntry<'recipes'>
  | CollectionEntry<'snippets'>
  | CollectionEntry<'hooks'>
  | CollectionEntry<'components'>
  | CollectionEntry<'utilities'>
  | CollectionEntry<'resources'>
  | CollectionEntry<'skills'>
  | CollectionEntry<'commands'>
  | CollectionEntry<'patterns'>
  | CollectionEntry<'practices'>
  | CollectionEntry<'guides'>
  | CollectionEntry<'tricks'>;

/**
 * Devuelve todas las entradas de todas las colecciones.
 * Los borradores solo aparecen en desarrollo.
 */
export async function getAllEntries(): Promise<AnyEntry[]> {
  const results = await Promise.all(
    CONTENT_TYPE_IDS.map((id) => getCollection(id as 'libraries')),
  );
  const all = results.flat() as AnyEntry[];
  return import.meta.env.DEV ? all : all.filter((entry) => !entry.data.draft);
}

/** URL pública de una entrada: /<coleccion>/<id> */
export function getEntryUrl(entry: AnyEntry): string {
  return `/${entry.collection}/${entry.id}`;
}

/** Clave única "coleccion/id" para comparar entradas. */
export function entryKey(entry: AnyEntry): string {
  return `${entry.collection}/${entry.id}`;
}

export function buildEntryMap(entries: AnyEntry[]): Map<string, AnyEntry> {
  return new Map(entries.map((entry) => [entryKey(entry), entry]));
}

export function sortByTitle<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.data.title.localeCompare(b.data.title, 'es'));
}

/**
 * Curva editorial compartida por sidebar, categorías y navegación anterior/
 * siguiente. `order` organiza una etapa, pero nunca puede adelantar una receta
 * completa a los fundamentos nativos de una tecnología.
 */
export const LEARNING_TYPE_ORDER: ContentTypeId[] = [
  'technologies',
  'guides',
  'practices',
  'patterns',
  'libraries',
  'integrations',
  'components',
  'hooks',
  'utilities',
  'snippets',
  'commands',
  'tricks',
  'recipes',
  'resources',
  'skills',
];

const learningRank = new Map(LEARNING_TYPE_ORDER.map((id, index) => [id, index]));

export function sortByLearningPath<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const rankA = learningRank.get(a.collection as ContentTypeId) ?? Infinity;
    const rankB = learningRank.get(b.collection as ContentTypeId) ?? Infinity;
    if (rankA !== rankB) return rankA - rankB;

    const orderA = (a.data as { order?: number }).order ?? Infinity;
    const orderB = (b.data as { order?: number }).order ?? Infinity;
    return orderA - orderB || a.data.title.localeCompare(b.data.title, 'es');
  });
}

export function getEntriesByType(entries: AnyEntry[], type: ContentTypeId): AnyEntry[] {
  return entries.filter((entry) => entry.collection === type);
}

/**
 * Agrupa entradas por tipo, siguiendo el orden definido en CONTENT_TYPES.
 */
export function groupByType(entries: AnyEntry[]): { meta: (typeof CONTENT_TYPES)[ContentTypeId]; entries: AnyEntry[] }[] {
  return LEARNING_TYPE_ORDER.map((id) => ({
    meta: CONTENT_TYPES[id],
    entries: sortByLearningPath(entries.filter((entry) => entry.collection === id)),
  })).filter((group) => group.entries.length > 0);
}

export interface TagCount {
  tag: string;
  count: number;
}

export function getAllTags(entries: AnyEntry[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const tag of entry.data.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'es'));
}

export function getEntriesByTag(entries: AnyEntry[], tag: string): AnyEntry[] {
  return sortByTitle(entries.filter((entry) => entry.data.tags?.includes(tag)));
}

const dateFormatter = new Intl.DateTimeFormat('es', { dateStyle: 'medium' });

export function formatDate(date: Date): string {
  return dateFormatter.format(date);
}

/** Texto plano del cuerpo markdown, para el índice de búsqueda. */
export function stripMarkdown(body: string): string {
  return body
    .replace(/```(\w*)\n?/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
