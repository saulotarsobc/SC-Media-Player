const { app, BrowserWindow, ipcMain, dialog, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require("crypto");
const { getConfig, updateLocation } = require("./database");

let mainWindow;
let secWindow;
let files = [];
let midiasFolder = "";

setTimeout(() => {
	secWindow.webContents.send("teste", "123");
}, 1000);

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
		autoHideMenuBar: true
	});
	mainWindow.loadFile('index.html');
	mainWindow.setPosition(50, 50);

	/* second scren */
	secWindow = new BrowserWindow({
		height: 180,
		minHeight: 180,
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
	mainWindow.webContents.openDevTools();
	// secWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
	createWindow();
	app.on('activate', function () { if (BrowserWindow.getAllWindows().length === 0) createWindow() });
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit();
});

/* code */
function showNotification(title, subtitle, body) {
	new Notification({ title, subtitle, body, silent: false }).show();
}

ipcMain.on('video/control', (event, arg) => {
	secWindow.webContents.send('video/control', arg);
});

ipcMain.on('set_folder', async (event, arg) => {
	const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
	if (canceled) {
		return;
	}
	else {
		midiasFolder = filePaths[0];
		showNotification("SC - Media Player", "Diretório selecionado", midiasFolder);
		updateLocation("location", midiasFolder);
	}
});

ipcMain.on('getMidias', (event, arg) => {
	files = [];
	if (midiasFolder) {
		console.log("\nMidias:")
		fs.readdirSync(midiasFolder).forEach(file => {
			console.log(midiasFolder, file)
			files.push({
				id: crypto.randomBytes(16).toString("hex"),
				name: file,
				src: path.join(midiasFolder, file),
			});
		});
		console.log("\n");
		event.reply('received/midias', files);
		showNotification('SC - Media Player', 'Midias', 'Lista de mídias atualizada');
	} else {
		showNotification('SC - Media Player', 'Media Player', 'Diretório não definido');
	}
});

ipcMain.on('setMidia', (event, arg) => {
	secWindow.webContents.send('setMidia', arg)
});

async function getConfigRun() {
	console.log('getConfigRun');
	let data = await getConfig("location");
	midiasFolder = data.dataValues.valor;
	console.log("\n\n" + midiasFolder + "\n\n");
}

setTimeout(() => {
	getConfigRun();
}, 1000);