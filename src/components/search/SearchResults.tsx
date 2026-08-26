import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import { navigate } from 'astro:transitions/client';
import { DynamicIcon } from '@/components/shared/DynamicIcon';
import { createFuse, loadSearchIndex, type SearchDoc } from '@/lib/search';

interface TagIndexItem {
  tag: string;
  count: number;
}

interface TerminalMessage {
  id: number;
  command: string;
  lines: string[];
  tone?: 'default' | 'error' | 'success';
}

interface QuizQuestion {
  topic: string;
  question: string;
  choices: readonly string[];
  answer: number;
  explanation: string;
}

interface TerminalSearchProps {
  variant?: 'page' | 'dialog';
  onRequestClose?: () => void;
  initialInput?: string;
}

type MenuItem =
  | { kind: 'document'; doc: SearchDoc }
  | { kind: 'tag'; tag: TagIndexItem };

type InputMode =
  | { kind: 'documents'; needle: string }
  | { kind: 'tags'; needle: string }
  | { kind: 'command'; name: string; args: string };

const TERMINAL_THEMES = [
  'default',
  'matrix',
  'midnight',
  'violet',
  'amber',
  'crimson',
  'ocean',
  'forest',
  'synthwave',
  'ice',
  'mono',
  'retro',
  'angel',
] as const;
type TerminalTheme = (typeof TERMINAL_THEMES)[number];
type TerminalEffect = 'none' | 'rainbow';

const MAX_RESULTS = 12;
const PUBLIC_COMMANDS = [
  'help',
  'clear',
  'pwd',
  'ls',
  'stats',
  'tree',
  'history',
  'search',
  'diccionario',
  'google',
  'mdn',
  'npm',
  'caniuse',
  'quiz',
  'respuesta',
  'tip',
  'tags',
  'open',
  'cd',
  'random',
  'theme',
  'scanlines',
  'reset',
  'motd',
  'whoami',
  'date',
  'echo',
  'back',
  'reload',
  'home',
  'exit',
] as const;
const SECRET_COMMANDS = [
  'myjson',
  'cat',
  'coffee',
  'fortune',
  'ping',
  'matrix',
  'party',
  'sudo',
  '42',
  'bug',
  'duck',
  'rm',
  'hello',
  'rainbow',
  'banner',
  'joke',
] as const;
const ALL_COMMANDS = [
  ...PUBLIC_COMMANDS,
  ...SECRET_COMMANDS,
  'cls',
  'bg',
  'categories',
  'url',
  'define',
  'dict',
  'answer',
];
const COMMAND_SET = new Set<string>(ALL_COMMANDS);
const COMMANDS_WITH_ARGS = new Set([
  'search',
  'tags',
  'open',
  'cd',
  'theme',
  'scanlines',
  'echo',
  'history',
  'diccionario',
  'google',
  'mdn',
  'npm',
  'caniuse',
  'quiz',
  'respuesta',
  'tip',
]);

const COMMAND_DESCRIPTIONS: Record<(typeof PUBLIC_COMMANDS)[number], string> = {
  help: 'mostrar comandos y ejemplos de uso',
  clear: 'limpiar la salida sin borrar el historial',
  pwd: 'mostrar el directorio virtual actual',
  ls: 'listar categorías como directorios',
  stats: 'resumen del índice y de la sesión',
  tree: 'dibujar el árbol de categorías',
  history: 'ver o limpiar comandos anteriores',
  search: 'buscar documentación indexada',
  diccionario: 'buscar la definición de un término en Google',
  google: 'abrir una consulta en Google',
  mdn: 'buscar una tecnología web en MDN',
  npm: 'buscar un paquete en npm',
  caniuse: 'consultar compatibilidad entre navegadores',
  quiz: 'iniciar una pregunta técnica interactiva',
  respuesta: 'responder la pregunta activa',
  tip: 'mostrar un consejo técnico por tema',
  tags: 'entrar al modo de búsqueda por tags',
  open: 'abrir un resultado anterior o una ruta',
  cd: 'navegar a una categoría o sección',
  random: 'abrir un documento al azar',
  theme: 'consultar o cambiar el tema visual',
  scanlines: 'activar o desactivar las líneas CRT',
  reset: 'restaurar la apariencia de la terminal',
  motd: 'mostrar el mensaje de la sesión',
  whoami: 'mostrar la identidad de la sesión',
  date: 'mostrar fecha y hora local',
  echo: 'imprimir texto en la salida',
  back: 'volver a la página anterior',
  reload: 'recargar la página actual',
  home: 'ir al inicio de la biblioteca',
  exit: 'cerrar la terminal global',
};

const HELP_LINES = [
  '/search <texto>   pasar a una búsqueda de documentación',
  '/diccionario <término>  buscar una definición en Google',
  '/google <consulta> · /mdn <tema> · /npm <paquete>',
  '/caniuse <función>      revisar soporte entre navegadores',
  '/quiz [tema] · /respuesta <n|ver> · /tip [tema]',
  '/tags [texto]     listar o filtrar tags; #texto es el atajo directo',
  '/open <n|ruta>    abrir un resultado anterior o una ruta interna',
  '/ls               listar las categorías disponibles',
  '/cd <directorio>  entrar a una categoría, /search, /tags o /',
  '/stats            mostrar estadísticas del índice local',
  '/random           abrir un documento al azar',
  '/theme [nombre]   cambiar el fondo; usa /theme list para ver todos',
  '/scanlines [on|off] · /reset · /motd · /tree',
  '/pwd · /whoami · /date · /url · /echo <texto>',
  '/history          mostrar los últimos comandos ejecutados',
  '/clear | /cls     limpiar la salida de la terminal',
  '/back · /reload · /home · /exit',
  'tip: /cat, /coffee y /fortune son solo el comienzo…',
];

const BANNER_LINES = [
  '  __ _ _ __   __ _  ___| |',
  " / _` | '_ \\ / _` |/ _ \\ |",
  '| (_| | | | | (_| |  __/ |',
  ' \\__,_|_| |_|\\__, |\\___|_|',
  '             |___/  library',
];

