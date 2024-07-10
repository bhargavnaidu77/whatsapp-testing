import { Sequelize } from "sequelize";

// DB CONNECTION
const sequelize = new Sequelize("testdb", "root", "password", {
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
  .then(() =>
    console.log("Connection to DB has been established successfully.")
  )
  .catch((err: any) => console.error("Unable to connect to DB:", err));

export default sequelize;
exports.Sequelize = Sequelize;
