const { app, BrowserWindow } = require("electron");

let mainWindow;
let secWindow;

function createWindows() {
    /* main window */
    mainWindow = new BrowserWindow({
        height: 500,
        width: 450,
        title: "SC Media Player",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        // autoHideMenuBar: true
    });
    mainWindow.loadFile("./src/views/index.html");
    mainWindow.setPosition(50, 50);
    mainWindow.webContents.openDevTools();

    /* second window */
    secWindow = new BrowserWindow({
        // height: 180,
        // minHeight: 180,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        alwaysOnTop: true,
        parent: mainWindow,
        // frame: false,
        // autoHideMenuBar: true,
    });
    secWindow.loadFile("./src/views/sec.html");
    secWindow.setPosition(500, 50);
    // secWindow.setAspectRatio(16 / 9);
    secWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindows();
    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindows();
    });
});

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit();
});

/* code */