const CAT_LINES = [
  ' /\\_/\\',
  '( o.o )',
  ' > ^ <',
];

const COFFEE_LINES = [
  '    ( (',
  '     ) )',
  '  ........',
  '  |      |]',
  '  \\      /',
  '   `----´',
  'compilando motivación… 100%',
];

const BUG_LINES = [
  '   /\\  /\\',
  '  ((ovo))',
  '  ():::()',
  '   VVVVV',
  'no es un bug; ahora es una interacción oculta.',
];

const DUCK_LINES = [
  '   __',
  ' <(o )___',
  '  ( ._> /',
  '   `---´',
  'cuéntame el problema desde el principio.',
];

const FORTUNES = [
  'Primero hazlo funcionar, luego hazlo claro y finalmente hazlo rápido.',
  'El comentario más útil explica por qué, no repite qué hace el código.',
  'Si una función necesita demasiada explicación, quizá necesita ser más pequeña.',
  'La caché convierte problemas difíciles en problemas difíciles de reproducir.',
  'Un buen nombre elimina una reunión futura.',
  'No hay código más rápido que el código que no necesita ejecutarse.',
];

const JOKES = [
  '¿Por qué el programador confundió Halloween y Navidad? Porque OCT 31 = DEC 25.',
  'Hay 10 tipos de personas: las que entienden binario y las que todavía lo están depurando.',
  'Funciona en mi máquina. Excelente, entonces enviemos tu máquina a producción.',
  'Un SQL entra a un bar, se acerca a dos mesas y pregunta: ¿puedo hacer un JOIN?',
];

const QUIZ_QUESTIONS: readonly QuizQuestion[] = [
  {
    topic: 'javascript',
    question: '¿Qué operador conserva valores válidos como 0, false y una cadena vacía?',
    choices: ['||', '??', '&&', '!='],
    answer: 1,
    explanation: '?? solo usa el valor derecho cuando el izquierdo es null o undefined; || también reemplaza otros valores falsy.',
  },
  {
    topic: 'javascript',
    question: '¿En qué cola se procesan las reacciones de una Promise resuelta?',
    choices: ['render queue', 'task queue', 'microtask queue', 'call stack persistente'],
    answer: 2,
    explanation: 'Los callbacks de Promise se programan como microtareas y se atienden antes de la siguiente tarea del event loop.',
  },
  {
    topic: 'html',
    question: '¿Qué elemento nativo crea un bloque desplegable accesible?',
    choices: ['<dialog>', '<details>', '<template>', '<fieldset>'],
    answer: 1,
    explanation: '<details> administra el estado abierto y se combina con <summary> para ofrecer una etiqueta interactiva.',
  },
  {
    topic: 'css',
    question: '¿Qué consulta permite adaptar un componente al ancho de su contenedor?',
    choices: ['@media', '@supports', '@container', '@layer'],
    answer: 2,
    explanation: '@container responde al espacio disponible del contenedor y no únicamente al tamaño del viewport.',
  },
  {
    topic: 'accesibilidad',
    question: '¿Cuándo suele ser apropiado usar aria-label en un botón?',
    choices: ['Siempre', 'Cuando solo tiene un icono sin nombre visible', 'Para reemplazar cualquier texto', 'Solo en formularios'],
    answer: 1,
    explanation: 'aria-label aporta un nombre accesible cuando no existe texto visible; si ya hay una etiqueta clara, normalmente no hace falta.',
  },
  {
    topic: 'http',
    question: '¿Qué estado HTTP representa la creación exitosa de un recurso?',
    choices: ['200', '201', '204', '304'],
    answer: 1,
    explanation: '201 Created indica que el servidor creó el recurso; normalmente se acompaña con una cabecera Location.',
  },
  {
    topic: 'seguridad',
    question: '¿Qué defensa evita que una entrada SQL se interprete como parte de la consulta?',
    choices: ['CORS', 'Consultas parametrizadas', 'Minificación', 'localStorage'],
    answer: 1,
    explanation: 'Las consultas parametrizadas separan los datos de la instrucción SQL y reducen el riesgo de inyección.',
  },
  {
    topic: 'performance',
    question: '¿Qué atributo permite diferir una imagen que está fuera del viewport?',
    choices: ['decoding="sync"', 'fetchpriority="high"', 'loading="lazy"', 'rel="preload"'],
    answer: 2,
    explanation: 'loading="lazy" pospone la descarga de imágenes lejanas; no conviene aplicarlo a la imagen principal que participa en el LCP.',
  },
];

const LEARNING_TIPS = [
  { topic: 'javascript', text: 'Prefiere comparar explícitamente con null cuando 0, false o "" sean valores válidos del dominio.' },
  { topic: 'css', text: 'Usa @supports para aplicar mejoras progresivas sin romper navegadores que todavía no entienden una propiedad.' },
  { topic: 'html', text: 'Antes de crear un componente interactivo desde cero, comprueba si <dialog>, <details> o popover ya resuelven la semántica.' },
  { topic: 'accesibilidad', text: 'Prueba cada flujo solo con Tab, Shift+Tab, Enter, Espacio y Escape; el foco debe ser visible y predecible.' },
  { topic: 'seguridad', text: 'Valida en el servidor incluso cuando el frontend ya validó: el cliente nunca constituye una frontera de confianza.' },
  { topic: 'performance', text: 'Mide antes y después. Una optimización sin una métrica y un escenario reproducible es solo una suposición.' },
  { topic: 'git', text: 'Haz commits pequeños que expresen una sola intención; serán más fáciles de revisar, revertir y reutilizar.' },
  { topic: 'backend', text: 'Diseña timeouts, reintentos e idempotencia juntos para evitar duplicar operaciones cuando una red falla.' },
] as const;

