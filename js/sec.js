window.addEventListener('DOMContentLoaded', () => {

    const { ipcRenderer } = require('electron');
    const video = document.querySelector('#video');

    ipcRenderer.on("sec/play", (event, args) => {
        console.log(args);
        video.play();
    });

    ipcRenderer.on("sec/pause", (event, args) => {
        console.log(args);
        video.pause();
    });

    ipcRenderer.on("sec/stop", (event, args) => {
        console.log(args);
        video.pause();
        video.currentTime = 0;
    });
    
});