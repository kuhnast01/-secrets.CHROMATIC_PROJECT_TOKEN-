
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './dashboard/App';
import './poseidon/global.css';

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
