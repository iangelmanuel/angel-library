import assert from "node:assert/strict"
import { log } from "node:console"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { readCatalog } from "../src/config/catalog.ts"

const directory = await fs.mkdtemp(path.join(os.tmpdir(), "angel-catalog-"))
const metadata = path.join(directory, "nuevo-tema", "_meta.json")
const writeMetadata = (value) => fs.writeFile(metadata, JSON.stringify(value))

try {
  await fs.mkdir(path.join(directory, "nuevo-tema", "primeros-pasos"), {
    recursive: true
  })
  let catalog = readCatalog(directory)
  assert.equal(catalog[0].id, "nuevo-tema")
  assert.equal(catalog[0].label, "Nuevo Tema")
  assert.equal(catalog[0].group, "referencia")
  assert.equal(catalog[0].subcategories[0].id, "primeros-pasos")

  await writeMetadata({
    label: "Nuevo tema",
    group: "construir",
    order: 2,
    subcategories: { "primeros-pasos": { label: "Empieza aquí" } }
  })
  catalog = readCatalog(directory)
  assert.equal(catalog[0].label, "Nuevo tema")
  assert.equal(catalog[0].subcategories[0].label, "Empieza aquí")

  await fs.mkdir(path.join(directory, "nuevo-tema", "otra-carpeta"))
  assert.deepEqual(
    readCatalog(directory)[0].subcategories.map((item) => item.id),
    ["primeros-pasos", "otra-carpeta"]
  )

  await writeMetadata({ group: "inexistente" })
  assert.throws(() => readCatalog(directory), /_meta.json/)
  await writeMetadata({ descripton: "Campo mal escrito" })
  assert.throws(() => readCatalog(directory), /descripton/)
  await fs.writeFile(metadata, "{")
  assert.throws(() => readCatalog(directory), /_meta.json/)

  await writeMetadata({ label: "Duplicada" })
  await fs.mkdir(path.join(directory, "segunda"))
  await fs.writeFile(
    path.join(directory, "segunda", "_meta.json"),
    '{"label":"Duplicada"}'
  )
  assert.throws(() => readCatalog(directory), /repetida/)

  await fs.mkdir(path.join(directory, "Nombre Invalido"))
  assert.throws(() => readCatalog(directory), /Nombre de carpeta inválido/)
  log(
    "Catálogo: carpetas automáticas, orden, metadatos, duplicados y errores comprobados."
  )
} finally {
  // Solo el directorio temporal creado por esta ejecución.
  if (
    path.dirname(directory) === path.resolve(os.tmpdir()) &&
    path.basename(directory).startsWith("angel-catalog-")
  ) {
    await fs.rm(directory, { recursive: true, force: true })
  }
}
