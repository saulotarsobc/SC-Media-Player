const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let files = [];
let midiasFolder = './midias'

fs.readdirSync(midiasFolder).forEach(file => {
	files.push({
		name: file,
		src: path.join(__dirname, midiasFolder, file),
	});
});

let mainWindow;
let secWindow;

function createWindow() {
	/* main scren */
	mainWindow = new BrowserWindow({
		width: 400,
		height: 400,
		webPreferences: {
			preload: path.join(__dirname, 'js', 'home.js'),
			nodeIntegration: true,
		}
	});
	mainWindow.loadFile('index.html');
	mainWindow.setPosition(50, 50);
	// secWindow.setAspectRatio(1 / 1);

	/* secont scren */
	secWindow = new BrowserWindow({
		// width: 300,
		height: 450,
		webPreferences: {
			preload: path.join(__dirname, 'js', 'sec.js'),
			nodeIntegration: true,
		},
		parent: mainWindow,
		frame: false,
		autoHideMenuBar: true
	});
	secWindow.loadFile('sec.html');
	secWindow.setPosition(500, 50);
	secWindow.setAspectRatio(16 / 9);

	/* Dev Tools */
	mainWindow.webContents.openDevTools();
	secWindow.webContents.openDevTools();
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

ipcMain.on('video/control', (event, args) => {
	secWindow.webContents.send('video/control', args);
});

ipcMain.on('getMidias', (event, args) => {
	event.reply('received/midias', files)
});

ipcMain.on('setMidia', (event, args) => {
	secWindow.webContents.send('setMidia', args)
});
