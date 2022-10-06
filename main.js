const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let secWindow;

let files = [];
let midiasFolder = '';

function createWindow() {
	/* main scren */
	mainWindow = new BrowserWindow({
		width: 400,
		height: 400,
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
ipcMain.on('video/control', (event, arg) => {
	secWindow.webContents.send('video/control', arg);
});

ipcMain.on('getMidias', (event, arg) => {
	console.log(arg);
	if (midiasFolder) {
		fs.readdirSync(midiasFolder).forEach(file => {
			files.push({
				name: file,
				src: path.join(midiasFolder, file),
			});
		});
		event.reply('received/midias', files);
	} else {
		console.log('diretorio nao definido');
	}
});

ipcMain.on('setMidia', (event, arg) => {
	secWindow.webContents.send('setMidia', arg)
});

ipcMain.on('set_folder', async (event, arg) => {

	console.log(arg);

	const result = await dialog.showOpenDialog(mainWindow, {
		properties: ['openDirectory']
	});

	if (result.canceled) {
		return;
	}

	console.log('directories selected', result.filePaths[0]);

	midiasFolder = result.filePaths[0];
})