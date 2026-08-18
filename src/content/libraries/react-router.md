---
title: React Router
description: Routing para SPAs de React — un solo paquete (ya no react-router-dom), rutas, navegación y parámetros de URL.
category: frontend
stack: react
order: 9
tags: [react, routing]
website: https://reactrouter.com
github: https://github.com/remix-run/react-router
install: npm i react-router
related:
  - libraries/tanstack-query
updatedAt: 2026-08-16
---

Desde la versión 7, React Router es **un solo paquete**: `react-router` — `react-router-dom` ya no existe como paquete separado, todo se importa de `react-router` directo. Si ves `react-router-dom` en un tutorial o proyecto viejo, es la sintaxis anterior; los componentes/hooks son básicamente los mismos, cambia el import.

Esta guía cubre **Declarative Mode**: rutas declaradas en el árbol de componentes, la forma más simple de agregar routing a una SPA existente. Para una app nueva completa, React Router también ofrece un "Framework Mode" con convenciones de archivos (más parecido a Next.js/Astro), pero Declarative Mode es lo que hace falta la mayoría de las veces.

## Setup

```tsx title="main.tsx"
import { BrowserRouter } from 'react-router';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
```

## Declarar rutas

```tsx title="App.tsx"
import { Routes, Route } from 'react-router';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/productos/:id" element={<DetalleProducto />} />
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
}
```

## Rutas anidadas con `<Outlet />`

Una ruta padre renderiza su propio layout, y `<Outlet />` marca dónde va la ruta hija que matcheó.

```tsx
<Routes>
  <Route path="/panel" element={<LayoutPanel />}>
    <Route index element={<ResumenPanel />} />
    <Route path="ajustes" element={<AjustesPanel />} />
  </Route>
</Routes>
```

```tsx title="LayoutPanel.tsx"
import { Outlet } from 'react-router';

function LayoutPanel() {
  return (
    <div>
      <Sidebar />
      <Outlet /> {/* aquí se renderiza ResumenPanel o AjustesPanel */}
    </div>
  );
}
```

## Navegar

```tsx
import { Link, useNavigate, useParams, useSearchParams } from 'react-router';

function DetalleProducto() {
  const { id } = useParams(); // de /productos/:id
  const [searchParams] = useSearchParams(); // de ?orden=precio
  const navigate = useNavigate();

  return (
    <>
      <Link to="/productos">Volver</Link>
      <button onClick={() => navigate(-1)}>Atrás</button>
      <p>Producto {id}, orden: {searchParams.get('orden')}</p>
    </>
  );
}
```

## Resumen

| API | Uso |
| --- | --- |
| `<BrowserRouter>` | Envuelve la app, habilita el routing basado en la URL real |
| `<Routes>` / `<Route path="..." element={...} />` | Declarar qué componente va en cada ruta |
| `<Outlet />` | Marca dónde renderiza la ruta hija dentro de un layout padre |
| `<Link to="...">` | Navegación sin recargar la página |
| `useNavigate()` | Navegar por código |
| `useParams()` | Leer segmentos dinámicos (`:id`) |
| `useSearchParams()` | Leer/escribir la query string |

## Consideraciones

- `<Link>`, no `<a href>`: un `<a>` normal recarga la página completa, perdiendo todo el estado de la SPA.
- El import es `from 'react-router'` en cualquier versión reciente — `react-router-dom` sigue instalándose en proyectos viejos, pero es el paquete legacy.
- Para apps más grandes con carga de datos por ruta (loaders), React Router también soporta un modo basado en objetos de ruta (`createBrowserRouter`) — vale la pena si la app crece mucho, pero el modo declarativo de esta guía alcanza para la mayoría de los casos.
