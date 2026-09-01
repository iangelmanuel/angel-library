/**
 * Traduce instalaciones entre npm, pnpm y Bun. Puro: lo usan el plugin
 * remark y EntryMeta. Si una línea no encaja, devuelve null y no traduce.
 */

const INSTALL_RE = /^(npm|pnpm|bun)\s+(install|i|add)\b(.*)$/;
const ASTRO_ADD_RE = /^(?:npx\s+astro|pnpm\s+astro|bunx\s+astro)\s+add\s+(.+)$/;
const RUNNER_RE = /^(npx|pnpm\s+dlx|bunx)\s+(.+)$/;
const CREATE_RE = /^(npm|pnpm|bun)\s+(create|init)\b(.*)$/;
const COMMENT_RE = /^#/;
const KNOWN_FLAGS = new Set(['-D', '-d', '--save-dev', '-g', '--global']);

/** Separa flags de paquetes. */
function splitArgs(rest) {
  const tokens = rest.trim().split(/\s+/).filter(Boolean);
  const flags = tokens.filter((t) => t.startsWith('-'));
  const packages = tokens.filter((t) => !t.startsWith('-'));
  return { flags, packages };
}

function hasFlag(flags, ...names) {
  return flags.some((f) => names.includes(f));
}

/** Traduce una línea; null si no la reconoce. */
function translateLine(line) {
  const trimmed = line.trim();
  if (trimmed === '' || COMMENT_RE.test(trimmed)) {
    return { pnpm: line, bun: line, npm: line };
  }

  const installMatch = INSTALL_RE.exec(trimmed);
  if (installMatch) {
    const rest = installMatch[3];
    const { flags, packages } = splitArgs(rest);
    if (flags.some((flag) => !KNOWN_FLAGS.has(flag))) return null;

    const dev = hasFlag(flags, '-D', '-d', '--save-dev');
    const global_ = hasFlag(flags, '-g', '--global');
    const hasPackages = packages.length > 0;

    const pnpmVerb = hasPackages ? 'add' : 'install';
    const bunVerb = hasPackages ? 'add' : 'install';

    const pnpmFlags = [dev && '-D', global_ && '-g'].filter(Boolean);
    const bunFlags = [dev && '-d', global_ && '-g'].filter(Boolean);
    const npmFlags = [dev && '-D', global_ && '-g'].filter(Boolean);

    const pnpm = ['pnpm', pnpmVerb, ...pnpmFlags, ...packages].join(' ');
    const bun = ['bun', bunVerb, ...bunFlags, ...packages].join(' ');
    const npm = ['npm', 'install', ...npmFlags, ...packages].join(' ');

    return { pnpm, bun, npm };
  }

  const astroAddMatch = ASTRO_ADD_RE.exec(trimmed);
  if (astroAddMatch) {
    const integrations = astroAddMatch[1];
    return {
      pnpm: `pnpm astro add ${integrations}`,
      bun: `bunx astro add ${integrations}`,
      npm: `npx astro add ${integrations}`,
    };
  }

  const runnerMatch = RUNNER_RE.exec(trimmed);
  if (runnerMatch) {
    const rest = runnerMatch[2];
    return {
      pnpm: `pnpm dlx ${rest}`,
      bun: `bunx ${rest}`,
      npm: `npx ${rest}`,
    };
  }

  const createMatch = CREATE_RE.exec(trimmed);
  if (createMatch) {
    const [, , verb, rawRest] = createMatch;
    const rest = rawRest.trim();

    // `npm init -y` no es un initializer: solo se traduce `init <nombre>`.
    if (!rest || (verb === 'init' && rest.startsWith('-'))) return null;

    return {
      pnpm: `pnpm create ${rest}`,
      bun: `bun create ${rest}`,
      npm: `npm create ${rest}`,
    };
  }

  return null;
}

/** Traduce un bloque entero; null si alguna línea no encaja. */
export function translateBlock(text) {
  const lines = text.split('\n');
  if (lines.every((l) => l.trim() === '')) return null;

  const pnpmLines = [];
  const bunLines = [];
  const npmLines = [];

  for (const line of lines) {
    const translated = translateLine(line);
    if (!translated) return null;
    pnpmLines.push(translated.pnpm);
    bunLines.push(translated.bun);
    npmLines.push(translated.npm);
  }

  return {
    pnpm: pnpmLines.join('\n'),
    bun: bunLines.join('\n'),
    npm: npmLines.join('\n'),
  };
}
