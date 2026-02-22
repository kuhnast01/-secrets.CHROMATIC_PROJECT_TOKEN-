import { ipcMain } from 'electron';
import fetch from 'node-fetch';

// Example: Ollama local LLM API (http://localhost:11434)
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

ipcMain.handle('llm:chat:local', async (event, messages) => {
  try {
    const res = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        stream: true
      })
    });
    if (!res.ok || !res.body) throw new Error('Local LLM API error');
    let text = '';
    for await (const chunk of res.body) {
      const str = chunk.toString();
      for (const line of str.split('\n')) {
        if (!line.trim()) continue;
        try {
          const delta = JSON.parse(line).message?.content;
          if (delta) {
            text += delta;
            event.sender.send('llm:stream', { role: 'poseidon', text });
          }
        } catch {}
      }
    }
    return { role: 'poseidon', text };
  } catch (e) {
    return { role: 'poseidon', text: `Local LLM error: ${e.message}` };
  }
});
