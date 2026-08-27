---
title: "Monorepo con frontend y backend — ejemplo completo"
description: Un monorepo real con Express de backend, Vite + React de frontend y un paquete de tipos compartido entre los dos, más el comando que abre ambos servidores a la vez en pnpm, npm y Bun.
category: general
stack: monorepo
order: 5
tags: [monorepo, frontend, backend, express, vite, concurrently]
scope: monorepo de frontend y backend con un comando de dev único
related:
  - guides/monorepo-que-es
  - guides/monorepo-pnpm
  - guides/monorepo-npm
  - guides/monorepo-bun
updatedAt: 2026-08-26
---

El ejemplo de `apps/web` + `packages/ui` de las guías anteriores es deliberadamente mínimo para explicar el mecanismo. Este va más allá: un **backend real** (Express), un **frontend real** (Vite + React) que le habla por HTTP, un **paquete de tipos compartido** entre los dos, y — lo que pediste — **un solo comando que levanta ambos servidores a la vez**, con la variante exacta para pnpm, npm y Bun.

El código de las apps es idéntico sin importar el gestor que uses — lo único que cambia es cómo se instala y cómo se ejecuta el `dev` en paralelo, así que esa parte va al final, una vez por gestor.

## Estructura

```text
mi-monorepo/
├── apps/
│   ├── api/                 # backend — Express
│   │   ├── src/
│   │   │   └── index.ts
│   │   └── package.json
│   └── web/                 # frontend — Vite + React
│       ├── src/
│       │   ├── App.tsx
│       │   └── main.tsx
│       ├── index.html
│       ├── vite.config.ts
│       └── package.json
├── packages/
│   └── shared-types/        # el contrato entre api y web
│       ├── src/
│       │   └── index.ts
│       └── package.json
└── package.json
```

Este es exactamente el caso de uso real que mencionaba [la guía de qué es un monorepo](/guides/monorepo-que-es): un tipo que cambia en `shared-types` rompe la build de `api` o de `web` de inmediato si dejan de coincidir, en vez de descubrirse en producción cuando el frontend recibe un campo que ya no existe.

## El contrato: packages/shared-types

```json title="packages/shared-types/package.json"
{
  "name": "@repo/shared-types",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

```ts title="packages/shared-types/src/index.ts"
export interface Task {
  id: string;
  title: string;
  done: boolean;
}
```

Sin build ni paso de compilación: `main` apunta directo al `.ts` fuente. Funciona porque tanto Vite (frontend) como `tsx` (backend, más abajo) transpilan TypeScript al vuelo — no hace falta que `shared-types` tenga su propio paso de build para que los otros dos paquetes lo consuman. Si más adelante `shared-types` necesita lógica además de tipos (funciones, no solo interfaces), ahí sí conviene agregarle un build propio.

## El backend: apps/api

```json title="apps/api/package.json"
{
  "name": "api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "@repo/shared-types": "workspace:*",
    "cors": "^2.8.5",
    "express": "^4.21.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "tsx": "^4.19.0"
  }
}
```

```ts title="apps/api/src/index.ts"
import cors from "cors";
import express from "express";
import type { Task } from "@repo/shared-types";

const app = express();
app.use(cors());
app.use(express.json());

const tasks: Task[] = [
  { id: "1", title: "Configurar el monorepo", done: true },
  { id: "2", title: "Conectar frontend y backend", done: false },
];

app.get("/api/tasks", (_req, res) => {
  res.json(tasks);
});

app.listen(3001, () => {
  console.log("API en http://localhost:3001");
});
```

`tsx watch` corre el TypeScript directo, sin paso de compilación previo, y reinicia el proceso cuando el código cambia — el equivalente de `nodemon` pensado para TypeScript. `@repo/shared-types` se importa exactamente igual que cualquier paquete de npm, porque el workspace lo symlinkeó en `apps/api/node_modules/@repo/shared-types`.

## El frontend: apps/web

```json title="apps/web/package.json"
{
  "name": "web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "@repo/shared-types": "workspace:*",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^6.0.0"
  }
}
```

```ts title="apps/web/vite.config.ts"
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
```

```tsx title="apps/web/src/App.tsx"
import { useEffect, useState } from "react";
import type { Task } from "@repo/shared-types";

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetch("/api/tasks")
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.done ? "✓" : "○"} {task.title}
        </li>
      ))}
    </ul>
  );
}
```

El detalle que importa acá es `server.proxy` en `vite.config.ts`. El frontend pide `fetch("/api/tasks")` — una ruta **relativa**, sin `http://localhost:3001` escrito en ningún lado. Vite intercepta cualquier petición a `/api/*` durante el desarrollo y la reenvía al backend en el puerto 3001. Dos ventajas reales:

