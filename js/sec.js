window.addEventListener('DOMContentLoaded', () => {

    const { ipcRenderer } = require('electron');
    const video = document.querySelector('#video');

    ipcRenderer.on("video/control", (event, args) => {
        
        console.log(args);

        if (args == "play") {
            video.play();
        }

        if (args == "pause") {
            video.pause();
        }

        if (args == "stop") {
            video.pause();
            video.currentTime = 0;
        }

    });

    ipcRenderer.on('setMidia', (event, args) => {
        video.src = args;
    });

});