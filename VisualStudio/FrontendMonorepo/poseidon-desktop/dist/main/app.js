import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import './ipc/system.js';
import './ipc/adminPanel.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    win.loadFile(path.join(__dirname, '../renderer/index.html'));
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});