- **Sin problemas de CORS en dev**, porque desde el punto de vista del navegador la petición nunca sale del origen `localhost:5173`.
- **El mismo código funciona en producción** si despliegas ambos detrás del mismo dominio con un reverse proxy que enrute `/api` al backend — no hay una URL hardcodeada de desarrollo que haya que acordarse de cambiar.

`Task` se importa en el frontend exactamente del mismo paquete que en el backend — si el backend agrega un campo a `Task`, TypeScript avisa en el frontend en cuanto lo uses (o no lo uses y debieras), sin necesitar documentación aparte del contrato entre los dos.

## Un comando para abrir los dos

Acá es donde cada gestor resuelve la ejecución en paralelo de forma distinta — pnpm y Bun lo traen nativo, npm necesita una herramienta aparte.

### pnpm

```json title="package.json (raíz)"
{
  "name": "mi-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm run --parallel --filter api --filter web dev"
  }
}
```

```bash
pnpm dev
```

`--parallel` es el flag real de pnpm para esto — sin él, `pnpm run` respeta el orden topológico y corre los scripts uno detrás del otro, lo cual no tiene sentido para un `dev` que no termina nunca (el segundo jamás arrancaría). Con `--parallel`, pnpm lanza `api` y `web` al mismo tiempo y prefija cada línea de salida con el nombre del paquete, para distinguir qué log viene de cuál.

### Bun

```json title="package.json (raíz)"
{
  "name": "mi-monorepo",
  "private": true,
  "scripts": {
    "dev": "bun run --filter api --filter web dev"
  }
}
```

```bash
bun dev
```

`bun run --filter` corre **en paralelo por defecto** — a diferencia de pnpm, acá no hace falta un flag extra. Si alguna vez quisieras lo contrario (uno después del otro), ahí sí existe `--sequential`.

### npm — necesita `concurrently`

npm no tiene ningún mecanismo nativo para correr scripts de varios workspaces a la vez: `npm run dev --workspaces` los ejecuta **uno detrás del otro**, en el orden en que aparecen en el `workspaces` de la raíz — inútil para dos procesos de `dev` que no terminan. La solución estándar es [`concurrently`](https://www.npmjs.com/package/concurrently), un paquete hecho justo para esto y agnóstico del gestor.

```bash
npm install -D concurrently
```

Sin `--workspace`, esto se instala en la **raíz** — que es lo correcto acá: `concurrently` es una herramienta del monorepo completo, no de `api` ni de `web` en particular.

```json title="package.json (raíz)"
{
  "name": "mi-monorepo",
  "private": true,
  "scripts": {
    "dev": "concurrently -n api,web -c blue,green \"npm run dev -w api\" \"npm run dev -w web\""
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

```bash
npm run dev
```

`-n api,web` le da nombre a cada proceso para el prefijo de log; `-c blue,green` le asigna color a cada uno en la terminal, para distinguirlos de un vistazo. `concurrently` funciona igual de bien con pnpm o Bun por debajo (`"pnpm --filter api dev"` en vez de `"npm run dev -w api"`) — es la opción a la que recurrir si alguna vez necesitas más de dos procesos, o correr algo que no es un script de un workspace (por ejemplo, un contenedor de base de datos en paralelo con `api` y `web`).

## Verificar que funciona

Con cualquiera de los tres comandos de arriba corriendo, deberías ver en la misma terminal algo como:

```text
[api] API en http://localhost:3001
[web]   VITE ready in 320 ms
[web]   ➜  Local:   http://localhost:5173/
```

Abrir `http://localhost:5173` debería mostrar la lista de tareas que devuelve `apps/api` — la prueba de que el proxy, el fetch relativo y el tipo compartido están conectados correctamente de punta a punta.
