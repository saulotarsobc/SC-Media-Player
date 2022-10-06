window.addEventListener('DOMContentLoaded', () => {

	const { ipcRenderer } = require('electron');

	const btn_play = document.querySelector('#btn_play');
	const btn_pause = document.querySelector('#btn_pause');
	const btn_stop = document.querySelector('#btn_stop');
	const get_midias = document.querySelector('#get_midias');
	const midias_list = document.querySelector('#midias_list');

	btn_play.addEventListener('click', () => {
		ipcRenderer.send('video/control', 'play');
	});

	btn_pause.addEventListener('click', () => {
		ipcRenderer.send('video/control', 'pause');
	});

	btn_stop.addEventListener('click', () => {
		ipcRenderer.send('video/control', 'stop');
	});

	get_midias.addEventListener('click', () => {
		ipcRenderer.send('getMidias', 'getMidias');
	});

	ipcRenderer.on('received/midias', (event, args) => {
		console.log(args);

		midias_list.innerHTML = "";

		args.forEach(el => {
			let iten = `<div class="iten" id="${el.src}">
				${el.name}
			</div>`;

			midias_list.innerHTML += iten;
		});

		let itens = document.querySelectorAll('.iten');

		itens.forEach(iten => {
			iten.addEventListener('click', () => {
				ipcRenderer.send('setMidia', iten.id);
			});
		});

	});

});