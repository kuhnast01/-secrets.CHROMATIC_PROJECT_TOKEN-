import React, { useState } from 'react';

import Dashboard from '../dashboard/Dashboard';
import Analytics from '../analytics/Analytics';
import Events from '../events/Events';
import Users from '../users/Users';
import Logs from '../logs/Logs';
import PoseidonConsole from '../poseidon/PoseidonConsole';
import MultiAgent from '../multiagent/MultiAgent';
import DeviceHealthPanel from './DeviceHealthPanel';
import ConfigPanel from './ConfigPanel';
import FeatureFlagsPanel from './FeatureFlagsPanel';
import TelemetryPanel from './TelemetryPanel';

const MODULES = [
  { key: 'dashboard', label: 'Dashboard', component: <Dashboard /> },
  { key: 'analytics', label: 'Analytics', component: <Analytics /> },
  { key: 'events', label: 'Events', component: <Events /> },
  { key: 'users', label: 'Users', component: <Users /> },
  { key: 'logs', label: 'Logs', component: <Logs /> },
  { key: 'devicehealth', label: 'Device Health', component: <DeviceHealthPanel /> },
  { key: 'config', label: 'Config', component: <ConfigPanel /> },
  { key: 'featureflags', label: 'Feature Flags', component: <FeatureFlagsPanel /> },
  { key: 'telemetry', label: 'Telemetry', component: <TelemetryPanel /> },
  { key: 'multiagent', label: 'Multi-Agent', component: <MultiAgent /> },
  { key: 'poseidon', label: 'Poseidon AI', component: <PoseidonConsole /> },
];

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [dark, setDark] = useState(false);
  const activeModule = MODULES.find(m => m.key === active)?.component;

  // Toggle dark mode by adding/removing class on body
  React.useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
  }, [dark]);

  return (
    <div style={{ fontFamily: 'var(--font-main)', minHeight: '100vh', background: 'var(--color-bg)', color: 'var(--color-text)' }}>
      <header style={{ background: 'var(--color-text)', color: 'var(--color-bg)', padding: '16px 32px', display: 'flex', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 24, flex: 1 }}>Poseidon Desktop Command Center</h1>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setDark(d => !d)}
            style={{
              marginRight: 16,
              padding: '8px 16px',
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: '0 2px 8px #0001',
              transition: 'all 0.2s',
            }}
          >
            {dark ? '☾ Dark' : '☀ Light'}
          </button>
          {MODULES.map(m => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              style={{
                marginLeft: 4,
                padding: '8px 16px',
                background: active === m.key ? 'var(--color-primary)' : 'var(--color-surface)',
                color: active === m.key ? 'var(--color-surface)' : 'var(--color-text)',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontWeight: 600,
                boxShadow: active === m.key ? '0 2px 8px #3b82f633' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {m.label}
            </button>
          ))}
        </nav>
      </header>
      <main style={{ padding: 32, maxWidth: 900, margin: '0 auto' }}>
        {activeModule}
      </main>
    </div>
  );
}
