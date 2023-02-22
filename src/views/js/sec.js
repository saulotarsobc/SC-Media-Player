const { ipcRenderer } = require("electron");
const video = document.querySelector("#video");

ipcRenderer.on("video/control", (event, arg) => {
    console.log(arg);

    if (arg == "play") {
        video.play();
    }

    if (arg == "pause") {
        video.pause();
    }

    if (arg == "stop") {
        video.pause();
        video.currentTime = 0;
    }
});

ipcRenderer.on("setMidia", (event, arg) => {
    console.log(arg);
    video.src = arg;
});