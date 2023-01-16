const { Sequelize, DataTypes } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/data.db'
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

locations.sync({ alter: true });

async function getLocation(id) {
    return locations.findOne({
        where: {
            id
        }
    })
        .then((data) => {
            // console.log(data);
            return (data);
        }).catch((e) => {
            console.log(e.message);
        })
}

async function updateLocation(id, newLocation) {
    return locations.update({ location: newLocation }, {
        where: {
            id
        }
    })
        .then((data) => {
            // console.log(data);
            return (data);
        }).catch((e) => {
            console.log(e.message);
        })
}

module.exports = { sequelize, getLocation, updateLocation };