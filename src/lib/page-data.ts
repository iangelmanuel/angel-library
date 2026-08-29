import {
  CATEGORIES,
  CONTENT_TYPES,
  type ContentTypeId,
} from '@/config/site';
import {
  buildEntryMap,
  getAllEntries,
  getAllTags,
  getEntryUrl,
  sortByLearningPath,
  stripMarkdown,
  type AnyEntry,
} from './content';
import { getCategoryCounts } from './content-groups';
import { getRelated, validateContentRelations } from './relations';

export async function getHomePageData() {
  const entries = await getAllEntries();
  const tags = getAllTags(entries);
  const recent = entries
    .filter((entry) => entry.data.updatedAt)
    .sort((a, b) => b.data.updatedAt!.getTime() - a.data.updatedAt!.getTime())
    .slice(0, 6);

  return {
    entries,
    categories: getCategoryCounts(entries),
    recent,
    tags,
    topTags: tags.slice(0, 16),
  };
}

/** Entradas de rutas de detalle, incluyendo privadas y con relaciones validadas. */
export async function getEntryPathData() {
  const entries = await getAllEntries(true);
  validateContentRelations(entries);
  return entries;
}

export async function getEntryPageData(entry: AnyEntry) {
  const entries = await getAllEntries(true);
  const entryMap = buildEntryMap(entries);
  const related = getRelated(entry, entries, entryMap);
  const currentStack = entry.data.stack;
  const siblings = sortByLearningPath(
    entries.filter(
      (item) =>
        item.data.category === entry.data.category && item.data.stack === currentStack,
    ),
  );
  const index = siblings.findIndex((item) => item.id === entry.id);

  return {
    entryMap,
    related,
    relatedExplicit: [...related.explicit, ...related.backlinks],
    categoryMeta: CATEGORIES[entry.data.category],
    prev: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
    hasNamedCodeBlocks: /```[^\n]*\btitle=["']/.test(entry.body ?? ''),
  };
}

export async function getSearchIndexData() {
  const entries = await getAllEntries();

  return entries.map((entry) => {
    const typeMeta = CONTENT_TYPES[entry.collection as ContentTypeId];
    const categoryMeta = CATEGORIES[entry.data.category];
    return {
      title: entry.data.title,
      description: entry.data.description,
      url: getEntryUrl(entry),
      type: entry.collection,
      typeLabel: typeMeta.label,
      typeSingular: typeMeta.singular,
      typeIcon: typeMeta.icon,
      categoryId: categoryMeta.id,
      categoryLabel: categoryMeta.label,
      categoryIcon: categoryMeta.icon,
      categoryColor: categoryMeta.color,
      tags: entry.data.tags ?? [],
      content: stripMarkdown(entry.body ?? '').slice(0, 1200),
    };
  });
}
