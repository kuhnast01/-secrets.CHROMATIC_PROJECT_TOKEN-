import React, { useState, useRef, useEffect } from 'react';

import ServiceStatus from './ServiceStatus';
import LLMContextPanel from './LLMContextPanel';

type Message = { role: 'user' | 'poseidon'; text: string };

const sendChat = async (text: string, _history: Message[], _useLocal: boolean): Promise<Message> => {
  // @ts-ignore
  if (!window.electronAPI?.invoke) {
    return { role: 'poseidon', text: 'IPC not available' };
  }
  // Route all messages to the brain layer for orchestration
  const res = await window.electronAPI.invoke('poseidon:brain', text);
  return res;
};

export default function PoseidonConsole() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'poseidon', text: 'Welcome to Poseidon AI Console. How can I help?' }
  ]);
  const [streamed, setStreamed] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [useLocal, setUseLocal] = useState(false);
  const [advancedLLM, setAdvancedLLM] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Demo context and trace for LLM reasoning panel
  const [llmContext, setLlmContext] = useState<string[]>(["User intent: deploy backend", "Env: production", "Last error: none"]);
  const [llmTrace, setLlmTrace] = useState<string[]>(["Parsed intent: deploy", "Checked backend health", "No errors found", "Ready to deploy"]);

  useEffect(() => {
    // @ts-ignore
    if (!window.electronAPI?.invoke || !window.electron) return;
    // @ts-ignore
    const { electron } = window;
    const handler = (_event: any, data: Message) => {
      setStreamed(data.text);
    };
    // @ts-ignore
    window.require?.('electron').ipcRenderer?.on('llm:stream', handler);
    return () => {
      // @ts-ignore
      window.require?.('electron').ipcRenderer?.removeListener('llm:stream', handler);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', text: input }]);
    setInput('');
    setStreaming(true);
    setStreamed(null);
    const reply = await sendChat(input, messages, useLocal);
    setMessages(msgs => [...msgs, reply]);
    setStreaming(false);
    setStreamed(null);
    inputRef.current?.focus();
  };

  return (
    <div className="poseidon-container" style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div className="poseidon-card" style={{ flex: 2, minWidth: 320 }}>
        <h2>Poseidon AI Console</h2>
        <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>
            <input type="checkbox" checked={useLocal} onChange={e => setUseLocal(e.target.checked)} style={{ marginRight: 6 }} />
            Use local LLM (Ollama)
          </label>
          <label style={{ fontSize: 14, fontWeight: 500 }}>
            <input type="checkbox" checked={advancedLLM} onChange={e => setAdvancedLLM(e.target.checked)} style={{ marginLeft: 18, marginRight: 6 }} />
            Advanced LLM Reasoning
          </label>
        </div>
        <div style={{ minHeight: 200, maxHeight: 320, overflowY: 'auto', marginBottom: 16, background: 'var(--color-bg)', borderRadius: 'var(--radius)', padding: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
              <span style={{
                display: 'inline-block',
                background: m.role === 'user' ? '#3b82f6' : '#e0e7ef',
                color: m.role === 'user' ? '#fff' : '#222',
                borderRadius: 16,
                padding: '8px 16px',
                maxWidth: '80%',
                wordBreak: 'break-word',
                fontSize: 15
              }}>{m.text}</span>
            </div>
          ))}
          {streaming && (
            <div style={{ color: '#3b82f6', fontStyle: 'italic', marginTop: 8 }}>
              {streamed ? <span>{streamed}</span> : 'Poseidon is thinking...'}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type a message..."
            style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15 }}
          />
          <button
            onClick={handleSend}
            style={{ padding: '10px 20px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
          >Send</button>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 220, maxWidth: 340 }}>
        <ServiceStatus />
        <LLMContextPanel context={llmContext} trace={llmTrace} />
      </div>
    </div>
  );
}
