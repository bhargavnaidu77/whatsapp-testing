"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
// DB CONNECTION
const sequelize = new sequelize_1.Sequelize("testdb", "root", "password", {
    host: "localhost",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    port: 3306,
});
// TEST DB CONNECTION
sequelize
    .authenticate()
    .then(() => console.log("Connection to DB has been established successfully."))
    .catch((err) => console.error("Unable to connect to DB:", err));
exports.default = sequelize;
exports.Sequelize = sequelize_1.Sequelize;
