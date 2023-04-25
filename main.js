const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const remoteMain = require("@electron/remote/main");

let win, sec;
remoteMain.initialize();

function createWindows() {
    /* main window */
    win = new BrowserWindow({
        maxHeight: 600,
        width: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });
    win.loadFile("./src/views/index.html");
    win.setTitle("SC Media Player");
    // win.setPosition(50, 50);
    remoteMain.enable(win.webContents);
    // win.webContents.openDevTools();

    /* second window */
    sec = new BrowserWindow({
        height: 180,
        minHeight: 180,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        parent: win,
        frame: false,
        autoHideMenuBar: true,
    });
    sec.loadFile("./src/views/sec.html");
    sec.setTitle("SC-Media-Player-Second");
    // sec.setPosition(500, 50);
    sec.setAspectRatio(16 / 9);
    // sec.webContents.openDevTools();
}

app.whenReady()
    .then(() => app.on("activate", () => BrowserWindow.getAllWindows().length === 0) ? createWindows() : "");
app.on("window-all-closed", () => process.platform !== "darwin" ? app.quit() : "");

/* code */
ipcMain.on('setMidia', (e, a) => sec.webContents.send('setMidia', a));
ipcMain.on('video/control', (e, a) => sec.webContents.send('video/control', a));
ipcMain.on('video/setProgress', (e, a) => sec.webContents.send('video/setProgress', a));
ipcMain.on('timeupdate', (e, a) => win.webContents.send('timeupdate', a));
ipcMain.on("addMidiaInDb", (e, a) => {
    dialog
        .showOpenDialog({ properties: ["openFile"] })
        .then((result) => {
            if (!result.canceled) {
                const filePath = result.filePaths[0];
                const fileName = path.parse(filePath).name;
                win.webContents.send("addMidiaInDb", { name: fileName, src: filePath });
            }
        })
        .catch((err) => console.log(err));
});