const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data.db'
});

const Configs = sequelize.define('configs', {
    chave: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    valor: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

Configs.sync({ alter: true });

Configs.create({ chave: "location", valor: "1234" }).then((data) => { console.log(data) }).then((e) => console.log(e, message));

async function getConfig(chave) {
    return Configs.findOne({
        where: {
            chave: chave
        }
    })
        .then((data) => {
            return (data);
        }).catch((e) => {
            console.log(e.message);
        })
}

async function updateLocation(chave, newLocation) {
    return Configs.update({ valor: newLocation }, {
        where: {
            chave
        }
    })
        .then((data) => {
            return (data);
        }).catch((e) => {
            console.log(e.message);
        })
}

// setTimeout(async () => {
//     let teste = await getConfig("location");
//     console.log(teste.dataValues.valor);
// }, 1000);

module.exports = { sequelize, getConfig, updateLocation };