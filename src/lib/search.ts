import Fuse from 'fuse.js';

/** Documento del índice de búsqueda. */
export interface SearchDoc {
  title: string;
  description: string;
  url: string;
  type: string;
  /** Plural del tipo. */
  typeLabel: string;
  /** Singular del tipo. */
  typeSingular: string;
  typeIcon: string;
  categoryId: string;
  categoryLabel: string;
  categoryIcon: string;
  categoryColor: string;
  tags: string[];
  content: string;
}

let cache: SearchDoc[] | null = null;
let pending: Promise<SearchDoc[]> | null = null;

/** Carga el índice una vez por sesión. */
export function loadSearchIndex(): Promise<SearchDoc[]> {
  if (cache) return Promise.resolve(cache);
  pending ??= fetch('/search-index.json')
    .then((res) => {
      if (!res.ok) throw new Error(`Error al cargar el índice de búsqueda (${res.status})`);
      return res.json() as Promise<SearchDoc[]>;
    })
    .then((docs) => {
      cache = docs;
      return docs;
    })
    .catch((error) => {
      pending = null;
      throw error;
    });
  return pending;
}

export function createFuse(docs: SearchDoc[]): Fuse<SearchDoc> {
  return new Fuse(docs, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'tags', weight: 0.2 },
      { name: 'description', weight: 0.2 },
      { name: 'content', weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
}
