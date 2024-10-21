const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    Menu,
    session,
} = require("electron");
const fs = require('fs');
const path = require("path");

let mainWindow;
let tray = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: true,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.setFullScreen(true);

    // Allow insecure SSL certificates (for development only)
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders["User-Agent"] = "Chrome";
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });

    session.defaultSession.setCertificateVerifyProc((request, callback) => {
        callback(0);
    });

    mainWindow.loadFile("index.html");

    mainWindow.on("minimize", (event) => {
        event.preventDefault();
        mainWindow.hide();
    });

    mainWindow.on("closed", function () {
        mainWindow = null;
    });

    if (!tray) {
        createTray();
    }

}

// Function to create the system tray
function createTray() {
    tray = new Tray(path.join(__dirname, "tray_icon.png"));

    const trayMenu = Menu.buildFromTemplate([
        {
            label: "Show",
            click: function () {
                mainWindow.show();
            },
        },
        {
            label: "Quit",
            click: function () {
                app.quit();
            },
        },
    ]);

    tray.setContextMenu(trayMenu);

    tray.setToolTip("Announcement App");
    tray.on("click", () => {
        mainWindow.show();
    });
}

app.on("ready", function () {
    createWindow();
    // Call the function to ensure the file exists
    ensureSettingsFileExists();
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", function () {
    if (mainWindow === null) {
        createWindow();
    } else {
        mainWindow.show();
    }
});

ipcMain.on("minimize-window", () => {
    mainWindow.hide();
});

ipcMain.on("close-window", () => {
    mainWindow.close();
});

ipcMain.on("bring-to-front", () => {
    mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true);
});

// Handle save-settings event and send back a response
const settingsPath = path.join(path.join(__dirname, "settings.json"));
function ensureSettingsFileExists() {
    if (!fs.existsSync(settingsPath)) {
        // If the file doesn't exist, create it with default content
        const defaultSettings = {
            protocol: "http",
            host: "localhost",
            port: "80",
        };

        fs.writeFileSync(
            settingsPath,
            JSON.stringify(defaultSettings, null, 2),
            "utf-8"
        );
        console.log("settings.json file created with default settings.");
    }
}

ipcMain.handle('save-settings', async (event, settings) => {
    try {
        // Save the settings to settings.json
        fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

        // Send a success response back
        return { status: 'success', message: 'Settings saved successfully' };
    } catch (error) {
        // If there is an error, send an error response back
        return { status: 'error', message: 'Failed to save settings', error: error.message };
    }
});

ipcMain.handle('get-settings', () => {
    let settings = null;
    if (fs.existsSync(settingsPath)) {
        settings = JSON.parse(fs.readFileSync(settingsPath));
    }
    return settings;
});
