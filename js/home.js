window.addEventListener('DOMContentLoaded', () => {

	const { ipcRenderer } = require('electron');

	const btn_play = document.querySelector('#btn_play');
	const btn_pause = document.querySelector('#btn_pause');
	const btn_stop = document.querySelector('#btn_stop');
	const get_midias = document.querySelector('#get_midias');
	const midias_list = document.querySelector('#midias_list');
	const add_midia = document.querySelector('#add_midia');

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

	add_midia.addEventListener('click', () => {
		ipcRenderer.send('set_folder', 'add_folder');
	});

	ipcRenderer.on('received/midias', (event, arg) => {

		console.log(arg);

		midias_list.innerHTML = "";

		arg.forEach(el => {
			let iten = `<div class="iten" data-src="${el.src}" id="${el.id}">
				${el.name}
			</div>`;

			midias_list.innerHTML += iten;
		});

		let itens = document.querySelectorAll('.iten');

		itens.forEach(iten => {
			iten.classList.remove('active');

			iten.addEventListener('click', () => {
				itens.forEach(iten => {
					iten.classList.remove('active');
				});
				iten.classList.add('active');
				console.log(iten.dataset.src);
				ipcRenderer.send('setMidia', iten.dataset.src);
			});
		});

	});

	ipcRenderer.once('teste', (event, arg) => {
		
		console.log(arg);

	});

});