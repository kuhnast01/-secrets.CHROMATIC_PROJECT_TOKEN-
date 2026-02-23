// Preload script for secure IPC and context bridging
// Add APIs to window object here for renderer access

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  ping: () => 'pong',
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
