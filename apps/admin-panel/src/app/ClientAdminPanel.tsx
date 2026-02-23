"use client";

import LoginForm from './LoginForm';
import { useState, useEffect } from 'react';
import UserManagementPanel from './UserManagementPanel';
import LiveOpsAnalyticsPanel from './LiveOpsAnalyticsPanel';
import SystemHealthPanel from './SystemHealthPanel';

export default function ClientAdminPanel() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthed(!!localStorage.getItem('token'));
      document.title = 'Admin Panel | Poseidon Platform';
    }
  }, []);

  function handleLogin() {
    setAuthed(true);
    window.location.reload();
  }

  if (!authed) {
    return <LoginForm onLogin={handleLogin} />;
  }
  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <h1 style={{ color: '#2b6cb0', marginBottom: 32 }}>Admin Panel Preview</h1>
      <UserManagementPanel />
      <LiveOpsAnalyticsPanel />
      <SystemHealthPanel />
    </main>
  );
}