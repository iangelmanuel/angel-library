import { access, mkdir, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import {
  CATEGORIES,
  CATEGORY_IDS,
  CATEGORY_STACK_ORDER,
  CONTENT_TYPES,
  CONTENT_TYPE_IDS,
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_IDS,
  STACKS,
  STACK_IDS,
  type ContentTypeId,
  type StackId,
} from '../src/config/site.ts';

type OptionValue = string | true;
type Options = Record<string, OptionValue>;

const HELP = `
Crear una entrada Markdown válida

Uso:
  pnpm content:new -- --type guides --slug mi-guia --title "Mi guía" \\
    --description "Qué aprenderás" --category frontend --stack react \\
    --tags react,typescript

Opciones comunes:
  --type <id>             Colección de contenido
  --slug <ruta>           Id del archivo, sin .md; admite subcarpetas
  --title <texto>         Título visible
  --description <texto>   Descripción breve
  --category <id>         Categoría principal
  --stack <id>            Subcategoría opcional
  --order <número>        Posición manual dentro de la subcategoría
  --tags <a,b,c>          Tags separados por coma
  --related <refs>        Referencias collection/id separadas por coma
  --publish               Crear con draft: false (por defecto es true)
  --private               Excluir de navegación, tags y búsqueda pública
  --dry-run               Mostrar el archivo sin escribirlo
  --list                  Listar tipos, categorías y subcategorías válidas
  --help                  Mostrar esta ayuda

Campos específicos aceptados:
  --website --github --install --technologies --libraries --language
  --framework --parameters --returns --runtime --problem --url
  --resource-category --personal-note --official --tool --command
  --when-to-use --warnings --practice --why --scope
`;

function parseOptions(args: string[]): Options {
  const options: Options = {};
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--') continue;
    if (!argument.startsWith('--')) {
      throw new Error(`Argumento inesperado: ${argument}`);
    }

    const key = argument.slice(2);
    const next = args[index + 1];
    if (!next || next.startsWith('--')) {
      options[key] = true;
    } else {
      options[key] = next;
      index += 1;
    }
  }
  return options;
}

function option(options: Options, key: string): string | undefined {
  const value = options[key];
  return typeof value === 'string' ? value.trim() : undefined;
}

function commaList(value: string | undefined): string[] {
  return value?.split(',').map((item) => item.trim()).filter(Boolean) ?? [];
}

function yamlString(value: string): string {
  return JSON.stringify(value);
}

function yamlList(values: string[]): string {
  return `[${values.map(yamlString).join(', ')}]`;
}

function assertChoice<T extends string>(
  value: string,
  choices: readonly T[],
  label: string,
): asserts value is T {
  if (!choices.includes(value as T)) {
    throw new Error(`${label} desconocido: "${value}". Usa: ${choices.join(', ')}`);
  }
}

function assertReferenceList(values: string[], label: string): void {
  const invalid = values.filter((value) => !/^[a-z-]+\/[a-z0-9-/]+$/.test(value));
  if (invalid.length > 0) {
    throw new Error(`${label} contiene referencias inválidas: ${invalid.join(', ')}`);
  }
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY);
const terminal = interactive
  ? createInterface({ input: process.stdin, output: process.stdout })
  : null;

async function requiredOption(
  options: Options,
  key: string,
  question: string,
  choices?: readonly string[],
): Promise<string> {
  const provided = option(options, key);
  if (provided) return provided;
  if (!terminal) throw new Error(`Falta --${key}`);

  if (choices) console.log(`Opciones: ${choices.join(', ')}`);
  while (true) {
    const answer = (await terminal.question(`${question}: `)).trim();
    if (answer && (!choices || choices.includes(answer))) return answer;
    console.log(choices ? 'Elige una opción válida.' : 'Este valor es obligatorio.');
  }
}

async function optionalOption(
  options: Options,
  key: string,
  question: string,
  choices?: readonly string[],
): Promise<string | undefined> {
  const provided = option(options, key);
  if (provided || !terminal) return provided;

  if (choices) console.log(`Opciones: ${choices.join(', ')}`);
  while (true) {
    const answer = (await terminal.question(`${question} (Enter para omitir): `)).trim();
    if (!answer || !choices || choices.includes(answer)) return answer || undefined;
    console.log('Elige una opción válida o pulsa Enter.');
  }
}

