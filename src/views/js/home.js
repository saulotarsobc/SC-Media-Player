/* navegador */
const btn_play = document.querySelector("#btn_play"),
    btn_pause = document.querySelector("#btn_pause"),
    btn_stop = document.querySelector("#btn_stop"),
    get_midias = document.querySelector("#get_midias"),
    midias_list = document.querySelector("#midias_list"),
    add_midia = document.querySelector("#add_midia"),
    video_main = document.querySelector("#video_main");

const { ipcRenderer } = require("electron");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const remote = require("@electron/remote");
const appPath = remote.app.getPath("userData");
const dbFile = path.join(appPath, "dbFile.sqlite");
const sequelize = new Sequelize({ dialect: "sqlite", storage: dbFile });
const Midias = sequelize.define("midias", { name: { type: DataTypes.STRING }, src: { type: DataTypes.STRING } });
Midias.sync({ alter: true });
/* ====================== */

/* ====================== listeners */
add_midia.addEventListener("click", async () => ipcRenderer.send("addMidiaInDb"));
get_midias?.addEventListener("click", () => updateLista());
btn_play?.addEventListener("click", () => ipcRenderer.send("video/control", "play"));
btn_pause?.addEventListener("click", () => ipcRenderer.send("video/control", "pause"));
btn_stop?.addEventListener("click", () => ipcRenderer.send("video/control", "stop"));

/* video */
video_main.addEventListener('play', () => ipcRenderer.send("video/control", "play"));
video_main.addEventListener('pause', () => ipcRenderer.send("video/control", "pause"));
video_main.addEventListener('timeupdate', () => ipcRenderer.send("video/setProgress", video_main.currentTime));
/* ====================== listeners */

/* db functions */
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

                    video_main.src = iten.dataset.src;
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

ipcRenderer.on("addMidiaInDb", async (events, { name, src }) => {
    Midias.create({ name, src })
        .then(() => updateLista())
        .catch((e) => console.log("erro: ", e));
});

const deleteInDb = async (id) => {
    Midias.destroy({ where: { id } })
        .then(() => updateLista())
        .catch((e) => console.log("erro: ", e))
};

updateLista();