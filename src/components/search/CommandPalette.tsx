import { useEffect, useMemo, useState } from 'react';
import { navigate } from 'astro:transitions/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import { createFuse, loadSearchIndex, type SearchDoc } from '@/lib/search';

interface PaletteType {
  id: string;
  label: string;
  icon: string;
  url: string;
  count: number;
}

/**
 * Command Palette global.
 *
 * - Se abre con Ctrl/Cmd+K o con "/" (eventos `angel:open-search` /
 *   `angel:toggle-search` emitidos por el script global de BaseLayout).
 * - El índice (/search-index.json) se descarga una única vez por sesión.
 * - Persiste entre navegaciones gracias a `transition:persist`.
 */
export default function CommandPalette({ types }: { types: PaletteType[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    const toggleHandler = () => setOpen((value) => !value);
    window.addEventListener('angel:open-search', openHandler);
    window.addEventListener('angel:toggle-search', toggleHandler);
    return () => {
      window.removeEventListener('angel:open-search', openHandler);
      window.removeEventListener('angel:toggle-search', toggleHandler);
    };
  }, []);

  useEffect(() => {
    if (!open || docs) return;
    loadSearchIndex()
      .then(setDocs)
      .catch(() => setFailed(true));
  }, [open, docs]);

  const fuse = useMemo(() => (docs ? createFuse(docs) : null), [docs]);

  const results = useMemo(() => {
    if (!query.trim() || !fuse) return [];
    return fuse.search(query, { limit: 14 }).map((result) => result.item);
  }, [fuse, query]);

  const groups = useMemo(() => {
    const byType = new Map<string, SearchDoc[]>();
    for (const item of results) {
      const list = byType.get(item.type) ?? [];
      list.push(item);
      byType.set(item.type, list);
    }
    return [...byType.values()];
  }, [results]);

  function go(url: string) {
    setOpen(false);
    setQuery('');
    navigate(url);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) setQuery('');
  }

  const loading = open && !docs && !failed;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideClose
        className="top-[10vh] translate-y-0 gap-0 overflow-hidden p-0 sm:top-[16vh] sm:max-w-xl"
      >
        <DialogTitle className="sr-only">Buscar en la biblioteca</DialogTitle>
        <DialogDescription className="sr-only">
          Busca tecnologías, librerías, snippets, recetas, comandos y más.
        </DialogDescription>

        <Command shouldFilter={false} loop label="Buscar en la biblioteca">
          <CommandInput
            autoFocus
            placeholder="Buscar… (prisma, git reset, debounce)"
            value={query}
            onValueChange={setQuery}
          />

          <CommandList>
            <CommandEmpty>
              {loading
                ? 'cargando índice…'
                : failed
                  ? 'no se pudo cargar el índice de búsqueda'
                  : query
                    ? `sin resultados para "${query}"`
                    : 'escribe para buscar'}
            </CommandEmpty>

            {!query && (
              <>
                <CommandGroup heading="Navegar">
                  <CommandItem value="nav-inicio" onSelect={() => go('/')}>
                    <DynamicIcon name="home" className="size-4 text-muted-foreground" />
                    Inicio
                  </CommandItem>
                  <CommandItem value="nav-tags" onSelect={() => go('/tags')}>
                    <DynamicIcon name="tags" className="size-4 text-muted-foreground" />
                    Todos los tags
                  </CommandItem>
                  <CommandItem value="nav-buscar" onSelect={() => go('/search')}>
                    <DynamicIcon name="search" className="size-4 text-muted-foreground" />
                    Página de búsqueda
                  </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Explorar por tipo">
                  {types.map((type) => (
                    <CommandItem
                      key={type.id}
                      value={`tipo-${type.id}`}
                      onSelect={() => go(type.url)}
                    >
                      <DynamicIcon name={type.icon} className="size-4 text-muted-foreground" />
                      {type.label}
                      <CommandShortcut>{type.count}</CommandShortcut>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {query &&
              groups.map((group) => (
                <CommandGroup key={group[0].type} heading={group[0].typeLabel}>
                  {group.map((doc) => (
                    <CommandItem key={doc.url} value={doc.url} onSelect={() => go(doc.url)}>
                      <DynamicIcon name={doc.typeIcon} className="size-4 text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate">{doc.title}</span>
                        <span className="block truncate text-[0.68rem] text-muted-foreground">
                          {doc.typeSingular} · {doc.categoryLabel}
                          {doc.tags.length > 0 && ` · ${doc.tags.slice(0, 3).join(' · ')}`}
                        </span>
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
          </CommandList>

          <div className="flex items-center gap-4 border-t border-border px-3 py-2 font-mono text-[0.62rem] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">↑↓</kbd> navegar
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">↵</kbd> abrir
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="kbd">esc</kbd> cerrar
            </span>
            {docs && (
              <span className="ml-auto hidden sm:block">{docs.length} entradas</span>
            )}
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
