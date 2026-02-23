import { ipcMain } from 'electron';
import fetch from 'node-fetch';
// Example: Proxy a health check from the admin panel backend
ipcMain.handle('adminPanel:health', async () => {
    try {
        const res = await fetch('http://localhost:4000/system-health');
        if (!res.ok)
            throw new Error('Backend not healthy');
        return await res.json();
    }
    catch (e) {
        return { status: 'error', error: e.message };
    }
});
