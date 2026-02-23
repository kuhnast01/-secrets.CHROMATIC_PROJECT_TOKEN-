
import React from 'react';


// Fetch agents from backend/Poseidon orchestrator
import { useEffect, useState } from 'react';

type Agent = {
  id: string | number;
  name: string;
  status: string;
  tasks: number;
  color?: string;
};

async function fetchAgents(): Promise<Agent[]> {
  // Replace with real backend or Poseidon orchestrator endpoint
  const res = await fetch('http://localhost:4000/poseidon/agents');
  if (!res.ok) throw new Error('Failed to fetch agents');
  return res.json();
}

export default function MultiAgent() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAgents()
      .then(setAgents)
      .catch(() => setError('Failed to load agents'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="poseidon-container">
      <h2>Multi-Agent Workflows</h2>
      {loading && <div>Loading agents...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div style={{ display: 'flex', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
        {agents.map(agent => (
          <div key={agent.id} className="poseidon-card" style={{ minWidth: 180, borderLeft: `6px solid ${agent.color || '#3b82f6'}` }}>
            <h3 style={{ margin: '0 0 8px 0', color: agent.color || '#3b82f6' }}>{agent.name}</h3>
            <div style={{ fontWeight: 600, color: agent.color || '#3b82f6' }}>{agent.status}</div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>Tasks: {agent.tasks}</div>
          </div>
        ))}
      </div>
      <div className="poseidon-card" style={{ minHeight: 180 }}>
        <h3 style={{ marginTop: 0 }}>Workflow Graph</h3>
        <div className="text-muted" style={{ fontStyle: 'italic' }}>
          {/* TODO: Connect to real workflow graph data from backend/Poseidon orchestrator */}
          <em>Workflow graph visualization coming soon. Connect to live data for production.</em>
        </div>
      </div>
    </div>
  );
}
