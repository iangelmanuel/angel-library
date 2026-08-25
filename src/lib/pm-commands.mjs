/**
 * Traduce instalaciones y ejecutores de npm, pnpm o Bun a sus equivalentes.
 * Puro (sin dependencias de Astro/Node más allá de string parsing) para poder
 * importarse tanto desde un plugin remark (.mjs, corre en build) como desde
 * un componente Astro/TS (EntryMeta.astro).
 *
 * Filosofía: mejor no traducir que traducir mal — si una línea no matchea un
 * patrón conocido, translateBlock() devuelve null y el bloque original queda
 * sin tocar.
 */

const INSTALL_RE = /^(npm|pnpm|bun)\s+(install|i|add)\b(.*)$/;
const RUNNER_RE = /^(npx|pnpm\s+dlx|bunx)\s+(.+)$/;
const COMMENT_RE = /^#/;
const KNOWN_FLAGS = new Set(['-D', '-d', '--save-dev', '-g', '--global']);

/** Separa flags (empiezan con "-") de paquetes en el resto de la línea. */
function splitArgs(rest) {
  const tokens = rest.trim().split(/\s+/).filter(Boolean);
  const flags = tokens.filter((t) => t.startsWith('-'));
  const packages = tokens.filter((t) => !t.startsWith('-'));
  return { flags, packages };
}

function hasFlag(flags, ...names) {
  return flags.some((f) => names.includes(f));
}

/**
 * Traduce una sola línea. Devuelve { pnpm, bun, npm } o null si no coincide
 * con una instalación o ejecutor reconocido.
 */
export function translateLine(line) {
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

  const runnerMatch = RUNNER_RE.exec(trimmed);
  if (runnerMatch) {
    const rest = runnerMatch[2];
    return {
      pnpm: `pnpm dlx ${rest}`,
      bun: `bunx ${rest}`,
      npm: `npx ${rest}`,
    };
  }

  return null;
}

/**
 * Traduce un bloque multilínea. Si alguna línea no vacía/no-comentario no
 * coincide, devuelve null para no transformar el bloque de forma parcial.
 */
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
