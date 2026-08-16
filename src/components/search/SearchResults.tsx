import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import { createFuse, loadSearchIndex, type SearchDoc } from '@/lib/search';

/**
 * Buscador de la página /search.
 * Sincroniza el término con el query param `?q=` (enlazable y compartible).
 */
export default function SearchResults() {
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);

  useEffect(() => {
    setQuery(new URLSearchParams(window.location.search).get('q') ?? '');
    loadSearchIndex()
      .then(setDocs)
      .catch(() => setDocs([]));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [query]);

  const fuse = useMemo(() => (docs ? createFuse(docs) : null), [docs]);

  const results = useMemo(
    () =>
      query.trim() && fuse ? fuse.search(query, { limit: 40 }).map((result) => result.item) : [],
    [fuse, query],
  );

  return (
    <div>
      <div className="flex items-center gap-2 border border-border bg-card px-3 transition-colors focus-within:border-border-strong">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar en toda la biblioteca…"
          aria-label="Buscar en la biblioteca"
          className="h-11 w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
          autoFocus
        />
      </div>

      <p className="mt-3 font-mono text-[0.68rem] text-muted-foreground" aria-live="polite">
        {docs === null
          ? 'cargando índice…'
          : query
            ? `${results.length} resultado${results.length === 1 ? '' : 's'}`
            : `${docs.length} entradas indexadas`}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {results.map((doc) => (
          <a key={doc.url} href={doc.url} className="card">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DynamicIcon name={doc.typeIcon} className="size-3" />
              <span className="font-pixel text-[0.6rem] uppercase tracking-wider">
                {doc.typeSingular}
              </span>
              <span className="font-mono text-[0.65rem]" aria-hidden="true">
                ·
              </span>
              <span className="font-mono text-[0.65rem]">{doc.categoryLabel}</span>
            </div>
            <h2 className="text-[0.95rem] font-medium leading-snug text-foreground">
              {doc.title}
            </h2>
            <p className="line-clamp-2 text-[0.8rem] leading-relaxed text-muted-foreground">
              {doc.description}
            </p>
            {doc.tags.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-x-3 gap-y-1 pt-1">
                {doc.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </a>
        ))}

        {query && docs !== null && results.length === 0 && (
          <p className="border border-dashed border-border px-4 py-8 text-center font-mono text-xs text-muted-foreground">
            sin resultados para &quot;{query}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
