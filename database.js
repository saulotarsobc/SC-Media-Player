const { Sequelize, DataTypes } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './data.db'
});

const locations = sequelize.define('locations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// locations.sync({ alter: true });

async function getLocation(chave) {
    return locations.findOne({
        where: {
            chave
        }
    })
        .then((data) => {
            // console.log(data);
            return (data);
        }).catch((e) => {
            console.log(e.message);
        })
}

async function updateLocation(chave, newLocation) {
    return locations.update({ location: newLocation }, {
        where: {
            chave
        }
    })
        .then((data) => {
            // console.log(data);
            return (data);
        }).catch((e) => {
            console.log(e.message);
        })
}

updateLocation("location", "123");

module.exports = { sequelize, getLocation, updateLocation };