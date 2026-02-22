import { ipcMain } from 'electron';
import fetch from 'node-fetch';

// Replace with your OpenAI API key or use environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

ipcMain.handle('llm:chat', async (event, messages) => {
  if (!OPENAI_API_KEY) {
    return { role: 'poseidon', text: 'OpenAI API key not set.' };
  }
  try {
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 256,
        temperature: 0.2,
        stream: true
      }),
    });
    if (!res.ok || !res.body) throw new Error('LLM API error');
    let text = '';
    for await (const chunk of res.body) {
      const str = chunk.toString();
      // OpenAI streams lines starting with 'data: '
      for (const line of str.split('\n')) {
        if (line.startsWith('data: ')) {
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              text += delta;
              event.sender.send('llm:stream', { role: 'poseidon', text });
            }
          } catch {}
        }
      }
    }
    return { role: 'poseidon', text };
  } catch (e) {
    return { role: 'poseidon', text: `LLM error: ${e.message}` };
  }
});