function printCatalog(): void {
  console.log('Tipos de contenido:');
  for (const id of CONTENT_TYPE_IDS) console.log(`  ${id}: ${CONTENT_TYPES[id].label}`);

  console.log('\nCategorías y subcategorías:');
  for (const id of CATEGORY_IDS) {
    console.log(`  ${id}: ${CATEGORIES[id].label}`);
    for (const stack of CATEGORY_STACK_ORDER[id] ?? []) {
      console.log(`    - ${stack}: ${STACKS[stack].label}`);
    }
  }

  console.log('\nCategorías de recursos:');
  for (const id of RESOURCE_CATEGORY_IDS) {
    console.log(`  ${id}: ${RESOURCE_CATEGORIES[id]}`);
  }
}

const stringFields: Partial<Record<ContentTypeId, Record<string, string>>> = {
  technologies: { website: 'website', github: 'github' },
  libraries: { website: 'website', github: 'github', install: 'install' },
  snippets: { language: 'language' },
  hooks: { framework: 'framework', language: 'language', returns: 'returns' },
  utilities: { runtime: 'runtime', language: 'language' },
  recipes: { problem: 'problem' },
  resources: { 'personal-note': 'personalNote' },
  skills: { tool: 'tool' },
  commands: { 'when-to-use': 'whenToUse' },
  patterns: { problem: 'problem' },
  practices: { practice: 'practice', why: 'why' },
  guides: { website: 'website', github: 'github', scope: 'scope' },
  tricks: { problem: 'problem' },
};

const listFields: Partial<Record<ContentTypeId, Record<string, string>>> = {
  libraries: { technologies: 'technologies' },
  integrations: { technologies: 'technologies' },
  hooks: { parameters: 'parameters' },
  recipes: { technologies: 'technologies' },
  resources: { technologies: 'technologies' },
  commands: { warnings: 'warnings' },
  guides: { technologies: 'technologies', libraries: 'libraries' },
};

