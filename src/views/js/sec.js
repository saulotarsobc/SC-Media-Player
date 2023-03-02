const { ipcRenderer } = require("electron");
const video = document.querySelector("#video");

video.addEventListener('timeupdate', function () {
    setTimeout(() => {
        ipcRenderer.send('timeupdate', {
            currentTime: video.currentTime,
            duration: video.duration,
        });
    }, 100);
});

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

ipcRenderer.on("setMidia", (event, arg) => {
    console.log(arg);
    if (video.src == arg) {
        return;
    } else {
        video.src = arg;
    };
});