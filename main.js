const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        resizable: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('minimize', (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    if (!tray) {
        createTray();
    }
}

function createTray() {
    tray = new Tray(path.join(__dirname, 'tray_icon.png'));

    const trayMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            click: function () {
                mainWindow.show();
            }
        },
        {
            label: 'Quit',
            click: function () {
                app.quit();
            }
        }
    ]);

    tray.setContextMenu(trayMenu);
    tray.setToolTip('Announcement App');
    tray.on('click', () => {
        mainWindow.show();
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

ipcMain.on('new-message', (event, message) => {
    mainWindow.webContents.executeJavaScript(`
        document.getElementById('Message').textContent = "${message}";
    `);
});


ipcMain.on('minimize-window', () => {
    mainWindow.hide();
});

ipcMain.on('close-window', () => {
    mainWindow.close();
});
