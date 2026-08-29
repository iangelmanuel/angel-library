import {
  CATEGORIES,
  CATEGORY_LIST,
  RESOURCE_CATEGORY_LIST,
  STACK_GROUPED_CATEGORIES,
  getStacksForCategory,
  type CategoryId,
  type CategoryMeta,
  type ResourceCategoryId,
  type StackId,
} from '@/config/site';
import { sortByLearningPath, type AnyEntry } from './content';

export interface EntryGroup {
  id: ResourceCategoryId | StackId;
  label: string;
  entries: AnyEntry[];
}

export type CategoryContent =
  | {
      kind: 'resources';
      meta: CategoryMeta;
      entries: AnyEntry[];
      groups: EntryGroup[];
      ungrouped: AnyEntry[];
    }
  | {
      kind: 'stacks';
      meta: CategoryMeta;
      entries: AnyEntry[];
      groups: EntryGroup[];
      ungrouped: AnyEntry[];
    }
  | {
      kind: 'flat';
      meta: CategoryMeta;
      entries: AnyEntry[];
      groups: [];
      ungrouped: AnyEntry[];
    };

/**
 * Aplica una sola vez las reglas de presentación de una categoría.
 * `ungrouped` contiene las guías introductorias o, para categorías planas,
 * toda la ruta de aprendizaje ya ordenada.
 */
export function getCategoryContent(all: AnyEntry[], category: CategoryId): CategoryContent {
  const meta = CATEGORIES[category];
  const entries = all.filter((entry) => entry.data.category === category);

  if (category === 'resources') {
    const groups = RESOURCE_CATEGORY_LIST.map(({ id, label }) => ({
      id,
      label,
      entries: entries.filter(
        (entry) => entry.collection === 'resources' && entry.data.resourceCategory === id,
      ),
    })).filter((group) => group.entries.length > 0);

    return {
      kind: 'resources',
      meta,
      entries,
      groups,
      ungrouped: sortByLearningPath(
        entries.filter((entry) => entry.collection !== 'resources'),
      ),
    };
  }

  if (STACK_GROUPED_CATEGORIES.includes(category)) {
    const groups = getStacksForCategory(category)
      .map(({ id, label }) => ({
        id,
        label,
        entries: sortByLearningPath(
          entries.filter((entry) => entry.data.stack === id),
        ),
      }))
      .filter((group) => group.entries.length > 0);

    return {
      kind: 'stacks',
      meta,
      entries,
      groups,
      ungrouped: sortByLearningPath(entries.filter((entry) => !entry.data.stack)),
    };
  }

  return {
    kind: 'flat',
    meta,
    entries,
    groups: [],
    ungrouped: sortByLearningPath(entries),
  };
}

export interface CategoryEntryGroup {
  meta: CategoryMeta;
  entries: AnyEntry[];
}

/** Agrupa una selección de entradas en el orden público de categorías. */
export function groupEntriesByCategory(entries: AnyEntry[]): CategoryEntryGroup[] {
  return CATEGORY_LIST.map((meta) => ({
    meta,
    entries: sortByLearningPath(
      entries.filter((entry) => entry.data.category === meta.id),
    ),
  })).filter((group) => group.entries.length > 0);
}

/** Categorías visibles con su cantidad de entradas, en orden de navegación. */
export function getCategoryCounts(entries: AnyEntry[]) {
  return CATEGORY_LIST.map((meta) => ({
    ...meta,
    count: entries.filter((entry) => entry.data.category === meta.id).length,
  })).filter((category) => category.count > 0);
}
