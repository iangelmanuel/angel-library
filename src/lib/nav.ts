import {
  CATEGORIES,
  CATEGORY_GROUPS,
  CONTENT_TYPES,
  STACKS,
  type CategoryId,
  type ContentTypeId,
  type ResourceCategoryId,
  type StackId,
} from '@/config/site';
import { getEntryUrl, sortByLearningPath, type AnyEntry } from './content';
import { getCategoryContent } from './content-groups';

/**
 * Datos de navegación para la sidebar (Astro) y el menú móvil (isla React).
 * Se construyen una sola vez por página a partir de las colecciones.
 */

/** Icono de marca por `language`, cuando aplica. */
const LANGUAGE_ICONS: Partial<Record<string, string>> = {
  css: 'brand-css',
  typescript: 'brand-typescript',
};

/**
 * Icono por entrada: casos especiales primero (Zod), después el tipo de
 * contenido (libraries → caja verde,
 * hooks → glifo TS, para distinguirlos del átomo de React del stack),
 * después el stack de conocimiento (lenguaje, framework o herramienta) si está declarado,
 * después el lenguaje (CSS/TypeScript), y por defecto el icono genérico
 * del tipo.
 */
function iconFor(entry: AnyEntry): string {
  if (entry.collection === 'libraries' && entry.id === 'zod') return 'brand-zod';
  if (entry.collection === 'guides' && entry.id === 'typescript-path-aliases') return 'brand-typescript';
  if (entry.collection === 'patterns' && entry.id === 'site-config-global') return 'brand-typescript';
  if (entry.collection === 'libraries') return 'stack-dependency';
  if (entry.collection === 'hooks') return 'brand-typescript';

  const stack = (entry.data as { stack?: StackId }).stack;
  if (stack) return STACKS[stack].icon;

  const language = (entry.data as { language?: string }).language;
  return (language && LANGUAGE_ICONS[language]) || CONTENT_TYPES[entry.collection as ContentTypeId].icon;
}

export interface NavItem {
  title: string;
  url: string;
  /** Icono del tipo de contenido */
  icon: string;
}

export interface NavCategory {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;
  items: NavItem[];
  resourceGroups?: NavGroup[];
  stackGroups?: NavGroup[];
}

/** Subgrupo dentro de una categoría: por categoría de recurso o por stack de conocimiento. */
export interface NavGroup {
  id: ResourceCategoryId | StackId;
  label: string;
  items: NavItem[];
}

/**
 * Bloque de categorías separado visualmente en la navegación.
 * Refleja `CATEGORY_GROUPS` de `config/site.ts`.
 */
export interface NavCategoryGroup {
  id: string;
  categories: NavCategory[];
}

export interface NavData {
  groups: NavCategoryGroup[];
}

function toNavItems(entries: AnyEntry[]): NavItem[] {
  return sortByLearningPath(entries).map((entry) => ({
    title: entry.data.title,
    url: getEntryUrl(entry),
    icon: iconFor(entry),
  }));
}

export function buildNavData(all: AnyEntry[]): NavData {
  const buildCategory = (id: CategoryId): NavCategory => {
    const meta = CATEGORIES[id];
    const content = getCategoryContent(all, id);

    const resourceGroups = content.kind === 'resources'
      ? content.groups.map(({ id, label, entries }) => ({
          id,
          label,
          items: toNavItems(entries),
        }))
      : undefined;

    const stackGroups = content.kind === 'stacks'
      ? content.groups.map(({ id, label, entries }) => ({
          id,
          label,
          items: toNavItems(entries),
        }))
      : undefined;
    const items = toNavItems(content.ungrouped);

    return { ...meta, items, resourceGroups, stackGroups };
  };

  const hasContent = (category: NavCategory) =>
    category.items.length > 0 ||
    (category.resourceGroups?.length ?? 0) > 0 ||
    (category.stackGroups?.length ?? 0) > 0;

  // Un grupo entero sin contenido no dibuja separador: evita dos líneas
  // seguidas cuando todas sus categorías están vacías.
  const groups: NavCategoryGroup[] = CATEGORY_GROUPS.map((group) => ({
    id: group.id,
    categories: (group.categories as readonly CategoryId[])
      .map(buildCategory)
      .filter(hasContent),
  })).filter((group) => group.categories.length > 0);

  return { groups };
}
