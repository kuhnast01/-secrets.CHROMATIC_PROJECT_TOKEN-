import { ipcMain } from 'electron';
import fetch from 'node-fetch';

// Simple AI brain: routes health check requests, echoes others
ipcMain.handle('poseidon:chat', async (_event, message: string) => {
  const lower = message.toLowerCase();
  if (lower.includes('health')) {
    // Call backend health check
    try {
      const res = await fetch('http://localhost:4000/system-health');
      if (!res.ok) throw new Error('Backend not healthy');
      const health = await res.json();
      return {
        role: 'poseidon',
        text: `System Health: ${health.status || 'unknown'}\nUptime: ${health.uptime || 'n/a'}\nDetails: ${JSON.stringify(health)}`
      };
    } catch (e) {
      return { role: 'poseidon', text: `Health check failed: ${e.message}` };
    }
  }
  // Default: echo
  return { role: 'poseidon', text: `Echo: ${message}` };
});
