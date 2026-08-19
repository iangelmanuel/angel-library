import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import SearchResults from '@/components/search/SearchResults';

/** Terminal global persistente abierta desde Ctrl/Cmd + K, "/" o el header. */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [initialInput, setInitialInput] = useState('');

  useEffect(() => {
    const openHandler = (event: Event) => {
      const detail = (event as CustomEvent<{ initialInput?: string }>).detail;
      setInitialInput(detail?.initialInput ?? '');
      setOpen(true);
    };
    const toggleHandler = () => {
      setInitialInput('');
      setOpen((value) => !value);
    };
    window.addEventListener('angel:open-search', openHandler);
    window.addEventListener('angel:toggle-search', toggleHandler);
    return () => {
      window.removeEventListener('angel:open-search', openHandler);
      window.removeEventListener('angel:toggle-search', toggleHandler);
    };
  }, []);

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) setInitialInput('');
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        hideClose
        className="search-terminal-dialog w-[calc(100vw-1rem)] max-w-none sm:w-[min(92vw,56rem)] sm:max-w-none"
      >
        <DialogTitle className="sr-only">Terminal de angel.library</DialogTitle>
        <DialogDescription className="sr-only">
          Busca documentación, explora tags o ejecuta comandos de navegación.
        </DialogDescription>
        <SearchResults
          variant="dialog"
          initialInput={initialInput}
          onRequestClose={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