function documentPath(doc: SearchDoc): string {
  const name = doc.url.split('/').filter(Boolean).at(-1) ?? 'document';
  return `${doc.categoryId}/${name}`;
}

function itemUrl(item: MenuItem): string {
  return item.kind === 'document'
    ? item.doc.url
    : `/tags/${encodeURIComponent(item.tag.tag)}`;
}

function parseInput(value: string): InputMode {
  const trimmed = value.trim();

  if (trimmed.startsWith('#')) {
    return { kind: 'tags', needle: trimmed.slice(1).trim() };
  }
  if (trimmed.startsWith('/')) {
    const command = trimmed.slice(1).trimStart();
    const [rawName = '', ...parts] = command.split(/\s+/);
    return {
      kind: 'command',
      name: rawName.toLocaleLowerCase('es'),
      args: parts.join(' ').trim(),
    };
  }
  return { kind: 'documents', needle: trimmed };
}

function isTerminalTheme(value: string | null): value is TerminalTheme {
  return TERMINAL_THEMES.includes(value as TerminalTheme);
}

function normalizeKeyword(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('es');
}

function openExternal(url: string) {
  const destination = new URL(url);
  if (destination.protocol !== 'https:') return;
  window.open(destination.toString(), '_blank', 'noopener,noreferrer');
}

/**
 * Consola común para `/search` y para la terminal global de Ctrl/Cmd + K.
 * La salida tiene un viewport propio: navegar por resultados nunca desplaza
 * el documento que se encuentra detrás.
 */
