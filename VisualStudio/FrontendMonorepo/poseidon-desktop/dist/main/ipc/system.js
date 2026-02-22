import { ipcMain } from 'electron';
import os from 'os';
ipcMain.handle('system:getHealth', async () => {
    return {
        uptime: os.uptime(),
        platform: os.platform(),
        arch: os.arch(),
        totalmem: os.totalmem(),
        freemem: os.freemem(),
        cpus: os.cpus().length,
        loadavg: os.loadavg(),
        hostname: os.hostname(),
        userInfo: os.userInfo(),
    };
});
