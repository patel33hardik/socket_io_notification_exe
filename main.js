const {
    app,
    BrowserWindow,
    ipcMain,
    Tray,
    Menu,
    session,
} = require("electron");
const path = require("path");

let mainWindow;
let tray = null;

function createWindow() {
    console.log(path.join(__dirname, "preload.js"));
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

app.on("ready", createWindow);

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
    if (mainWindow.isMinimized() || !mainWindow.isVisible()) {
        mainWindow.restore();
        mainWindow.show();
    }
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true);
    setTimeout(() => {
        mainWindow.setAlwaysOnTop(false);
    }, 3000);
});
