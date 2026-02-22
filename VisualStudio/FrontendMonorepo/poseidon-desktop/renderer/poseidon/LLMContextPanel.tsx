import React from 'react';

export default function LLMContextPanel({ context, trace }: { context: string[]; trace: string[] }) {
  return (
    <div style={{ background: '#f4f6fa', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <h3 style={{ margin: 0, fontSize: 16, color: '#1a2233' }}>LLM Context & Reasoning</h3>
      <div style={{ marginBottom: 12 }}>
        <b>Context:</b>
        <ul style={{ paddingLeft: 18 }}>
          {context.map((c, i) => <li key={i} style={{ fontSize: 13 }}>{c}</li>)}
        </ul>
      </div>
      <div>
        <b>Reasoning Trace:</b>
        <ul style={{ paddingLeft: 18 }}>
          {trace.map((t, i) => <li key={i} style={{ fontSize: 13, color: '#3b82f6' }}>{t}</li>)}
        </ul>
      </div>
    </div>
  );
}
