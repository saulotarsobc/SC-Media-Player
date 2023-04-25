const { ipcRenderer } = require("electron");
const video = document.querySelector("#video");

ipcRenderer.on("video/control", (event, arg) => {
    console.log(arg);

    if (arg == "play") {
        console.log("play");
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

ipcRenderer.on("video/setProgress", (event, arg) => video.currentTime = arg);

ipcRenderer.on("setMidia", (event, arg) => {
    if (video.src == arg) {
        return;
    } else {
        video.src = arg;
    };
});