export default function SearchResults({
  variant = 'page',
  onRequestClose,
  initialInput = '',
}: TerminalSearchProps) {
  const instanceId = useId().replace(/:/g, '');
  const listboxId = `${instanceId}-options`;
  const commandListboxId = `${instanceId}-commands`;
  const statusId = `${instanceId}-status`;
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyDraft = useRef('');
  const messageId = useRef(0);
  const previousItems = useRef<MenuItem[]>([]);
  const [input, setInput] = useState(initialInput);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCommandIndex, setActiveCommandIndex] = useState(0);
  const [messages, setMessages] = useState<TerminalMessage[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>('default');
  const [scanlines, setScanlines] = useState(true);
  const [terminalEffect, setTerminalEffect] = useState<TerminalEffect>('none');
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);

  useEffect(() => {
    if (variant === 'page') {
      setInput(new URLSearchParams(window.location.search).get('q') ?? '');
    }

    loadSearchIndex()
      .then(setDocs)
      .catch(() => {
        setDocs([]);
        setFailed(true);
      });
  }, [variant]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem('angel:terminal-theme');
    if (isTerminalTheme(storedTheme)) setTerminalTheme(storedTheme);
    setScanlines(window.localStorage.getItem('angel:terminal-scanlines') !== 'off');

    try {
      const storedHistory = JSON.parse(
        window.localStorage.getItem('angel:terminal-history') ?? '[]',
      );
      if (Array.isArray(storedHistory)) {
        setCommandHistory(
          storedHistory.filter((entry): entry is string => typeof entry === 'string').slice(-30),
        );
      }
    } catch {
      window.localStorage.removeItem('angel:terminal-history');
    }

    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<string>).detail;
      if (isTerminalTheme(nextTheme)) setTerminalTheme(nextTheme);
    };
    const syncScanlines = (event: Event) => {
      setScanlines((event as CustomEvent<boolean>).detail);
    };
    const syncHistory = (event: Event) => {
      const nextHistory = (event as CustomEvent<unknown>).detail;
      if (!Array.isArray(nextHistory)) return;
      setCommandHistory(
        nextHistory.filter((entry): entry is string => typeof entry === 'string').slice(-30),
      );
    };
    window.addEventListener('angel:terminal-theme', syncTheme);
    window.addEventListener('angel:terminal-scanlines', syncScanlines);
    window.addEventListener('angel:terminal-history', syncHistory);
    return () => {
      window.removeEventListener('angel:terminal-theme', syncTheme);
      window.removeEventListener('angel:terminal-scanlines', syncScanlines);
      window.removeEventListener('angel:terminal-history', syncHistory);
    };
  }, []);

  useEffect(() => {
    if (variant !== 'page') return;
    const url = new URL(window.location.href);
    if (input) url.searchParams.set('q', input);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }, [input, variant]);

  const fuse = useMemo(() => (docs ? createFuse(docs) : null), [docs]);

  const tagIndex = useMemo<TagIndexItem[]>(() => {
    if (!docs) return [];

    const counts = new Map<string, TagIndexItem>();
    for (const doc of docs) {
      for (const tag of doc.tags) {
        const key = tag.toLocaleLowerCase('es');
        const current = counts.get(key);
        counts.set(key, { tag: current?.tag ?? tag, count: (current?.count ?? 0) + 1 });
      }
    }

    return [...counts.values()].sort(
      (a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'es'),
    );
  }, [docs]);

  const categories = useMemo(() => {
    if (!docs) return [];
    const index = new Map<string, { id: string; label: string }>();
    for (const doc of docs) {
      index.set(doc.categoryId, { id: doc.categoryId, label: doc.categoryLabel });
    }
    return [...index.values()].sort((a, b) => a.label.localeCompare(b.label, 'es'));
  }, [docs]);

  const inputMode = useMemo(() => parseInput(input), [input]);
  const normalizedInput = input.trim();
  const commandSuggestions = useMemo(() => {
    if (!normalizedInput.startsWith('/')) return [];
    const candidate = normalizedInput.slice(1).toLocaleLowerCase('es');
    if (candidate.includes(' ')) return [];
    return PUBLIC_COMMANDS.filter(
      (command) => command.startsWith(candidate) && command !== candidate,
    ).slice(0, 12);
  }, [normalizedInput]);
  const selectedCommandIndex = commandSuggestions.length > 0
    ? Math.min(activeCommandIndex, commandSuggestions.length - 1)
    : 0;
  const knownCommand = inputMode.kind === 'command' && COMMAND_SET.has(inputMode.name);

  const menuItems = useMemo<MenuItem[]>(() => {
    if (
      !docs ||
      !normalizedInput ||
      inputMode.kind === 'command'
    ) return [];

    if (inputMode.kind === 'tags') {
      const needle = inputMode.needle.toLocaleLowerCase('es');
      return tagIndex
        .filter(({ tag }) => !needle || tag.toLocaleLowerCase('es').includes(needle))
        .slice(0, MAX_RESULTS)
        .map((tag) => ({ kind: 'tag' as const, tag }));
    }

    if (!fuse || !inputMode.needle) return [];
    return fuse
      .search(inputMode.needle, { limit: MAX_RESULTS })
      .map(({ item: doc }) => ({ kind: 'document' as const, doc }));
  }, [docs, fuse, inputMode, normalizedInput, tagIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [input, menuItems.length]);

  useEffect(() => {
    setActiveCommandIndex(0);
  }, [commandSuggestions]);

  useEffect(() => {
    if (menuItems.length > 0) previousItems.current = menuItems;
  }, [menuItems]);

  useEffect(() => {
    const output = outputRef.current;
    const optionId = commandSuggestions.length > 0
      ? `${instanceId}-command-${selectedCommandIndex}`
      : `${instanceId}-option-${activeIndex}`;
    const option = document.getElementById(optionId);
    if (!output || !option || !output.contains(option)) return;

    const outputRect = output.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < outputRect.top) {
      output.scrollTop -= outputRect.top - optionRect.top;
    } else if (optionRect.bottom > outputRect.bottom) {
      output.scrollTop += optionRect.bottom - outputRect.bottom;
    }
  }, [activeIndex, commandSuggestions.length, instanceId, selectedCommandIndex]);

  useEffect(() => {
    if (messages.length === 0) return;
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [messages]);

  function addMessage(
    command: string,
    lines: string[],
    tone: TerminalMessage['tone'] = 'default',
  ) {
    messageId.current += 1;
    setMessages((current) => [
      ...current.slice(-5),
      { id: messageId.current, command, lines, tone },
    ]);
  }

  function go(url: string) {
    if (!url.startsWith('/') || url.startsWith('//')) return;
    onRequestClose?.();
    setHistoryCursor(null);
    setInput('');
    void navigate(url);
  }

  function remember(command: string) {
    const next = [...commandHistory, command].slice(-30);
    setCommandHistory(next);
    window.localStorage.setItem('angel:terminal-history', JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('angel:terminal-history', { detail: next }));
    setHistoryCursor(null);
  }

  function clearCommandHistory() {
    setCommandHistory([]);
    setHistoryCursor(null);
    window.localStorage.removeItem('angel:terminal-history');
    window.dispatchEvent(new CustomEvent('angel:terminal-history', { detail: [] }));
  }

  function completeCommand(command: string) {
    setInput(`/${command}${COMMANDS_WITH_ARGS.has(command) ? ' ' : ''}`);
    setHistoryCursor(null);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  function applyTerminalTheme(theme: TerminalTheme) {
    setTerminalTheme(theme);
    window.localStorage.setItem('angel:terminal-theme', theme);
    window.dispatchEvent(new CustomEvent('angel:terminal-theme', { detail: theme }));
  }

  function applyScanlines(enabled: boolean) {
    setScanlines(enabled);
    window.localStorage.setItem('angel:terminal-scanlines', enabled ? 'on' : 'off');
    window.dispatchEvent(new CustomEvent('angel:terminal-scanlines', { detail: enabled }));
  }

  function executeCommand() {
    if (!normalizedInput) return;

    if (inputMode.kind !== 'command') {
      if (menuItems.length === 0 && docs !== null) {
        addMessage(normalizedInput, [`sin coincidencias para “${inputMode.needle}”`], 'error');
        setInput('');
      }
      return;
    }

    const command = normalizedInput;
    const { name, args } = inputMode;

    if (!name) {
      addMessage(command, ['escribe /help o usa Tab para completar un comando'], 'error');
      setInput('');
      return;
    }

    if (name === 'clear' || name === 'cls') {
      setMessages([]);
      setInput('');
      return;
    }

    remember(command);

    if (name === 'help') {
      addMessage(command, HELP_LINES);
      setInput('');
      return;
    }

    if (name === 'search') {
      if (!args) {
        addMessage(command, ['uso: /search <texto>'], 'error');
        setInput('');
      } else {
        setInput(args);
      }
      return;
    }

    if (name === 'diccionario' || name === 'define' || name === 'dict') {
      if (!args) {
        addMessage(command, ['uso: /diccionario <palabra o concepto>', 'ejemplo: /diccionario closure'], 'error');
      } else {
        openExternal(`https://www.google.com/search?hl=es&q=${encodeURIComponent(`define:${args}`)}`);
        addMessage(command, [`abriendo en Google la definición de “${args}”…`], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'google') {
      if (!args) {
        addMessage(command, ['uso: /google <consulta>'], 'error');
      } else {
        openExternal(`https://www.google.com/search?hl=es&q=${encodeURIComponent(args)}`);
        addMessage(command, [`buscando “${args}” en Google…`], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'mdn') {
      if (!args) {
        addMessage(command, ['uso: /mdn <API, elemento o propiedad>', 'ejemplo: /mdn AbortController'], 'error');
      } else {
        openExternal(`https://developer.mozilla.org/es/search?q=${encodeURIComponent(args)}`);
        addMessage(command, [`buscando “${args}” en MDN Web Docs…`], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'npm') {
      if (!args) {
        addMessage(command, ['uso: /npm <paquete o término>'], 'error');
      } else {
        openExternal(`https://www.npmjs.com/search?q=${encodeURIComponent(args)}`);
        addMessage(command, [`buscando “${args}” en npm…`], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'caniuse') {
      if (!args) {
        addMessage(command, ['uso: /caniuse <funcionalidad web>', 'ejemplo: /caniuse container queries'], 'error');
      } else {
        openExternal(`https://caniuse.com/?search=${encodeURIComponent(args)}`);
        addMessage(command, [`consultando la compatibilidad de “${args}”…`], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'quiz') {
      const requestedTopic = normalizeKeyword(args);
      const topics = [...new Set(QUIZ_QUESTIONS.map(({ topic }) => topic))];
      if (requestedTopic === 'temas' || requestedTopic === 'topics') {
        addMessage(command, [`temas disponibles: ${topics.join(', ')}`]);
        setInput('');
        return;
      }

      const candidates = requestedTopic
        ? QUIZ_QUESTIONS.filter(({ topic }) => normalizeKeyword(topic) === requestedTopic)
        : QUIZ_QUESTIONS;
      if (candidates.length === 0) {
        addMessage(command, [
          `tema desconocido: ${args}`,
          `disponibles: ${topics.join(', ')}`,
        ], 'error');
        setInput('');
        return;
      }

      const alternatives = activeQuiz && candidates.length > 1
        ? candidates.filter((question) => question !== activeQuiz)
        : candidates;
      const question = alternatives[Math.floor(Math.random() * alternatives.length)];
      setActiveQuiz(question);
      addMessage(command, [
        `quiz · ${question.topic}`,
        question.question,
        ...question.choices.map((choice, index) => `${index + 1}. ${choice}`),
        'responde con /respuesta <número> · /respuesta ver revela la solución',
      ]);
      setInput('');
      return;
    }

    if (name === 'respuesta' || name === 'answer') {
      if (!activeQuiz) {
        addMessage(command, ['no hay una pregunta activa; ejecuta /quiz o /quiz temas'], 'error');
        setInput('');
        return;
      }

      const normalizedAnswer = normalizeKeyword(args);
      const correctChoice = activeQuiz.choices[activeQuiz.answer];
      if (['ver', 'rendirse', 'skip'].includes(normalizedAnswer)) {
        addMessage(command, [
          `respuesta: ${activeQuiz.answer + 1}. ${correctChoice}`,
          activeQuiz.explanation,
        ]);
        setActiveQuiz(null);
        setInput('');
        return;
      }

      const selectedAnswer = Number.parseInt(args, 10) - 1;
      if (!/^\d+$/.test(args) || selectedAnswer < 0 || selectedAnswer >= activeQuiz.choices.length) {
        addMessage(command, ['uso: /respuesta <número> o /respuesta ver'], 'error');
      } else if (selectedAnswer === activeQuiz.answer) {
        addMessage(command, ['✓ respuesta correcta', activeQuiz.explanation], 'success');
        setActiveQuiz(null);
      } else {
        addMessage(command, [
          `✗ “${activeQuiz.choices[selectedAnswer]}” no es la respuesta`,
          'inténtalo otra vez o usa /respuesta ver para estudiar la explicación',
        ], 'error');
      }
      setInput('');
      return;
    }

    if (name === 'tip') {
      const requestedTopic = normalizeKeyword(args);
      const topics = [...new Set(LEARNING_TIPS.map(({ topic }) => topic))];
      if (requestedTopic === 'temas' || requestedTopic === 'topics') {
        addMessage(command, [`temas disponibles: ${topics.join(', ')}`]);
        setInput('');
        return;
      }
      const candidates = requestedTopic
        ? LEARNING_TIPS.filter(({ topic }) => normalizeKeyword(topic) === requestedTopic)
        : LEARNING_TIPS;
      if (candidates.length === 0) {
        addMessage(command, [`tema desconocido: ${args}`, `disponibles: ${topics.join(', ')}`], 'error');
      } else {
        const tip = candidates[Math.floor(Math.random() * candidates.length)];
        addMessage(command, [`tip · ${tip.topic}`, tip.text], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'tags') {
      setInput(args ? `#${args}` : '#');
      return;
    }

    if (name === 'pwd') {
      addMessage(command, ['~/angel.library'], 'success');
      setInput('');
      return;
    }

    if (name === 'whoami') {
      addMessage(command, ['dev — constructor, depurador y archivista de este segundo cerebro'], 'success');
      setInput('');
      return;
    }

    if (name === 'date') {
      addMessage(
        command,
        [new Intl.DateTimeFormat('es', { dateStyle: 'full', timeStyle: 'medium' }).format(new Date())],
      );
      setInput('');
      return;
    }

    if (name === 'url') {
      addMessage(command, [window.location.pathname + window.location.search], 'success');
      setInput('');
      return;
    }

    if (name === 'ls' || name === 'categories') {
      addMessage(
        command,
        categories.length > 0
          ? categories.map(({ id, label }) => `drwx  ${id}/  — ${label}`)
          : ['el índice todavía se está montando…'],
      );
      setInput('');
      return;
    }

    if (name === 'tree') {
      addMessage(command, [
        'angel.library/',
        ...categories.flatMap(({ id }, index) => {
          const branch = index === categories.length - 1 ? '└──' : '├──';
          return [`${branch} ${id}/`];
        }),
      ]);
      setInput('');
      return;
    }

    if (name === 'stats') {
      addMessage(command, [
        `${docs?.length ?? 0} documentos indexados`,
        `${tagIndex.length} tags únicos`,
        `${categories.length} categorías`,
        `${commandHistory.length + 1} comandos en esta sesión`,
      ], 'success');
      setInput('');
      return;
    }

    if (name === 'history') {
      if (args.toLocaleLowerCase('es') === 'clear') {
        clearCommandHistory();
        addMessage(command, ['historial eliminado'], 'success');
        setInput('');
        return;
      }
      const entries = [...commandHistory, command];
      addMessage(
        command,
        entries.map((entry, index) => `${String(index + 1).padStart(2, '0')}  ${entry}`),
      );
      setInput('');
      return;
    }

    if (name === 'echo') {
      addMessage(command, [args || '']);
      setInput('');
      return;
    }

    if (name === 'theme' || name === 'bg') {
      const themeArgument = args.toLocaleLowerCase('es');
      if (!args || themeArgument === 'list') {
        addMessage(command, [
          `tema actual: ${terminalTheme}`,
          `disponibles: ${TERMINAL_THEMES.join(', ')}`,
          'uso: /theme <nombre|next|random>',
        ]);
        setInput('');
        return;
      }

      let requestedTheme = themeArgument;
      if (requestedTheme === 'next') {
        const currentIndex = TERMINAL_THEMES.indexOf(terminalTheme);
        requestedTheme = TERMINAL_THEMES[(currentIndex + 1) % TERMINAL_THEMES.length];
      }
      if (requestedTheme === 'random') {
        const alternatives = TERMINAL_THEMES.filter((theme) => theme !== terminalTheme);
        requestedTheme = alternatives[Math.floor(Math.random() * alternatives.length)];
      }
      if (isTerminalTheme(requestedTheme)) {
        applyTerminalTheme(requestedTheme);
        addMessage(command, [`tema aplicado: ${requestedTheme}`], 'success');
      } else {
        addMessage(command, [`tema desconocido: ${args}`, `usa: ${TERMINAL_THEMES.join(', ')}`], 'error');
      }
      setInput('');
      return;
    }

    if (name === 'scanlines') {
      const option = args.toLocaleLowerCase('es');
      const enabled = option === 'on' ? true : option === 'off' ? false : !scanlines;
      if (option && option !== 'on' && option !== 'off' && option !== 'toggle') {
        addMessage(command, ['uso: /scanlines <on|off|toggle>'], 'error');
      } else {
        applyScanlines(enabled);
        addMessage(command, [`scanlines: ${enabled ? 'on' : 'off'}`], 'success');
      }
      setInput('');
      return;
    }

    if (name === 'reset') {
      applyTerminalTheme('default');
      applyScanlines(true);
      setTerminalEffect('none');
      addMessage(command, ['apariencia restaurada'], 'success');
      setInput('');
      return;
    }

    if (name === 'motd') {
      addMessage(command, [
        'Message Of The Day',
        'documenta lo que hoy parece obvio; mañana será contexto valioso.',
        `índice listo: ${docs?.length ?? 0} documentos disponibles`,
      ], 'success');
      setInput('');
      return;
    }

    if (name === 'random') {
      if (!docs?.length) {
        addMessage(command, ['el índice todavía no está disponible'], 'error');
        setInput('');
        return;
      }
      go(docs[Math.floor(Math.random() * docs.length)].url);
      return;
    }

    if (name === 'back') {
      onRequestClose?.();
      window.history.back();
      return;
    }

    if (name === 'reload') {
      window.location.reload();
      return;
    }

    if (name === 'home') {
      go('/');
      return;
    }

    if (name === 'myjson') {
      go('/commands/myjson');
      return;
    }

    if (name === 'exit') {
      if (onRequestClose) onRequestClose();
      else go('/');
      return;
    }

    if (name === 'open') {
      const position = Number.parseInt(args, 10);
      if (/^\d+$/.test(args) && position > 0) {
        const selected = previousItems.current[position - 1];
        if (selected) {
          go(itemUrl(selected));
          return;
        }
      }
      if (args.startsWith('/')) {
        go(args);
        return;
      }
      addMessage(command, ['uso: /open <número de resultado|/ruta>'], 'error');
      setInput('');
      return;
    }

    if (name === 'cd') {
      const rawDestination = args.trim();
      if (rawDestination === '/' || rawDestination === '~' || rawDestination === '..') {
        go('/');
        return;
      }
      const destination = rawDestination.replace(/^\.\//, '').replace(/\/$/, '');
      if (destination === 'search' || destination === '/search') {
        go('/search');
        return;
      }
      if (destination === 'tags' || destination === '/tags') {
        go('/tags');
        return;
      }
      const category = categories.find(({ id }) => id === destination);
      if (category) {
        go(`/categories/${category.id}`);
        return;
      }
      addMessage(command, ['directorio no encontrado; ejecuta /ls para ver las categorías'], 'error');
      setInput('');
      return;
    }

    if (name === 'cat') {
      addMessage(command, [...CAT_LINES, 'miau: índice protegido.']);
      setInput('');
      return;
    }

    if (name === 'coffee') {
      addMessage(command, COFFEE_LINES, 'success');
      setInput('');
      return;
    }

    if (name === 'fortune') {
      addMessage(command, [FORTUNES[Math.floor(Math.random() * FORTUNES.length)]]);
      setInput('');
      return;
    }

    if (name === 'ping') {
      addMessage(command, ['pong — 0.042 ms desde localhost'], 'success');
      setInput('');
      return;
    }

    if (name === 'matrix') {
      applyTerminalTheme('matrix');
      setTerminalEffect('none');
      addMessage(command, ['wake up, dev…', 'the docs have you.', 'follow the white rabbit: /cat'], 'success');
      setInput('');
      return;
    }

    if (name === 'party') {
      const alternatives = TERMINAL_THEMES.filter((theme) => theme !== terminalTheme);
      const nextTheme = alternatives[Math.floor(Math.random() * alternatives.length)];
      applyTerminalTheme(nextTheme);
      setTerminalEffect('rainbow');
      addMessage(command, [`♪ tema ${nextTheme} desbloqueado · /rainbow para detener ♪`], 'success');
      setInput('');
      return;
    }

    if (name === 'sudo') {
      addMessage(command, ['dev no está en el archivo sudoers. Este intento será documentado.'], 'error');
      setInput('');
      return;
    }

    if (name === '42') {
      addMessage(command, ['42 — la respuesta era sencilla; la pregunta sigue en backlog.'], 'success');
      setInput('');
      return;
    }

    if (name === 'bug') {
      addMessage(command, BUG_LINES);
      setInput('');
      return;
    }

    if (name === 'duck') {
      addMessage(command, DUCK_LINES);
      setInput('');
      return;
    }

    if (name === 'rm') {
      addMessage(command, ['operación bloqueada: este segundo cerebro sí hace copias de seguridad.'], 'error');
      setInput('');
      return;
    }

    if (name === 'hello') {
      addMessage(command, ['hola, dev. Todo sistema saludable comienza con curiosidad.'], 'success');
      setInput('');
      return;
    }

    if (name === 'rainbow') {
      const nextEffect = terminalEffect === 'rainbow' ? 'none' : 'rainbow';
      setTerminalEffect(nextEffect);
      addMessage(command, [`rainbow mode: ${nextEffect === 'rainbow' ? 'on' : 'off'}`], 'success');
      setInput('');
      return;
    }

    if (name === 'banner') {
      addMessage(command, BANNER_LINES, 'success');
      setInput('');
      return;
    }

    if (name === 'joke') {
      addMessage(command, [JOKES[Math.floor(Math.random() * JOKES.length)]]);
      setInput('');
      return;
    }

    addMessage(command, [`comando no encontrado: /${name}`, 'ejecuta /help para ver los comandos disponibles'], 'error');
    setInput('');
  }

  function handleInputChange(value: string) {
    setInput(value);
    setHistoryCursor(null);
    historyDraft.current = '';
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      if (input) {
        event.preventDefault();
        event.stopPropagation();
        setInput('');
        setHistoryCursor(null);
      } else if (onRequestClose) {
        event.preventDefault();
        onRequestClose();
      }
      return;
    }

    if (event.key === 'Tab' && commandSuggestions.length > 0) {
      event.preventDefault();
      const selected = commandSuggestions[selectedCommandIndex];
      if (selected) completeCommand(selected);
      return;
    }

    if (event.key === 'ArrowDown' && commandSuggestions.length > 0) {
      event.preventDefault();
      setActiveCommandIndex((current) => (current + 1) % commandSuggestions.length);
      return;
    }

    if (event.key === 'ArrowUp' && commandSuggestions.length > 0) {
      event.preventDefault();
      setActiveCommandIndex(
        (current) => (current - 1 + commandSuggestions.length) % commandSuggestions.length,
      );
      return;
    }

    if (event.key === 'ArrowDown' && menuItems.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % menuItems.length);
      return;
    }

    if (event.key === 'ArrowUp' && menuItems.length > 0) {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + menuItems.length) % menuItems.length);
      return;
    }

    if (
      event.key === 'ArrowUp' &&
      commandHistory.length > 0 &&
      (input === '' || historyCursor !== null)
    ) {
      event.preventDefault();
      const nextCursor = historyCursor === null
        ? commandHistory.length - 1
        : Math.max(0, historyCursor - 1);
      if (historyCursor === null) historyDraft.current = input;
      setHistoryCursor(nextCursor);
      setInput(commandHistory[nextCursor]);
      return;
    }

    if (event.key === 'ArrowDown' && historyCursor !== null) {
      event.preventDefault();
      const nextCursor = historyCursor + 1;
      if (nextCursor >= commandHistory.length) {
        setHistoryCursor(null);
        setInput(historyDraft.current);
      } else {
        setHistoryCursor(nextCursor);
        setInput(commandHistory[nextCursor]);
      }
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const selectedCommand = commandSuggestions[selectedCommandIndex];
      if (selectedCommand) {
        completeCommand(selectedCommand);
        return;
      }
      const selected = menuItems[activeIndex];
      if (selected) go(itemUrl(selected));
      else executeCommand();
    }
  }

  const terminalMode = inputMode.kind === 'command'
    ? 'command'
    : inputMode.kind === 'tags'
      ? 'tags'
      : 'docs';

  const status = failed
    ? 'error al montar el índice'
    : docs === null
      ? 'montando índice…'
      : historyCursor !== null
        ? `historial ${historyCursor + 1}/${commandHistory.length}`
      : commandSuggestions.length > 0
        ? `${commandSuggestions.length} comando${commandSuggestions.length === 1 ? '' : 's'}`
      : menuItems.length > 0
        ? `${menuItems.length} resultado${menuItems.length === 1 ? '' : 's'}`
        : `${docs.length} documentos · ${tagIndex.length} tags`;

  return (
    <div
      className={`search-terminal search-terminal--${variant}`}
      data-terminal-theme={terminalTheme}
      data-scanlines={scanlines ? 'on' : 'off'}
      data-terminal-effect={terminalEffect}
    >
      <div className="search-terminal__bar" aria-hidden="true">
        <span className="terminal-window__lights"><i></i><i></i><i></i></span>
        <span>angel.library/{variant === 'dialog' ? 'command' : 'search'}</span>
        <span className="search-terminal__mode">mode: {terminalMode}</span>
      </div>

      <div className="search-terminal__screen">
        <div className="search-terminal__boot" aria-hidden="true">
          <p><span>[ok]</span> angel.shell v2.0 · sesión local de solo lectura</p>
          <p><span>[ok]</span> índice {docs === null ? 'montando…' : 'montado'} · escribe /help</p>
        </div>

        <div ref={outputRef} className="search-terminal__output" aria-live="polite">
          {messages.map((message) => (
            <div
              key={message.id}
              className="search-terminal__history"
              data-tone={message.tone ?? 'default'}
            >
              <p className="search-terminal__echo">
                <span>dev@workspace:~/angel.library $</span> {message.command}
              </p>
              <div className="search-terminal__response">
                {message.lines.map((line, index) => <p key={`${message.id}-${index}`}>{line}</p>)}
              </div>
            </div>
          ))}

          {!normalizedInput && messages.length === 0 && docs !== null && (
            <div className="search-terminal__welcome">
              <p><span>$</span> escribe cualquier término para buscar documentación</p>
              <p><span>$</span> comienza con <strong>#</strong> para buscar tags</p>
              <p><span>$</span> comienza con <strong>/</strong> para ejecutar comandos</p>
              <p><span>$</span> prueba <strong>react</strong>, <strong>#accesibilidad</strong> o <strong>/help</strong></p>
              <p><span>$</span> usa <kbd className="kbd">↑↓</kbd> y <kbd className="kbd">Enter</kbd> para abrir</p>
            </div>
          )}

          {commandSuggestions.length > 0 && (
            <div
              id={commandListboxId}
              className="search-terminal__menu search-terminal__command-menu"
              role="listbox"
              aria-label="Comandos disponibles"
            >
              {commandSuggestions.map((command, index) => {
                const selected = index === selectedCommandIndex;
                return (
                  <button
                    id={`${instanceId}-command-${index}`}
                    key={command}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    className="search-terminal__result search-terminal__command-option"
                    style={{ '--result-accent': 'var(--terminal-accent)' } as CSSProperties}
                    onMouseEnter={() => setActiveCommandIndex(index)}
                    onClick={() => completeCommand(command)}
                  >
                    <span className="search-terminal__cursor" aria-hidden="true">❯</span>
                    <DynamicIcon name="terminal" className="size-3.5 text-[var(--terminal-accent)]" />
                    <span className="search-terminal__result-content">
                      <strong>/{command}</strong>
                      <small>{COMMAND_DESCRIPTIONS[command]}</small>
                    </span>
                    <span className="search-terminal__result-meta">
                      {COMMANDS_WITH_ARGS.has(command) ? 'args' : 'run'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {inputMode.kind === 'command' && normalizedInput && commandSuggestions.length === 0 && (
            <div className="search-terminal__command-preview" data-known={knownCommand}>
              <span>{knownCommand ? 'command' : 'unknown'}</span>
              <strong>/{inputMode.name || '…'}</strong>
              <small>presiona Enter para ejecutar</small>
            </div>
          )}

          {normalizedInput && menuItems.length > 0 && (
            <div
              id={listboxId}
              className="search-terminal__menu"
              role="listbox"
              aria-label={inputMode.kind === 'tags' ? 'Tags encontrados' : 'Documentos encontrados'}
            >
              {menuItems.map((item, index) => {
                const selected = index === activeIndex;

                if (item.kind === 'tag') {
                  return (
                    <a
                      id={`${instanceId}-option-${index}`}
                      key={`tag-${item.tag.tag}`}
                      href={itemUrl(item)}
                      role="option"
                      aria-selected={selected}
                      tabIndex={-1}
                      className="search-terminal__result"
                      style={{ '--result-accent': 'var(--accent-yellow)' } as CSSProperties}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => onRequestClose?.()}
                    >
                      <span className="search-terminal__cursor" aria-hidden="true">❯</span>
                      <DynamicIcon name="tags" className="size-3.5 text-[var(--accent-yellow)]" />
                      <span className="search-terminal__result-content">
                        <strong>{index + 1}. #{item.tag.tag}</strong>
                        <small>~/tags/{item.tag.tag}</small>
                      </span>
                      <span className="search-terminal__result-meta">
                        {item.tag.count} doc{item.tag.count === 1 ? '' : 's'}
                      </span>
                    </a>
                  );
                }

                const { doc } = item;
                return (
                  <a
                    id={`${instanceId}-option-${index}`}
                    key={doc.url}
                    href={doc.url}
                    role="option"
                    aria-selected={selected}
                    tabIndex={-1}
                    className="search-terminal__result"
                    style={{ '--result-accent': `var(${doc.categoryColor})` } as CSSProperties}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => onRequestClose?.()}
                  >
                    <span className="search-terminal__cursor" aria-hidden="true">❯</span>
                    <span style={{ color: `var(${doc.categoryColor})` }}>
                      <DynamicIcon name={doc.categoryIcon} className="size-3.5" />
                    </span>
                    <span className="search-terminal__result-content">
                      <strong>{index + 1}. {doc.title}</strong>
                      <small>~/{documentPath(doc)}</small>
                    </span>
                    <span className="search-terminal__result-meta">{doc.typeSingular}</span>
                  </a>
                );
              })}
            </div>
          )}

          {normalizedInput &&
            inputMode.kind !== 'command' &&
            docs !== null &&
            menuItems.length === 0 && (
              <p className="search-terminal__empty">
                <span>exit 1</span>: sin coincidencias para “{inputMode.needle}”
              </p>
            )}
        </div>

        <div className="search-terminal__prompt-line">
          <span className="search-terminal__user" aria-hidden="true">dev@workspace</span>
          <span aria-hidden="true">:</span>
          <span className="search-terminal__cwd" aria-hidden="true">~/angel.library</span>
          <span className="search-terminal__prompt" aria-hidden="true">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="buscar, #tags o /comando"
            autoComplete="off"
            spellCheck={false}
            autoFocus
            role="combobox"
            aria-label="Buscar o ejecutar un comando de la biblioteca"
            aria-autocomplete="list"
            aria-expanded={menuItems.length > 0 || commandSuggestions.length > 0}
            aria-controls={
              commandSuggestions.length > 0
                ? commandListboxId
                : menuItems.length > 0
                  ? listboxId
                  : undefined
            }
            aria-activedescendant={
              commandSuggestions.length > 0
                ? `${instanceId}-command-${selectedCommandIndex}`
                : menuItems.length > 0
                  ? `${instanceId}-option-${activeIndex}`
                  : undefined
            }
            aria-describedby={statusId}
          />
        </div>
      </div>

      <div className="search-terminal__footer">
        <span><kbd className="kbd">↑↓</kbd> seleccionar</span>
        <span><kbd className="kbd">↑</kbd> historial</span>
        <span><kbd className="kbd">Enter</kbd> abrir / ejecutar</span>
        <span><kbd className="kbd">Tab</kbd> completar</span>
        <span><kbd className="kbd">Esc</kbd> limpiar / cerrar</span>
        <span><kbd className="kbd">/help</kbd> comandos</span>
        <span id={statusId} className="search-terminal__status" aria-live="polite">
          {status}
        </span>
      </div>
    </div>
  );
}
