import { useEffect, useState, type CSSProperties } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import type { NavData } from '@/lib/nav';

/**
 * Menú de navegación para pantallas pequeñas.
 * Se abre desde el botón del header mediante el evento `angel:toggle-nav`.
 * Los enlaces son anchors normales: ClientRouter los intercepta y aplica
 * view transitions; aquí solo cerramos el panel.
 */
export default function MobileNav({ data }: { data: NavData }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const toggle = () => setOpen((value) => !value);
    window.addEventListener('angel:toggle-nav', toggle);
    return () => window.removeEventListener('angel:toggle-nav', toggle);
  }, []);

  const close = () => setOpen(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left"
          aria-label="Menú de navegación"
        >
          <DialogPrimitive.Title className="sr-only">Navegación</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Menú con categorías, documentación y acceso a la búsqueda.
          </DialogPrimitive.Description>

          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
            <span className="font-pixel text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              menú
            </span>
            <DialogPrimitive.Close
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Cerrar menú"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navegación móvil">
            <button
              type="button"
              onClick={() => {
                close();
                window.dispatchEvent(new CustomEvent('angel:open-search'));
              }}
              className="mb-4 flex w-full items-center gap-2 border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              <span className="font-mono font-semibold text-[var(--accent-green)]" aria-hidden="true">$</span>
              <span className="flex-1 text-left">grep docs</span>
              <kbd className="kbd">/</kbd>
            </button>

            <div className="flex flex-col gap-0.5 pb-4">
              <a href="/" className="nav-link" onClick={close}>
                <DynamicIcon name="home" className="size-3.5 text-[var(--accent-blue)]" /> Inicio
              </a>
              <a href="/tags" className="nav-link" onClick={close}>
                <DynamicIcon name="tags" className="size-3.5 text-[var(--accent-yellow)]" /> Tags
              </a>
            </div>

            {data.categories.map((category) => (
              <div
                key={category.id}
                className="pb-4"
                style={{ '--cat-accent': `var(${category.color})` } as CSSProperties}
              >
                <p className="section-label flex items-center gap-2 px-2 pb-1.5">
                  <DynamicIcon name={category.icon} className="size-3 text-[var(--cat-accent)]" />
                  {category.label}
                </p>
                {(category.resourceGroups ?? category.stackGroups) && (
                  <div className="flex flex-col gap-2 pl-2">
                    {(category.resourceGroups ?? category.stackGroups)!.map((group) => (
                      <div key={group.id}>
                        <p className="px-2 pb-1 font-mono text-[0.62rem] text-muted-foreground">{group.label}</p>
                        <div className="flex flex-col gap-0.5 border-l border-border pl-2">
                          {group.items.map((item) => (
                            <a key={item.url} href={item.url} className="nav-link" onClick={close}>
                              <DynamicIcon name={item.icon} className="size-3.5 text-[var(--cat-accent)]" />
                              <span className="truncate">{item.title}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {category.items.length > 0 && (
                  <div className="flex flex-col gap-0.5">
                    {category.items.map((item) => (
                      <a key={item.url} href={item.url} className="nav-link" onClick={close}>
                        <DynamicIcon name={item.icon} className="size-3.5 text-[var(--cat-accent)]" />
                        <span className="truncate">{item.title}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
