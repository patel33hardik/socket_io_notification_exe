const { ipcRenderer, contextBridge } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const minimizeBtn = document.getElementById('min-btn');
    const closeBtn = document.getElementById('close-btn');

    minimizeBtn.addEventListener('click', () => {
        ipcRenderer.send('minimize-window');
    });

    closeBtn.addEventListener('click', () => {
        ipcRenderer.send('close-window');
    });
});

// Expose a function that will send the 'bring-to-front' event to the main process
contextBridge.exposeInMainWorld('api', {
    bringToFront: () => ipcRenderer.send('bring-to-front')
});
