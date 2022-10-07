const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require("crypto");

let mainWindow;
let secWindow;
let files = [];
let midiasFolder = 'C:\\Users\\saulo\\Documents\\OnlyM\\Media';
// let midiasFolder = '';

function createWindow() {
	/* main scren */
	mainWindow = new BrowserWindow({
		height: 500,
		width: 450,
		// kiosk: true,
		title: "SC Media Player",
		webPreferences: {
			preload: path.join(__dirname, 'js', 'home.js'),
			nodeIntegration: true,
		},
		// frame: false,
		autoHideMenuBar: true
	});
	mainWindow.loadFile('index.html');
	mainWindow.setPosition(50, 50);

	/* secont scren */
	secWindow = new BrowserWindow({
		// width: 300,
		height: 180,
		minHeight:180,
		webPreferences: {
			preload: path.join(__dirname, 'js', 'sec.js'),
			nodeIntegration: true,
		},
		parent: mainWindow,
		frame: false,
		autoHideMenuBar: true,
	});
	secWindow.loadFile('sec.html');
	secWindow.setPosition(500, 50);
	secWindow.setAspectRatio(16 / 9);

	/* Dev Tools */
	// mainWindow.webContents.openDevTools();
	// secWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

/* code */
function showNotification(title, subtitle, body) {
	new Notification({ title, subtitle, body, silent: true }).show();
}

ipcMain.on('video/control', (event, arg) => {
	secWindow.webContents.send('video/control', arg);
});

ipcMain.on('set_folder', async (event, arg) => {
	const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
	if (canceled) { return; } else { midiasFolder = filePaths[0]; }
});

ipcMain.on('getMidias', (event, arg) => {
	// console.log(arg);
	files = [];
	if (midiasFolder) {
		fs.readdirSync(midiasFolder).forEach(file => {
			files.push({
				id: crypto.randomBytes(16).toString("hex"),
				name: file,
				src: path.join(midiasFolder, file),
			});
		});
		event.reply('received/midias', files);
	} else {
		showNotification('SC - Media Player', 'Media Player', 'Diretório não definido');
	}
});

ipcMain.on('setMidia', (event, arg) => {
	secWindow.webContents.send('setMidia', arg)
});