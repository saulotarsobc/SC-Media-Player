const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const productName = require('./package.json').build.productName;
const appVersion = require('./package.json').version;

const remoteMain = require("@electron/remote/main");
remoteMain.initialize();

let win;
let sec;

function createWindows() {
    /* main window */
    win = new BrowserWindow({
        // height: 500,
        width: 450,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });
    win.loadFile("./src/views/index.html");
    win.setTitle(`${productName} - v${appVersion}`);
    win.setPosition(50, 50);
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
    sec.setPosition(500, 50);
    sec.setAspectRatio(16 / 9);
    // sec.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindows();
    console.log("app inicializado...");
    app.on("activate", function() {
        if (BrowserWindow.getAllWindows().length === 0) createWindows();
    });
});

app.on("window-all-closed", function() {
    console.log("...app finalizado");
    if (process.platform !== "darwin") app.quit();
});

/* code */
ipcMain.on("addMidiaInDb", async(event, args) => {
    console.log(args);
    dialog
        .showOpenDialog({ properties: ["openFile"] })
        .then((result) => {
            if (!result.canceled) {
                const filePath = result.filePaths[0];
                const fileName = path.parse(filePath).name;
                win.webContents.send("addMidiaInDb", { name: fileName, src: filePath });
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

ipcMain.on('setMidia', (event, args) => {
    console.log(args);
    sec.webContents.send('setMidia', args)
});

ipcMain.on('video/control', (event, args) => {
    console.log(args);
    sec.webContents.send('video/control', args);
});