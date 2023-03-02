/* navegador */
const btn_play = document.querySelector("#btn_play"),
    btn_pause = document.querySelector("#btn_pause"),
    btn_stop = document.querySelector("#btn_stop"),
    get_midias = document.querySelector("#get_midias"),
    midias_list = document.querySelector("#midias_list"),
    add_midia = document.querySelector("#add_midia"),
    time_corrente = document.querySelector("#time_corrente"),
    time_final = document.querySelector("#time_final"),
    progress_input = document.querySelector("#progress_input");
/* ====================== */

// progress_input.value = 0;

const { ipcRenderer } = require("electron");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const remote = require("@electron/remote");
const appPath = remote.app.getPath("userData");
const dbFile = path.join(appPath, "dbFile.sqlite");
const sequelize = new Sequelize({ dialect: "sqlite", storage: dbFile });
const Midias = sequelize.define("midias", {
    name: { type: DataTypes.STRING },
    src: { type: DataTypes.STRING },
});

Midias.sync({ alter: true });

add_midia.addEventListener("click", async () => {
    ipcRenderer.send("addMidiaInDb", "chamando 'addMidiaInDb' para showOpenDialog no main");
});

ipcRenderer.on("addMidiaInDb", async (events, { name, src }) => {
    Midias.create({ name, src })
        .then(() => {
            updateLista();
        })
        .catch((e) => {
            console.log("erro: ", e);
        });
});

ipcRenderer.on("timeupdate", (events, args) => {
    console.log(args);

    time_corrente.innerHTML = "00:00";
    time_final.innerHTML = "00:00";

    const { currentTime, duration } = args;

    if (duration == NaN) {
        progress_input.value = 0;
    } else {
        const valueToProgress = ((currentTime / duration) * 1000).toFixed(0);
        progress_input.value = valueToProgress;
        time_corrente.innerHTML = formatSeconds(currentTime.toFixed(0));
        time_final.innerHTML = formatSeconds(duration.toFixed(0));
    };
});

function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // formata a saída em uma string
    const formatted = [hours, minutes, remainingSeconds]
        .map(value => value < 10 ? "0" + value : value) // adiciona um zero à esquerda se o valor for menor que 10
        .filter((value, index) => value !== "00" || index > 0) // remove as horas se for zero
        .join(":");

    return formatted;
}


get_midias.addEventListener("click", () => {
    updateLista();
});

async function updateLista() {
    await Midias.findAll({ raw: true })
        .then((midias) => {
            midias_list.innerHTML = "";

            midias.map(({ src, name, id }) => {
                midias_list.innerHTML += `<div class="iten" data-src="${src}" id="${id}">${name}<br><div class="deletar" data-id="${id}">APAGAR</div></div>`;
            });

            document.querySelectorAll(".iten").forEach((iten) => {
                iten.classList.remove("active");
                iten.addEventListener("click", () => {
                    document.querySelectorAll(".iten").forEach((iten) => {
                        iten.classList.remove("active");
                    });
                    iten.classList.add("active");
                    ipcRenderer.send("setMidia", iten.dataset.src);
                });
            });

            document.querySelectorAll(".deletar").forEach((deletar) => {
                deletar.addEventListener("click", () => {
                    deleteInDb(deletar.dataset.id);
                });
            });
        })
        .catch((e) => {
            console.log("erro: ", e);
        });
};

function deleteInDb(id) {
    Midias.destroy({ where: { id } })
        .then((res) => {
            console.log("deletado", res);
            updateLista();
        })
        .catch((e) => {
            console.log("erro: ", e);
        });
};

btn_play.addEventListener("click", () => {
    console.log('key => play');
    ipcRenderer.send("video/control", "play")
});

btn_pause.addEventListener("click", () => {
    console.log('key => pause');
    ipcRenderer.send("video/control", "pause")
});

btn_stop.addEventListener("click", () => {
    console.log('key => stop');
    ipcRenderer.send("video/control", "stop")
});

updateLista();