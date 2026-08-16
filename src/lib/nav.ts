import {
  CATEGORY_LIST,
  CONTENT_TYPES,
  CONTENT_TYPE_LIST,
  RESOURCE_CATEGORY_LIST,
  STACK_LIST,
  type CategoryId,
  type ContentTypeId,
  type ResourceCategoryId,
  type StackId,
} from '@/config/site';
import { getEntryUrl, type AnyEntry } from './content';

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
 * contenido (libraries → caja verde, components → icono amarillo), después
 * el stack de frontend (Astro/React/Next.js) si está declarado, después el
 * lenguaje (CSS/TypeScript), y por defecto el icono genérico del tipo.
 */
function iconFor(entry: AnyEntry): string {
  if (entry.collection === 'libraries' && entry.id === 'zod') return 'brand-zod';
  if (entry.collection === 'libraries') return 'stack-dependency';
  if (entry.collection === 'components') return 'stack-component';

  const stack = (entry.data as { stack?: StackId }).stack;
  if (stack) return `brand-${stack === 'nextjs' ? 'nextjs' : stack}`;

  const language = (entry.data as { language?: string }).language;
  return (language && LANGUAGE_ICONS[language]) || CONTENT_TYPES[entry.collection as ContentTypeId].icon;
}

/**
 * Orden dentro de una categoría: librerías primero, después snippets de CSS
 * agrupados, después utilities de TypeScript agrupadas, el resto al final
 * (alfabético en cada grupo). Evita que el listado de una categoría con
 * temas mezclados (ej. "General": Zod, CSS, JS) quede intercalado al azar
 * por orden alfabético puro.
 */
function groupRank(entry: AnyEntry): number {
  if (entry.collection === 'libraries') return 0;
  const language = (entry.data as { language?: string }).language;
  if (language === 'css') return 1;
  if (language === 'typescript') return 2;
  return 3;
}

/**
 * Con `order` en el frontmatter, ese orden manda (útil para un grupo de
 * stack donde el orden "lógico" —importancia, orden de la doc oficial—
 * importa más que el alfabético). Sin `order` en ninguna de las dos
 * entradas comparadas, cae al orden por tipo/lenguaje de arriba.
 */
function sortForNav<T extends AnyEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const orderA = (a.data as { order?: number }).order;
    const orderB = (b.data as { order?: number }).order;
    if (orderA !== undefined || orderB !== undefined) {
      return (orderA ?? Infinity) - (orderB ?? Infinity) || a.data.title.localeCompare(b.data.title, 'es');
    }
    return groupRank(a) - groupRank(b) || a.data.title.localeCompare(b.data.title, 'es');
  });
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

export interface NavType {
  id: ContentTypeId;
  label: string;
  icon: string;
  url: string;
  count: number;
}

export interface NavData {
  categories: NavCategory[];
  types: NavType[];
}

function toNavItems(entries: AnyEntry[]): NavItem[] {
  return sortForNav(entries).map((entry) => ({
    title: entry.data.title,
    url: getEntryUrl(entry),
    icon: iconFor(entry),
  }));
}

export function buildNavData(all: AnyEntry[]): NavData {
  const types: NavType[] = CONTENT_TYPE_LIST.map((meta) => ({
    id: meta.id,
    label: meta.label,
    icon: meta.icon,
    url: `/${meta.id}`,
    count: all.filter((entry) => entry.collection === meta.id).length,
  }));

  const categories: NavCategory[] = CATEGORY_LIST.map((meta) => {
    const entries = all.filter((entry) => entry.data.category === meta.id);
    const isResources = meta.id === 'resources';
    const isFrontend = meta.id === 'frontend';

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

    const stackGroups = isFrontend
      ? STACK_LIST.map((stack) => ({
          id: stack.id,
          label: stack.label,
          items: toNavItems(entries.filter((entry) => (entry.data as { stack?: StackId }).stack === stack.id)),
        })).filter((group) => group.items.length > 0)
      : undefined;

    // Lo que ya quedó agrupado (por recurso o por stack) no se repite en el listado plano.
    const ungrouped = entries.filter((entry) => {
      if (isResources) return false;
      if (isFrontend) return !(entry.data as { stack?: StackId }).stack;
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

  return { categories, types };
}