async function buildEntry(options: Options) {
  const type = await requiredOption(options, 'type', 'Tipo de contenido', CONTENT_TYPE_IDS);
  assertChoice(type, CONTENT_TYPE_IDS, 'Tipo');

  const slug = await requiredOption(options, 'slug', 'Slug o ruta');
  if (!/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(slug)) {
    throw new Error('El slug solo puede contener minúsculas, números, guiones y subcarpetas.');
  }

  const title = await requiredOption(options, 'title', 'Título');
  const description = await requiredOption(options, 'description', 'Descripción');
  const category = await requiredOption(options, 'category', 'Categoría', CATEGORY_IDS);
  assertChoice(category, CATEGORY_IDS, 'Categoría');

  const categoryStacks = CATEGORY_STACK_ORDER[category] ?? [];
  const requestedStack = await optionalOption(
    options,
    'stack',
    'Subcategoría',
    categoryStacks,
  );
  if (requestedStack) assertChoice(requestedStack, STACK_IDS, 'Stack');
  if (requestedStack && !categoryStacks.includes(requestedStack as StackId)) {
    throw new Error(`La subcategoría "${requestedStack}" no pertenece a "${category}".`);
  }
  const stack = requestedStack as StackId | undefined;

  const tags = commaList(await optionalOption(options, 'tags', 'Tags separados por coma'));
  const related = commaList(
    await optionalOption(options, 'related', 'Referencias relacionadas separadas por coma'),
  );
  assertReferenceList(related, 'related');

  const orderValue = option(options, 'order');
  const order = orderValue ? Number(orderValue) : undefined;
  if (orderValue && !Number.isFinite(order)) {
    throw new Error('--order debe ser un número.');
  }

  const lines = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description)}`,
    `category: ${category}`,
  ];
  let resourceCategoryLabel: string | undefined;

  if (stack) lines.push(`stack: ${stack}`);
  if (order !== undefined) lines.push(`order: ${order}`);
  lines.push(`tags: ${yamlList(tags.length > 0 ? tags : [category])}`);
  if (related.length > 0) lines.push(`related: ${yamlList(related)}`);

  for (const [argument, field] of Object.entries(stringFields[type] ?? {})) {
    const value = option(options, argument);
    if (value) lines.push(`${field}: ${yamlString(value)}`);
  }

  for (const [argument, field] of Object.entries(listFields[type] ?? {})) {
    const values = commaList(option(options, argument));
    if (values.length === 0) continue;
    if (argument === 'technologies' || argument === 'libraries') {
      assertReferenceList(values, argument);
    }
    lines.push(`${field}: ${yamlList(values)}`);
  }

  if (type === 'integrations') {
    const values = commaList(
      await optionalOption(
        options,
        'technologies',
        'Referencias de las tecnologías combinadas, separadas por coma',
      ),
    );
    if (values.length < 2) {
      throw new Error('Una integración requiere --technologies con al menos dos referencias.');
    }
    assertReferenceList(values, 'technologies');
    if (!lines.some((line) => line.startsWith('technologies:'))) {
      lines.push(`technologies: ${yamlList(values)}`);
    }
  }

  if (type === 'resources') {
    const url = await requiredOption(options, 'url', 'URL del recurso');
    new URL(url);
    const resourceCategory = await requiredOption(
      options,
      'resource-category',
      'Categoría de recurso',
      RESOURCE_CATEGORY_IDS,
    );
    assertChoice(resourceCategory, RESOURCE_CATEGORY_IDS, 'Categoría de recurso');
    lines.push(`url: ${yamlString(url)}`, `resourceCategory: ${resourceCategory}`);
    resourceCategoryLabel = RESOURCE_CATEGORIES[resourceCategory];
    if (options.official === true) lines.push('official: true');
  }

  if (type === 'commands') {
    const command = await requiredOption(options, 'command', 'Comando');
    lines.push(`command: ${yamlString(command)}`);
  }

  if (options.private === true) lines.push('private: true');
  lines.push(`draft: ${options.publish === true ? 'false' : 'true'}`);
  lines.push(`updatedAt: ${new Date().toISOString().slice(0, 10)}`, '---', '');
  lines.push('## Resumen', '', 'Escribe aquí el contenido de la entrada.', '');

  return {
    type,
    slug,
    content: lines.join('\n'),
    summary: {
      type: `${CONTENT_TYPES[type].label} (${type})`,
      category: `${CATEGORIES[category].label} (${category})`,
      stack: stack ? `${STACKS[stack].label} (${stack})` : 'sin subcategoría',
      suggestedStacks: (CATEGORY_STACK_ORDER[category] ?? []).map(
        (id) => `${STACKS[id].label} (${id})`,
      ),
      resourceCategory: resourceCategoryLabel,
    },
  };
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  if (options.help === true) {
    console.log(HELP.trim());
    return;
  }
  if (options.list === true) {
    printCatalog();
    return;
  }

  const entry = await buildEntry(options);
  const destination = path.resolve('src', 'content', entry.type, `${entry.slug}.md`);

  console.log(`Tipo: ${entry.summary.type}`);
  console.log(`Categoría: ${entry.summary.category}`);
  console.log(`Subcategoría: ${entry.summary.stack}`);
  if (entry.summary.stack === 'sin subcategoría' && entry.summary.suggestedStacks.length > 0) {
    console.log(`Subcategorías disponibles: ${entry.summary.suggestedStacks.join(', ')}`);
  }
  if (entry.summary.resourceCategory) {
    console.log(`Categoría de recurso: ${entry.summary.resourceCategory}`);
  }

  if (options['dry-run'] === true) {
    console.log(`\nDestino: ${destination}\n\n${entry.content}`);
    return;
  }

  if (await fileExists(destination)) {
    throw new Error(`Ya existe: ${destination}`);
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, entry.content, 'utf8');
  console.log(`Creado: ${destination}`);
  console.log('Siguiente paso: completa el Markdown y ejecuta pnpm check && pnpm build.');
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => terminal?.close());
