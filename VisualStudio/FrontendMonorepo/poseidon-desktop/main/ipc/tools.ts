import { ipcMain } from 'electron';
import fetch from 'node-fetch';
import net from 'net';
import fs from 'fs';
import path from 'path';

// Health check: call backend /system-health
ipcMain.handle('tools:healthCheck', async () => {
  try {
    const res = await fetch('http://localhost:4000/system-health');
    if (!res.ok) throw new Error('Backend not healthy');
    return await res.json();
  } catch (e) {
    return { status: 'error', error: e.message };
  }
});

// Check if a port is open (returns true/false)
ipcMain.handle('tools:checkPort', async (_event, port: number) => {
  return await new Promise(resolve => {
    const socket = new net.Socket();
    socket.setTimeout(1000);
    socket.once('connect', () => { socket.destroy(); resolve(true); });
    socket.once('timeout', () => { socket.destroy(); resolve(false); });
    socket.once('error', () => { resolve(false); });
    socket.connect(port, '127.0.0.1');
  });
});

// Read a file (logs, configs, etc.)
ipcMain.handle('tools:readFile', async (_event, filePath: string) => {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    const content = fs.readFileSync(abs, 'utf8');
    return { status: 'ok', content };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
});

// List running processes (simple, cross-platform)
ipcMain.handle('tools:listProcesses', async () => {
  try {
    const ps = process.platform === 'win32' ? 'tasklist' : 'ps aux';
    const { execSync } = require('child_process');
    const output = execSync(ps, { encoding: 'utf8' });
    return { status: 'ok', output };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
});

// Tail a log file (last N lines)
ipcMain.handle('tools:tailLog', async (_event, filePath: string, lines: number = 40) => {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    const content = fs.readFileSync(abs, 'utf8');
    const allLines = content.split(/\r?\n/);
    return { status: 'ok', content: allLines.slice(-lines).join('\n') };
  } catch (e) {
    return { status: 'error', error: e.message };
  }
});
