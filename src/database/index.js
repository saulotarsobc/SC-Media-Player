const { Sequelize, DataTypes } = require('sequelize');
const remote = require("@electron/remote");
const appPath = remote.app.getPath("userData");
const fileDb = path.join(appPath, "prefs.json");

console.log(fileDb);

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: fileDb
});

const Configs = sequelize.define('configs', {
    configName: {
        type: DataTypes.STRING
    }
});

Configs.sync({ alter: true });