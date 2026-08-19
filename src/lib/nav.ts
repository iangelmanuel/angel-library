import {
  CATEGORY_LIST,
  CONTENT_TYPES,
  RESOURCE_CATEGORY_LIST,
  STACK_GROUPED_CATEGORIES,
  STACKS,
  getStacksForCategory,
  type CategoryId,
  type ContentTypeId,
  type ResourceCategoryId,
  type StackId,
} from '@/config/site';
import { getEntryUrl, sortByLearningPath, type AnyEntry } from './content';

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
 * contenido (libraries → caja verde, components → icono amarillo,
 * hooks → glifo TS, para distinguirlos del átomo de React del stack),
 * después el stack de frontend (Astro/React/Next.js) si está declarado,
 * después el lenguaje (CSS/TypeScript), y por defecto el icono genérico
 * del tipo.
 */
function iconFor(entry: AnyEntry): string {
  if (entry.collection === 'libraries' && entry.id === 'zod') return 'brand-zod';
  if (entry.collection === 'guides' && entry.id === 'typescript-path-aliases') return 'brand-typescript';
  if (entry.collection === 'patterns' && entry.id === 'site-config-global') return 'brand-typescript';
  if (entry.collection === 'libraries') return 'stack-dependency';
  if (entry.collection === 'components') return 'stack-component';
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

/** Subgrupo dentro de una categoría: por categoría de recurso o por stack de frontend. */
export interface NavGroup {
  id: ResourceCategoryId | StackId;
  label: string;
  items: NavItem[];
}

export interface NavData {
  categories: NavCategory[];
}

function toNavItems(entries: AnyEntry[]): NavItem[] {
  return sortByLearningPath(entries).map((entry) => ({
    title: entry.data.title,
    url: getEntryUrl(entry),
    icon: iconFor(entry),
  }));
}

export function buildNavData(all: AnyEntry[]): NavData {
  const categories: NavCategory[] = CATEGORY_LIST.map((meta) => {
    const entries = all.filter((entry) => entry.data.category === meta.id);
    const isResources = meta.id === 'resources';
    const usesStackGroups = STACK_GROUPED_CATEGORIES.includes(meta.id);

    const resourceGroups = isResources
      ? RESOURCE_CATEGORY_LIST.map((resourceCategory) => ({
          ...resourceCategory,
          items: toNavItems(
            entries.filter(
              (entry) => entry.collection === 'resources' && entry.data.resourceCategory === resourceCategory.id,
            ),
          ),
        })).filter((group) => group.items.length > 0)
      : undefined;

    const stackGroups = usesStackGroups
      ? getStacksForCategory(meta.id).map((stack) => ({
          id: stack.id,
          label: stack.label,
          items: toNavItems(entries.filter((entry) => (entry.data as { stack?: StackId }).stack === stack.id)),
        })).filter((group) => group.items.length > 0)
      : undefined;

    // Lo que ya quedó agrupado (por recurso o por stack) no se repite en el listado plano.
    const ungrouped = entries.filter((entry) => {
      // Los enlaces externos se agrupan por tipo de recurso. Las guías
      // editoriales de la categoría permanecen visibles antes de esos grupos.
      if (isResources) return entry.collection !== 'resources';
      if (usesStackGroups) return !(entry.data as { stack?: StackId }).stack;
      return true;
    });
    const items = toNavItems(ungrouped);

    return { ...meta, items, resourceGroups, stackGroups };
  }).filter(
    (category) =>
      category.items.length > 0 ||
      (category.resourceGroups?.length ?? 0) > 0 ||
      (category.stackGroups?.length ?? 0) > 0,
  );

  return { categories };
}
