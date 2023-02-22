const btn_play = document.querySelector("#btn_play");
const btn_pause = document.querySelector("#btn_pause");
const btn_stop = document.querySelector("#btn_stop");
const get_midias = document.querySelector("#get_midias");
const midias_list = document.querySelector("#midias_list");
const add_midia = document.querySelector("#add_midia");
/* ====================== */

const { ipcRenderer } = require("electron"), { Sequelize, DataTypes } = require("sequelize"),
    path = require("path"),
    remote = require("@electron/remote"),
    appPath = remote.app.getPath("userData"),
    dbFile = path.join(appPath, "dbFile.sqlite"),
    sequelize = new Sequelize({ dialect: "sqlite", storage: dbFile }),
    Midias = sequelize.define("midias", {
        name: { type: DataTypes.STRING },
        src: { type: DataTypes.STRING },
    });

Midias.sync({ alter: true });

add_midia.addEventListener("click", async() => {
    ipcRenderer.send("addMidiaInDb");
});

ipcRenderer.on("addMidiaInDb", async(events, args) => {
    const { name, src } = args;
    Midias.create({ name, src })
        .then(() => {
            updateLista();
        })
        .catch((e) => {
            console.log("erro: ", e);
        });
});

get_midias.addEventListener("click", () => {
    updateLista();
});

async function updateLista() {
    await Midias.findAll({ raw: true })
        .then((midias) => {
            midias_list.innerHTML = "";
            midias.map((midia) => {
                let iten = `<div class="iten" data-src="${midia.src}" id="${midia.id}">
                    ${midia.name}
                    <br>
                    <div class="deletar" data-id="${midia.id}">APAGAR</div>
                </div>`;

                midias_list.innerHTML += iten;
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
}

function deleteInDb(id) {
    Midias.destroy({ where: { id } })
        .then((res) => {
            console.log("deletado", res);
            updateLista();
        })
        .catch((e) => {
            console.log("erro: ", e);
        });
}

btn_play.addEventListener("click", () =>
    ipcRenderer.send("video/control", "play")
);

btn_pause.addEventListener("click", () =>
    ipcRenderer.send("video/control", "pause")
);

btn_stop.addEventListener("click", () =>
    ipcRenderer.send("video/control", "stop")
);

updateLista();