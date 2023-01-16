const { Sequelize, DataTypes } = require('sequelize');

// Option 2: Passing parameters separately (sqlite)
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/data.db'
});

const locations = sequelize.define('locations', {
    // Model attributes are defined here
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

// locations.create({
//     location: "aki",
// }).then((data) => {
//     conosole.log(data);
// }).catch((e) => {
//     conosole.log(e.message);
// })

locations.findAll({
    where: {
        id: 1
    }
})
    .then((data) => {
        console.log(data);
    }).catch((e) => {
        console.log(e.message);
    })

module.exports = sequelize;