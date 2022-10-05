window.addEventListener('DOMContentLoaded', () => {

	const { ipcRenderer } = require('electron');
	const btn_play = document.querySelector('#btn_play');
	const btn_pause = document.querySelector('#btn_pause');
	const btn_stop = document.querySelector('#btn_stop');

	btn_play.addEventListener('click', () => {
		ipcRenderer.send('home/play', 'home enviando play para main');
	});

	btn_pause.addEventListener('click', () => {
		ipcRenderer.send('home/pause', 'home enviando pause para main');
	});

	btn_stop.addEventListener('click', () => {
		ipcRenderer.send('home/stop', 'home enviando stop para main');
	});

})
