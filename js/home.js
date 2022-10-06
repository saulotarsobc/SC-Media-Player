window.addEventListener('DOMContentLoaded', () => {

	const { ipcRenderer } = require('electron');
	
	const btn_play = document.querySelector('#btn_play');
	const btn_pause = document.querySelector('#btn_pause');
	const btn_stop = document.querySelector('#btn_stop');

	btn_play.addEventListener('click', () => {
		ipcRenderer.send('video/control', 'play');
	});

	btn_pause.addEventListener('click', () => {
		ipcRenderer.send('video/control', 'pause');
	});

	btn_stop.addEventListener('click', () => {
		ipcRenderer.send('video/control', 'stop');
	});

});