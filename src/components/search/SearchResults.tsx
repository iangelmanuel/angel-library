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

import {
  BANNER_LINES,
  BUG_LINES,
  CAT_LINES,
  COFFEE_LINES,
  COMMAND_DESCRIPTIONS,
  COMMAND_SET,
  COMMANDS_WITH_ARGS,
  DUCK_LINES,
  FORTUNES,
  HELP_LINES,
  JOKES,
  LEARNING_TIPS,
  MAX_RESULTS,
  PUBLIC_COMMANDS,
  QUIZ_QUESTIONS,
  TERMINAL_THEMES,
  documentPath,
  isTerminalTheme,
  itemUrl,
  normalizeKeyword,
  parseInput,
  type MenuItem,
  type QuizQuestion,
  type TagIndexItem,
  type TerminalEffect,
  type TerminalMessage,
  type TerminalSearchProps,
  type TerminalTheme,
} from './terminal';

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

    if (name === 'myastro') {
      go('/commands/myastro');
      return;
    }

    if (name === 'mynext') {
      go('/commands/mynext');
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
