import React, { Suspense, lazy } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Player from './pages/Player';
import Commanders from './pages/Commanders';
import Fleet from './pages/Fleet';
import Tech from './pages/Tech';
import Base from './pages/Base';
import StoreLazy from './pages/StoreLazy';
import Combat from './pages/Combat';

const AdminPage = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Galaxy Ascendant — Demo UI</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/player">Player</Link>
          <Link to="/commanders">Commanders</Link>
          <Link to="/fleet">Fleet</Link>
          <Link to="/tech">Tech</Link>
          <Link to="/base">Base</Link>
          <Link to="/store">Store</Link>
          <Link to="/combat">Combat</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player" element={<Player />} />
          <Route path="/commanders" element={<Commanders />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/tech" element={<Tech />} />
          <Route path="/base" element={<Base />} />
          <Route path="/store" element={<StoreLazy />} />
          <Route path="/combat" element={<Combat />} />
          <Route path="/admin" element={<Suspense fallback={<div>loading...</div>}><AdminPage /></Suspense>} />
        </Routes>
      </main>
      <footer>API: <code>{import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}</code></footer>
    </div>
  );
}
